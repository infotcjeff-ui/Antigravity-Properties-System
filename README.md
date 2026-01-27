# Antigravity Properties System

A comprehensive SaaS Property Management System built with React 18, Tailwind CSS v4, Framer Motion, and Supabase.

## Features

### Admin Dashboard
- **Properties Management**: Full CRUD operations with advanced features
  - Proprietor selection with inline creation modal
  - Drag & drop image upload (max 5 images, 5MB total)
  - Google Maps address lookup (mock implementation)
  - Comprehensive property fields (type, status, land use, etc.)
- **Renting (Expense)**: Track outgoing payments
- **Rent Out (Income)**: Track incoming rent
- **Proprietors**: Manage asset owners
- **Dashboard**: Bento Grid layout with statistics and quick stats

### Client Portal
- **My Listings**: View assigned properties
- **List/Unlist**: Toggle property listing status

### Technical Features
- 🌓 Dark/Light mode support
- 🌍 i18n support (English & Traditional Chinese)
- 🎨 Modern UI with HeroUI components
- ✨ Smooth animations with Framer Motion
- 🔐 Row Level Security with Supabase
- 📱 Responsive design

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env.local`:
```
VITE_SUPABASE_URL=https://gmpkqwrkechzojbqhfxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Xli-Md9J88Ghe5w9cPnqKg_zVf6BL8S
```

3. Setup Supabase database:
   - Go to your Supabase project SQL Editor
   - Run the SQL script from `supabase/schema.sql`
   - This will create all tables, RLS policies, and storage buckets

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Shared components
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   ├── ThemeProvider.jsx
│   ├── ProtectedRoute.jsx
│   └── PageTransition.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── features/           # Feature-based modules
│   ├── auth/
│   ├── properties/
│   ├── renting/
│   ├── rentout/
│   ├── proprietors/
│   ├── dashboard/
│   └── client/
├── hooks/              # Custom hooks
│   └── useDatabase.js
├── i18n/               # Internationalization
│   ├── config.js
│   └── locales/
├── layouts/            # Layout components
│   ├── AdminLayout.jsx
│   └── ClientLayout.jsx
├── utils/              # Utilities
│   └── supabase.js
├── App.jsx
├── main.jsx
└── index.css
```

## Database Schema

### Tables
- **profiles**: User profiles extending auth.users
- **proprietors**: Asset owners
- **properties**: Property records with all details
- **transactions**: Income and expense tracking

### Row Level Security
- Admins have full access to all tables
- Clients can only view/update their assigned properties
- Proper RLS policies ensure data security

## Usage

### Admin Login
1. Create an admin user in Supabase Auth
2. Add a profile record with `role = 'admin'`
3. Login with credentials

### Client Login
1. Create a client user in Supabase Auth
2. Add a profile record with `role = 'client'`
3. Login with credentials

### Adding Properties
1. Navigate to Properties page
2. Click "Add Property"
3. Fill in the form:
   - Select or create a proprietor
   - Enter property details
   - Upload images (drag & drop)
   - Enter address for map preview
4. Save the property

## Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v4
- **UI Library**: HeroUI
- **Animation**: Framer Motion 11.9
- **Backend**: Supabase (PostgreSQL)
- **i18n**: i18next, react-i18next
- **Routing**: React Router DOM
- **Icons**: Heroicons

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## License

Private project for Antigravity Properties.
