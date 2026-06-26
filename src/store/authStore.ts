import { create } from 'zustand'
import { supabase } from '@/config/supabase'
import { Profile, User } from '@/types'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signUpWithPhone: (phone: string, fullName: string) => Promise<void>
  verifyOTP: (phone: string, token: string) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signUpWithPhone: async (phone: string, fullName: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      })
      if (error) throw error
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  verifyOTP: async (phone: string, token: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      })
      if (error) throw error

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          // Create new profile
          const { error: createError } = await supabase.from('profiles').insert([
            {
              id: data.user.id,
              phone,
              full_name: '',
              role: 'customer',
            },
          ])
          if (createError) throw createError
        } else {
          set({ profile })
        }
      }
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, profile: null })
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  getCurrentUser: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        set({ user: null, profile: null })
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!profileError && profile) {
        set({ profile })
      }
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ loading: true, error: null })
    try {
      const profile = get().profile
      if (!profile) throw new Error('No profile found')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      set({ profile: data })
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },
}))
