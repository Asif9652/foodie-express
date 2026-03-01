import { supabase } from '../lib/supabase';

export const offerService = {
    fetchAll: async () => {
        try {
            const { data, error } = await supabase
                .from('offers')
                .select('*');

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Offer Fetch Error:", err);
            throw err;
        }
    }
};
