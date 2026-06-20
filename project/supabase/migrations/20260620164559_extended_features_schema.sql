-- Coupons Table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount DECIMAL(10,2),
  min_order_value DECIMAL(10,2) DEFAULT 0,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_categories UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Coupons (claimed coupons)
CREATE TABLE user_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  is_used BOOLEAN DEFAULT false,
  used_on_booking UUID REFERENCES bookings(id),
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coupon_id)
);

-- Wallet Table
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'credit', 'debit', 'refund', 'cashback', 'referral'
  description TEXT,
  reference_id VARCHAR(100), -- booking_id or referral_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Codes
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  code VARCHAR(20) UNIQUE NOT NULL,
  total_referrals INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code_id UUID REFERENCES referral_codes(id) ON DELETE CASCADE,
  reward_amount DECIMAL(10,2) DEFAULT 100,
  is_rewarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referee_id)
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL, -- 'customer', 'partner', 'admin'
  message TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Profiles (Service Partners)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  profile_image TEXT,
  categories UUID[], -- array of category ids they can serve
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
  documents JSONB, -- store document urls
  city VARCHAR(100),
  pincode VARCHAR(10),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Earnings
CREATE TABLE partner_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'job_payment', 'bonus', 'penalty', 'withdrawal'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processed', 'withdrawn'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Job Requests (for accepting/rejecting jobs)
CREATE TABLE partner_job_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'expired'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partner_id, booking_id)
);

-- Tracking Updates (for live technician tracking)
CREATE TABLE tracking_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  status VARCHAR(50), -- 'en_route', 'arrived', 'working', 'completed'
  eta_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push Notification Tokens
CREATE TABLE notification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform VARCHAR(20) DEFAULT 'android',
  device_id VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stored Notifications
CREATE TABLE stored_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  data JSONB,
  type VARCHAR(50), -- 'booking', 'chat', 'promotion', 'system'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (Extended)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- Bookings (Extended)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS wallet_used DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tracking_enabled BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS chat_enabled BOOLEAN DEFAULT true;

-- Profiles (Extended)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code_id UUID REFERENCES referral_codes(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_id VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer'; -- 'customer', 'partner', 'admin'

-- Enable RLS on all new tables
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Coupons (public read for active coupons)
CREATE POLICY "coupons_public" ON coupons FOR SELECT TO public USING (is_active = true);

-- User Coupons (users own their coupons)
CREATE POLICY "user_coupons_own" ON user_coupons FOR ALL TO authenticated 
  USING (user_id = auth.uid());

-- Wallets (users own their wallet)
CREATE POLICY "wallets_own" ON wallets FOR ALL TO authenticated 
  USING (user_id = auth.uid());

-- Wallet Transactions (users own their transactions)
CREATE POLICY "wallet_transactions_own" ON wallet_transactions FOR SELECT TO authenticated 
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- Referral Codes (users own their code)
CREATE POLICY "referral_codes_own" ON referral_codes FOR ALL TO authenticated 
  USING (user_id = auth.uid());

-- Referrals (users can see their referrals)
CREATE POLICY "referrals_own" ON referrals FOR SELECT TO authenticated 
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

-- Chat Messages (participants can access)
CREATE POLICY "chat_booking_participant" ON chat_messages FOR SELECT TO authenticated 
  USING (booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));
CREATE POLICY "chat_insert_participant" ON chat_messages FOR INSERT TO authenticated 
  WITH CHECK (booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));

-- Partners (partners own their profile)
CREATE POLICY "partners_own" ON partners FOR ALL TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "partners_public" ON partners FOR SELECT TO public 
  USING (is_verified = true AND is_available = true);

-- Partner Earnings (partners own their earnings)
CREATE POLICY "partner_earnings_own" ON partner_earnings FOR SELECT TO authenticated 
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- Partner Job Requests (partners access their requests)
CREATE POLICY "job_requests_own" ON partner_job_requests FOR ALL TO authenticated 
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- Tracking Updates (accessible by booking participants)
CREATE POLICY "tracking_booking" ON tracking_updates FOR SELECT TO authenticated 
  USING (booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));

-- Notification Tokens (users own their tokens)
CREATE POLICY "notif_tokens_own" ON notification_tokens FOR ALL TO authenticated 
  USING (user_id = auth.uid());

-- Stored Notifications (users own their notifications)
CREATE POLICY "stored_notif_own" ON stored_notifications FOR ALL TO authenticated 
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_chat_booking ON chat_messages(booking_id);
CREATE INDEX idx_tracking_booking ON tracking_updates(booking_id);
CREATE INDEX idx_tracking_created ON tracking_updates(created_at DESC);
CREATE INDEX idx_notif_user ON stored_notifications(user_id);
CREATE INDEX idx_partners_available ON partners(is_available, is_verified, city);
CREATE INDEX idx_job_requests_partner ON partner_job_requests(partner_id, status);
CREATE INDEX idx_wallet_user ON wallets(user_id);
CREATE INDEX idx_referral_code ON referral_codes(code);