import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/bookingStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import BookingCard from '@/components/BookingCard'
import Button from '@/components/Button'
import { Booking } from '@/types'
import { Filter, Plus } from 'lucide-react'

const BookingsPage: React.FC = () => {
  const navigate = useNavigate()
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const { profile } = useAuthStore()
  const { bookings, loading, fetchBookings } = useBookingStore()
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (profile) {
      fetchBookings(profile.id)
    }
  }, [profile])

  const filteredBookings =
    filter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === filter)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => toggleSidebar()} />

      <div className="flex-1">
        <Header title="My Bookings" />

        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Header with Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Bookings History</h1>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              <Plus className="w-5 h-5" />
              New Booking
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? 'bg-primary-800 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Bookings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
                />
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 text-lg mb-4">No bookings found</p>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
              >
                Browse Services
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingsPage
