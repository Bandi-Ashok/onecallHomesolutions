import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home,
  Briefcase,
  User,
  LogOut,
  Settings,
  BarChart3,
  Users,
  Wrench,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems =
    profile?.role === 'admin'
      ? [
          { icon: Home, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Wrench, label: 'Services', path: '/admin/services' },
          { icon: Briefcase, label: 'Bookings', path: '/admin/bookings' },
          { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
          { icon: Settings, label: 'AMC Plans', path: '/admin/amc' },
        ]
      : profile?.role === 'partner'
        ? [
            { icon: Home, label: 'Dashboard', path: '/partner' },
            { icon: Calendar, label: 'Jobs', path: '/partner/jobs' },
            { icon: AlertCircle, label: 'Emergency', path: '/partner/emergency' },
            { icon: User, label: 'Profile', path: '/partner/profile' },
          ]
        : [
            { icon: Home, label: 'Home', path: '/' },
            { icon: Briefcase, label: 'My Bookings', path: '/bookings' },
            { icon: AlertCircle, label: 'Emergency SOS', path: '/emergency' },
            { icon: User, label: 'Profile', path: '/profile' },
          ]

  const sidebarClasses = `
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg
    lg:translate-x-0 lg:static lg:shadow-none
    transition-transform duration-300 z-50 flex flex-col
  `

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary-800">OCHS</h2>
          <p className="text-xs text-gray-600">One Call Home Solutions</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path)
                    onClose?.()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          {profile && (
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-gray-900">
                {profile.full_name}
              </p>
              <p className="text-xs text-gray-600">{profile.phone}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
