import { create } from 'zustand'
import { supabase } from '@/config/supabase'
import { Service } from '@/types'

interface ServiceState {
  services: Service[]
  filteredServices: Service[]
  loading: boolean
  error: string | null
  selectedCategory: string | null
  searchQuery: string
  setServices: (services: Service[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  fetchServices: () => Promise<void>
  filterServices: () => void
  searchServices: (query: string) => void
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  filteredServices: [],
  loading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',

  setServices: (services) => set({ services }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
    get().filterServices()
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().filterServices()
  },

  fetchServices: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ services: data || [], filteredServices: data || [] })
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  filterServices: () => {
    const { services, selectedCategory, searchQuery } = get()
    let filtered = [...services]

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    }

    set({ filteredServices: filtered })
  },

  searchServices: (query: string) => {
    set({ searchQuery: query })
    get().filterServices()
  },
}))
