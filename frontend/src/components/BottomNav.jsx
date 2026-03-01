import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Package, User, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
    const location = useLocation();
    const { totalItems } = useCart();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Restaurants', path: '/restaurants', icon: UtensilsCrossed },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: totalItems },
        { name: 'Orders', path: '/orders', icon: Package },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl border-t border-gray-100 px-4 py-3 shadow-2xl">
            <div className="flex justify-between items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center gap-1 group relative outline-none"
                        >
                            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 group-hover:text-primary-600'}`}>
                                <item.icon className="w-6 h-6" />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black animate-bounce-short">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
