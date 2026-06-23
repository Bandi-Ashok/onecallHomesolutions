/*
# Admin Access Policies - CRITICAL SECURITY FIX

Adds admin role-based access policies to ALL tables.

## Changes:
1. Adds is_admin() helper function
2. Adds admin policies for all tables
*/

-- Create is_admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fix service_categories - read-only for non-admins
DROP POLICY IF EXISTS "service_categories_public" ON service_categories;
CREATE POLICY "service_categories_public" ON service_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "service_categories_admin" ON service_categories;
CREATE POLICY "service_categories_admin" ON service_categories FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for bookings
DROP POLICY IF EXISTS "bookings_admin" ON bookings;
CREATE POLICY "bookings_admin" ON bookings FOR SELECT
  TO authenticated USING (is_admin() OR customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "bookings_update_admin" ON bookings;
CREATE POLICY "bookings_update_admin" ON bookings FOR UPDATE
  TO authenticated USING (is_admin() OR customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
  WITH CHECK (is_admin() OR customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "bookings_delete_admin" ON bookings;
CREATE POLICY "bookings_delete_admin" ON bookings FOR DELETE
  TO authenticated USING (is_admin());

-- Admin policies for profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT
  TO authenticated USING (is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE
  TO authenticated USING (is_admin() OR auth.uid() = user_id)
  WITH CHECK (is_admin() OR auth.uid() = user_id);

-- Admin policies for partners
DROP POLICY IF EXISTS "partners_select_admin" ON partners;
CREATE POLICY "partners_select_admin" ON partners FOR SELECT
  TO authenticated USING (is_admin() OR auth.uid() = user_id OR (is_verified = true AND is_available = true));

DROP POLICY IF EXISTS "partners_update_admin" ON partners;
CREATE POLICY "partners_update_admin" ON partners FOR UPDATE
  TO authenticated USING (is_admin() OR auth.uid() = user_id)
  WITH CHECK (is_admin() OR auth.uid() = user_id);

-- Admin policies for coupons
DROP POLICY IF EXISTS "coupons_admin_insert" ON coupons;
CREATE POLICY "coupons_admin_insert" ON coupons FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "coupons_admin_update" ON coupons;
CREATE POLICY "coupons_admin_update" ON coupons FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "coupons_admin_delete" ON coupons;
CREATE POLICY "coupons_admin_delete" ON coupons FOR DELETE
  TO authenticated USING (is_admin());

-- Admin policies for amc_plans
DROP POLICY IF EXISTS "amc_plans_admin" ON amc_plans;
CREATE POLICY "amc_plans_admin" ON amc_plans FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for services
DROP POLICY IF EXISTS "services_admin" ON services;
CREATE POLICY "services_admin" ON services FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for stored_notifications (broadcast)
DROP POLICY IF EXISTS "stored_notif_admin" ON stored_notifications;
CREATE POLICY "stored_notif_admin" ON stored_notifications FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- Admin policies for customer_amc
DROP POLICY IF EXISTS "customer_amc_admin" ON customer_amc;
CREATE POLICY "customer_amc_admin" ON customer_amc FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for reviews
DROP POLICY IF EXISTS "reviews_admin" ON reviews;
CREATE POLICY "reviews_admin" ON reviews FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for partner_earnings
DROP POLICY IF EXISTS "partner_earnings_admin" ON partner_earnings;
CREATE POLICY "partner_earnings_admin" ON partner_earnings FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for partner_job_requests
DROP POLICY IF EXISTS "partner_job_requests_admin" ON partner_job_requests;
CREATE POLICY "partner_job_requests_admin" ON partner_job_requests FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for tracking_updates
DROP POLICY IF EXISTS "tracking_admin" ON tracking_updates;
CREATE POLICY "tracking_admin" ON tracking_updates FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin policies for referral_codes
DROP POLICY IF EXISTS "referral_codes_admin" ON referral_codes;
CREATE POLICY "referral_codes_admin" ON referral_codes FOR SELECT
  TO authenticated USING (is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "referral_codes_own" ON referral_codes;
CREATE POLICY "referral_codes_own" ON referral_codes FOR ALL
  TO authenticated USING (user_id = auth.uid() OR is_admin()) WITH CHECK (user_id = auth.uid() OR is_admin());

-- Admin policies for referrals
DROP POLICY IF EXISTS "referrals_admin" ON referrals;
CREATE POLICY "referrals_admin" ON referrals FOR ALL
  TO authenticated USING (is_admin() OR referrer_id = auth.uid() OR referee_id = auth.uid());

DROP POLICY IF EXISTS "referrals_own" ON referrals;
CREATE POLICY "referrals_own" ON referrals FOR SELECT
  TO authenticated USING (referrer_id = auth.uid() OR referee_id = auth.uid() OR is_admin());

-- Admin policies for wallets
DROP POLICY IF EXISTS "wallets_admin" ON wallets;
DROP POLICY IF EXISTS "wallets_own" ON wallets;
CREATE POLICY "wallets_own" ON wallets FOR ALL
  TO authenticated USING (user_id = auth.uid() OR is_admin()) WITH CHECK (user_id = auth.uid() OR is_admin());

-- Admin policies for wallet_transactions
DROP POLICY IF EXISTS "wallet_transactions_admin" ON wallet_transactions;
CREATE POLICY "wallet_transactions_admin" ON wallet_transactions FOR ALL
  TO authenticated USING (is_admin() OR wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- Admin policies for chat_messages
DROP POLICY IF EXISTS "chat_admin" ON chat_messages;
CREATE POLICY "chat_admin" ON chat_messages FOR ALL
  TO authenticated USING (is_admin() OR booking_id IN (
    SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR technician_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  ));

-- Admin policies for user_coupons
DROP POLICY IF EXISTS "user_coupons_admin" ON user_coupons;
CREATE POLICY "user_coupons_admin" ON user_coupons FOR ALL
  TO authenticated USING (is_admin() OR user_id = auth.uid());