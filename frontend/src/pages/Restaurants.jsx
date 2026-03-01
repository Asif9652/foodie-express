import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin, Search, Loader2, AlertCircle, ShoppingBag, Navigation, Utensils, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLocation as useLocationHook } from '../hooks/useLocation';
import { restaurantService } from '../services/restaurantService';
import { useNavigate, useLocation } from 'react-router-dom';

const Restaurants = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const categoryParam = query.get('category');
    const { latitude, longitude, loading: locLoading, error: locError } = useLocationHook();

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(categoryParam || '');

    useEffect(() => {
        if (!locLoading) {
            fetchRestaurants();
        }
    }, [locLoading, latitude, longitude]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const { data, error: fetchErr } = await supabase
                .from('restaurants')
                .select('*');

            if (fetchErr) throw fetchErr;

            // If no data, try fetching from OSM via service
            if ((!data || data.length === 0) && latitude && longitude) {
                await restaurantService.fetchFromOSM(latitude, longitude);
                const { data: newData } = await supabase.from('restaurants').select('*');
                setRestaurants(newData || []);
            } else {
                setRestaurants(data || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const nearbyRestaurants = useMemo(() => {
        const mapped = restaurants.map(res => ({
            ...res,
            distance: (latitude && longitude && res.latitude && res.longitude)
                ? parseFloat(restaurantService.getDistance(latitude, longitude, res.latitude, res.longitude))
                : null
        }));

        const nearby = mapped.filter(res => res.distance !== null && res.distance <= 5); // Increased to 5km for better compatibility

        return nearby.length > 0 ? nearby.sort((a, b) => a.distance - b.distance) : mapped;
    }, [restaurants, latitude, longitude]);

    const filteredRestaurants = nearbyRestaurants.filter(r =>
        (r.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (r.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (locLoading) return (
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
            <Navigation className="w-12 h-12 text-primary-600 animate-pulse mb-4" />
            <p className="font-black text-gray-400">Detecting your location...</p>
        </div>
    );

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">Nearby Flavors</h1>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <MapPin className="w-4 h-4" />
                        <p>{nearbyRestaurants.some(r => r.distance <= 5) ? 'Showing restaurants within 5.0 km' : 'Showing all restaurants'}</p>
                    </div>
                </div>

                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors w-6 h-6" />
                    <input
                        type="text"
                        placeholder="Search for restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent focus:border-primary-600 rounded-[32px] outline-none transition-all font-black text-gray-900 shadow-xl placeholder:text-gray-300"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Curating your menu...</p>
                </div>
            ) : error ? (
                <div className="glass p-12 rounded-[40px] border-rose-100 flex flex-col items-center gap-6 text-center">
                    <AlertCircle className="w-16 h-16 text-rose-500" />
                    <h4 className="text-2xl font-black text-gray-900">Database Connection Issue</h4>
                    <button onClick={fetchRestaurants} className="btn-primary px-8 py-3 rounded-2xl">Retry Connection</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {filteredRestaurants.map((res, idx) => (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -12 }}
                                onClick={() => navigate(`/restaurant/${res.id}`)}
                                className="bg-white rounded-[56px] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                    <img
                                        src={res.image_url || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop`}
                                        alt={res.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="font-black text-xs text-gray-900">{res.rating || '4.2'}</span>
                                    </div>

                                    <div className="absolute bottom-6 left-8 text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                                            <p className="text-xs font-black uppercase tracking-widest">{res.distance ? `${res.distance} KM AWAY` : 'LOCAL'}</p>
                                        </div>
                                        <h3 className="text-3xl font-black tracking-tight">{res.name}</h3>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <p className="text-gray-400 font-bold text-lg mb-6 flex items-center gap-2">
                                        <Utensils className="w-5 h-5 text-primary-600" /> {res.category || 'Multi-cuisine'}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-gray-900 text-lg">₹{res.price_for_two || '500'} For Two</span>
                                        </div>
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-7 h-7" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {
                        filteredRestaurants.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-[56px] border-2 border-dashed border-gray-100 shadow-xl">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl grayscale">🍕</div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Nearby Restaurants</h3>
                                <p className="text-gray-500 font-bold text-lg max-w-md mx-auto mb-10">We couldn't find any restaurants within 2km. Try expanding your search or searching by name.</p>
                                <button onClick={fetchRestaurants} className="btn-primary px-10 py-4 font-black text-lg">Refresh Listing</button>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
};

export default Restaurants;
