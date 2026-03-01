-- MASTER PRODUCTION SETUP FOR FOODIEEXPRESS (v4 - Final Bulletproof Fix)
-- This script fixes "column does not exist" in menu_items and ensures everything is production-ready.
-- Run this in your Supabase SQL Editor.

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENSURE TABLES AND COLUMNS EXIST (Repairing any existing tables)

-- --- Repairing Restaurants Table ---
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS latitude FLOAT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS longitude FLOAT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS rating FLOAT DEFAULT 4.0;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS price_for_two INTEGER DEFAULT 500;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS image_url TEXT;

-- --- Repairing Menu Items Table ---
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- --- Repairing Offers Table ---
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS category TEXT;

-- --- Repairing Orders Table ---
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_price INTEGER DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'Preparing';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES public.restaurants(id);

-- 3. CLEAN SEED DATA
-- Clear out old "fake" data to ensure a fresh, consistent start
DELETE FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM public.restaurants WHERE name IN ('The Royal Kitchen', 'Biryani Kingdom', 'Sushi Zen', 'Pizza Paradise', 'Taco Fiesta', 'Sweet Dreams'));
DELETE FROM public.restaurants WHERE name IN ('The Royal Kitchen', 'Biryani Kingdom', 'Sushi Zen', 'Pizza Paradise', 'Taco Fiesta', 'Sweet Dreams');

-- Seed Restaurants
INSERT INTO public.restaurants (name, latitude, longitude, address, category, rating, price_for_two, image_url)
VALUES 
('The Royal Kitchen', 13.0827, 80.2707, 'Anna Nagar, Chennai', 'North Indian', 4.8, 800, 'https://images.unsplash.com/photo-1517248135467-4c7ed938e55e?q=80&w=800&auto=format&fit=crop'),
('Biryani Kingdom', 12.9716, 77.5946, 'MG Road, Bangalore', 'Biryani', 4.6, 600, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop'),
('Sushi Zen', 19.0760, 72.8777, 'Bandra West, Mumbai', 'Japanese', 4.9, 1500, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop'),
('Pizza Paradise', 28.6139, 77.2090, 'Connaught Place, Delhi', 'Italian', 4.4, 700, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop'),
('Taco Fiesta', 17.3850, 78.4867, 'Banjara Hills, Hyderabad', 'Mexican', 4.5, 500, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop'),
('Sweet Dreams', 12.9279, 77.6271, 'Koramangala, Bangalore', 'Desserts', 4.7, 400, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop');

-- 4. SEED MENU ITEMS
DO $$
DECLARE
    rest_id UUID;
BEGIN
    -- The Royal Kitchen
    SELECT id INTO rest_id FROM public.restaurants WHERE name = 'The Royal Kitchen' LIMIT 1;
    IF rest_id IS NOT NULL THEN
        INSERT INTO public.menu_items (restaurant_id, name, description, price, category, image_url)
        VALUES 
        (rest_id, 'Butter Chicken Royale', 'Rich creamy tomato gravy with tender clay-oven grilled chicken.', 450, 'Main Course', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop'),
        (rest_id, 'Garlic Naan', 'Soft and fluffy naan bread seasoned with roasted garlic and butter.', 45, 'Bread', 'https://images.unsplash.com/photo-1601050638917-051fba74936b?q=80&w=600&auto=format&fit=crop'),
        (rest_id, 'Dal Makhani', 'Overnight cooked black lentils tempered with cream and butter.', 280, 'Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop');
    END IF;

    -- Biryani Kingdom
    SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Biryani Kingdom' LIMIT 1;
    IF rest_id IS NOT NULL THEN
        INSERT INTO public.menu_items (restaurant_id, name, description, price, category, image_url)
        VALUES 
        (rest_id, 'Hyderabadi Dum Biryani', 'World famous aromatic rice layered with spice-marinated chicken.', 350, 'Biryani', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=600&auto=format&fit=crop'),
        (rest_id, 'Chicken Tikka Biryani', 'Spicy tandoori chicken chunks cooked with long grain basmati rice.', 380, 'Biryani', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop');
    END IF;

    -- Pizza Paradise
    SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Pizza Paradise' LIMIT 1;
    IF rest_id IS NOT NULL THEN
        INSERT INTO public.menu_items (restaurant_id, name, description, price, category, image_url)
        VALUES 
        (rest_id, 'Margherita Classic', 'Simple yet divine with fresh mozzarella, basil and olive oil.', 299, 'Italian', 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=600&auto=format&fit=crop'),
        (rest_id, 'Double Pepperoni', 'Loaded with double spicy pepperoni and extra cheese.', 499, 'Italian', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop');
    END IF;
END $$;

-- 5. SEED OFFERS
DELETE FROM public.offers WHERE code IN ('FIRST50', 'PIZZA30', 'HDFC20', 'FREEFOOD');
INSERT INTO public.offers (title, description, code, discount_percent, image_url, category)
VALUES 
('Welcome 50', 'Get flat 50% discount on your first order ever!', 'FIRST50', 50, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200', 'New User Coupons'),
('Pizza Weekend', 'Love Pizza? Get 30% off on all items this weekend.', 'PIZZA30', 30, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200', 'Flash Deals'),
('HDFC Bank Offer', 'Flat 20% off using HDFC Credit Cards.', 'HDFC20', 20, 'https://images.unsplash.com/photo-1591033594798-33227a05780d?q=80&w=1200', 'Bank Offers'),
('Express Delivery', 'Get free delivery on every order above ₹999.', 'FREEFOOD', 10, 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1200', 'Free Delivery');

-- 6. SECURITY - ENABLE RLS AND POLICIES
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Menu" ON public.menu_items;
CREATE POLICY "Public Read Menu" ON public.menu_items FOR SELECT USING (true);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Offers" ON public.offers;
CREATE POLICY "Public Read Offers" ON public.offers FOR SELECT USING (true);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Restaurants" ON public.restaurants;
CREATE POLICY "Public Read Restaurants" ON public.restaurants FOR SELECT USING (true);

-- Ensure Realtime is enabled for these (ignore if already member)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'offers') then
    alter publication supabase_realtime add table public.offers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'menu_items') then
    alter publication supabase_realtime add table public.menu_items;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'restaurants') then
    alter publication supabase_realtime add table public.restaurants;
  end if;
end $$;
