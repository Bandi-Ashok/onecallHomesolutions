import React from 'react'
import { Booking } from '@/types'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { Clock, MapPin, Zap } from 'lucide-react'

interface BookingCardProps {
  booking: Booking
  onClick?: () => void
  isClickable?: boolean
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onClick,
  isClickable = true,
}) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`card p-4 ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">
            {booking.service?.name || 'Service'}
          </h3>
          <p className="text-sm text-gray-600">
            {booking.service?.category}
          </p>
        </div>
        <span
          className={`badge text-xs font-medium px-3 py-1 rounded-full ${
            statusColors[booking.status as keyof typeof statusColors] ||
            'bg-gray-100 text-gray-800'
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatDate(booking.scheduled_time)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{booking.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Zap className="w-4 h-4" />
          <span>₹{booking.total_amount}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-primary-800">
          {booking.payment_status}
        </span>
        {isClickable && (
          <span className="text-accent-500 text-sm font-medium">View Details →</span>
        )}
      </div>
    </div>
  )
}

export default BookingCard
