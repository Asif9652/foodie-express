const supabase = require('../config/supabase');

exports.getMenuByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ menu: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
