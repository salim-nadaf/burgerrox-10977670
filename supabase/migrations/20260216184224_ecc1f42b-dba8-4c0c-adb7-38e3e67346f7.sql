
-- Add CHECK constraints to cart_items for server-side validation
ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_price_positive CHECK (item_price > 0),
  ADD CONSTRAINT cart_items_quantity_valid CHECK (quantity > 0 AND quantity <= 100),
  ADD CONSTRAINT cart_items_name_length CHECK (LENGTH(item_name) >= 2 AND LENGTH(item_name) <= 200);

-- Add validation trigger for cart_items
CREATE OR REPLACE FUNCTION public.validate_cart_item()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Sanitize item_name: trim whitespace
  NEW.item_name := TRIM(NEW.item_name);
  
  -- Validate price is reasonable (max 10000)
  IF NEW.item_price > 10000 THEN
    RAISE EXCEPTION 'Item price exceeds maximum allowed value';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_cart_item_trigger
BEFORE INSERT OR UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.validate_cart_item();
