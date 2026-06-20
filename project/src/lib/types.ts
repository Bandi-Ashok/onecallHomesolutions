export type Profile = {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  pincode: string | null
  is_verified: boolean
  membership_tier: 'free' | 'silver' | 'gold' | 'platinum'
  loyalty_points: number
  profile_image: string | null
  referral_code_id: string | null
  google_id: string | null
  whatsapp_opt_in: boolean
  role: 'customer' | 'partner' | 'admin'
  created_at: string
  updated_at: string
}

export type Partner = {
  id: string
  user_id: string
  full_name: string
  phone: string
  email: string | null
  profile_image: string | null
  categories: string[]
  rating: number
  total_jobs: number
  total_earnings: number
  wallet_balance: number
  is_verified: boolean
  is_available: boolean
  is_online: boolean
  current_lat: number | null
  current_lng: number | null
  aadhaar_number: string | null
  pan_number: string | null
  bank_account: string | null
  ifsc_code: string | null
  documents: Record<string, string> | null
  city: string | null
  pincode: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export type Booking = {
  id: string
  booking_number: string
  customer_id: string
  service_id: string | null
  technician_id: string | null
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  scheduled_date: string | null
  scheduled_time_slot: string | null
  address: string
  city: string | null
  pincode: string | null
  notes: string | null
  final_price: number | null
  is_emergency: boolean
  otp: string | null
  coupon_id: string | null
  discount_amount: number
  wallet_used: number
  tracking_enabled: boolean
  chat_enabled: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
  service?: Service
  customer?: Profile
  technician?: Partner
}

export type ServiceCategory = {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  display_order: number
  is_emergency_available: boolean
  created_at: string
}

export type Service = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  unit: string
  duration_minutes: number | null
  is_active: boolean
  created_at: string
  category?: ServiceCategory
}

export type Coupon = {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_discount: number | null
  min_order_value: number
  usage_limit: number | null
  usage_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  applicable_categories: string[] | null
  created_at: string
}

export type UserCoupon = {
  id: string
  user_id: string
  coupon_id: string
  is_used: boolean
  used_on_booking: string | null
  claimed_at: string
  coupon: Coupon
}

export type Wallet = {
  id: string
  user_id: string
  balance: number
  created_at: string
  updated_at: string
}

export type WalletTransaction = {
  id: string
  wallet_id: string
  amount: number
  type: 'credit' | 'debit' | 'refund' | 'cashback' | 'referral'
  description: string | null
  reference_id: string | null
  created_at: string
}

export type ReferralCode = {
  id: string
  user_id: string
  code: string
  total_referrals: number
  total_earnings: number
  created_at: string
}

export type Referral = {
  id: string
  referrer_id: string
  referee_id: string
  referral_code_id: string
  reward_amount: number
  is_rewarded: boolean
  created_at: string
}

export type ChatMessage = {
  id: string
  booking_id: string
  sender_id: string
  sender_type: 'customer' | 'partner' | 'admin'
  message: string
  attachment_url: string | null
  is_read: boolean
  created_at: string
}

export type TrackingUpdate = {
  id: string
  booking_id: string
  partner_id: string | null
  lat: number
  lng: number
  status: 'en_route' | 'arrived' | 'working' | 'completed'
  eta_minutes: number | null
  created_at: string
}

export type StoredNotification = {
  id: string
  user_id: string
  title: string
  body: string | null
  data: Record<string, any> | null
  type: 'booking' | 'chat' | 'promotion' | 'system'
  is_read: boolean
  created_at: string
}

export type Review = {
  id: string
  booking_id: string
  customer_id: string
  technician_id: string | null
  rating: number
  comment: string | null
  is_public: boolean
  reply: string | null
  replied_at: string | null
  created_at: string
  customer?: Profile
}

export type PartnerJobRequest = {
  id: string
  partner_id: string
  booking_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expires_at: string | null
  created_at: string
  booking?: Booking
}

export type PartnerEarning = {
  id: string
  partner_id: string
  booking_id: string | null
  amount: number
  type: 'job_payment' | 'bonus' | 'penalty' | 'withdrawal'
  status: 'pending' | 'processed' | 'withdrawn'
  description: string | null
  created_at: string
}

export type ServiceAddress = {
  id: string
  customer_id: string
  label: string | null
  address: string
  city: string | null
  pincode: string | null
  landmark: string | null
  is_default: boolean
  created_at: string
}

export type AMCPlan = {
  id: string
  name: string
  tier: string
  monthly_price: number
  annual_price: number
  discount_percent: number
  features: string[]
  visit_count_per_year: number
  is_active: boolean
  created_at: string
}

export type CustomerAMC = {
  id: string
  customer_id: string
  plan_id: string
  start_date: string
  end_date: string
  status: string
  total_visits_included: number
  visits_used: number
  created_at: string
  plan?: AMCPlan
}
