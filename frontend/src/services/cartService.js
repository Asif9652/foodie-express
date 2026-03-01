import { supabase } from '../lib/supabase';

export const cartService = {
    fetchItems: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select(`
          *,
          menu_items (*)
        `)
                .eq('user_id', userId);

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Cart Fetch Error:", err);
            throw err;
        }
    },

    updateQuantity: async (id, quantity) => {
        try {
            if (quantity <= 0) {
                return cartService.removeItem(id);
            }
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', id)
                .select();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Cart Update Error:", err);
            throw err;
        }
    },

    addItem: async (userId, menuItemId) => {
        try {
            // Check if item exists
            const { data: existing, error: checkError } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', userId)
                .eq('menu_item_id', menuItemId)
                .maybeSingle();

            if (existing) {
                return cartService.updateQuantity(existing.id, existing.quantity + 1);
            }

            const { data, error } = await supabase
                .from('cart_items')
                .insert({ user_id: userId, menu_item_id: menuItemId, quantity: 1 })
                .select();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Cart Add Error:", err);
            throw err;
        }
    },

    removeItem: async (id) => {
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error("Cart Remove Error:", err);
            throw err;
        }
    },

    clear: async (userId) => {
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;
        } catch (err) {
            console.error("Cart Clear Error:", err);
            throw err;
        }
    }
};
