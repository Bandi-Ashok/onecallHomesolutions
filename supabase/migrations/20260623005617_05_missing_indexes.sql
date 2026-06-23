-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_technician ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_cart_customer ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_wallet_txn ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_service_addr_customer ON service_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_earnings_partner ON partner_earnings(partner_id);
CREATE INDEX IF NOT EXISTS idx_tracking_partner ON tracking_updates(partner_id);
CREATE INDEX IF NOT EXISTS idx_chat_booking ON chat_messages(booking_id);

-- Optional: unique email/phone if business requires
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_unique ON profiles(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone_unique ON profiles(phone) WHERE phone IS NOT NULL;