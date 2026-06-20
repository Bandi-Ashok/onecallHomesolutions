import { useEffect, useState, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
  logout: () => void
  setUser: (user: any | null) => void
  setProfile: (profile: Profile | null) => void
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, logout: () => {}, setUser: () => {}, setProfile: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return <AuthContext.Provider value={{ user, profile, loading, logout, setUser, setProfile }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
