import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, Package, MapPin, Heart, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showToast('Error logging out', 'error');
        }
    };

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* User Stats/Info Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="glass p-8 rounded-[40px] text-center border border-primary-100">
                        <div className="w-24 h-24 bg-primary-100 rounded-3xl mx-auto mb-6 flex items-center justify-center relative group">
                            <User className="w-12 h-12 text-primary-600" />
                            <div className="absolute inset-0 bg-primary-600/10 rounded-3xl scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-1">{user?.user_metadata?.full_name || 'Foodie User'}</h2>
                        <p className="text-gray-500 font-medium mb-6">{user?.email}</p>

                        <div className="flex gap-2 justify-center mb-8">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5">
                                <Shield className="w-3 h-3" />
                                Verified User
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>

                    <div className="glass p-8 rounded-[40px] border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                            Quick Links
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        </h3>
                        <div className="space-y-3">
                            <Link to="/orders" className="w-full flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-50 hover:border-primary-200 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white shadow-sm text-indigo-500">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-700">My Orders</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-primary-500 transition-all" />
                            </Link>
                            <Link to="/profile" className="w-full flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white shadow-sm text-orange-500">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-700">Addresses</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-primary-500 transition-all" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Main Dashboard Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="glass p-10 rounded-[40px] border border-primary-50 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
                        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Welcome to Your Dashboard</h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-6 bg-white rounded-3xl border border-gray-100">
                                <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">TOTAL ORDERS</h4>
                                <p className="text-4xl font-black text-gray-900">12</p>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-gray-100">
                                <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">CASHBACK EARNED</h4>
                                <p className="text-4xl font-black text-primary-600">₹450</p>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-gradient-to-r from-primary-600 to-rose-500 rounded-3xl text-white">
                            <p className="font-medium mb-1 opacity-90">Special Offer for {user?.user_metadata?.full_name?.split(' ')[0] || 'you'}!</p>
                            <h4 className="text-2xl font-black">Get 50% Cashback on next 3 orders</h4>
                            <button className="mt-4 px-6 py-2 bg-white text-primary-600 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                                Claim Now
                            </button>
                        </div>
                    </div>

                    <div className="glass p-10 rounded-[40px] border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900">Recent Activity</h3>
                            <button className="text-primary-600 font-bold text-sm hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white/40 rounded-3xl border border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl">🍕</div>
                                        <div>
                                            <h5 className="font-bold text-gray-900">Order from Pizza Hut</h5>
                                            <p className="text-xs text-gray-400 font-medium">Yesterday, 8:45 PM</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-gray-900">₹799</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
