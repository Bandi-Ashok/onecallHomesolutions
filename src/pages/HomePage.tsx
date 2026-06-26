import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServiceStore } from '@/store/serviceStore'
import { SERVICE_CATEGORIES } from '@/config/constants'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ServiceCard from '@/components/ServiceCard'
import Button from '@/components/Button'
import { Search, AlertCircle, Zap, Smartphone } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  const {
    services,
    filteredServices,
    loading,
    selectedCategory,
    searchQuery,
    fetchServices,
    setSelectedCategory,
    setSearchQuery,
  } = useServiceStore()

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEmergency = () => {
    navigate('/emergency')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => toggleSidebar()} />

      {/* Main Content */}
      <div className="flex-1">
        <Header title="One Call Home Solutions" />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Your Safety Home. Our Priority.
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  Book trusted professionals for 300+ home services in 28 categories. Fast, reliable, and affordable.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => document.querySelector('[id="services"]')?.scrollIntoView()}
                  >
                    Browse Services
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleEmergency}
                  >
                    <AlertCircle className="w-5 h-5" />
                    Emergency SOS
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-300 rounded-3xl blur-2xl opacity-50"></div>
                  <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="text-primary-800">
                      <Zap className="w-24 h-24 mx-auto mb-4" />
                      <p className="text-center font-bold text-xl">Fast & Reliable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-30 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, e.g., 'plumbing', 'electrical'..."
                  className="input-field pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="input-field md:w-64"
              >
                <option value="">All Categories</option>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedCategory || 'All'} Services
                  <span className="text-gray-600 font-normal text-lg ml-2">
                    ({filteredServices.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onBook={() => navigate(`/services/${service.id}`)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No services found</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                  }}
                  className="text-primary-800 font-medium hover:underline"
                >
                  Clear filters and try again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-12 px-4 mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to AMC for Priority Service</h2>
            <p className="text-gray-200 mb-6">
              Get priority booking, exclusive discounts, and free inspections with our Annual Maintenance Contracts.
            </p>
            <Button variant="secondary" size="lg" onClick={() => navigate('/amc')}>
              View AMC Plans
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4">OCHS</h3>
                <p className="text-sm">Your trusted partner for all home services.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <p className="text-sm">📞 1800-OCHS-911</p>
                <p className="text-sm">📧 support@ochs.com</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm">
              <p>&copy; 2024 One Call Home Solutions. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
