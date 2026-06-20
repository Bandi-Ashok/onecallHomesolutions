// Google Analytics integration
// Note: For production, replace GA_MEASUREMENT_ID with actual measurement ID

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

// Initialize Google Analytics
export function initAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!measurementId) {
    console.log('Google Analytics not configured')
    return
  }

  // Load gtag.js
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function(...args: any[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll manually track page views
  })
}

// Track page view
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  })
}

// Track custom event
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (!window.gtag) return

  window.gtag('event', eventName, eventParams)
}

// E-commerce tracking
export const EcommerceEvents = {
  // Track when user views a service
  viewItem: (service: { id: string; name: string; price: number; category: string }) => {
    trackEvent('view_item', {
      currency: 'INR',
      value: service.price,
      items: [{
        item_id: service.id,
        item_name: service.name,
        price: service.price,
        item_category: service.category,
      }],
    })
  },

  // Track when user adds to cart/booking
  addToCart: (service: { id: string; name: string; price: number; category: string }) => {
    trackEvent('add_to_cart', {
      currency: 'INR',
      value: service.price,
      items: [{
        item_id: service.id,
        item_name: service.name,
        price: service.price,
        item_category: service.category,
      }],
    })
  },

  // Track when user begins checkout
  beginCheckout: (items: Array<{ id: string; name: string; price: number }>, total: number) => {
    trackEvent('begin_checkout', {
      currency: 'INR',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
      })),
    })
  },

  // Track completed purchase
  purchase: (booking: {
    id: string
    revenue: number
    service: { id: string; name: string; price: number; category: string }
    coupon?: string
  }) => {
    trackEvent('purchase', {
      transaction_id: booking.id,
      currency: 'INR',
      value: booking.revenue,
      coupon: booking.coupon,
      items: [{
        item_id: booking.service.id,
        item_name: booking.service.name,
        price: booking.service.price,
        item_category: booking.service.category,
        quantity: 1,
      }],
    })
  },
}

// User engagement events
export const EngagementEvents = {
  signUp: (method: 'phone' | 'email' | 'google') => {
    trackEvent('sign_up', { method })
  },

  login: (method: 'phone' | 'email' | 'google') => {
    trackEvent('login', { method })
  },

  search: (searchTerm: string) => {
    trackEvent('search', { search_term: searchTerm })
  },

  selectContent: (contentType: string, itemId: string) => {
    trackEvent('select_content', {
      content_type: contentType,
      item_id: itemId,
    })
  },

  share: (contentType: string, itemId: string) => {
    trackEvent('share', {
      content_type: contentType,
      item_id: itemId,
    })
  },

  notificationOpen: (notificationId: string) => {
    trackEvent('notification_open', { notification_id: notificationId })
  },

  bookingStatusChange: (bookingId: string, oldStatus: string, newStatus: string) => {
    trackEvent('booking_status_change', {
      booking_id: bookingId,
      old_status: oldStatus,
      new_status: newStatus,
    })
  },
}

// Set user properties
export function setUserProperties(properties: Record<string, any>): void {
  if (!window.gtag) return

  window.gtag('set', 'user_properties', properties)
}

// Set user ID for cross-platform tracking
export function setUserId(userId: string): void {
  if (!window.gtag) return

  window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
    user_id: userId,
  })
}

// Clear user ID on logout
export function clearUserId(): void {
  if (!window.gtag) return

  window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
    user_id: undefined,
  })
}
