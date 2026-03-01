import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="relative mb-6 mx-auto w-16 h-16">
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin absolute inset-0 opacity-20" />
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center relative">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                    </div>
                </div>
                <p className="text-gray-400 font-black tracking-widest text-[10px] uppercase">Verifying Access</p>
            </motion.div>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
