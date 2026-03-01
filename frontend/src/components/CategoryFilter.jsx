import { motion } from 'framer-motion';
import { LayoutGrid, Utensils, Soup, Coffee, ChevronRight, UtensilsCrossed } from 'lucide-react';

const categories = [
    { id: 'All', name: 'All', icon: LayoutGrid },
    { id: 'Biryani', name: 'Biryani', icon: Soup }, // Using Soup as a proxy for Biryani icon
    { id: 'Pizza', name: 'Pizza', icon: Utensils },
    { id: 'Burger', name: 'Burger', icon: UtensilsCrossed },
    { id: 'Chinese', name: 'Chinese', icon: UtensilsCrossed },
    { id: 'Dessert', name: 'Dessert', icon: Coffee },
    { id: 'Beverages', name: 'Beverages', icon: Coffee },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="relative mb-12">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-gray-900 tracking-tighter">Categories</h3>
                <div className="flex items-center gap-1.5 text-xs font-black text-primary-600 uppercase tracking-widest cursor-pointer hover:underline">
                    View All <ChevronRight className="w-4 h-4" />
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide no-scrollbar scroll-smooth">
                {categories.map((cat) => (
                    <motion.button
                        key={cat.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`
                            relative min-w-[120px] flex flex-col items-center gap-4 p-5 rounded-[32px] transition-all duration-300
                            ${selectedCategory === cat.id
                                ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/30 border-transparent'
                                : 'bg-white text-gray-400 border border-gray-100 hover:border-primary-100 hover:bg-primary-50 hover:text-primary-600 shadow-sm'
                            }
                        `}
                    >
                        <div className={`
                            w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                            ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-primary-100'}
                        `}>
                            <cat.icon className="w-8 h-8" />
                        </div>

                        <span className="font-black text-xs tracking-wider uppercase whitespace-nowrap">
                            {cat.name}
                        </span>

                        {selectedCategory === cat.id && (
                            <motion.div
                                layoutId="active-cat-bubble"
                                className="absolute -bottom-1 w-2 h-2 bg-white rounded-full"
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Visual gradient to show scrollability */}
            <div className="absolute right-0 top-12 bottom-0 w-20 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />
        </div>
    );
};

export default CategoryFilter;
