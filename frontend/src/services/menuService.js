import { supabase } from '../lib/supabase';

export const menuService = {
    fetchByRestaurant: async (restaurantId) => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('is_available', true);

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Menu Fetch Error:", err);
            throw err;
        }
    }
};
