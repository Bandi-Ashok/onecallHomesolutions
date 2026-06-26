import { supabase } from './supabase'

export const bookingApi = {
  create: async (booking: any) => {
    const bookingNumber = `OCH${Date.now().toString().slice(-8)}`
    return supabase.from('bookings').insert({ ...booking, booking_number: bookingNumber }).select().single()
  },
  getById: async (id: string) => supabase.from('bookings').select('*, service:services(*)').eq('id', id).maybeSingle(),
  getByCustomer: async (customerId: string) => supabase.from('bookings').select('*, service:services(*)').eq('customer_id', customerId).order('created_at', { ascending: false }),
  updateStatus: async (id: string, status: string) => supabase.from('bookings').update({ status }).eq('id', id),
  getAll: async () => supabase.from('bookings').select('*, service:services(*), customer:profiles(*)').order('created_at', { ascending: false }),
}

export const servicesApi = {
  getCategories: async () => supabase.from('service_categories').select('*').order('display_order'),
  getByCategory: async (categoryId: string) => supabase.from('services').select('*').eq('category_id', categoryId).eq('is_active', true),
  getById: async (id: string) => supabase.from('services').select('*, category:service_categories(*)').eq('id', id).maybeSingle(),
}

export const walletApi = {
  getBalance: async (userId: string) => supabase.from('wallets').select('*').eq('user_id', userId).maybeSingle(),
  getTransactions: async (walletId: string) => supabase.from('wallet_transactions').select('*').eq('wallet_id', walletId).order('created_at', { ascending: false }),
  createWallet: async (userId: string) => supabase.from('wallets').insert({ user_id: userId }).select().single(),
}

export const couponApi = {
  getAll: async () => supabase.from('coupons').select('*').eq('is_active', true),
  create: async (coupon: any) => supabase.from('coupons').insert(coupon).select().single(),
}

export const referralApi = {
  getCode: async (userId: string) => supabase.from('referral_codes').select('*').eq('user_id', userId).maybeSingle(),
}

export const chatApi = {
  getByBooking: async (bookingId: string) => supabase.from('chat_messages').select('*').eq('booking_id', bookingId).order('created_at'),
}

export const trackingApi = {
  getLatest: async (bookingId: string) => supabase.from('tracking_updates').select('*').eq('booking_id', bookingId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
}

export const partnerApi = {
  getProfile: async (userId: string) => supabase.from('partners').select('*').eq('user_id', userId).maybeSingle(),
  updateProfile: async (userId: string, updates: any) => supabase.from('partners').update(updates).eq('user_id', userId).select().single(),
  getJobRequests: async (partnerId: string) => supabase.from('partner_job_requests').select('*, booking:bookings(*, service:services(*))').eq('partner_id', partnerId).eq('status', 'pending'),
  getEarnings: async (partnerId: string) => supabase.from('partner_earnings').select('*').eq('partner_id', partnerId).order('created_at', { ascending: false }),
  getHistory: async (partnerId: string) => supabase.from('bookings').select('*, service:services(*)').eq('technician_id', partnerId).order('created_at', { ascending: false }),
  setAvailability: async (partnerId: string, isAvailable: boolean) => supabase.from('partners').update({ is_available: isAvailable }).eq('id', partnerId),
  getAll: async () => supabase.from('partners').select('*').order('created_at', { ascending: false }),
}

export const notificationApi = {
  getForUser: async (userId: string) => supabase.from('stored_notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
  markAsRead: async (id: string) => supabase.from('stored_notifications').update({ is_read: true }).eq('id', id),
  markAllAsRead: async (userId: string) => supabase.from('stored_notifications').update({ is_read: true }).eq('user_id', userId),
  getUnreadCount: async (userId: string) => supabase.from('stored_notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false),
}

export const reviewApi = {
  getByPartner: async (partnerId: string) => supabase.from('reviews').select('*').eq('technician_id', partnerId).order('created_at', { ascending: false }),
  create: async (review: any) => supabase.from('reviews').insert(review).select().single(),
}

export const userApi = {
  getProfile: async (userId: string) => supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
  updateProfile: async (userId: string, updates: any) => supabase.from('profiles').update(updates).eq('user_id', userId).select().single(),
  getAddresses: async (customerId: string) => supabase.from('service_addresses').select('*').eq('customer_id', customerId).order('is_default', { ascending: false }),
  addAddress: async (address: any) => supabase.from('service_addresses').insert(address).select().single(),
  deleteAddress: async (id: string) => supabase.from('service_addresses').delete().eq('id', id),
  getAll: async () => supabase.from('profiles').select('*'),
}

export const dashboardApi = {
  getAdminStats: async () => {
    const [bookings, users, partners] = await Promise.all([
      supabase.from('bookings').select('final_price, status'),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('partners').select('id', { count: 'exact' }),
    ])
    return ({
      totalRevenue: bookings.data?.filter((b: any) => b.status === 'completed').reduce((sum: number, b: any) => sum + (b.final_price || 0), 0) || 0,
      totalBookings: bookings.data?.length || 0,
      completedBookings: bookings.data?.filter((b: any) => b.status === 'completed').length || 0,
      totalUsers: users.count || 0,
      totalPartners: partners.count || 0,
    })
  },
  getPartnerStats: async (partnerId: string) => {
    const [earnings, jobs] = await Promise.all([
      supabase.from('partner_earnings').select('amount, type').eq('partner_id', partnerId),
      supabase.from('bookings').select('id, status').eq('technician_id', partnerId),
    ])
    return ({
      totalEarnings: earnings.data?.filter((e: any) => e.type === 'job_payment').reduce((sum: number, e: any) => sum + e.amount, 0) || 0,
      totalJobs: jobs.data?.length || 0,
      completedJobs: jobs.data?.filter((j: any) => j.status === 'completed').length || 0,
      avgRating: 4.5,
    })
  },
  getCustomerStats: async (customerId: string) => {
    const { data: bookings } = await supabase.from('bookings').select('*').eq('customer_id', customerId)
    return ({
      totalBookings: bookings?.length || 0,
      completedBookings: bookings?.filter((b: any) => b.status === 'completed').length || 0,
      totalSpent: bookings?.filter((b: any) => b.status === 'completed').reduce((sum: number, b: any) => sum + (b.final_price || 0), 0) || 0,
    })
  },
}

export const amcApi = {
  getPlans: async () => supabase.from('amc_plans').select('*').eq('is_active', true).order('monthly_price'),
  getActiveSubscription: async (customerId: string) => supabase.from('customer_amc').select('*, plan:amc_plans(*)').eq('customer_id', customerId).eq('status', 'active').maybeSingle(),
}
