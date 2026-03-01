import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Utensils, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService } from '../services/searchService';

interface Result {
    id: number;
    name: string;
    category?: string;
    description?: string;
    restaurants?: { name: string };
    price?: number;
}

const SearchBar = ({ isMobile = false }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ restaurants: Result[], menuItems: Result[] }>({ restaurants: [], menuItems: [] });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    // Live search
    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim() === '') {
                setResults({ restaurants: [], menuItems: [] });
                setIsOpen(false);
                return;
            }

            setLoading(true);
            setIsOpen(true);
            const data = await searchService.searchAll(query);
            setResults(data);
            setLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 400);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Navigate and clear search
    const handleNavigate = (path: string) => {
        setIsOpen(false);
        setQuery('');
        navigate(path);
    };

    const hasResults = results.restaurants.length > 0 || results.menuItems.length > 0;

    return (
        <div ref={wrapperRef} className={`relative w-full max-w-lg ${isMobile ? 'block' : 'hidden md:block'}`}>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 w-5 h-5 transition-colors" />
                <input
                    type="text"
                    placeholder="Search for restaurants, cuisines, or dishes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() !== '' && setIsOpen(true)}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-primary-600 focus:bg-white rounded-full py-2.5 pl-12 pr-4 text-sm font-bold shadow-inner outline-none transition-all placeholder:text-gray-400 text-gray-900"
                />
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600 animate-spin" />
                )}
            </div>

            <AnimatePresence>
                {isOpen && query && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col max-h-[70vh]"
                    >
                        {!loading && !hasResults ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <span className="text-4xl mb-3 grayscale opacity-50">🔍</span>
                                <h4 className="font-black text-gray-900 mb-1">No Results Found</h4>
                                <p className="text-xs font-bold text-gray-400">Try searching for something else like "Pizza" or "Biryani".</p>
                            </div>
                        ) : (
                            <div className="overflow-y-auto no-scrollbar scroll-smooth">
                                {/* Restaurants Section */}
                                {results.restaurants.length > 0 && (
                                    <div className="p-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 flex items-center gap-1.5 mb-3 px-3">
                                            <MapPin className="w-3.5 h-3.5" /> Restaurants
                                        </h4>
                                        <div className="space-y-1">
                                            {results.restaurants.map(rest => (
                                                <div
                                                    key={`r-${rest.id}`}
                                                    onClick={() => handleNavigate(`/restaurant/${rest.id}`)}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
                                                >
                                                    <div>
                                                        <h5 className="font-bold text-sm text-gray-900 group-hover:text-primary-600 transition-colors">{rest.name}</h5>
                                                        <p className="text-xs font-bold text-gray-400">{rest.category}</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Divider */}
                                {results.restaurants.length > 0 && results.menuItems.length > 0 && (
                                    <div className="mx-6 h-px bg-gray-100" />
                                )}

                                {/* Menu Items Section */}
                                {results.menuItems.length > 0 && (
                                    <div className="p-4 bg-gray-50/30">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 flex items-center gap-1.5 mb-3 px-3">
                                            <Utensils className="w-3.5 h-3.5" /> Dishes
                                        </h4>
                                        <div className="space-y-1">
                                            {results.menuItems.map(item => (
                                                <div
                                                    key={`m-${item.id}`}
                                                    onClick={() => handleNavigate(`/restaurants?category=${item.category}`)}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white shadow-sm hover:shadow-md cursor-pointer group transition-all"
                                                >
                                                    <div className="flex-1 pr-4">
                                                        <h5 className="font-bold text-sm text-gray-900 group-hover:text-primary-600">{item.name}</h5>
                                                        <p className="text-xs font-bold text-gray-400 capitalize">{item.category} • {item.restaurants?.name || 'Various'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                                                            ₹{item.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100 mt-auto">
                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 italic">Press enter or click on an item to navigate</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
