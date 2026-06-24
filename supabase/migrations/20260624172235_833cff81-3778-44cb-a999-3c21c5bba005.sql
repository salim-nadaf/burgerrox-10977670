
-- Replace the shared 'orders-changes' realtime SELECT policy with a per-user scoped one.
DROP POLICY IF EXISTS "Authenticated users can subscribe to orders-changes" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated users subscribe to own user topic" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated users can subscribe to user-scoped topics" ON realtime.messages;

CREATE POLICY "Authenticated users can subscribe to user-scoped topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE ('user:' || auth.uid()::text || ':%')
);
