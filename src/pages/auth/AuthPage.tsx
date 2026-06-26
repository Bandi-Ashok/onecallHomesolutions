import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { firebaseAuth, googleProvider } from '../../lib/firebase'
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { Phone, Mail, ArrowRight, Loader as Loader2, MessageCircle, Shield } from 'lucide-react'

type AuthMode = 'phone' | 'email'
type AuthStep = 'initial' | 'otp' | 'details'

export function AuthPage() {
  const navigate = useNavigate()
  const { user, profile, setUser, setProfile } = useAuth()
  const [mode, setMode] = useState<AuthMode>('phone')
  const [step, setStep] = useState<AuthStep>('initial')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)

  // Redirect if already logged in
  if (user && profile) {
    navigate(profile.role === 'partner' ? '/partner' : profile.role === 'admin' ? '/admin' : '/')
    return null
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider)
      const firebaseUser = result.user

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('google_id', firebaseUser.uid)
        .maybeSingle()

      if (existingProfile) {
        setUser({ id: existingProfile.user_id } as any)
        setProfile(existingProfile)
        navigate(existingProfile.role === 'partner' ? '/partner' : existingProfile.role === 'admin' ? '/admin' : '/')
        return
      }

      setFullName(firebaseUser.displayName || '')
      setEmail(firebaseUser.email || '')
      setStep('details')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function initRecaptcha() {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
  }

  async function sendPhoneOTP() {
    if (phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setLoading(true)
    setError('')
    try {
      await initRecaptcha()
      const formattedPhone = `+91${phone}`
      const result = await signInWithPhoneNumber(firebaseAuth, formattedPhone, (window as any).recaptchaVerifier)
      setConfirmationResult(result)
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear()
        ;(window as any).recaptchaVerifier = null
      }
    } finally {
      setLoading(false)
    }
  }

  async function verifyOTP() {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')
    try {
      await confirmationResult.confirm(otp)
      setStep('details')
    } catch {
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailLogin() {
    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: userProfile } = await supabase.from('profiles').select('*').eq('user_id', authUser.id).maybeSingle()
        if (userProfile) {
          setUser({ id: userProfile.user_id } as any)
          setProfile(userProfile)
          navigate(userProfile.role === 'partner' ? '/partner' : userProfile.role === 'admin' ? '/admin' : '/')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function completeProfile() {
    if (!fullName) {
      setError('Please enter your full name')
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email || `${phone}@phone.placeholder`,
          password: password || Math.random().toString(36).slice(-10),
        })
        if (signUpError) throw signUpError

        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user!.id,
            full_name: fullName,
            phone,
            email,
          })
          .select()
          .maybeSingle()

        if (newProfile) {
          setUser({ id: newProfile.user_id } as any)
          setProfile(newProfile)
          navigate('/')
        }
      } else {
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .update({ full_name: fullName, phone, email, updated_at: new Date().toISOString() })
          .eq('user_id', authUser.id)
          .select()
          .maybeSingle()

        if (updatedProfile) {
          setUser({ id: updatedProfile.user_id } as any)
          setProfile(updatedProfile)
          navigate('/')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={32} />
          </div>
          <h1>ONE CALL</h1>
          <p>Home Solutions</p>
        </div>

        {step === 'initial' && (
          <div className="auth-form-container">
            <div className="auth-tabs">
              <button className={`tab ${mode === 'phone' ? 'active' : ''}`} onClick={() => setMode('phone')}>
                <Phone size={16} />
                Phone
              </button>
              <button className={`tab ${mode === 'email' ? 'active' : ''}`} onClick={() => setMode('email')}>
                <Mail size={16} />
                Email
              </button>
            </div>

            {mode === 'phone' ? (
              <div className="auth-form">
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="phone-input">
                    <span className="country-code">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>
                <button className="btn btn-primary btn-block" onClick={sendPhoneOTP} disabled={loading}>
                  {loading ? <Loader2 className="spinner" size={20} /> : 'Continue with OTP'}
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <button className="btn btn-primary btn-block" onClick={handleEmailLogin} disabled={loading}>
                  {loading ? <Loader2 className="spinner" size={20} /> : 'Sign In'}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            <div className="divider">
              <span>or</span>
            </div>

            <button className="btn btn-google btn-block" onClick={handleGoogleLogin} disabled={loading}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.85c.87-2.6 3.3-4.54 6.16-4.54z" />
              </svg>
              Continue with Google
            </button>

            <a href="https://wa.me/911234567890" className="btn btn-whatsapp btn-block">
              <MessageCircle size={20} />
              WhatsApp Support
            </a>
          </div>
        )}

        {step === 'otp' && (
          <div className="auth-form-container">
            <div className="step-header">
              <button className="back-btn" onClick={() => setStep('initial')}>
                Back
              </button>
              <h2>Verify OTP</h2>
            </div>
            <p className="otp-hint">We sent a 6-digit code to +91{phone}</p>
            <div className="otp-input-container">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    const newOtp = otp.split('')
                    newOtp[i] = value
                    setOtp(newOtp.join(''))
                    if (value && e.target.nextElementSibling) {
                      (e.target.nextElementSibling as HTMLInputElement).focus()
                    }
                  }}
                  className="otp-box"
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <button className="btn btn-primary btn-block" onClick={verifyOTP} disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : 'Verify OTP'}
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="auth-form-container">
            <div className="step-header">
              <button className="back-btn" onClick={() => setStep('initial')}>
                Back
              </button>
              <h2>Complete Profile</h2>
            </div>
            <div className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              {mode === 'email' && (
                <div className="form-group">
                  <label>Phone Number (Optional)</label>
                  <div className="phone-input">
                    <span className="country-code">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>
              )}
              <button className="btn btn-primary btn-block" onClick={completeProfile} disabled={loading}>
                {loading ? <Loader2 className="spinner" size={20} /> : 'Get Started'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
      <div id="recaptcha-container"></div>
    </div>
  )
}
