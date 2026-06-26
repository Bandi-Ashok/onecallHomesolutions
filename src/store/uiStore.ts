import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  isModalOpen: boolean
  modalContent: string | null
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null
  toggleSidebar: () => void
  openModal: (content: string) => void
  closeModal: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  toast: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  showToast: (message, type = 'info') =>
    set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}))
