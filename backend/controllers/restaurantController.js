const supabase = require('../config/supabase');

exports.getAllRestaurants = async (req, res) => {
    try {
        const { search, city } = req.query;
        let query = supabase.from('restaurants').select('*');

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }
        if (city) {
            query = query.eq('city', city);
        }

        const { data, error } = await query;

        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ restaurants: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: 'Restaurant not found' });

        res.status(200).json({ restaurant: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
