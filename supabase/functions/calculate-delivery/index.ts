import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Restaurant location - Urban Forest, Mamurdi, Pune 412101
const RESTAURANT_ADDRESS = "Urban Forest, Mamurdi, Pune 412101, India";

// Delivery charge tiers based on distance (in km)
// Using mid-range values from the provided ranges
const DELIVERY_TIERS = [
  { maxDistance: 3, charge: 0, label: "Free Delivery" },
  { maxDistance: 5, charge: 50, label: "₹50 (3-5 km)" },      // Mid of ₹40-₹60
  { maxDistance: 7, charge: 75, label: "₹75 (5-7 km)" },      // Mid of ₹60-₹90
  { maxDistance: 10, charge: 105, label: "₹105 (7-10 km)" },  // Mid of ₹90-₹120
  { maxDistance: Infinity, charge: 175, label: "₹175 (10+ km)" } // Mid of ₹150-₹200
];

function getDeliveryCharge(distanceKm: number): { charge: number; label: string; distanceKm: number } {
  for (const tier of DELIVERY_TIERS) {
    if (distanceKm <= tier.maxDistance) {
      return { 
        charge: tier.charge, 
        label: tier.label,
        distanceKm: Math.round(distanceKm * 10) / 10
      };
    }
  }
  // Fallback for very far distances
  return { 
    charge: DELIVERY_TIERS[DELIVERY_TIERS.length - 1].charge, 
    label: DELIVERY_TIERS[DELIVERY_TIERS.length - 1].label,
    distanceKm: Math.round(distanceKm * 10) / 10
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    const { customerAddress } = await req.json();
    
    if (!customerAddress || customerAddress.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid delivery address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add "Pune, India" to help with geocoding accuracy
    const fullAddress = customerAddress.toLowerCase().includes('pune') 
      ? customerAddress 
      : `${customerAddress}, Pune, India`;

    // Use Google Maps Distance Matrix API
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', RESTAURANT_ADDRESS);
    url.searchParams.set('destinations', fullAddress);
    url.searchParams.set('units', 'metric');
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    console.log('Google Maps API response:', JSON.stringify(data));

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`);
    }

    const element = data.rows?.[0]?.elements?.[0];
    
    if (!element || element.status !== 'OK') {
      return new Response(
        JSON.stringify({ 
          error: 'Could not calculate distance. Please check your address and try again.',
          details: element?.status || 'No route found'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Distance is in meters, convert to km
    const distanceMeters = element.distance.value;
    const distanceKm = distanceMeters / 1000;
    const durationText = element.duration.text;

    const deliveryInfo = getDeliveryCharge(distanceKm);

    return new Response(
      JSON.stringify({
        success: true,
        distance: {
          value: distanceKm,
          text: element.distance.text
        },
        duration: {
          text: durationText
        },
        deliveryCharge: deliveryInfo.charge,
        deliveryLabel: deliveryInfo.label,
        destinationAddress: data.destination_addresses?.[0] || fullAddress
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error calculating delivery:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to calculate delivery charge' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
