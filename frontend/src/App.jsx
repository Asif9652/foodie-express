import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
// MyOrders is not used
import TrackOrder from './pages/TrackOrder';
import PaymentSuccess from './pages/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';

import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Offers from './pages/Offers';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';
import BottomNav from './components/BottomNav';

import Search from './pages/Search';

function App() {
    console.log('App.jsx: Rendering App component...');
    return (
        <div className="flex flex-col min-h-screen bg-white pb-20 md:pb-0">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/restaurant/:id" element={<Menu />} />
                    <Route path="/offers" element={<Offers />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected Routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                    <Route path="/track-order/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
                    <Route path="/payment-success/:orderId" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                </Routes>
            </main>
            <BottomNav />
            <Footer />
        </div>
    );
}

export default App;
