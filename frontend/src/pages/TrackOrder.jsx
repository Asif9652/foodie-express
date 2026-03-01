import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Truck, Home, MapPin, ChevronRight, Utensils, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TrackOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const steps = [
        { title: 'Order Placed', status: 'Success', icon: CheckCircle2 },
        { title: 'Preparing', status: 'Preparing', icon: Utensils },
        { title: 'Out for Delivery', status: 'Out for Delivery', icon: Truck },
        { title: 'Delivered', status: 'Delivered', icon: Home },
    ];

    const getStepIndex = (status) => {
        if (status === 'Delivered') return 3;
        if (status === 'Out for Delivery') return 2;
        if (status === 'Preparing') return 1;
        return 0;
    };

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (data) setOrder(data);
            setLoading(false);
        };

        fetchOrder();

        // REALTIME SUBSCRIPTION
        const subscription = supabase
            .channel(`order-${orderId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${orderId}`
            }, (payload) => {
                setOrder(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [orderId]);

    if (loading) return <div className="pt-32 text-center font-black">Tracking Order...</div>;
    if (!order) return <div className="pt-32 text-center font-black">Order Not Found</div>;

    const currentStep = getStepIndex(order.order_status);

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white p-8 rounded-[40px] shadow-2xl mb-8 border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">Order Tracking</p>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                                #{order.id.slice(0, 8).toUpperCase()}
                                <span className="bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full">{order.order_status}</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 font-bold text-xs">Arriving in</p>
                            <p className="text-2xl font-black text-primary-600">25 Mins</p>
                        </div>
                    </div>

                    {/* Progress Bar UI */}
                    <div className="relative pt-12 pb-8">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / 3) * 100}%` }}
                            className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 rounded-full z-10"
                        />

                        <div className="relative z-20 flex justify-between">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isActive = idx <= currentStep;
                                const isCurrent = idx === currentStep;

                                return (
                                    <div key={idx} className="flex flex-col items-center">
                                        <motion.div
                                            animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors border-4 ${isActive ? 'bg-primary-600 text-white border-white' : 'bg-white text-gray-300 border-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </motion.div>
                                        <p className={`mt-4 text-[10px] uppercase tracking-widest font-black ${isActive ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {step.title}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Delivery Details */}
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">Delivery Address</h3>
                                <p className="text-sm text-gray-500 font-medium">Home, New Delhi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">Rider Info</h3>
                                <p className="text-sm text-gray-500 font-medium">Rahul Sharma is on the way</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-3">
                            {order.items && order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-bold">{item.quantity}x {item.name}</span>
                                    <span className="font-black">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-dashed flex justify-between items-center text-lg">
                                <span className="font-black">Total Paid</span>
                                <span className="text-primary-600 font-black">₹{order.total_price}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link to="/my-orders" className="text-primary-600 font-black flex items-center justify-center gap-2 hover:gap-4 transition-all">
                        View My Orders <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
