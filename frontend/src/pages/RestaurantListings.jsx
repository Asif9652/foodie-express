import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, MapPin, Filter, FilterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantListings = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dummy Data for Preview
    const dummyRestaurants = [
        { id: 1, name: "Burger King", rating: 4.5, time: "20-30 min", address: "Downtown St, NY", category: "Fast Food", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop" },
        { id: 2, name: "Pizza Hut", rating: 4.3, time: "30-45 min", address: "Main Avenue, NY", category: "Italian", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" },
        { id: 3, name: "Sushi Sensation", rating: 4.8, time: "25-40 min", address: "Market St, NY", category: "Japanese", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop" },
        { id: 4, name: "Taco Bell", rating: 4.1, time: "15-25 min", address: "Lexington Ave, NY", category: "Mexican", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop" },
        { id: 5, name: "Pasta Palace", rating: 4.6, time: "35-50 min", address: "Park Avenue, NY", category: "Italian", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1000&auto=format&fit=crop" },
        { id: 6, name: "Sweet Dreams", rating: 4.9, time: "10-20 min", address: "Broadway St, NY", category: "Desserts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop" }
    ];

    useEffect(() => {
        // Mocking API load
        setTimeout(() => {
            setRestaurants(dummyRestaurants);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
            {/* Header / Search */}
            <div className="mb-16">
                <h1 className="text-4xl font-bold mb-8">Restaurants near you</h1>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-[60%]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search restaurants, cuisines..."
                            className="input-field pl-12 py-4"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    Array(6).fill(0).map((_, idx) => (
                        <div key={idx} className="h-[400px] w-full bg-gray-200 animate-pulse rounded-3xl" />
                    ))
                ) : (
                    restaurants.map((restaurant) => (
                        <motion.div
                            key={restaurant.id}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100"
                        >
                            <Link to={`/restaurant/${restaurant.id}`}>
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                                    <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="font-bold text-sm">{restaurant.rating}</span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary-600" />
                                        <span className="font-bold text-xs">{restaurant.time}</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-xl text-gray-900">{restaurant.name}</h3>
                                        <span className="text-xs font-bold px-2 py-1 bg-primary-100 text-primary-700 rounded-md uppercase tracking-wider">{restaurant.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span>{restaurant.address}</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-600">Free delivery on $25+</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantListings;
