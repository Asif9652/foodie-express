import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Plus, Search, ChevronRight, Utensils, Info, ArrowLeft, Loader2, Navigation, MapPin } from 'lucide-react';
import { menuService } from '../services/menuService';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { getFoodImage } from '../utils/getFoodImage';
import CategoryFilter from '../components/CategoryFilter';

const Menu = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch restaurant info
                const { data: restData } = await supabase
                    .from('restaurants')
                    .select('*')
                    .eq('id', id)
                    .single();

                setRestaurant(restData);

                // Fetch menu items using real Supabase data
                const menuData = await menuService.fetchByRestaurant(id);
                setMenuItems(menuData || []);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="pt-40 flex flex-col items-center justify-center min-h-[60vh] gap-8">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin absolute inset-0 opacity-20" />
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center relative">
                        <Utensils className="w-8 h-8 text-primary-600" />
                    </div>
                </div>
                <div className="text-center">
                    <h4 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Curating Menu</h4>
                    <p className="text-gray-400 font-bold tracking-widest text-[10px] animate-pulse">Sourcing fresh ingredients for you</p>
                </div>
            </div>
        );
    }

    if (!restaurant) return (
        <div className="pt-40 text-center flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl grayscale">🍽️</div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Restaurant Not Found</h1>
            <Link to="/restaurants" className="btn-primary py-3 px-8 text-sm font-black">Browse Others</Link>
        </div>
    );

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-32">
            {/* Premium Restaurant Header */}
            <div className="bg-white border-b border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/5 -skew-x-12 translate-x-20 hidden lg:block" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
                    <Link to="/restaurants" className="group inline-flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-primary-600 transition-colors">
                        <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-primary-50">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Exploration
                    </Link>

                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="w-full md:w-80 h-60 rounded-[56px] overflow-hidden shadow-2xl relative group border-4 border-white"
                        >
                            <img
                                src={restaurant.image_url}
                                alt={restaurant.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white">
                                <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
                                <span className="font-black text-sm text-gray-900">{restaurant.rating || '4.0'}</span>
                            </div>
                        </motion.div>

                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">{restaurant.name}</h1>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] uppercase font-black tracking-widest border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Open Now
                                    </div>
                                </div>

                                <p className="text-gray-400 font-bold text-xl mb-10 flex items-center gap-2 italic">
                                    <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                                    {restaurant.category} • {restaurant.location || restaurant.address}
                                </p>

                                <div className="flex flex-wrap gap-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-primary-600 shadow-sm border border-gray-100">
                                            <Clock className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Delivery</p>
                                            <p className="font-black text-lg text-gray-900">30-45 Mins</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-primary-600 shadow-sm border border-gray-100">
                                            <span className="text-xl font-bold">₹</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Two People</p>
                                            <p className="font-black text-lg text-gray-900"><span className="text-sm">₹</span>{restaurant.price_for_two}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Experience */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
                <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

                {/* Search & Results */}
                <div className="space-y-12">
                    <div className="relative group max-w-2xl mx-auto">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="What are you craving today?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-2 border-transparent focus:border-primary-600 rounded-[40px] py-7 px-20 text-xl font-black shadow-2xl outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -12 }}
                                    className="bg-white p-8 rounded-[56px] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col justify-between group relative overflow-hidden h-full"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-primary-600/10 transition-colors" />

                                    <div>
                                        <div className="aspect-square w-full rounded-[40px] overflow-hidden shadow-xl border-4 border-gray-50 mb-8 relative">
                                            <img
                                                src={getFoodImage(item.name, 600, 600)}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'; }}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary-600 shadow-lg border border-white">
                                                {item.category}
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                                <div className="flex items-center gap-1 text-emerald-600 font-black bg-emerald-50 px-3 py-1 rounded-xl text-lg border border-emerald-100 shadow-sm shrink-0">
                                                    <span className="text-sm">₹</span>
                                                    {item.price}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm font-bold line-clamp-2 mb-8 italic pr-4">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(item)}
                                        className="w-full py-5 bg-gray-50 text-gray-900 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-gray-100 overflow-hidden relative group/btn"
                                    >
                                        <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-20deg] -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]" />
                                        <Plus className="w-6 h-6" /> Add to Plate
                                    </motion.button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white p-24 rounded-[64px] shadow-2xl text-center border-2 border-dashed border-gray-100 max-w-2xl mx-auto"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl grayscale">🍜</div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Cravings Not Found</h3>
                            <p className="text-gray-400 font-bold mb-10 text-lg">We couldn't find any dishes matching your search. Maybe try another category?</p>
                            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="btn-primary py-4 px-10 text-lg font-black tracking-tight">Show All Cravings</button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
