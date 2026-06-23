/*
# Extended Features Schema

Adds additional tables for:
- Coupons and user-claimed coupons
- Wallets and wallet transactions  
- Referral codes and referrals
- Chat messages between customers and partners
- Partner earnings and job requests
- Live tracking updates
- Notification tokens and stored notifications
- Contact messages

## Security:
- Full RLS policies for user-owned data
- Public read for active coupons
- Partner-scoped access for job requests and earnings
*/

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL,
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
CREATE TABLE IF NOT EXISTS user_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  is_used BOOLEAN DEFAULT false,
  used_on_booking UUID REFERENCES bookings(id),
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coupon_id)
);

-- Wallet Table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL,
  description TEXT,
  reference_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Codes
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  code VARCHAR(20) UNIQUE NOT NULL,
  total_referrals INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
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
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Earnings
CREATE TABLE IF NOT EXISTS partner_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Job Requests
CREATE TABLE IF NOT EXISTS partner_job_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partner_id, booking_id)
);

-- Tracking Updates (for live technician tracking)
CREATE TABLE IF NOT EXISTS tracking_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  status VARCHAR(50),
  eta_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push Notification Tokens
CREATE TABLE IF NOT EXISTS notification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform VARCHAR(20) DEFAULT 'android',
  device_id VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stored Notifications
CREATE TABLE IF NOT EXISTS stored_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  data JSONB,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200),
  email VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
DROP POLICY IF EXISTS "coupons_public" ON coupons;
CREATE POLICY "coupons_public" ON coupons FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- RLS Policies for user_coupons
DROP POLICY IF EXISTS "user_coupons_own" ON user_coupons;
CREATE POLICY "user_coupons_own" ON user_coupons FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for wallets
DROP POLICY IF EXISTS "wallets_own" ON wallets;
CREATE POLICY "wallets_own" ON wallets FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for wallet_transactions
DROP POLICY IF EXISTS "wallet_transactions_own" ON wallet_transactions;
CREATE POLICY "wallet_transactions_own" ON wallet_transactions FOR SELECT
  TO authenticated USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "wallet_transactions_insert" ON wallet_transactions;
CREATE POLICY "wallet_transactions_insert" ON wallet_transactions FOR INSERT
  TO authenticated WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- RLS Policies for referral_codes
DROP POLICY IF EXISTS "referral_codes_own" ON referral_codes;
CREATE POLICY "referral_codes_own" ON referral_codes FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for referrals
DROP POLICY IF EXISTS "referrals_own" ON referrals;
CREATE POLICY "referrals_own" ON referrals FOR SELECT
  TO authenticated USING (referrer_id = auth.uid() OR referee_id = auth.uid());

DROP POLICY IF EXISTS "referrals_insert" ON referrals;
CREATE POLICY "referrals_insert" ON referrals FOR INSERT
  TO authenticated WITH CHECK (referee_id = auth.uid());

-- RLS Policies for chat_messages
DROP POLICY IF EXISTS "chat_select_participant" ON chat_messages;
CREATE POLICY "chat_select_participant" ON chat_messages FOR SELECT
  TO authenticated USING (booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));

DROP POLICY IF EXISTS "chat_insert_participant" ON chat_messages;
CREATE POLICY "chat_insert_participant" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));

-- RLS Policies for partner_earnings
DROP POLICY IF EXISTS "partner_earnings_own" ON partner_earnings;
CREATE POLICY "partner_earnings_own" ON partner_earnings FOR SELECT
  TO authenticated USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- RLS Policies for partner_job_requests
DROP POLICY IF EXISTS "job_requests_own" ON partner_job_requests;
CREATE POLICY "job_requests_own" ON partner_job_requests FOR ALL
  TO authenticated USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- RLS Policies for tracking_updates
DROP POLICY IF EXISTS "tracking_booking" ON tracking_updates;
CREATE POLICY "tracking_booking" ON tracking_updates FOR SELECT
  TO authenticated USING (booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));

DROP POLICY IF EXISTS "tracking_insert" ON tracking_updates;
CREATE POLICY "tracking_insert" ON tracking_updates FOR INSERT
  TO authenticated WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- RLS Policies for notification_tokens
DROP POLICY IF EXISTS "notif_tokens_own" ON notification_tokens;
CREATE POLICY "notif_tokens_own" ON notification_tokens FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for stored_notifications
DROP POLICY IF EXISTS "stored_notif_own" ON stored_notifications;
CREATE POLICY "stored_notif_own" ON stored_notifications FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for contact_messages (anyone can insert)
DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;
CREATE POLICY "contact_messages_insert" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_booking ON chat_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_tracking_booking ON tracking_updates(booking_id);
CREATE INDEX IF NOT EXISTS idx_tracking_created ON tracking_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_user ON stored_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_partner ON partner_job_requests(partner_id, status);
CREATE INDEX IF NOT EXISTS idx_wallet_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_code ON referral_codes(code);