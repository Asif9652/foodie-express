-- Sample Menu Items for FoodieExpress
-- Assuming we have at least one restaurant with ID 'RESTAURANT_ID'
-- This script provides a template to add items.

-- 1. Helper to get an existing restaurant ID
DO $$
DECLARE
    rest_id UUID;
BEGIN
    SELECT id INTO rest_id FROM public.restaurants LIMIT 1;

    IF rest_id IS NOT NULL THEN
        -- Insert Menu Items
        INSERT INTO public.menu_items (restaurant_id, name, description, price, category, image_url) VALUES
        (rest_id, 'Paneer Tikka Masala', 'Soft paneer cubes in a rich tomato-based gravy', 349, 'Main Course', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=600&q=80'),
        (rest_id, 'Butter Garlic Naan', 'Freshly baked tandoori bread with garlic butter', 79, 'Breads', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80'),
        (rest_id, 'Chicken Dum Biryani', 'Slow cooked aromatic basmati rice with spicy chicken', 429, 'Rice', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?w=600&q=80'),
        (rest_id, 'Crispy Chilli Corn', 'Crispy sweet corn kernels tossed in spicy sauce', 229, 'Starters', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80'),
        (rest_id, 'Gulab Jamun (2pcs)', 'Hot dumplings soaked in cardamom sugar syrup', 99, 'Desserts', 'https://images.unsplash.com/photo-1528735238446-c7473bc46132?w=600&q=80');
    END IF;
END $$;
