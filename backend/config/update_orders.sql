-- Update orders table to match new requirements
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'Preparing';

-- Rename status to order_status if it exists and we want to consolidate
-- ALTER TABLE public.orders RENAME COLUMN status TO order_status;

-- Ensure items is JSONB
-- ALTER TABLE public.orders ALTER COLUMN items TYPE JSONB;

-- Set default for order_status
ALTER TABLE public.orders ALTER COLUMN order_status SET DEFAULT 'Preparing';
