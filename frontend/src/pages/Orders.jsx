import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, ChevronRight, Utensils, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const steps = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const data = await orderService.fetchByUser(user.id);
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // REALTIME SUBSCRIPTION
        const channel = supabase
            .channel('orders-realtime')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const getStepIndex = (status) => steps.indexOf(status);

    if (loading) return <div className="pt-32 text-center font-bold">Loading your orders...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="max-w-5xl mx-auto px-4">
                <header className="mb-12">
                    <p className="text-primary-600 font-black tracking-widest text-[10px] uppercase mb-2">History & Tracking</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Your Orders</h1>
                </header>

                <div className="space-y-10">
                    {orders.length === 0 ? (
                        <div className="bg-white p-20 rounded-[48px] shadow-xl text-center border border-gray-100">
                            <Package className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-gray-900 mb-4">No orders yet!</h3>
                            <Link to="/restaurants">
                                <button className="btn-primary px-8 py-3 rounded-2xl font-black">Order Something Yummy</button>
                            </Link>
                        </div>
                    ) : (
                        orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 md:p-10 rounded-[48px] shadow-2xl border border-gray-100 relative overflow-hidden group"
                            >
                                {/* Header */}
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 border-b border-gray-50 pb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600">
                                            <Utensils className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                                Order #{order.id.slice(0, 8).toUpperCase()}
                                                <span className="text-xs font-black uppercase tracking-widest text-primary-600 px-3 py-1 bg-primary-50 rounded-full">
                                                    {order.order_status}
                                                </span>
                                            </h3>
                                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                                                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-3xl font-black text-gray-900">₹{order.total_price}</p>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                <div className="relative mb-12 px-2">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(getStepIndex(order.order_status) / (steps.length - 1)) * 100}%` }}
                                        className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 rounded-full transition-all duration-1000"
                                    />

                                    <div className="relative z-10 flex justify-between">
                                        {steps.map((step, i) => {
                                            const isActive = i <= getStepIndex(order.order_status);
                                            const isCurrent = i === getStepIndex(order.order_status);

                                            return (
                                                <div key={step} className="flex flex-col items-center">
                                                    <motion.div
                                                        animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shadow-xl ${isActive ? 'bg-primary-600 border-white text-white' : 'bg-white border-gray-50 text-gray-200'
                                                            }`}
                                                    >
                                                        {i === 0 && <Package className="w-5 h-5" />}
                                                        {i === 1 && <Clock className="w-5 h-5" />}
                                                        {i === 2 && <Truck className="w-5 h-5" />}
                                                        {i === 3 && <CheckCircle className="w-5 h-5" />}
                                                    </motion.div>
                                                    <p className={`mt-4 text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                                                        {step}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Items Summary */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                                        <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <Utensils className="w-4 h-4 text-primary-600" /> Items Summary
                                        </h4>
                                        <div className="space-y-3">
                                            {order.items && order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-600 font-bold">{item.quantity} x {item.name}</span>
                                                    <span className="font-black">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                                        <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary-600" /> Delivery Address
                                        </h4>
                                        <p className="text-sm text-gray-500 font-bold">
                                            Default Address • Delivered by FoodieExpress
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
