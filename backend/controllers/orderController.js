const supabase = require('../config/supabase');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { total_amount, items, payment_method } = req.body;
        const user_id = req.user.id;

        // Create Razorpay Order if not COD
        let razorpay_order_id = null;
        if (payment_method === 'razorpay') {
            const options = {
                amount: Math.round(total_amount * 100), // amount in the smallest currency unit
                currency: "INR",
                receipt: `receipt_order_${Date.now()}`,
            };
            const rzpOrder = await razorpay.orders.create(options);
            razorpay_order_id = rzpOrder.id;
        }

        // Create Order in DB
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id,
                items,
                total_price: total_amount,
                order_status: 'Preparing',
                payment_status: payment_method === 'razorpay' ? 'Pending' : 'Success',
                payment_id: razorpay_order_id,
            })
            .select('*')
            .single();

        if (orderError) return res.status(500).json({ error: orderError.message });

        res.status(201).json({
            message: 'Order created',
            order: orderData,
            payment_info: {
                razorpay_order_id,
                amount: total_amount * 100, // in paise
                key: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ orders: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json({ order: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const crypto = require('crypto');

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update order status in Supabase
            const { error } = await supabase
                .from('orders')
                .update({
                    payment_status: 'Success',
                    payment_id: razorpay_payment_id,
                })
                .eq('id', order_id);

            if (error) return res.status(500).json({ error: error.message });

            // Start Simulation (Fake delivery progress)
            // Preparing (Already set)
            setTimeout(async () => {
                await supabase.from('orders').update({ order_status: 'Out for Delivery' }).eq('id', order_id);
                setTimeout(async () => {
                    await supabase.from('orders').update({ order_status: 'Delivered' }).eq('id', order_id);
                }, 10000); // 10s more = 30s total? No, the user said 10, 20, 30.
            }, 20000); // 10s for preparing + 10s = 20s mark for Out for Delivery? 
            // Let's just follow the intervals: 10s, 10s, 10s.

            res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
