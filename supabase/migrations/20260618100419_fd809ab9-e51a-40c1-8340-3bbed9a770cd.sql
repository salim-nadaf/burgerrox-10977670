
-- 1. Lock down customers table: only service_role can access (edge functions)
-- Add explicit deny policies so the linter sees policies exist
CREATE POLICY "Deny all client select on customers"
  ON public.customers FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Deny all client insert on customers"
  ON public.customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Deny all client update on customers"
  ON public.customers FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "Deny all client delete on customers"
  ON public.customers FOR DELETE
  TO anon, authenticated
  USING (false);

-- Revoke client privileges; service_role retains access
REVOKE ALL ON public.customers FROM anon, authenticated;
GRANT ALL ON public.customers TO service_role;

-- 2. Realtime authorization: restrict channel access
-- Enable RLS on realtime.messages and only allow authenticated users on their own user-scoped topic
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read own user-scoped channels" ON realtime.messages;
CREATE POLICY "Authenticated users can read own user-scoped channels"
  ON realtime.messages FOR SELECT
  TO authenticated
  USING (
    (realtime.topic() = 'orders-changes' OR realtime.topic() LIKE 'user:' || auth.uid()::text || ':%')
  );

DROP POLICY IF EXISTS "Authenticated users can write own user-scoped channels" ON realtime.messages;
CREATE POLICY "Authenticated users can write own user-scoped channels"
  ON realtime.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    realtime.topic() LIKE 'user:' || auth.uid()::text || ':%'
  );

-- 3. Revoke EXECUTE on internal SECURITY DEFINER function from anon/authenticated
-- next_order_number is only called from edge functions via service_role
REVOKE EXECUTE ON FUNCTION public.next_order_number() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_order_number() TO service_role;
