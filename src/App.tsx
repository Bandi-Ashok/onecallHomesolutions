import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import ToastContainer from '@/components/Toast'
import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage'
import EmergencyPage from '@/pages/EmergencyPage'
import BookingsPage from '@/pages/BookingsPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminServices from '@/pages/admin/AdminServices'
import AdminBookings from '@/pages/admin/AdminBookings'

const App: React.FC = () => {
  const { profile, getCurrentUser } = useAuthStore()

  useEffect(() => {
    getCurrentUser()
  }, [])

  // Public routes
  if (!profile) {
    return <AuthPage />
  }

  // Admin routes
  if (profile.role === 'admin') {
    return (
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
        <ToastContainer />
      </Router>
    )
  }

  // Partner routes
  if (profile.role === 'partner') {
    return (
      <Router>
        <Routes>
          <Route path="/partner" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/partner" replace />} />
        </Routes>
        <ToastContainer />
      </Router>
    )
  }

  // Customer routes (default)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
