export interface User {
  id: string
  fullName: string
  phone: string
  email?: string
  role: 'customer' | 'partner' | 'admin'
  createdAt: string
  profileImage?: string
}

export interface Profile {
  id: string
  full_name: string
  phone: string
  email?: string
  role: 'customer' | 'partner' | 'admin'
  created_at: string
  profile_image?: string
  is_verified?: boolean
}

export interface Service {
  id: string
  name: string
  category: string
  description: string
  price: number
  image_url?: string
  is_active: boolean
  estimated_time: number // in minutes
  created_at?: string
}

export interface Booking {
  id: string
  customer_id: string
  partner_id?: string
  service_id: string
  address: string
  scheduled_time: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'refunded'
  total_amount: number
  payment_method: 'upi' | 'card' | 'netbanking' | 'emi' | 'cod'
  created_at: string
  notes?: string
  service?: Service
  customer?: Profile
  partner?: Profile
}

export interface Review {
  id: string
  booking_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface AMCPlan {
  id: string
  name: 'Silver' | 'Gold' | 'Platinum' | 'Corporate'
  description: string
  price: number
  benefits: string[]
  validity_days: number
  created_at?: string
}

export interface AMCSubscription {
  id: string
  user_id: string
  plan_id: string
  start_date: string
  end_date: string
  status: 'active' | 'expired'
  plan?: AMCPlan
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  created_at: string
  type?: 'booking' | 'payment' | 'promotion' | 'emergency'
}

export interface EmergencyRequest {
  id: string
  user_id: string
  booking_id?: string
  address: string
  description: string
  status: 'pending' | 'assigned' | 'resolved'
  created_at: string
  user?: Profile
}

export interface PaymentResponse {
  orderId: string
  amount: number
  currency: string
}
