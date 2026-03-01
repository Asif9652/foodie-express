import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Utensils, ShoppingBag, TrendingUp, Settings, ChevronRight, CheckCircle, Clock, Truck, Plus, Package, Loader2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, customers: 0, restaurants: 0 });
    const { showToast } = useToast();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch stats
                const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
                const { count: restCount } = await supabase.from('restaurants').select('*', { count: 'exact', head: true });
                const { data: revData } = await supabase.from('orders').select('total_price');
                const totalRevenue = revData.reduce((acc, curr) => acc + curr.total_price, 0);

                setStats({
                    totalOrders: orderCount || 0,
                    revenue: totalRevenue || 0,
                    customers: new Set(revData.map(o => o.user_id)).size || 0,
                    restaurants: restCount || 0
                });

                // Fetch orders
                const data = await orderService.fetchAll();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
            showToast(`Order status updated to ${newStatus}`, 'success');
        } catch (err) {
            showToast('Failed to update status.', 'error');
        }
    };

    if (loading) return <div className="pt-32 text-center font-bold">Loading Admin Console...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <p className="text-primary-600 font-black tracking-widest text-[10px] uppercase mb-2">Management</p>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Admin Dashboard</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 hover:scale-105 transition-all text-gray-600">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="btn-primary py-4 px-8 rounded-3xl font-black flex items-center gap-3 shadow-2xl">
                            <Plus className="w-5 h-5" /> Add Restaurant
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-primary-600', bg: 'bg-primary-50' },
                        { label: 'Total Users', value: stats.customers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Restaurants', value: stats.restaurants, icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
                        </div>
                    ))}
                </div>

                {/* Orders Management */}
                <div className="bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-black text-gray-900">Live Order Management</h2>
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-sm bg-primary-50 px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4 animate-pulse" /> Real-time Updates Active
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 uppercase text-[10px] font-black tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-10 py-6">Order ID</th>
                                    <th className="px-10 py-6">Customer</th>
                                    <th className="px-10 py-6">Total Price</th>
                                    <th className="px-10 py-6">Status</th>
                                    <th className="px-10 py-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-10 py-8 font-black text-primary-600">#{order.id.slice(0, 8).toUpperCase()}</td>
                                        <td className="px-10 py-8">
                                            <p className="font-bold text-gray-900">{order.user_id.slice(0, 5)}... User</p>
                                        </td>
                                        <td className="px-10 py-8 font-black text-gray-900">₹{order.total_price}</td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current ${order.order_status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                                    order.order_status === 'Out for Delivery' ? 'bg-blue-50 text-blue-600' :
                                                        order.order_status === 'Preparing' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-600'
                                                }`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex gap-2">
                                                {['Placed', 'Preparing', 'Out for Delivery', 'Delivered'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleUpdateStatus(order.id, status)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${order.order_status === status
                                                                ? 'bg-primary-600 text-white shadow-lg'
                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                            }`}
                                                        title={status}
                                                    >
                                                        {status === 'Placed' && <Package className="w-3.5 h-3.5" />}
                                                        {status === 'Preparing' && <Clock className="w-3.5 h-3.5" />}
                                                        {status === 'Out for Delivery' && <Truck className="w-3.5 h-3.5" />}
                                                        {status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
