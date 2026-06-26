import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

const getStripe = async (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)
  }
  return stripePromise
}

export interface RazorpayOrderOptions {
  amount: number
  currency: string
  receipt: string
  description?: string
  notes?: Record<string, any>
}

export const createRazorpayOrder = async (
  options: RazorpayOrderOptions
): Promise<string> => {
  try {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    const data = await response.json()
    return data.orderId
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export const openRazorpayCheckout = (
  orderId: string,
  amount: number,
  customerEmail: string,
  customerPhone: string,
  onSuccess: (paymentId: string) => void,
  onError: (error: any) => void
) => {
  if (!(window as any).Razorpay) {
    onError(new Error('Razorpay is not loaded'))
    return
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    order_id: orderId,
    amount,
    currency: 'INR',
    name: 'One Call Home Solutions',
    description: 'Service Booking',
    customer_id: customerEmail,
    prefill: {
      email: customerEmail,
      contact: customerPhone,
    },
    theme: {
      color: '#1B3A5C',
    },
    handler: (response: any) => {
      onSuccess(response.razorpay_payment_id)
    },
    modal: {
      ondismiss: () => {
        onError(new Error('Payment cancelled'))
      },
    },
  }

  const razorpay = new (window as any).Razorpay(options)
  razorpay.open()
}

export { getStripe }
