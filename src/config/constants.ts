export const BRAND = {
  NAME: 'One Call Home Solutions',
  TAGLINE: 'Your Safety Home. Our Priority.',
  LOGO_URL: 'https://via.placeholder.com/200x50?text=OCHS',
  COLORS: {
    PRIMARY: '#1B3A5C',
    ACCENT: '#C9972C',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
  },
}

export const SERVICE_CATEGORIES = [
  'Cleaning Services',
  'Painting Services',
  'Interior Design Services',
  'Waterproofing Services',
  'Plumbing Services',
  'Electrical Services',
  'Home Appliance Services',
  'Smart Home & Security Services',
  'Pest Control Services',
  'Packers & Movers Services',
  'Construction & Civil Works',
  'Roofing & PVC Sheet Services',
  'Beauty & Personal Care Services',
  'Event Management Services',
  'Driver & Travel Services',
  'Garden & Outdoor Services',
  'Corporate & Commercial Services',
  'Rental Property Management',
  'Emergency Services',
  'Annual Maintenance Contracts',
  'Home Inspection Services',
  'Eco-Friendly & Green Services',
  'Product Sales & Installation',
  'Senior Citizen Home Care',
  'Furniture Assembly & Carpentry',
  'Laundry & Dry Cleaning Services',
  'Vehicle Care Services',
  'Healthcare & Wellness at Home',
]

export const BOOKING_STATUS = [
  { value: 'pending', label: 'Pending', color: 'badge-warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'badge-primary' },
  { value: 'in-progress', label: 'In Progress', color: 'badge-info' },
  { value: 'completed', label: 'Completed', color: 'badge-success' },
  { value: 'cancelled', label: 'Cancelled', color: 'badge-error' },
]

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'emi', label: 'EMI' },
  { value: 'cod', label: 'Cash on Delivery' },
]

export const AMC_PLANS = [
  { id: '1', name: 'Silver', price: 999, validity_days: 365, discount: 5 },
  { id: '2', name: 'Gold', price: 1999, validity_days: 365, discount: 10 },
  { id: '3', name: 'Platinum', price: 3999, validity_days: 365, discount: 15 },
  { id: '4', name: 'Corporate', price: 9999, validity_days: 365, discount: 20 },
]

export const EMERGENCY_SOS_TIMEOUT = 30 // minutes
export const EMERGENCY_RESPONSE_TIME = '30-60' // minutes

export const API_ENDPOINTS = {
  AUTH: '/auth',
  SERVICES: '/services',
  BOOKINGS: '/bookings',
  REVIEWS: '/reviews',
  PROFILES: '/profiles',
  AMC: '/amc',
  NOTIFICATIONS: '/notifications',
  PAYMENTS: '/payments',
}
