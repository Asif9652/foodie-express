import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, UtensilsCrossed, History, Receipt } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
            setLoading(false);
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            'Preparing': 'bg-amber-50 text-amber-600 border-amber-100',
            'Out for Delivery': 'bg-blue-50 text-blue-600 border-blue-100',
            'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'Success': 'bg-primary-50 text-primary-600 border-primary-100',
        };
        return styles[status] || styles['Success'];
    };

    if (loading) return <div className="pt-32 text-center font-black">Loading your orders...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="max-w-5xl mx-auto px-4">
                <header className="mb-12">
                    <p className="text-primary-600 font-black tracking-widest text-[10px] uppercase mb-2 ml-1">Account</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">My Orders</h1>
                    <p className="text-gray-500 font-bold mt-2">Manage your current and previous orders.</p>
                </header>

                <div className="grid gap-8">
                    {orders.length === 0 ? (
                        <div className="bg-white p-20 rounded-[48px] shadow-2xl text-center border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <History className="w-12 h-12 text-gray-300" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">No orders yet!</h2>
                            <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto">Still haven't found your favorite meal? Explore the city's top restaurants now.</p>
                            <Link to="/restaurants">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="btn-primary py-5 px-12 text-xl font-black shadow-2xl"
                                >
                                    Find Food
                                </motion.button>
                            </Link>
                        </div>
                    ) : (
                        orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.id}
                                className="bg-white p-8 md:p-10 rounded-[48px] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between gap-10 hover:shadow-2xl transition-all group"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                            <UtensilsCrossed className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black text-gray-900">FoodieExpress Order</h3>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(order.order_status)}`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                                                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className="space-y-2">
                                            {order.items && order.items.slice(0, 2).map((item, i) => (
                                                <p key={i} className="text-gray-500 font-bold flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                                    {item.quantity} x {item.name}
                                                </p>
                                            ))}
                                            {order.items && order.items.length > 2 && (
                                                <p className="text-primary-600 font-black text-xs">+{order.items.length - 2} more items</p>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100 w-fit">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Total Paid</p>
                                            <p className="text-2xl font-black text-gray-900">₹{order.total_price}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center items-center gap-4 border-l border-gray-100 pl-10 hidden md:flex">
                                    <Link to={`/track-order/${order.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="px-10 py-5 bg-gray-900 text-white rounded-[32px] font-black text-lg flex items-center gap-3 shadow-2xl hover:bg-black transition-all"
                                        >
                                            Track Order
                                            <TrendingUp className="w-6 h-6" />
                                        </motion.button>
                                    </Link>
                                    <button className="text-gray-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                        <Receipt className="w-5 h-5" />
                                        Order Receipt
                                    </button>
                                </div>

                                <div className="md:hidden">
                                    <Link to={`/track-order/${order.id}`}>
                                        <button className="w-full btn-primary py-5 rounded-[32px] font-black flex items-center justify-center gap-3 shadow-2xl">
                                            Track Order <TrendingUp className="w-6 h-6" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
