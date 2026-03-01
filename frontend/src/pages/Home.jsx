import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Clock, TrendingUp, Search, UtensilsCrossed, ArrowRight, ShieldCheck, Zap, Flame, Sparkles, History, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { recommendationService } from '../services/recommendationService';
import { useCart } from '../context/CartContext';
import { getFoodImage } from '../utils/getFoodImage';

const Home = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [stats] = useState([
        { label: 'Restaurants', value: '850+', icon: UtensilsCrossed },
        { label: 'Daily Orders', value: '12K+', icon: Zap },
        { label: 'Trust Score', value: '4.9/5', icon: ShieldCheck },
    ]);

    const [trendingItems, setTrendingItems] = useState([]);
    const [recommendedItems, setRecommendedItems] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        const fetchPersonalization = async () => {
            const trending = await recommendationService.getTrendingItems();
            setTrendingItems(trending);

            const recommended = await recommendationService.getRecommendations(user?.id);
            setRecommendedItems(recommended);

            const viewedStr = localStorage.getItem('recentlyViewed');
            if (viewedStr) {
                setRecentlyViewed(JSON.parse(viewedStr));
            }
        };
        fetchPersonalization();
    }, [user]);

    const renderFoodCards = (items) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item, idx) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-3xl p-4 shadow-lg border border-gray-50 flex flex-col justify-between group cursor-pointer"
                    onClick={() => {
                        // Keep track of viewed
                        try {
                            const newViewed = [item, ...recentlyViewed.filter(i => i.id !== item.id)].slice(0, 5);
                            localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
                            setRecentlyViewed(newViewed);
                            navigate(`/restaurants?category=${item.category}`);
                        } catch (e) { }
                    }}
                >
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative shadow-sm border-2 border-gray-50">
                        <img
                            src={item.image_url || getFoodImage(item.name)}
                            onError={(e) => { e.target.onerror = null; e.target.src = getFoodImage(item.name); }}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-primary-600 shadow-sm border border-white">
                            {item.category}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-black text-gray-900 leading-tight mb-1 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                            <p className="text-xs font-bold text-gray-400 capitalize mb-3 line-clamp-1">{item.restaurants?.name || 'Various'}</p>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <span className="font-black text-emerald-600 text-sm">₹{item.price}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                className="w-full py-2 bg-gray-50 text-gray-900 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-gray-100"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add to Plate
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="pt-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center bg-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/5 -skew-x-12 translate-x-32 hidden lg:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-50 text-primary-700 font-black tracking-widest text-xs mb-8 border border-primary-100 uppercase"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Fastest Delivery in Town
                        </motion.div>

                        <h1 className="text-7xl md:text-8xl font-black leading-[0.9] mb-10 text-gray-900 tracking-tighter">
                            Cravings, <br />
                            <span className="text-primary-600 italic underline decoration-gray-200">Delivered.</span>
                        </h1>

                        <p className="text-xl text-gray-500 font-bold mb-12 max-w-lg leading-relaxed">
                            Experience the future of food ordering with ultra-fast delivery and absolute premium menus.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/restaurants">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary py-5 px-12 text-xl font-black shadow-2xl shadow-primary-500/40 flex items-center gap-3"
                                >
                                    Explore Menu
                                    <ArrowRight className="w-6 h-6" />
                                </motion.button>
                            </Link>
                            <Link to="/offers">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-5 bg-gray-50 text-gray-900 rounded-3xl font-black text-xl hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    View Offers
                                </motion.button>
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="mt-20 grid grid-cols-3 gap-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                >
                                    <h4 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h4>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary-600/20 rounded-[80px] blur-3xl animate-pulse" />
                            <img
                                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000&auto=format&fit=crop"
                                alt="Gourmet Bowl"
                                className="w-full h-[700px] object-cover rounded-[80px] shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-1000"
                            />

                            {/* Floating Element 1 */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -top-10 -left-10 glass p-6 rounded-[32px] shadow-2xl z-20 flex items-center gap-4 border border-white"
                            >
                                <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Star className="w-8 h-8 fill-white" />
                                </div>
                                <div className="pr-4">
                                    <p className="font-black text-gray-900 leading-tight">4.9 / 5.0</p>
                                    <p className="text-xs font-bold text-gray-400">User Satisfaction</p>
                                </div>
                            </motion.div>

                            {/* Floating Element 2 */}
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                                className="absolute -bottom-10 -right-10 glass p-6 rounded-[32px] shadow-2xl z-20 flex items-center gap-4 border border-white"
                            >
                                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div className="pr-4">
                                    <p className="font-black text-gray-900 leading-tight">15 Min</p>
                                    <p className="text-xs font-bold text-gray-400">Average Delivery</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            {user ? (
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Welcome back, <span className="text-primary-600">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Foodie'}!</span></h2>
                            ) : (
                                <>
                                    <p className="text-primary-600 font-black tracking-widest text-[10px] uppercase mb-2">Order Options</p>
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">What's on your mind?</h2>
                                </>
                            )}
                        </div>
                        <Link to="/restaurants" className="text-gray-400 font-bold flex items-center gap-2 hover:text-primary-600 transition-colors">
                            View All <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
                        {[
                            { name: 'North Indian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop' },
                            { name: 'Biryani', img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=400&auto=format&fit=crop' },
                            { name: 'Japanese', img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop' },
                            { name: 'Italian', img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&auto=format&fit=crop' },
                            { name: 'Mexican', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop' },
                            { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop' }
                        ].map((cat, idx) => (
                            <Link
                                key={idx}
                                to={`/restaurants?category=${cat.name}`}
                                className="group cursor-pointer"
                            >
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <div className="aspect-square rounded-[32px] overflow-hidden mb-4 shadow-lg group-hover:shadow-primary-500/20 transition-all border-4 border-white">
                                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <p className="text-center font-black text-gray-900">{cat.name}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Recommendations */}
            {recommendedItems.length > 0 && (
                <section className="py-16 bg-gray-50/30">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Recommended For You</h2>
                        </div>
                        {renderFoodCards(recommendedItems)}
                    </div>
                </section>
            )}

            {/* Trending */}
            {trendingItems.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500">
                                <Flame className="w-5 h-5 fill-rose-500 text-rose-500" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Trending Now 🔥</h2>
                        </div>
                        {renderFoodCards(trendingItems)}
                    </div>
                </section>
            )}

            {/* Recently Viewed */}
            {user && recentlyViewed.length > 0 && (
                <section className="py-16 bg-gray-50/50 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-600">
                                <History className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Recently Viewed</h2>
                        </div>
                        {renderFoodCards(recentlyViewed)}
                    </div>
                </section>
            )}

            {/* Promo Section */}
            <section className="py-32 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-5xl font-black text-gray-900 mb-6">Hungry? We've Got You.</h2>
                    <p className="text-xl text-gray-500 font-bold mb-16 max-w-2xl mx-auto italic">Browse through thousands of restaurants and get your favorite meals delivered to your doorstep.</p>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: 'No Minimum Order', icon: '🌯', desc: 'Order for yourself or the whole office with no restrictions.' },
                            { title: 'Live Order Tracking', icon: '📍', desc: 'Know where your food is at all times with real-time GPS.' },
                            { title: 'Lightning Fast', icon: '⚡', desc: 'Our riders are trained for the fastest delivery times.' },
                        ].map((feat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="glass p-12 rounded-[56px] border border-white flex flex-col items-center"
                            >
                                <span className="text-6xl mb-8">{feat.icon}</span>
                                <h3 className="text-2xl font-black text-gray-900 mb-4">{feat.title}</h3>
                                <p className="text-gray-500 font-bold leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
