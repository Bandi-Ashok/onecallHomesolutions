import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { validatePhone } from '@/utils/helpers'
import Button from '@/components/Button'
import Alert from '@/components/Alert'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')

  const { loading, error, signUpWithPhone, verifyOTP, profile } = useAuthStore()

  useEffect(() => {
    if (profile) {
      if (profile.role === 'admin') {
        navigate('/admin')
      } else if (profile.role === 'partner') {
        navigate('/partner')
      } else {
        navigate('/')
      }
    }
  }, [profile, navigate])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePhone(phone)) {
      return
    }
    try {
      await signUpWithPhone(phone, fullName)
      setStep('otp')
    } catch (err) {
      console.error(err)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await verifyOTP(phone, otp)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">OCHS</h1>
          <p className="text-accent-400 font-semibold">Your Safety Home. Our Priority.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <Alert type="error" title="Error" message={error} dismissible />
          )}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-100 rounded-lg text-gray-700 font-medium">
                    +91
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="input-field flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you an OTP to verify
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={!fullName || !phone || phone.length !== 10 || !validatePhone(phone)}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
              <p className="text-gray-600 text-sm mb-6">
                Enter the 6-digit OTP sent to +91 {phone}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="input-field text-center text-2xl tracking-widest font-bold"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={otp.length !== 6}
              >
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-primary-800 text-sm font-medium hover:underline"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default AuthPage
