import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Search, Menu, X, UtensilsCrossed, LayoutDashboard, LogOut, Ticket, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: UtensilsCrossed },
        { name: 'Restaurants', path: '/restaurants', icon: Search },
        { name: 'Offers', path: '/offers', icon: Ticket },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/50 backdrop-blur-md py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                        <UtensilsCrossed className="text-white w-6 h-6" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-gray-900 border-b-2 border-transparent hover:border-primary-600 transition-all">
                        FoodieExpress
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-10 flex-1 justify-center relative z-20">
                    <div className="flex-1 w-full max-w-sm xl:max-w-md ml-8 border-r border-gray-100 pr-8">
                        <SearchBar />
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-2 text-sm font-bold transition-colors hover:text-primary-600 ${location.pathname === link.path ? 'text-primary-600' : 'text-gray-700'
                                }`}
                        >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                        </Link>
                    )
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/cart">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 rounded-full hover:bg-primary-50 text-gray-700 relative group"
                        >
                            <ShoppingCart className="w-6 h-6 group-hover:text-primary-600 transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black animate-bounce-short">
                                    {totalItems}
                                </span>
                            )}
                        </motion.button>
                    </Link>

                    {!user ? (
                        <>
                            <Link to="/login" className="hidden sm:block">
                                <button className="btn-secondary py-2.5 px-6 text-sm font-bold">Log In</button>
                            </Link>
                            <Link to="/signup" className="hidden sm:block">
                                <button className="btn-primary py-2.5 px-6 text-sm font-bold shadow-primary-500/20 shadow-lg">Sign Up</button>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/orders" className="hidden md:block">
                                <button className="p-2.5 text-gray-600 hover:text-primary-600 font-bold text-sm flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    <span>Orders</span>
                                </button>
                            </Link>
                            <div className="group relative">
                                <div className="flex items-center gap-3 pr-2 group cursor-pointer relative">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Welcome back</p>
                                        <p className="text-sm font-black text-gray-900 leading-none">{user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}</p>
                                    </div>
                                    <div className="w-11 h-11 bg-primary-100 rounded-[18px] flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-xl overflow-hidden hover:border-primary-500 transition-all">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 transform origin-top-right">
                                    <Link to="/profile" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-700">
                                        <UserIcon className="w-4 h-4" /> Profile
                                    </Link>
                                    <Link to="/orders" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-700 md:hidden">
                                        <Package className="w-4 h-4" /> My Orders
                                    </Link>
                                    <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-700">
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </Link>
                                    <hr className="my-2 border-gray-50" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-rose-50 rounded-xl font-bold text-sm text-rose-600"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-primary-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6 text-primary-600" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed inset-0 top-[72px] bg-white z-40 lg:hidden overflow-y-auto"
                    >
                        <div className="p-6 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center gap-4 text-2xl font-black text-gray-900 border-b border-gray-50 pb-6"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <link.icon className="w-6 h-6 text-primary-600" />
                                    {link.name}
                                </Link>
                            ))}
                            {user && (
                                <>
                                    <Link to="/orders" className="flex items-center gap-4 text-2xl font-black text-gray-900 border-b border-gray-50 pb-6" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Package className="w-6 h-6 text-primary-600" /> Orders
                                    </Link>
                                    <Link to="/profile" className="flex items-center gap-4 text-2xl font-black text-gray-900 border-b border-gray-50 pb-6" onClick={() => setIsMobileMenuOpen(false)}>
                                        <UserIcon className="w-6 h-6 text-primary-600" /> Profile
                                    </Link>
                                </>
                            )}
                            <div className="pt-4 flex flex-col gap-4">
                                {!user ? (
                                    <>
                                        <Link to="/login" className="w-full">
                                            <button className="btn-secondary w-full py-4 text-xl font-black" onClick={() => setIsMobileMenuOpen(false)}>Log In</button>
                                        </Link>
                                        <Link to="/signup" className="w-full">
                                            <button className="btn-primary w-full py-4 text-xl font-black shadow-xl shadow-primary-500/20" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</button>
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
                                    >
                                        <LogOut className="w-6 h-6" /> Sign Out
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
