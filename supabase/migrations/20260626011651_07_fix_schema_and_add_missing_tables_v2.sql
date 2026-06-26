/*
# QA Audit Fix: Schema Corrections and Missing Tables v2

This migration addresses critical issues found during the end-to-end QA audit.
Idempotent version with DROP IF EXISTS before CREATE.
*/

-- ============================================================
-- 1. RENAME technicians TO partners (app expects partners table)
-- ============================================================

-- Drop existing FK from bookings to technicians first
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_technician_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_technician_id_fkey;

-- Rename technicians table to partners if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'technicians') THEN
    ALTER TABLE technicians RENAME TO partners;
  END IF;
END $$;

-- Update the FK in bookings to reference partners
ALTER TABLE bookings ADD CONSTRAINT bookings_technician_id_fkey
  FOREIGN KEY (technician_id) REFERENCES partners(id) ON DELETE SET NULL;

-- Update reviews FK
ALTER TABLE reviews ADD CONSTRAINT reviews_technician_id_fkey
  FOREIGN KEY (technician_id) REFERENCES partners(id) ON DELETE SET NULL;

-- ============================================================
-- 2. CREATE MISSING TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  reject_reason TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partner_id, document_type)
);

CREATE TABLE IF NOT EXISTS partner_bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  bank_name VARCHAR(200) NOT NULL,
  account_holder_name VARCHAR(200),
  account_number VARCHAR(50) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  branch_name VARCHAR(200),
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES partner_bank_accounts(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  transaction_reference VARCHAR(100),
  reject_reason TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. FIX PROFILES TABLE
-- ============================================================

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'partner', 'admin'));
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';

-- ============================================================
-- 4. ENABLE RLS ON NEW TABLES
-- ============================================================

ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES FOR NEW TABLES
-- ============================================================

DROP POLICY IF EXISTS "kyc_select_own" ON kyc_documents;
CREATE POLICY "kyc_select_own" ON kyc_documents FOR SELECT
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "kyc_insert_own" ON kyc_documents;
CREATE POLICY "kyc_insert_own" ON kyc_documents FOR INSERT
  TO authenticated WITH CHECK (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "kyc_update_own" ON kyc_documents;
CREATE POLICY "kyc_update_own" ON kyc_documents FOR UPDATE
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "kyc_delete_own" ON kyc_documents;
CREATE POLICY "kyc_delete_own" ON kyc_documents FOR DELETE
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "bank_select_own" ON partner_bank_accounts;
CREATE POLICY "bank_select_own" ON partner_bank_accounts FOR SELECT
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "bank_insert_own" ON partner_bank_accounts;
CREATE POLICY "bank_insert_own" ON partner_bank_accounts FOR INSERT
  TO authenticated WITH CHECK (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "bank_update_own" ON partner_bank_accounts;
CREATE POLICY "bank_update_own" ON partner_bank_accounts FOR UPDATE
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "bank_delete_own" ON partner_bank_accounts;
CREATE POLICY "bank_delete_own" ON partner_bank_accounts FOR DELETE
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "withdrawal_select_own" ON withdrawal_requests;
CREATE POLICY "withdrawal_select_own" ON withdrawal_requests FOR SELECT
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "withdrawal_insert_own" ON withdrawal_requests;
CREATE POLICY "withdrawal_insert_own" ON withdrawal_requests FOR INSERT
  TO authenticated WITH CHECK (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "withdrawal_update_admin" ON withdrawal_requests;
CREATE POLICY "withdrawal_update_admin" ON withdrawal_requests FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    OR partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

-- ============================================================
-- 6. FIX EXISTING RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
  TO authenticated USING (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
  TO authenticated WITH CHECK (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "bookings_update_own" ON bookings;
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE
  TO authenticated USING (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "bookings_delete_own" ON bookings;
CREATE POLICY "bookings_delete_own" ON bookings FOR DELETE
  TO authenticated USING (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "job_requests_own" ON partner_job_requests;
DROP POLICY IF EXISTS "job_requests_select" ON partner_job_requests;
DROP POLICY IF EXISTS "job_requests_insert" ON partner_job_requests;
DROP POLICY IF EXISTS "job_requests_update" ON partner_job_requests;
CREATE POLICY "job_requests_select" ON partner_job_requests FOR SELECT
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "job_requests_insert" ON partner_job_requests FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "job_requests_update" ON partner_job_requests FOR UPDATE
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "services_admin" ON services;
CREATE POLICY "services_admin" ON services FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "service_categories_public" ON service_categories;
DROP POLICY IF EXISTS "service_categories_admin" ON service_categories;
CREATE POLICY "service_categories_public" ON service_categories FOR SELECT
  TO public USING (true);
CREATE POLICY "service_categories_admin" ON service_categories FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p2 WHERE p2.user_id = auth.uid() AND p2.role = 'admin')
  );

DROP POLICY IF EXISTS "partners_own" ON partners;
DROP POLICY IF EXISTS "partners_public" ON partners;
DROP POLICY IF EXISTS "partners_select" ON partners;
DROP POLICY IF EXISTS "partners_insert" ON partners;
DROP POLICY IF EXISTS "partners_update" ON partners;
CREATE POLICY "partners_select" ON partners FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "partners_public" ON partners FOR SELECT
  TO public USING (is_verified = true AND is_available = true);
CREATE POLICY "partners_insert" ON partners FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "partners_update" ON partners FOR UPDATE
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "partner_earnings_own" ON partner_earnings;
DROP POLICY IF EXISTS "partner_earnings_select" ON partner_earnings;
CREATE POLICY "partner_earnings_select" ON partner_earnings FOR SELECT
  TO authenticated USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "reviews_public" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
DROP POLICY IF EXISTS "reviews_update" ON reviews;
CREATE POLICY "reviews_public" ON reviews FOR SELECT
  TO public USING (is_public = true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  TO authenticated WITH CHECK (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
CREATE POLICY "reviews_update" ON reviews FOR UPDATE
  TO authenticated USING (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "coupons_public" ON coupons;
DROP POLICY IF EXISTS "coupons_admin" ON coupons;
CREATE POLICY "coupons_public" ON coupons FOR SELECT
  TO public USING (is_active = true);
CREATE POLICY "coupons_admin" ON coupons FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "amc_plans_public" ON amc_plans;
DROP POLICY IF EXISTS "amc_plans_admin" ON amc_plans;
CREATE POLICY "amc_plans_public" ON amc_plans FOR SELECT
  TO public USING (is_active = true);
CREATE POLICY "amc_plans_admin" ON amc_plans FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "stored_notif_own" ON stored_notifications;
DROP POLICY IF EXISTS "stored_notif_select" ON stored_notifications;
DROP POLICY IF EXISTS "stored_notif_insert" ON stored_notifications;
DROP POLICY IF EXISTS "stored_notif_update" ON stored_notifications;
DROP POLICY IF EXISTS "stored_notif_delete" ON stored_notifications;
CREATE POLICY "stored_notif_select" ON stored_notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "stored_notif_insert" ON stored_notifications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "stored_notif_update" ON stored_notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "stored_notif_delete" ON stored_notifications FOR DELETE
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "wallet_transactions_own" ON wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_select" ON wallet_transactions;
CREATE POLICY "wallet_transactions_select" ON wallet_transactions FOR SELECT
  TO authenticated USING (
    wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "referrals_own" ON referrals;
DROP POLICY IF EXISTS "referrals_select" ON referrals;
CREATE POLICY "referrals_select" ON referrals FOR SELECT
  TO authenticated USING (
    referrer_id = auth.uid() OR referee_id = auth.uid()
  );

DROP POLICY IF EXISTS "tracking_booking" ON tracking_updates;
DROP POLICY IF EXISTS "tracking_select" ON tracking_updates;
DROP POLICY IF EXISTS "tracking_insert" ON tracking_updates;
CREATE POLICY "tracking_select" ON tracking_updates FOR SELECT
  TO authenticated USING (
    booking_id IN (
      SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
      OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "tracking_insert" ON tracking_updates FOR INSERT
  TO authenticated WITH CHECK (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 7. INDEXES FOR NEW TABLES AND FIXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_kyc_partner ON kyc_documents(partner_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verified ON kyc_documents(is_verified);
CREATE INDEX IF NOT EXISTS idx_bank_partner ON partner_bank_accounts(partner_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_partner ON withdrawal_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_bookings_technician ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_partners_user ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_technician ON reviews(technician_id);
