import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, TrendingUp, History, Zap, ShieldCheck } from 'lucide-react';

const PaymentSuccess = () => {
    const { orderId } = useParams();

    useEffect(() => {
        // Confetti effect could be added here if needed
    }, []);

    return (
        <div className="pt-24 min-h-screen bg-white flex flex-col items-center justify-center -translate-y-12">
            <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center text-white mb-10 shadow-emerald-500/50 shadow-2xl z-20"
                >
                    <CheckCircle2 className="w-20 h-20" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center px-4"
            >
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs mb-6 border border-emerald-100 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Transaction
                </div>

                <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Payment <br /> Successful!</h1>
                <p className="text-xl text-gray-500 font-bold mb-12 max-w-sm mx-auto leading-relaxed">
                    Hurrah! Your order is on the way. You can track its progress in real-time.
                </p>

                <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 mb-12 flex flex-col items-center">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1 font-bold">Order Reference ID</p>
                    <p className="text-lg font-black text-gray-900">#{orderId.slice(0, 12).toUpperCase()}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link to={`/track-order/${orderId}`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-900 text-white py-5 px-12 text-xl font-black rounded-[32px] shadow-2xl flex items-center gap-3 hover:bg-black transition-all"
                        >
                            Track Progress
                            <TrendingUp className="w-6 h-6" />
                        </motion.button>
                    </Link>
                    <Link to="/my-orders">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-gray-50 text-gray-900 rounded-[32px] font-black text-xl hover:bg-gray-100 transition-all border border-gray-100 flex items-center gap-3"
                        >
                            History
                            <History className="w-6 h-6" />
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
