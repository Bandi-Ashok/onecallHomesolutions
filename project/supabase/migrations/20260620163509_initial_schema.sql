-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Service Categories (28 main categories)
CREATE TABLE service_categories (
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
CREATE TABLE services (
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
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(200),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  is_verified BOOLEAN DEFAULT false,
  membership_tier VARCHAR(20) DEFAULT 'free', -- free, silver, gold, platinum
  loyalty_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technicians
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  skills TEXT[], -- Array of service category slugs
  rating DECIMAL(3,2) DEFAULT 4.5,
  total_jobs INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  identity_proof VARCHAR(50), -- Aadhaar number
  police_clearance BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
  scheduled_date DATE,
  scheduled_time_slot VARCHAR(50),
  address TEXT NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(10),
  notes TEXT,
  final_price DECIMAL(10,2),
  is_emergency BOOLEAN DEFAULT false,
  otp VARCHAR(6), -- For service verification
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AMC Plans
CREATE TABLE amc_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(20) NOT NULL, -- silver, gold, platinum, corporate
  monthly_price DECIMAL(10,2) NOT NULL,
  annual_price DECIMAL(10,2) NOT NULL,
  discount_percent INT DEFAULT 0,
  features JSONB, -- Array of features
  included_services UUID[], -- Array of service IDs
  visit_count_per_year INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer AMC Subscriptions
CREATE TABLE customer_amc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES amc_plans(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  total_visits_included INT,
  visits_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Addresses (for multi-property management)
CREATE TABLE service_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label VARCHAR(100), -- Home, Office, etc.
  address TEXT NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(10),
  landmark VARCHAR(200),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items (for multi-service booking)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(50), -- booking, payment, emergency, promo
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_amc ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Service categories are public
CREATE POLICY "service_categories_public" ON service_categories FOR ALL
  TO public USING (true);

-- Services are public
CREATE POLICY "services_public" ON services FOR SELECT
  TO public USING (true);
CREATE POLICY "services_admin" ON services FOR ALL
  TO authenticated USING (false) WITH CHECK (false);

-- Profiles - users own their profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Technicians - public read for availability
CREATE POLICY "technicians_public" ON technicians FOR SELECT
  TO public USING (is_available = true);
CREATE POLICY "technicians_own" ON technicians FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- Bookings - users own their bookings
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- AMC Plans are public
CREATE POLICY "amc_plans_public" ON amc_plans FOR SELECT
  TO public USING (is_active = true);

-- Customer AMC - users own their subscriptions
CREATE POLICY "customer_amc_select_own" ON customer_amc FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "customer_amc_insert_own" ON customer_amc FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Reviews - public read, user creates own
CREATE POLICY "reviews_public" ON reviews FOR SELECT
  TO public USING (is_public = true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Service addresses - users own their addresses
CREATE POLICY "addresses_select_own" ON service_addresses FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "addresses_insert_own" ON service_addresses FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "addresses_update_own" ON service_addresses FOR UPDATE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "addresses_delete_own" ON service_addresses FOR DELETE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Cart items - users own their cart
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE
  TO authenticated USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Notifications - users own their notifications
CREATE POLICY "notifications_own" ON notifications FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_date, scheduled_time_slot);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_profiles_user ON profiles(user_id);