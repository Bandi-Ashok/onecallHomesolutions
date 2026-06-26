import { getToken, onMessage, type MessagePayload } from 'firebase/messaging'
import { getFirebaseMessaging } from './firebase'
import { supabase } from './supabase'

let messagingInstance: any = null

export async function initMessaging(): Promise<string | null> {
  try {
    messagingInstance = await getFirebaseMessaging()
    if (!messagingInstance) {
      console.log('Messaging not supported in this browser')
      return null
    }

    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
    })

    if (token) {
      // Save token to database
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('notification_tokens').upsert({
          user_id: user.id,
          token,
          platform: 'web',
          created_at: new Date().toISOString(),
        }, { onConflict: 'token' })
      }
      return token
    }
    return null
  } catch (error) {
    console.error('Error initializing messaging:', error)
    return null
  }
}

export function onMessageListener(callback: (payload: MessagePayload) => void): () => void {
  if (!messagingInstance) {
    return () => {}
  }

  return onMessage(messagingInstance, callback)
}

export async function subscribeToTopic(topic: string): Promise<boolean> {
  // Note: Topic subscriptions require server-side implementation
  // This would typically be done via Firebase Cloud Functions
  console.log(`Subscribing to topic: ${topic}`)
  return true
}

export async function unsubscribeFromTopic(topic: string): Promise<boolean> {
  console.log(`Unsubscribing from topic: ${topic}`)
  return true
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
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

// Notification types for the app
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

// Handle incoming notifications
export function handleNotification(payload: MessagePayload): void {
  const { notification, data } = payload

  if (notification) {
    showLocalNotification({
      title: notification.title || 'One Call',
      body: notification.body || '',
      data: data as Record<string, any>,
    })
  }

  // Handle data-only messages
  if (data) {
    const type = data.type as NotificationType
    switch (type) {
      case NotificationTypes.BOOKING_CONFIRMED:
        // Handle booking confirmation
        break
      case NotificationTypes.PARTNER_ARRIVING:
        // Show tracking update
        break
      case NotificationTypes.NEW_MESSAGE:
        // Refresh chat
        break
      default:
        break
    }
  }
}

// Initialize notification listener
export function setupNotificationHandlers(): () => void {
  const unsubscribe = onMessageListener((payload) => {
    console.log('Received foreground message:', payload)
    handleNotification(payload)
  })

  return unsubscribe
}
