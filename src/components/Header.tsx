import React from 'react'
import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, onBack }) => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          {title && <h1 className="text-2xl font-bold text-primary-800">{title}</h1>}
        </div>
      </div>
    </header>
  )
}

export default Header
