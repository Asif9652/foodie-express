# FoodieExpress – Full Stack Food Ordering System

## Setup Instructions

### 1. Database (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the SQL Editor and run the contents of `backend/config/schema.sql`.
3. Enable **Supabase Auth** with Email/Password.

### 2. Backend Configuration
1. Navigate to the `backend/` directory.
2. Rename `.env.example` to `.env` (or use the one already created).
3. Fill in your `SUPABASE_URL` and `SUPABASE_KEY` (Service Role Key).
4. Fill in your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

### 3. Install Dependencies & Run

#### Backend:
```bash
cd backend
npm install
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion.
- **MVC Architecture**: Clean separation of concerns in the backend.
- **Supabase Integration**: Real-time database and secure authentication.
- **Razorpay Payments**: Integrated payment gateway flow.
- **Responsive Design**: Works perfectly on mobile and desktop.
- **Protected Routes**: Secure pages like Checkout and Profile.

## API Documentation
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate user & get JWT
- `GET /api/restaurants`: Fetch all restaurants (with search/city filters)
- `GET /api/menu/:restaurantId`: Fetch menu for a specific restaurant
- `POST /api/orders/create`: Create a new order (triggers Razorpay)
- `POST /api/orders/verify-payment`: Verify Razorpay signature and confirm order
