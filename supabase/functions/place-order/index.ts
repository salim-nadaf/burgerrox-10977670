import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SECURITY: Authoritative coupon catalog (must mirror UI but UI is untrusted).
const COUPONS: Record<string, { amount: number; minSubtotal: number }> = {
  FLAT10: { amount: 10, minSubtotal: 0 },
  WELCOME20: { amount: 20, minSubtotal: 199 },
};
const ONLINE_DISCOUNT = 10;

function computeCouponDiscount(code: string | undefined | null, subtotal: number): number {
  if (!code) return 0;
  const c = COUPONS[String(code).trim().toUpperCase()];
  if (!c) return 0;
  if (subtotal < c.minSubtotal) return 0;
  return c.amount;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const {
      customer_name,
      customer_whatsapp,
      customer_address,
      items,
      total_amount,
      payment_method,
      user_id,
      coupon_code,
      delivery_charge,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_whatsapp || !items || !total_amount || !payment_method) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize phone: strip non-digits, take last 10
    const phone = customer_whatsapp.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate amount
    if (typeof total_amount !== "number" || total_amount <= 0 || total_amount > 50000) {
      return new Response(
        JSON.stringify({ error: "Invalid order amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: recompute totals server-side. Never trust client-supplied
    // discounts, coupon amounts, or payment status.
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Items required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    let subtotal = 0;
    for (const it of items) {
      const price = Number(it?.item_price);
      const qty = Number(it?.quantity);
      if (!isFinite(price) || price < 0 || price > 5000) {
        return new Response(JSON.stringify({ error: "Invalid item price" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (!isFinite(qty) || qty <= 0 || qty > 50) {
        return new Response(JSON.stringify({ error: "Invalid item quantity" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      subtotal += price * qty;
    }

    const delivery = Math.max(0, Math.min(500, Number(delivery_charge) || 0));
    const couponDiscount = computeCouponDiscount(coupon_code, subtotal);
    const onlineDiscount = payment_method === "online" ? ONLINE_DISCOUNT : 0;
    const expectedTotal = Math.max(0, subtotal + delivery - onlineDiscount - couponDiscount);

    if (Math.abs(Number(total_amount) - expectedTotal) > 1) {
      console.error("[place-order] Total mismatch", { client: total_amount, server: expectedTotal, subtotal, delivery, couponDiscount, onlineDiscount });
      return new Response(
        JSON.stringify({ error: "Order total does not match server calculation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Derive payment_status from verified Razorpay signature only.
    let paymentStatus = "pending";
    let verifiedPaymentId: string | null = null;
    if (payment_method === "online") {
      const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
      if (!keySecret) {
        return new Response(JSON.stringify({ error: "Payment not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return new Response(JSON.stringify({ error: "Missing payment verification fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const expected = createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (expected !== String(razorpay_signature)) {
        console.error("[place-order] Razorpay signature mismatch");
        return new Response(JSON.stringify({ error: "Payment signature verification failed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      paymentStatus = "paid";
      verifiedPaymentId = String(razorpay_payment_id);
    }

    // Step 1: Upsert customer
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("whatsapp", phone)
      .maybeSingle();

    let customerId: string;
    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Update name/address if changed
      await supabase
        .from("customers")
        .update({
          name: customer_name.trim(),
          address: customer_address || null,
        })
        .eq("id", customerId);
      console.log("[place-order] Updated existing customer:", customerId);
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from("customers")
        .insert({
          name: customer_name.trim(),
          whatsapp: phone,
          address: customer_address || null,
        })
        .select("id")
        .single();

      if (custErr) {
        console.error("[place-order] Customer creation error:", custErr);
        throw custErr;
      }
      customerId = newCustomer.id;
      console.log("[place-order] Created new customer:", customerId);
    }

    // Step 2: Generate sequential order number atomically
    const { data: orderNumber, error: seqErr } = await supabase.rpc("next_order_number");
    if (seqErr) {
      console.error("[place-order] Sequence error:", seqErr);
      throw seqErr;
    }
    console.log("[place-order] Generated order number:", orderNumber);

    // Step 3: Create order
    // For guest orders, use customer_id as user_id (no FK constraint on user_id)
    const effectiveUserId = user_id || customerId;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: effectiveUserId,
        customer_id: customerId,
        order_number: orderNumber,
        items,
        total_amount,
        payment_method,
        payment_status: paymentStatus,
        payment_id: verifiedPaymentId,
        customer_name: customer_name.trim(),
        customer_whatsapp: phone,
        customer_area: customer_address || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderErr) {
      console.error("[place-order] Order creation error:", orderErr);
      throw orderErr;
    }

    console.log("[place-order] Order created successfully:", order.id);

    return new Response(
      JSON.stringify({
        order,
        customer_id: customerId,
        order_number: orderNumber,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[place-order] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to place order" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
