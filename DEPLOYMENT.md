# Deployment Guide

This document explains how to deploy the frontend to Vercel and the backend to Render.

## Frontend (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import your repository.
3. Configure your project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In Environment Variables, add:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://foodieexpress-backend.onrender.com`)
5. Click **Deploy**.

## Backend (Render)

1. Go to [Render](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure your service:
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following Environment Variables in the Advanced settings:
   - `PORT`: `5000` (Optional, Render assigns one automatically)
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key (or Service role key if needed)
   - `SUPABASE_SERVICE_KEY`: Your Supabase Service Role Key
5. Click **Create Web Service**.

## Verification
- Visit the Render URL ending in `/api/health` to confirm the backend is running (`{ "status": "running" }`).
- Visit the Vercel deployed app to verify that the UI connects fully to the real backend.
