# BurgerRox - Restaurant Ordering App

## Overview
BurgerRox is a burger restaurant ordering website for a restaurant located in Pune, India. It allows customers to browse the menu, place orders with delivery, and pay online via Razorpay or Cash on Delivery.

## Current State
- Imported from Lovable platform to Replit
- Frontend-only React app with Supabase as the backend (auth, database, edge functions)
- Fully functional with all features working

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Supabase (auth, PostgreSQL database, edge functions)
- **Payments**: Razorpay
- **Maps/Delivery**: Google Maps APIs (Distance Matrix, Geocoding, Places)
- **Routing**: react-router-dom v6

## Project Structure
```
src/
  App.tsx              - Main app with routes
  main.tsx             - Entry point
  index.css            - Global styles & Tailwind config
  components/          - UI components (Header, Hero, Cart, Menu, etc.)
  components/ui/       - shadcn/ui base components
  hooks/               - React hooks (useAuth, useCart, useDelivery, useOrders)
  integrations/supabase/ - Supabase client configuration
  pages/               - Page components (Index, Menu, Admin, Privacy, etc.)
  lib/                 - Utilities
supabase/
  functions/           - Supabase Edge Functions (Razorpay, delivery calc, etc.)
  migrations/          - Database migration SQL files
```

## Key Features
- Menu browsing with category filtering
- Shopping cart with quantity management
- User authentication (signup/login)
- Delivery address with Google Maps integration
- Distance-based delivery charges
- Razorpay online payment integration
- Order history tracking
- Admin dashboard for order management
- WhatsApp ordering support

## Environment Variables
The app uses Supabase environment variables configured via Vite:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## Running
- Dev server: `npm run dev` (runs Vite on port 5000)
- Build: `npm run build` (outputs to `dist/`)

## Recent Changes
- 2026-02-08: Imported from Lovable to Replit
  - Updated Vite config: port 5000, allowedHosts enabled
  - Removed lovable-tagger dev dependency
  - Configured deployment as static site
