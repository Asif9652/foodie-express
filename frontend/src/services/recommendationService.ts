import { supabase } from '../lib/supabase';

export const recommendationService = {
    getTrendingItems: async () => {
        try {
            // "Trending Now" - most added cart_items
            const { data: cartItems, error } = await supabase
                .from('cart_items')
                .select('menu_item_id');

            if (error || !cartItems) throw error;

            const counts: Record<string, number> = {};
            cartItems.forEach(item => {
                const id = item.menu_item_id;
                counts[id] = (counts[id] || 0) + 1;
            });

            const topIds = Object.entries(counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([id]) => id);

            if (topIds.length === 0) {
                // Return generic popular items if cart empty
                const { data } = await supabase.from('menu_items').select('*, restaurants!inner(name)').limit(10);
                return data || [];
            }

            const { data: topMenuItems } = await supabase
                .from('menu_items')
                .select('*, restaurants!inner(name)')
                .in('id', topIds);

            // Sort to match topIds order
            if (topMenuItems) {
                topMenuItems.sort((a, b) => topIds.indexOf(String(a.id)) - topIds.indexOf(String(b.id)));
                return topMenuItems;
            }
            return [];
        } catch (error) {
            console.error('Trending Error:', error);
            const { data } = await supabase.from('menu_items').select('*, restaurants!inner(name)').limit(10);
            return data || [];
        }
    },

    getRecommendations: async (userId: string | undefined) => {
        try {
            const { data: popular } = await supabase
                .from('menu_items')
                .select('*, restaurants!inner(name)')
                .limit(4);

            if (!userId) {
                return popular || [];
            }

            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            let favoriteCategory = null;
            if (orders && orders.length > 0) {
                const categoryCounts: Record<string, number> = {};
                orders.forEach(order => {
                    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    items?.forEach((item: any) => {
                        if (item.category) {
                            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
                        }
                    });
                });

                let maxCount = 0;
                for (const [cat, count] of Object.entries(categoryCounts)) {
                    if (count > maxCount) {
                        maxCount = count;
                        favoriteCategory = cat;
                    }
                }
            }

            if (favoriteCategory) {
                const { data: personalized } = await supabase
                    .from('menu_items')
                    .select('*, restaurants!inner(name)')
                    .eq('category', favoriteCategory)
                    .limit(4);

                if (personalized && personalized.length > 0) {
                    return personalized;
                }
            }

            return popular || [];
        } catch (error) {
            console.error('Recommendation Error:', error);
            return [];
        }
    }
};
