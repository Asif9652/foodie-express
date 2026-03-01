import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { ShoppingBag, Minus, Plus, Trash2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isPlacing, setIsPlacing] = useState(false);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        if (!user) {
            showToast('Please login to place an order.', 'error');
            return;
        }

        setIsPlacing(true);
        try {
            const amount = totalPrice + 40 + 25;

            // Step 4: Move cart to orders
            const order = await orderService.createFromCart(user.id, cartItems, amount);

            showToast('Order placed successfully!', 'success');
            navigate('/orders');
        } catch (err) {
            showToast(err.message || 'Failed to place order.', 'error');
        } finally {
            setIsPlacing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-20 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-80 h-80 bg-primary-50 rounded-full flex items-center justify-center mb-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary-600/5 backdrop-blur-3xl animate-pulse" />
                    <ShoppingBag className="w-40 h-40 text-primary-600 relative z-10" />
                </motion.div>
                <h1 className="text-4xl font-black text-gray-900 mb-4">Your cart is empty</h1>
                <p className="text-gray-500 font-medium mb-10 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/restaurants">
                    <button className="btn-primary px-10 py-4 text-lg font-black shadow-xl shadow-primary-500/20">
                        Top Restaurants Near You
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-primary-600 rounded-2xl">
                    <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass p-8 rounded-[40px] border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900">Your Menu</h2>
                            <span className="text-sm font-bold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full">
                                {cartItems.length} Items Selected
                            </span>
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50 group hover:border-primary-100 transition-all"
                                    >
                                        <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                                                <img
                                                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'; }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.restaurant_name}</p>
                                                <p className="mt-2 font-black text-primary-600 flex items-center gap-1">
                                                    <span className="text-sm">₹</span>
                                                    {item.price}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-8">
                                            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-50 text-primary-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-8 rounded-[40px] border border-gray-100 sticky top-32">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">Bill Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 font-bold">
                                <span>Item Total</span>
                                <span className="text-gray-900 flex items-center gap-1">
                                    <span className="text-sm">₹</span>
                                    {totalPrice}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold">
                                <span>Delivery Fee</span>
                                <span className="text-emerald-500 flex items-center gap-1">
                                    + <span className="text-sm">₹</span>
                                    40
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold border-b border-gray-50 pb-4">
                                <span>Taxes & Charges</span>
                                <span className="text-gray-900 flex items-center gap-1">
                                    + <span className="text-sm">₹</span>
                                    25
                                </span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-gray-900 pt-4">
                                <span>Total Pay</span>
                                <span className="text-primary-600 flex items-center gap-1">
                                    <span className="text-xl">₹</span>
                                    {totalPrice + 40 + 25}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleCheckout}
                                disabled={isPlacing}
                                className="w-full btn-primary py-5 text-xl font-black shadow-xl shadow-primary-500/20 group disabled:opacity-50"
                            >
                                {isPlacing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Place Order
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>

                            <div className="p-4 bg-emerald-50 rounded-2xl flex items-start gap-4">
                                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                                <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                                    Safe and Secure Payments. 100% Authentic food from certified restaurants.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
