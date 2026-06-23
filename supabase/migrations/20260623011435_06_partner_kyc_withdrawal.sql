-- Partner Bank Accounts
CREATE TABLE IF NOT EXISTS partner_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  account_holder_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  confirm_account_number VARCHAR(50) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  account_type VARCHAR(20) DEFAULT 'savings',
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partner_id, account_number)
);

-- Withdrawal Requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  bank_account_id UUID REFERENCES partner_bank_accounts(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reject_reason TEXT,
  processed_at TIMESTAMPTZ,
  transaction_reference VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC Documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  document_url TEXT NOT NULL,
  document_number VARCHAR(50),
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  reject_reason TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Applications (for registration workflow)
CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  experience_years INTEGER DEFAULT 0,
  service_categories TEXT[] DEFAULT '{}',
  service_areas TEXT[] DEFAULT '{}',
  about_me TEXT,
  status VARCHAR(20) DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  reject_reason TEXT,
  partner_id UUID REFERENCES partners(id)
);

-- Create indexes
CREATE INDEX idx_bank_accounts_partner ON partner_bank_accounts(partner_id);
CREATE INDEX idx_withdrawals_partner ON withdrawal_requests(partner_id);
CREATE INDEX idx_withdrawals_status ON withdrawal_requests(status);
CREATE INDEX idx_kyc_partner ON kyc_documents(partner_id);
CREATE INDEX idx_kyc_type ON kyc_documents(document_type);
CREATE INDEX idx_applications_user ON partner_applications(user_id);
CREATE INDEX idx_applications_status ON partner_applications(status);

-- RLS Policies
ALTER TABLE partner_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

-- Partner bank accounts policies
CREATE POLICY "partners_own_bank_accounts" ON partner_bank_accounts FOR SELECT
  TO authenticated USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "partners_insert_bank_accounts" ON partner_bank_accounts FOR INSERT
  TO authenticated WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "partners_update_bank_accounts" ON partner_bank_accounts FOR UPDATE
  TO authenticated USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "admin_bank_accounts" ON partner_bank_accounts FOR ALL
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Withdrawal requests policies
CREATE POLICY "partners_own_withdrawals" ON withdrawal_requests FOR SELECT
  TO authenticated USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "partners_insert_withdrawals" ON withdrawal_requests FOR INSERT
  TO authenticated WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "admin_withdrawals" ON withdrawal_requests FOR ALL
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- KYC documents policies
CREATE POLICY "partners_own_kyc" ON kyc_documents FOR SELECT
  TO authenticated USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "partners_insert_kyc" ON kyc_documents FOR INSERT
  TO authenticated WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "admin_kyc" ON kyc_documents FOR ALL
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Partner applications policies
CREATE POLICY "users_own_applications" ON partner_applications FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users_insert_applications" ON partner_applications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_update_applications" ON partner_applications FOR UPDATE
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admin_applications" ON partner_applications FOR ALL
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create Supabase Storage bucket for KYC documents
-- Note: This requires the storage API, which we'll handle via edge function or manual setup