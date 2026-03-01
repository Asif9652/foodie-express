const supabase = require('../config/supabase');

exports.addToCart = async (req, res) => {
    try {
        const { menu_item_id, quantity = 1 } = req.body;
        const user_id = req.user.id;

        const { data, error } = await supabase
            .from('cart_items')
            .upsert({ user_id, menu_item_id, quantity });

        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ message: 'Item added to cart', cart_item: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { data, error } = await supabase
            .from('cart_items')
            .select('*, menu_items(*)')
            .eq('user_id', user_id);

        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ cartItems: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const user_id = req.user.id;

        const { data, error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
            .eq('user_id', user_id);

        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
