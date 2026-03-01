-- Adding Offers table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sample Offers
INSERT INTO public.offers (title, description, code, discount_percent, image_url) VALUES
('50% OFF', 'Flat 50% off on your first order', 'WELCOME50', 50, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'),
('MEGA DEALS', 'Save up to ₹100 on every bite', 'FOODIE100', 30, 'https://images.unsplash.com/photo-1476224484781-a35a17075760?w=600&q=80');
