/*
# Add partner_applications table

Missing table referenced in App.tsx for partner registration flow.
*/

CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  service_categories TEXT[],
  experience_years INT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partner_apps_select" ON partner_applications;
CREATE POLICY "partner_apps_select" ON partner_applications FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "partner_apps_insert" ON partner_applications;
CREATE POLICY "partner_apps_insert" ON partner_applications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "partner_apps_update" ON partner_applications;
CREATE POLICY "partner_apps_update" ON partner_applications FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_partner_apps_user ON partner_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_apps_status ON partner_applications(status);
