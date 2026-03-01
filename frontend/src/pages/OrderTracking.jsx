import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin, Phone, MessageSquare, Utensils, Truck, Home, User, Star, ChevronDown, Package } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const OrderTracking = () => {
    const { id } = useParams();
    const [status, setStatus] = useState(2); // 0: Pending, 1: Confirmed, 2: Preparing, 3: Out for Delivery, 4: Delivered

    const stages = [
        { id: 0, name: "Order Placed", icon: <Package className="w-5 h-5" />, time: "12:30 PM", desc: "We've received your order." },
        { id: 1, name: "Confirmed", icon: <Check className="w-5 h-5" />, time: "12:32 PM", desc: "Restaurant has accepted your order." },
        { id: 2, name: "Preparing", icon: <Utensils className="w-5 h-5" />, time: "12:45 PM", desc: "Chef is cooking your delicious meal." },
        { id: 3, name: "Out for Delivery", icon: <Truck className="w-5 h-5" />, time: "1:05 PM", desc: "Rider is on the way to your location." },
        { id: 4, name: "Delivered", icon: <Home className="w-5 h-5" />, time: "1:20 PM", desc: "Enjoy your meal!" }
    ];

    return (
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid lg:grid-cols-3 gap-12"
            >
                {/* Left: Status and Map */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-10 rounded-[48px] border border-gray-100 shadow-xl overflow-hidden relative">
                        {/* Status Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <span className="px-4 py-2 bg-primary-100 text-primary-600 rounded-full font-black text-xs uppercase tracking-widest mb-4 inline-block">
                                    Live Tracking
                                </span>
                                <h1 className="text-4xl font-black text-gray-900">Order #{id || 'PX-9921'}</h1>
                                <p className="text-gray-500 font-medium">Estimated Delivery: <span className="text-primary-600 font-bold">25 Minutes</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="btn-secondary py-3 px-6 text-sm font-bold flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Call Support
                                </button>
                            </div>
                        </div>

                        {/* Progress Stepper */}
                        <div className="relative pt-10 pb-4">
                            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-100 -translate-y-1/2 hidden md:block" />
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                                {stages.map((stage, idx) => (
                                    <div key={stage.id} className="flex flex-row md:flex-col items-center gap-6 group">
                                        <div className={`w-14 h-14 rounded-[20px] shrink-0 flex items-center justify-center transition-all duration-500 ${status >= stage.id ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 rotate-[360deg]" : "bg-white text-gray-300 border-2 border-gray-100"
                                            }`}>
                                            {stage.icon}
                                        </div>
                                        <div className="text-left md:text-center space-y-1">
                                            <h4 className={`font-black uppercase tracking-tighter text-sm ${status >= stage.id ? "text-gray-900" : "text-gray-400"}`}>
                                                {stage.name}
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity whitespace-nowrap">{stage.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Map Mock */}
                    <div className="glass h-[500px] rounded-[48px] border border-gray-100 shadow-xl overflow-hidden relative">
                        {/* Use an image to mock map */}
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                            className="w-full h-full object-cover grayscale opacity-80"
                            alt="Map View"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />

                        {/* Live Delivery Marker */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3"
                        >
                            <Truck className="w-6 h-6" />
                            <div className="pr-2">
                                <p className="font-black text-xs uppercase">Rider is near</p>
                                <p className="text-[10px] font-bold opacity-80">2.4 km away</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Rider and Summary */}
                <aside className="space-y-8">
                    {/* Rider Info */}
                    <div className="glass p-10 rounded-[48px] border border-gray-100 shadow-xl">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-[24px] overflow-hidden border-4 border-primary-100">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Alex Johnson</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-sm">4.9 Rider Rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="btn-primary py-3 px-6 text-sm font-bold flex items-center justify-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Chat
                            </button>
                            <button className="btn-secondary py-3 px-6 text-sm font-bold flex items-center justify-center gap-2">
                                <Phone className="w-5 h-5" />
                                Call
                            </button>
                        </div>
                    </div>

                    {/* Order Details Summary */}
                    <div className="glass p-10 rounded-[48px] border border-gray-100 shadow-xl">
                        <h3 className="text-2xl font-black mb-6">Delivery Details</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900">Burger King</p>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Downtown St, NY - Restaurant Location</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900">Home Address</p>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">123 Maple Avenue, Downtown, NY 10001</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-400">Status</span>
                                <span className="text-green-500 uppercase tracking-widest">Paid with Razorpay</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-sm">Order Total</span>
                                <span className="text-2xl font-black text-gray-900">$57.48</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </motion.div>
        </div>
    );
};

export default OrderTracking;
