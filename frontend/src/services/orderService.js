import { supabase } from '../lib/supabase';
import { cartService } from './cartService';

export const orderService = {
    fetchByUser: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Order Fetch Error:", err);
            throw err;
        }
    },

    createFromCart: async (userId, items, totalPrice) => {
        try {
            // 1. Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: userId,
                    items: items, // JSONB storage as simplified implementation
                    total_price: totalPrice,
                    order_status: 'Placed'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Clear cart
            await cartService.clear(userId);

            return order;
        } catch (err) {
            console.error("Order Creation Error:", err);
            throw err;
        }
    },

    updateStatus: async (orderId, status) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ order_status: status })
                .eq('id', orderId)
                .select();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Order Status Update Error:", err);
            throw err;
        }
    },

    fetchAll: async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            throw err;
        }
    }
};
