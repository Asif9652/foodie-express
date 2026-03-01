import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <ToastProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </ToastProvider>
        </AuthProvider>
    </BrowserRouter>
);
