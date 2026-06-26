import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

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
  created_at: string
  updated_at: string
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
  completed_at: string | null
  created_at: string
  updated_at: string
  service?: Service
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

export type Review = {
  id: string
  booking_id: string
  customer_id: string
  technician_id: string | null
  rating: number
  comment: string | null
  is_public: boolean
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
