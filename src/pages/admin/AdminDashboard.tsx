import React, { useState, useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'
import { supabase } from '@/config/supabase'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { BarChart3, Users, Briefcase, TrendingUp, Zap } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  totalServices: number
  completionRate: number
}

const AdminDashboard: React.FC = () => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [usersRes, bookingsRes, servicesRes] = await Promise.all([
        supabase.from('profiles').select('id').eq('role', 'customer'),
        supabase.from('bookings').select('id, status, total_amount'),
        supabase.from('services').select('id'),
      ])

      const completedBookings = (bookingsRes.data || []).filter(
        (b) => b.status === 'completed'
      )
      const totalRevenue = completedBookings.reduce(
        (sum, b) => sum + (b.total_amount || 0),
        0
      )

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalRevenue,
        totalServices: servicesRes.data?.length || 0,
        completionRate: bookingsRes.data
          ? (completedBookings.length / bookingsRes.data.length) * 100
          : 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string
    value: string | number
    icon: any
    color: string
  }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' && title.includes('Rate')
              ? `${value.toFixed(1)}%`
              : typeof value === 'number' && title.includes('Revenue')
                ? `₹${(value / 100000).toFixed(1)}L`
                : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => toggleSidebar()} />

      <div className="flex-1">
        <Header title="Admin Dashboard" />

        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="card h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Total Bookings"
                value={stats.totalBookings}
                icon={Briefcase}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Revenue"
                value={stats.totalRevenue}
                icon={TrendingUp}
                color="bg-green-500"
              />
              <StatCard
                title="Services"
                value={stats.totalServices}
                icon={Zap}
                color="bg-orange-500"
              />
              <StatCard
                title="Completion Rate"
                value={stats.completionRate}
                icon={BarChart3}
                color="bg-indigo-500"
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 cursor-pointer hover:shadow-lg">
              <h3 className="font-bold text-lg mb-2">👥 Manage Users</h3>
              <p className="text-gray-600 text-sm mb-4">
                View and manage customers and service partners
              </p>
              <a href="/admin/users" className="text-primary-800 font-medium text-sm">
                Go to Users →
              </a>
            </div>

            <div className="card p-6 cursor-pointer hover:shadow-lg">
              <h3 className="font-bold text-lg mb-2">🔧 Manage Services</h3>
              <p className="text-gray-600 text-sm mb-4">
                Add, edit, or delete services and categories
              </p>
              <a href="/admin/services" className="text-primary-800 font-medium text-sm">
                Go to Services →
              </a>
            </div>

            <div className="card p-6 cursor-pointer hover:shadow-lg">
              <h3 className="font-bold text-lg mb-2">📋 Manage Bookings</h3>
              <p className="text-gray-600 text-sm mb-4">
                View all bookings and assign partners
              </p>
              <a href="/admin/bookings" className="text-primary-800 font-medium text-sm">
                Go to Bookings →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
