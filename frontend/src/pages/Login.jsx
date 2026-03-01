import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UtensilsCrossed, ArrowRight, Github, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Requirement 3: Use supabase.auth.signInWithPassword()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            showToast('Welcome back!', 'success');
            navigate('/home');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg glass p-10 md:p-14 rounded-[48px] shadow-2xl relative z-10"
            >
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="bg-primary-600 p-2.5 rounded-2xl">
                            <UtensilsCrossed className="text-white w-6 h-6" />
                        </div>
                        <span className="font-bold text-3xl tracking-tight bg-gradient-to-r from-primary-700 to-rose-500 bg-clip-text text-transparent">
                            FoodieExpress
                        </span>
                    </Link>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Login to Account</h2>
                    <p className="text-gray-500 font-medium">Enter your credentials to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="input-field pl-12 py-4"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-field pl-12 py-4"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4 text-lg mt-4 group relative overflow-hidden disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Sign In
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-gray-100 space-y-6">
                    <p className="text-center text-gray-600 font-medium">
                        Don't have an account? <Link to="/signup" className="text-primary-600 font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
