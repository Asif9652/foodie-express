import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const paymentService = {
    createOrder: async (orderData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/orders/create`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/orders/verify-payment`, paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },

    openRazorpay: (orderInfo, onSuccess, onCancel) => {
        const options = {
            key: orderInfo.payment_info.key,
            amount: orderInfo.payment_info.amount,
            currency: "INR",
            name: "FoodieExpress",
            description: "Food Order Payment",
            order_id: orderInfo.payment_info.razorpay_order_id,
            handler: function (response) {
                onSuccess({
                    order_id: orderInfo.order.id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            theme: {
                color: "#f97316"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            if (onCancel) onCancel(response.error);
        });
        rzp.open();
    }
};
