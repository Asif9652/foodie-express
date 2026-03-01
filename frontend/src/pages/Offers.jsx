import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Percent, Zap, Gift, Copy, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';
import { offerService } from '../services/offerService';
import { useToast } from '../context/ToastContext';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await offerService.fetchAll();
                setOffers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        showToast(`Promo code ${code} copied!`, 'success');
    };

    if (loading) return <div className="pt-32 text-center font-bold">Fetching deals for you...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[60px] h-80 overflow-hidden mb-16 shadow-2xl group cursor-pointer"
                >
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop"
                        alt="Summer Offers"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12 md:px-20">
                        <div className="max-w-lg">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary-600 text-white font-black text-xs uppercase tracking-widest mb-6 shadow-xl"
                            >
                                <Zap className="w-4 h-4" /> Limited Time Deal
                            </motion.div>
                            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-4">
                                Summer <br /> <span className="text-primary-600 italic">Carnival!</span>
                            </h1>
                            <p className="text-white/80 font-bold text-lg max-w-sm">Get up to 60% off on premium restaurants across the city.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    {['All', 'Bank Offers', 'Free Delivery', 'Flash Deals', 'New User Coupons'].map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedFilter(cat)}
                            className={`whitespace-nowrap px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest border transition-all ${selectedFilter === cat ? 'bg-primary-600 border-primary-600 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-500 hover:border-primary-600 hover:text-primary-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Offers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.filter(o => selectedFilter === 'All' || o.category === selectedFilter).map((offer, idx) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-100 group flex flex-col"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl font-black text-primary-600 flex items-center gap-2 shadow-xl border border-white">
                                    <Percent className="w-4 h-4" /> {offer.discount_percent}% OFF
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{offer.title}</h3>
                                    <p className="text-gray-500 font-bold mb-8 leading-relaxed italic">{offer.description}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 group-hover:border-primary-600 transition-colors cursor-pointer" onClick={() => copyCode(offer.code)}>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Coupon Code</p>
                                            <p className="text-2xl font-black text-gray-900 font-mono">{offer.code}</p>
                                        </div>
                                        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest italic">Terms & Conditions Apply • Valid till stock lasts</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Offers;
