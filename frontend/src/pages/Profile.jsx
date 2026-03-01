import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bell, MapPin, CreditCard, ChevronRight, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const menuItems = [
        { icon: MapPin, label: 'Manage Addresses', desc: 'Home, Office, Other addresses' },
        { icon: CreditCard, label: 'Payment Methods', desc: 'Saved cards, Wallets, UPI' },
        { icon: Bell, label: 'Notifications', desc: 'Deals, Status, System updates' },
        { icon: Shield, label: 'Privacy & Security', desc: 'Password, App lock, Connected apps' },
    ];

    const handleLogout = async () => {
        await logout();
        showToast('Logged out successfully', 'success');
        navigate('/');
    };

    return (
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-8">
            <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tight">Personal Account</h1>

            <div className="space-y-8">
                {/* Profile Header */}
                <div className="glass p-10 rounded-[48px] border border-primary-50 relative overflow-hidden flex flex-col items-center sm:flex-row sm:items-start gap-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -z-10" />

                    <div className="relative group">
                        <div className="w-40 h-40 bg-primary-100 rounded-[40px] flex items-center justify-center text-primary-600 border-4 border-white shadow-2xl relative overflow-hidden">
                            <User className="w-20 h-20" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="text-white w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow text-center sm:text-left pt-4">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 truncate">{user?.user_metadata?.full_name || 'Foodie Express User'}</h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 font-bold mb-6">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                            <span className="px-5 py-2 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">Member Gold</span>
                            <span className="px-5 py-2 bg-gray-50 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-gray-100">Joined Feb 2026</span>
                        </div>
                    </div>
                </div>

                {/* Settings list */}
                <div className="glass p-4 rounded-[48px] border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {menuItems.map((item, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 0.995 }}
                            className="w-full flex items-center justify-between p-8 hover:bg-gray-50 transition-all text-left"
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
                                    <item.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg mb-1">{item.label}</h4>
                                    <p className="text-sm font-bold text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-300" />
                        </motion.button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-8 hover:bg-rose-50 transition-all text-left group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50 group-hover:border-rose-100">
                                <LogOut className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-rose-600 text-lg mb-1">Sign Out</h4>
                                <p className="text-sm font-bold text-rose-300">Exit your current session</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-rose-200" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
