# One Call Home Solutions - Production Ready Full-Stack Application

## 📋 Overview

**One Call Home Solutions (OCHS)** is a comprehensive home services platform that connects customers with trusted professionals across 300+ services in 28 categories. Built with modern technologies for scalability, security, and excellent user experience.

**Tagline:** "Your Safety Home. Our Priority."

## ✨ Key Features

### For Customers
- 🔍 Browse 300+ services across 28 categories
- 🗓️ Easy booking with instant confirmation
- 💳 Multiple payment options (UPI, Card, Net Banking, EMI, COD)
- 📍 Real-time technician tracking via Google Maps
- 🚨 One-click Emergency SOS with 30-60 min response
- ⭐ Rate and review completed services
- 📋 Annual Maintenance Contracts (AMC) with discounts
- 🔔 Push notifications for updates
- 👤 Profile management with multiple addresses

### For Service Partners
- 📊 Dashboard with assigned jobs
- ✅ Job status management (accept, start, complete)
- 📅 Weekly schedule view
- 💰 Earnings tracking
- 📸 Job documentation with notes and photos
- 🔔 Real-time job notifications
- 👁️ Availability and service area management

### For Admin
- 📈 Comprehensive dashboard with analytics
- 👥 User management and verification
- 🔧 Service catalog management
- 📋 Booking management and assignment
- 💹 Revenue reports and analytics
- 🎁 AMC plan management
- 📸 Document verification (Aadhaar, Police Clearance)
- 🎯 Content management (banners, promos)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Phone OTP |
| **Real-time** | Supabase Realtime / Socket.io |
| **Payments** | Razorpay |
| **Maps** | Google Maps API |
| **Mobile** | Capacitor (React Native Web) |
| **Deployment** | Vercel (Web), Play Store / App Store (Mobile) |
| **UI Icons** | Lucide React |
| **Notifications** | React Hot Toast |

## 📁 Project Structure

```
onecallHomesolutions/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── BookingCard.tsx
│   │   ├── Toast.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── pages/               # Page components
│   │   ├── AuthPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── EmergencyPage.tsx
│   │   ├── BookingsPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminUsers.tsx
│   │       ├── AdminServices.tsx
│   │       └── AdminBookings.tsx
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── bookingStore.ts
│   │   ├── serviceStore.ts
│   │   └── uiStore.ts
│   ├── utils/               # Utility functions
│   │   ├── api.ts
│   │   ├── helpers.ts
│   │   ├── socket.ts
│   │   └── payment.ts
│   ├── config/              # Configuration
│   │   ├── supabase.ts
│   │   └── constants.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── index.css            # Global styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/
│       ├── 001_init_schema.sql
│       └── 002_sample_data.sql
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vercel.json              # Vercel deployment config
├── Dockerfile               # Docker configuration
├── README.md
└── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bandi-Ashok/onecallHomesolutions.git
   cd onecallHomesolutions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_SOCKET_SERVER_URL=http://localhost:3001
   ```

4. **Setup Supabase**
   - Create a new Supabase project
   - Go to SQL Editor and run migrations from `supabase/migrations/`
   - Enable Row Level Security on all tables
   - Configure authentication with Phone OTP

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

## 🗄️ Database Schema

### Key Tables

#### profiles
- User profile information with role-based access
- Roles: customer, partner, admin

#### services
- 300+ services across 28 categories
- Price, description, estimated time, images

#### bookings
- Customer service bookings
- Status tracking, payment info, partner assignment

#### reviews
- Service ratings (1-5 stars) with comments
- Auto-escalation if rating < 3

#### amc_plans & amc_subscriptions
- Silver, Gold, Platinum, Corporate plans
- Subscription management

#### emergency_requests
- SOS requests with priority dispatch

#### notifications
- Push notifications for all events

### Row Level Security (RLS)
- Customers access only their own data
- Partners access assigned bookings
- Admins access all data
- Public read access for services and reviews

## 💳 Payment Integration

### Razorpay Setup
1. Create Razorpay account
2. Get Key ID and Secret from dashboard
3. Supported methods:
   - UPI
   - Credit/Debit Cards
   - Net Banking
   - EMI (installment plans)
   - Cash on Delivery (COD)

### Payment Flow
```
Customer selects service → Creates booking → Initiates payment
  → Razorpay checkout → Verification → Updates booking status
```

## 🗺️ Live Tracking

- Google Maps API integration
- Real-time partner location updates via Socket.io
- Customer can track technician on map during in-progress bookings
- Distance calculation and ETA

## 📱 Mobile App (Capacitor)

### Build Android APK
```bash
npm run build
npm run cap:init
npm run cap:sync
npm run android:build
```

### Build iOS App
```bash
npm run build
npm run cap:sync
npm run cap:open:ios
# Build from Xcode
```

## 🌍 Deployment

### Web Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Deployment
```bash
docker build -t ochs-app .
docker run -p 3000:5173 ochs-app
```

## 🔐 Security Features

- ✅ Phone OTP authentication
- ✅ Row Level Security (RLS) policies
- ✅ HTTPS/TLS encryption
- ✅ JWT token management
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ Secure payment processing

## 📊 28 Service Categories

1. Cleaning Services
2. Painting Services
3. Interior Design Services
4. Waterproofing Services
5. Plumbing Services
6. Electrical Services
7. Home Appliance Services
8. Smart Home & Security Services
9. Pest Control Services
10. Packers & Movers Services
11. Construction & Civil Works
12. Roofing & PVC Sheet Services
13. Beauty & Personal Care Services
14. Event Management Services
15. Driver & Travel Services
16. Garden & Outdoor Services
17. Corporate & Commercial Services
18. Rental Property Management
19. Emergency Services (24/7)
20. Annual Maintenance Contracts
21. Home Inspection Services
22. Eco-Friendly & Green Services
23. Product Sales & Installation
24. Senior Citizen Home Care
25. Furniture Assembly & Carpentry
26. Laundry & Dry Cleaning Services
27. Vehicle Care Services
28. Healthcare & Wellness at Home

## 🎨 Brand Colors

- **Primary:** #1B3A5C (Navy Blue)
- **Accent:** #C9972C (Gold)
- **Success:** #10b981 (Green)
- **Warning:** #f59e0b (Amber)
- **Error:** #ef4444 (Red)

## 📞 Support

- 📧 Email: support@ochs.com
- 📱 Phone: 1800-OCHS-911 (24/7)
- 🐛 Report bugs: Create GitHub issues

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Bandi Ashok Kumar (@Bandi-Ashok)

## 🙏 Acknowledgments

- Built with React, TypeScript, and Supabase
- UI powered by Tailwind CSS
- Icons by Lucide React
- Payment processing by Razorpay
- Maps by Google Maps API

---

**Ready to deploy!** 🚀 Follow the setup guide above and you'll be live in minutes.
