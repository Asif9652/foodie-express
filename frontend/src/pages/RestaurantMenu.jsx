import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin, Search, Plus, Minus, ShoppingBag, ArrowLeft, Heart, Share2, Info } from 'lucide-react';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Mock data
    const mockRestaurant = {
        id: 1,
        name: "Burger King",
        rating: 4.5,
        reviewCount: 1200,
        time: "20-30 min",
        address: "Downtown St, NY",
        category: "Fast Food",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop",
        description: "Voted #1 Burger Joint in the city! Fresh ingredients, flame-grilled goodness."
    };

    const mockMenuItems = [
        { id: 101, name: "Whopper Meal", price: 12.99, description: "Flame-grilled beef patty, lettuce, tomato, mayo, pickles on a sesame seed bun. Served with fries and drink.", category: "Mains", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" },
        { id: 102, name: "Chicken Royale", price: 10.99, description: "Crispy chicken breast, lettuce, creamy mayo on a long sesame seed bun.", category: "Mains", image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=1000&auto=format&fit=crop" },
        { id: 103, name: "Onion Rings", price: 3.99, description: "Crispy, golden-brown onion rings served with a side of zesty sauce.", category: "Sides", image: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=1000&auto=format&fit=crop" },
        { id: 104, name: "Chocolate Sundae", price: 2.99, description: "Creamy vanilla soft serve with decadent chocolate sauce.", category: "Desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop" },
    ];

    useEffect(() => {
        setTimeout(() => {
            setRestaurant(mockRestaurant);
            setMenuItems(mockMenuItems);
            setLoading(false);
        }, 800);
    }, [id]);

    const categories = ["All", "Mains", "Sides", "Desserts", "Beverages"];

    const filteredItems = selectedCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    if (loading) return <div className="pt-32 flex justify-center h-screen"><div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="pt-20">
            {/* Header Hero */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <img src={restaurant.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 text-white">
                    <Link to="/restaurants" className="inline-flex items-center gap-2 mb-6 text-sm font-semibold glass px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        Back to restaurants
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">{restaurant.name}</h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-1.5 font-bold">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span>{restaurant.rating} ({restaurant.reviewCount}+ reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <Clock className="w-5 h-5" />
                                    <span>{restaurant.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <MapPin className="w-5 h-5" />
                                    <span>{restaurant.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 glass rounded-2xl hover:bg-white hover:text-rose-500 transition-all">
                                <Heart className="w-6 h-6" />
                            </button>
                            <button className="p-3 glass rounded-2xl hover:bg-white/20 transition-all">
                                <Share2 className="w-6 h-6" />
                            </button>
                            <button className="p-3 glass rounded-2xl hover:bg-white/20 transition-all">
                                <Info className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12">
                {/* Menu Side */}
                <div className="flex-grow">
                    <div className="sticky top-24 z-30 mb-8 p-1 bg-white glass-dark border rounded-2xl flex overflow-x-auto no-scrollbar gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                                        : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex gap-6 items-center"
                                >
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                                        <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                                        <div className="flex items-center justify-between pt-4">
                                            <span className="text-xl font-black text-primary-600">${item.price}</span>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Cart Sidebar Placeholder (Desktop) */}
                <aside className="hidden lg:block w-96 space-y-8">
                    <div className="sticky top-28 glass p-8 rounded-[40px] shadow-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-primary-600" />
                                Your Order
                            </h3>
                            <span className="font-bold bg-primary-100 text-primary-600 px-3 py-1 rounded-lg text-sm">2 items</span>
                        </div>

                        {/* Order Items Mock */}
                        <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900">Whopper Meal</p>
                                    <p className="text-gray-500 text-xs">Extras: Large Fries</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold">1</span>
                                    <button className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>$12.99</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Delivery Fee</span>
                                <span>$2.00</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-gray-900 pt-2">
                                <span>Total</span>
                                <span>$14.99</span>
                            </div>
                        </div>

                        <Link to="/checkout">
                            <button className="btn-primary w-full py-4 text-lg">
                                Checkout Now
                            </button>
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RestaurantMenu;
