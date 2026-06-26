import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { AlertTriangle, Phone, MapPin, FileText, Send } from 'lucide-react'

const EmergencyPage: React.FC = () => {
  const navigate = useNavigate()
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const { profile } = useAuthStore()

  const [formData, setFormData] = useState({
    address: '',
    description: '',
    serviceType: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => navigate('/bookings'), 2000)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onClose={() => toggleSidebar()} />
        <div className="flex-1">
          <Header title="Emergency SOS" />
          <div className="flex items-center justify-center h-96 px-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Request Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Our team is dispatching a technician to your location. Response time: 30-60 minutes.
              </p>
              <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => toggleSidebar()} />

      <div className="flex-1">
        <Header title="Emergency SOS" />

        <div className="max-w-2xl mx-auto py-12 px-4">
          {/* Alert */}
          <Alert
            type="error"
            title="Emergency Service Request"
            message="This is for urgent situations only. Response time: 30-60 minutes. For non-emergencies, please use regular booking."
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Your Location/Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your complete address"
                rows={2}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Service Type
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select service</option>
                <option value="plumbing">Emergency Plumbing</option>
                <option value="electrical">Emergency Electrical</option>
                <option value="ac">Emergency AC Service</option>
                <option value="roof">Emergency Roof Repair</option>
                <option value="other">Other Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Problem Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the emergency situation in detail"
                rows={4}
                className="input-field"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <Phone className="w-4 h-4 inline mr-2" />
                <strong>Emergency Hotline:</strong> 1800-OCHS-911 (24/7)
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              <Send className="w-5 h-5" />
              Request Emergency Service
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmergencyPage
