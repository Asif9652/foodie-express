import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch items from DB
    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        try {
            const data = await cartService.fetchItems(user.id);
            // Transform for easy UI usage (merging quantity and menuItem info)
            const formatted = data.map(item => ({
                id: item.id,
                menuItemId: item.menu_item_id,
                ...item.menu_items,
                quantity: item.quantity
            }));
            setCartItems(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (menuItem) => {
        if (!user) {
            showToast('Please login to add items to cart.', 'error');
            return;
        }
        try {
            await cartService.addItem(user.id, menuItem.id);
            await fetchCart();
            showToast(`${menuItem.name} added to plate!`, 'success');
        } catch (err) {
            showToast('Failed to add item.', 'error');
        }
    };

    const removeFromCart = async (id) => {
        try {
            await cartService.removeItem(id);
            await fetchCart();
        } catch (err) {
            showToast('Failed to remove item.', 'error');
        }
    };

    const updateQuantity = async (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;
        try {
            const newQty = item.quantity + delta;
            await cartService.updateQuantity(id, newQty);
            await fetchCart();
        } catch (err) {
            showToast('Failed to update quantity.', 'error');
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            await cartService.clear(user.id);
            setCartItems([]);
        } catch (err) {
            console.error(err);
        }
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};
