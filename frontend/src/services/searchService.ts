import { supabase } from '../lib/supabase';

export const searchService = {
    searchAll: async (query: string) => {
        if (!query || query.trim() === '') return { restaurants: [], menuItems: [] };

        const searchTerm = `%${query}%`;

        try {
            // Search restaurants by name or category
            const { data: restaurants, error: restError } = await supabase
                .from('restaurants')
                .select('*')
                .or(`name.ilike.${searchTerm},category.ilike.${searchTerm}`)
                .limit(5);

            if (restError) throw restError;

            // Search menu items by name, category, or description
            const { data: menuItems, error: menuError } = await supabase
                .from('menu_items')
                .select(`
                    *,
                    restaurants!inner(name)
                `)
                .or(`name.ilike.${searchTerm},category.ilike.${searchTerm},description.ilike.${searchTerm}`)
                .limit(5);

            if (menuError) throw menuError;

            return {
                restaurants: restaurants || [],
                menuItems: menuItems || []
            };
        } catch (error) {
            console.error('Search error:', error);
            return { restaurants: [], menuItems: [] };
        }
    }
};
