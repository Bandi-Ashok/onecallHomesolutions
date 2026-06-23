/*
# Initial Schema for One Call Home Solutions

Creates the core database tables for the home services platform.

## Tables Created:
1. **service_categories** - 28 main service categories (Cleaning, Plumbing, etc.)
2. **services** - Individual services under each category (300+ services)
3. **profiles** - Customer profiles with membership tiers
4. **technicians** - Service partner/technician profiles
5. **bookings** - Service booking records with scheduling
6. **amc_plans** - Annual Maintenance Contract tiers
7. **customer_amc** - Customer AMC subscriptions
8. **reviews** - Service reviews and ratings
9. **service_addresses** - Customer saved addresses
10. **cart_items** - Multi-service booking cart
11. **notifications** - User notifications

## Security:
- Row Level Security (RLS) enabled on all tables
- Public read for categories, services, and AMC plans
- User-scoped access for personal data (profiles, bookings, addresses)
- Partner profile visibility for verified/available partners
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Service Categories (28 main categories)
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  display_order INT DEFAULT 0,
  is_emergency_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services (individual services under categories)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'per service',
  duration_minutes INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Customer Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(200),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  is_verified BOOLEAN DEFAULT false,
  membership_tier VARCHAR(20) DEFAULT 'free',
  loyalty_points INT DEFAULT 0,
  profile_image TEXT,
  referral_code_id UUID,
  google_id VARCHAR(100),
  whatsapp_opt_in BOOLEAN DEFAULT true,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners (Service Partners/Technicians)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  profile_image TEXT,
  categories UUID[],
  rating DECIMAL(3,2) DEFAULT 4.5,
  total_jobs INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_online BOOLEAN DEFAULT false,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  aadhaar_number VARCHAR(20),
  pan_number VARCHAR(20),
  bank_account VARCHAR(50),
  ifsc_code VARCHAR(20),
  documents JSONB,
  city VARCHAR(100),
  pincode VARCHAR(10),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'pending',
  scheduled_date DATE,
  scheduled_time_slot VARCHAR(50),
  address TEXT NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(10),
  notes TEXT,
  final_price DECIMAL(10,2),
  is_emergency BOOLEAN DEFAULT false,
  otp VARCHAR(6),
  coupon_id UUID,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  wallet_used DECIMAL(10,2) DEFAULT 0,
  tracking_enabled BOOLEAN DEFAULT false,
  chat_enabled BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AMC Plans
CREATE TABLE IF NOT EXISTS amc_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(20) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  annual_price DECIMAL(10,2) NOT NULL,
  discount_percent INT DEFAULT 0,
  features JSONB,
  included_services UUID[],
  visit_count_per_year INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer AMC Subscriptions
CREATE TABLE IF NOT EXISTS customer_amc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES amc_plans(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  total_visits_included INT,
  visits_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Addresses
CREATE TABLE IF NOT EXISTS service_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(10),
  landmark VARCHAR(200),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_amc ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories (public read)
DROP POLICY IF EXISTS "service_categories_public" ON service_categories;
CREATE POLICY "service_categories_public" ON service_categories FOR ALL
  TO anon, authenticated USING (true);

-- RLS Policies for services (public read)
DROP POLICY IF EXISTS "services_public_select" ON services;
CREATE POLICY "services_public_select" ON services FOR SELECT
  TO anon, authenticated USING (true);

-- RLS Policies for profiles (users own their profile)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for partners
DROP POLICY IF EXISTS "partners_public" ON partners;
CREATE POLICY "partners_public" ON partners FOR SELECT
  TO anon, authenticated USING (is_verified = true AND is_available = true);

DROP POLICY IF EXISTS "partners_own" ON partners;
CREATE POLICY "partners_own" ON partners FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for bookings
DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "bookings_update_own" ON bookings;
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- RLS Policies for amc_plans (public read for active plans)
DROP POLICY IF EXISTS "amc_plans_public" ON amc_plans;
CREATE POLICY "amc_plans_public" ON amc_plans FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- RLS Policies for customer_amc
DROP POLICY IF EXISTS "customer_amc_select_own" ON customer_amc;
CREATE POLICY "customer_amc_select_own" ON customer_amc FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "customer_amc_insert_own" ON customer_amc;
CREATE POLICY "customer_amc_insert_own" ON customer_amc FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for reviews
DROP POLICY IF EXISTS "reviews_public" ON reviews;
CREATE POLICY "reviews_public" ON reviews FOR SELECT
  TO anon, authenticated USING (is_public = true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for service_addresses
DROP POLICY IF EXISTS "addresses_select_own" ON service_addresses;
CREATE POLICY "addresses_select_own" ON service_addresses FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "addresses_insert_own" ON service_addresses;
CREATE POLICY "addresses_insert_own" ON service_addresses FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "addresses_update_own" ON service_addresses;
CREATE POLICY "addresses_update_own" ON service_addresses FOR UPDATE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())) WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "addresses_delete_own" ON service_addresses;
CREATE POLICY "addresses_delete_own" ON service_addresses FOR DELETE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for cart_items
DROP POLICY IF EXISTS "cart_select_own" ON cart_items;
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cart_insert_own" ON cart_items;
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cart_delete_own" ON cart_items;
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for notifications
DROP POLICY IF EXISTS "notifications_own" ON notifications;
CREATE POLICY "notifications_own" ON notifications FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings(scheduled_date, scheduled_time_slot);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_available ON partners(is_available, is_verified, city);