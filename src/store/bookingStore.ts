import { create } from 'zustand'
import { supabase } from '@/config/supabase'
import { Booking } from '@/types'

interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  loading: boolean
  error: string | null
  setBookings: (bookings: Booking[]) => void
  setCurrentBooking: (booking: Booking | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchBookings: (userId: string) => Promise<void>
  fetchBookingById: (id: string) => Promise<void>
  createBooking: (booking: Partial<Booking>) => Promise<Booking>
  updateBookingStatus: (id: string, status: string) => Promise<void>
  cancelBooking: (id: string) => Promise<void>
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchBookings: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          service:services(*),
          customer:profiles!customer_id(*),
          partner:profiles!partner_id(*)
        `
        )
        .eq('customer_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ bookings: data || [] })
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchBookingById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          service:services(*),
          customer:profiles!customer_id(*),
          partner:profiles!partner_id(*)
        `
        )
        .eq('id', id)
        .single()

      if (error) throw error
      set({ currentBooking: data })
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  createBooking: async (booking: Partial<Booking>) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  updateBookingStatus: async (id: string, status: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  cancelBooking: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },
}))
