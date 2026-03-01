import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ChevronRight, Check, Plus, ShoppingBag, Clock, DollarSign, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState("card");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleOrder = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate order creation
        setTimeout(() => {
            setIsLoading(false);
            navigate('/order-tracking/12345');
        }, 2000);
    };

    const steps = [
        { id: 1, name: "Delivery Address" },
        { id: 2, name: "Payment Method" },
        { id: 3, name: "Confirm Order" }
    ];

    const addresses = [
        { id: 1, name: "Home", address: "123 Maple Avenue, Downtown, New York, NY 10001", phone: "+1 (555) 123-4567" },
        { id: 2, name: "Office", address: "456 Wall Street, Finance District, New York, NY 10005", phone: "+1 (555) 987-6543" }
    ];

    const renderStep = () => {
        switch (activeStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-3xl font-black text-gray-900 mb-8">Where should we send it?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddress(addr.id)}
                                    className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all relative ${selectedAddress === addr.id
                                            ? "border-primary-600 bg-primary-50 shadow-xl shadow-primary-500/10"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                >
                                    {selectedAddress === addr.id && (
                                        <div className="absolute top-6 right-6 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center animate-bounce">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    )}
                                    <h4 className="font-black text-xl mb-4">{addr.name}</h4>
                                    <p className="text-gray-500 font-medium mb-4 leading-relaxed">{addr.address}</p>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{addr.phone}</p>
                                </div>
                            ))}
                            <div className="p-8 rounded-[40px] border-2 border-dashed border-gray-200 bg-white hover:border-primary-600 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-gray-400 group hover:text-primary-600">
                                <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-bold">Add New Address</span>
                            </div>
                        </div>
                        <div className="pt-10 flex justify-end">
                            <button
                                onClick={() => setActiveStep(2)}
                                className="btn-primary py-4 px-10 rounded-2xl group text-lg"
                            >
                                Continue to Payment
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-3xl font-black text-gray-900 mb-8">Choose Payment Method</h3>
                        <div className="space-y-6 max-w-2xl">
                            {["card", "razorpay", "paypal", "cod"].map((method) => (
                                <div
                                    key={method}
                                    onClick={() => setSelectedPayment(method)}
                                    className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedPayment === method
                                            ? "border-primary-600 bg-primary-50"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${selectedPayment === method ? "bg-primary-600 text-white" : "bg-gray-100"
                                            }`}>
                                            <CreditCard className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl uppercase tracking-tight">
                                                {method === "card" ? "Debit/Credit Card" : method.toUpperCase()}
                                            </h4>
                                            <p className="text-gray-500 text-sm font-medium">Safe & Encrypted Transaction</p>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${selectedPayment === method ? "border-primary-600 bg-primary-600" : "border-gray-200"
                                        }`}>
                                        {selectedPayment === method && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-10 flex items-center justify-between">
                            <button
                                onClick={() => setActiveStep(1)}
                                className="inline-flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to address
                            </button>
                            <button
                                onClick={() => setActiveStep(3)}
                                className="btn-primary py-4 px-10 rounded-2xl group text-lg"
                            >
                                Review Order
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                        <h3 className="text-3xl font-black text-gray-900">Final Confirmation</h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-[40px] border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-black text-lg">Delivery Details</h4>
                                    <button onClick={() => setActiveStep(1)} className="text-primary-600 hover:underline text-sm font-bold">Edit</button>
                                </div>
                                <div className="flex gap-4">
                                    <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                                    <p className="text-gray-500 font-medium">{addresses.find(a => a.id === selectedAddress).address}</p>
                                </div>
                                <div className="flex gap-4">
                                    <Clock className="w-5 h-5 text-primary-600 shrink-0" />
                                    <p className="text-gray-500 font-medium">Estimated Delivery: 25-30 Minutes</p>
                                </div>
                            </div>

                            <div className="glass p-8 rounded-[40px] border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-black text-lg">Payment Choice</h4>
                                    <button onClick={() => setActiveStep(2)} className="text-primary-600 hover:underline text-sm font-bold">Edit</button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                                    <div>
                                        <p className="font-black text-gray-900 uppercase tracking-tighter">{selectedPayment}</p>
                                        <p className="text-gray-500 text-xs font-medium">Secured with 256-bit encryption</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex items-center justify-between">
                            <button
                                onClick={() => setActiveStep(2)}
                                className="inline-flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to payment
                            </button>
                            <button
                                onClick={handleOrder}
                                disabled={isLoading}
                                className="btn-primary py-5 px-14 rounded-2xl group text-xl font-black shadow-2xl shadow-primary-500/40 relative overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Confirm & Place Order
                                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-8">
            {/* Steps Progress */}
            <div className="flex items-center justify-center gap-12 mb-20 px-8">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-4 group">
                        <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-xl transition-all ${activeStep >= s.id ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" : "bg-gray-100 text-gray-400"
                            }`}>
                            {activeStep > s.id ? <Check className="w-6 h-6" /> : s.id}
                        </div>
                        <span className={`hidden md:block font-black uppercase tracking-widest text-xs ${activeStep >= s.id ? "text-gray-900" : "text-gray-400"
                            }`}>{s.name}</span>
                        {i < steps.length - 1 && <div className="hidden lg:block w-32 h-[2px] bg-gray-100 rounded-full" />}
                    </div>
                ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-16">
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </main>

                <aside className="w-full xl:w-[450px]">
                    <div className="glass p-10 rounded-[48px] border border-gray-100 sticky top-28">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-primary-600" />
                                Order Details
                            </h3>
                            <Link to="/cart" className="text-primary-600 text-sm font-bold hover:underline">Edit Bag</Link>
                        </div>

                        <div className="space-y-6 mb-10 pr-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 leading-none">Whopper Meal × 1</p>
                                    <p className="text-gray-400 text-xs font-semibold">BK Signature Burger</p>
                                </div>
                                <span className="font-black text-gray-900">$12.99</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 leading-none">Pizza Hut × 2</p>
                                    <p className="text-gray-400 text-xs font-semibold">Large Pepperoni</p>
                                </div>
                                <span className="font-black text-gray-900">$37.00</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 mb-2">
                            <div className="flex justify-between font-bold text-gray-400 text-sm uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>$49.99</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-400 text-sm uppercase tracking-widest">
                                <span>Delivery Cost</span>
                                <span>$2.50</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-400 text-sm uppercase tracking-widest">
                                <span>Tax/GST</span>
                                <span className="text-green-500">+$4.99</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="text-gray-900 font-bold text-xl uppercase tracking-tighter">Amount to pay</span>
                                <span className="text-5xl font-black text-primary-600">$57.48</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
