import React from 'react'
import { Star, MapPin, Clock, AlertCircle } from 'lucide-react'
import { Service } from '@/types'
import { formatCurrency } from '@/utils/helpers'

interface ServiceCardProps {
  service: Service
  onBook?: () => void
  isCompact?: boolean
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
  isCompact = false,
}) => {
  return (
    <div className="card overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <AlertCircle className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
          <p className="text-xs text-gray-500 mb-2">{service.category}</p>
        </div>

        {!isCompact && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{service.estimated_time}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
            <span>4.5</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-lg font-bold text-primary-800">
            {formatCurrency(service.price)}
          </div>
          {onBook && (
            <button
              onClick={onBook}
              className="btn-primary text-sm py-1 px-3"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
