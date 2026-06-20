import { useState, useEffect } from 'react'

// Toast notification system
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

let toastListeners: Array<(toast: Toast) => void> = []
let toastId = 0

export function showToast(message: string, type: Toast['type'] = 'info', duration = 4000) {
  const toast: Toast = {
    id: `toast-${++toastId}`,
    message,
    type,
    duration,
  }
  toastListeners.forEach(listener => listener(toast))

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast.id)
    }, duration)
  }

  return toast.id
}

export function dismissToast(id: string) {
  const dismissEvent = { id, type: 'dismiss' as const }
  toastListeners.forEach(listener => listener(dismissEvent as any))
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast | { id: string; type: 'dismiss' }) => {
      if ('type' in toast && toast.type === 'dismiss') {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      } else {
        setToasts(prev => [...prev, toast as Toast])
      }
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  return toasts
}

// Form validation utilities
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  message?: string
}

export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rule.message || 'This field is required'
    }
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`
    }
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`
    }
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format'
    }
    if (rule.custom) {
      const error = rule.custom(value)
      if (error) return error
    }
  }
  return null
}

export const validationRules = {
  phone: [
    { required: true, message: 'Phone number is required' },
    { pattern: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
  ],
  email: [
    { required: true, message: 'Email is required' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 6, message: 'Password must be at least 6 characters' },
  ],
  name: [
    { required: true, message: 'Name is required' },
    { minLength: 2, message: 'Name must be at least 2 characters' },
    { maxLength: 50, message: 'Name cannot exceed 50 characters' },
  ],
  address: [
    { required: true, message: 'Address is required' },
    { minLength: 10, message: 'Please enter a complete address' },
  ],
  pincode: [
    { required: true, message: 'Pincode is required' },
    { pattern: /^\d{6}$/, message: 'Enter a valid 6-digit pincode' },
  ],
 OTP: [
    { required: true, message: 'OTP is required' },
    { pattern: /^\d{6}$/, message: 'Enter a valid 6-digit OTP' },
  ],
}

// Offline detection hook
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

// Format utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Booking number generator
export function generateBookingNumber(): string {
  return `OCH${Date.now().toString().slice(-8)}`
}

// API error handler
export function handleApiError(error: any, fallbackMessage = 'Something went wrong'): string {
  if (error?.message) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection.'
    }
    if (error.message.includes('unauthorized') || error.message.includes('401')) {
      return 'Session expired. Please sign in again.'
    }
    if (error.message.includes('forbidden') || error.message.includes('403')) {
      return 'You do not have permission to perform this action.'
    }
    return error.message
  }
  return fallbackMessage
}

// Storage utilities for offline data
export const offlineStorage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Failed to save to localStorage')
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      console.error('Failed to remove from localStorage')
    }
  },
}

// Time slots for booking
export const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
]

// Get Available dates (next 30 days)
export function getAvailableDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}
