import { supabase } from './supabase'

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
}

export async function initMessaging(): Promise<string | null> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported in this browser')
      return null
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BEl62iM0f7Slv0P4_3g1r8gL0a9mQ7nK2pQ5rT8uW1yZ4xC7vB0nM3qR6tY9wQ2eR5tU8iO1pA4sD7fG0hJ3kL6m'
      ),
    })

    const token = JSON.stringify(subscription)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('notification_tokens').upsert({
        user_id: user.id,
        token,
        platform: 'web',
      }, { onConflict: 'token' })
    }
    return token
  } catch (error) {
    console.error('Error initializing messaging:', error)
    return null
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from(rawData.split('').map(c => c.charCodeAt(0)))
}

export function showLocalNotification(payload: NotificationPayload): void {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/badge-72x72.png',
        tag: payload.tag || 'onecall-notification',
        data: payload.data,
      })
    })
  }
}

export const NotificationTypes = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_ASSIGNED: 'booking_assigned',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  PARTNER_ARRIVING: 'partner_arriving',
  NEW_MESSAGE: 'new_message',
  PROMOTION: 'promotion',
  WALLET_CREDIT: 'wallet_credit',
  REFERRAL_REWARD: 'referral_reward',
} as const

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes]

export function handleNotification(payload: any): void {
  const { notification, data } = payload
  if (notification) {
    showLocalNotification({
      title: notification.title || 'One Call',
      body: notification.body || '',
      data: data as Record<string, any>,
    })
  }
}
