import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Supabase confirms and recovers session
                const { data, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (data?.session) {
                    // Success! Redirect to home
                    navigate('/home');
                } else {
                    // Something went wrong, return to login
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error during auth callback:', err.message);
                navigate('/login');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="relative mb-8">
                    <Loader2 className="w-20 h-20 text-primary-600 animate-spin absolute inset-0 opacity-20" />
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center relative">
                        <ShieldCheck className="w-10 h-10 text-primary-600 animate-bounce" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">
                    Confirming Account...
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Please wait while we secure your session
                </p>

                <div className="mt-8 flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="w-2 h-2 bg-primary-600 rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthCallback;
