-- FOODIEEXPRESS DATABASE SCHEMA (SWIGGY STYLE)

-- 1. Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image_url TEXT,
    rating FLOAT DEFAULT 4.0,
    category TEXT,
    price_for_two INTEGER DEFAULT 500,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    total_price INTEGER NOT NULL,
    status TEXT DEFAULT 'placed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SAMPLE DATA (Copy and run in Supabase SQL Editor)
-- INSERT INTO public.restaurants (name, image_url, rating, category, price_for_two, location) VALUES
-- ('The Burger King', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', 4.5, 'Burgers, American', 600, 'Connaught Place'),
-- ('Pizza Planet', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', 4.3, 'Pizzas, Italian', 800, 'Green Park'),
-- ('Sushi Central', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', 4.8, 'Japanese, Sushi', 1200, 'South Ext'),
-- ('Taco Town', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80', 4.1, 'Mexican, Tacos', 500, 'Hauz Khas'),
-- ('Pasta Palace', 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&q=80', 4.4, 'Italian, Pasta', 900, 'Defense Colony'),
-- ('Wok & Roll', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80', 4.2, 'Chinese, Asian', 700, 'Saket'),
-- ('Sweet Delights', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', 4.7, 'Desserts, Shakes', 400, 'GK 2'),
-- ('Spicy Curry House', 'https://images.unsplash.com/photo-1517248135467-4c7ed938e55e?w=800&q=80', 4.6, 'North Indian, Thali', 1000, 'Janakpuri');
