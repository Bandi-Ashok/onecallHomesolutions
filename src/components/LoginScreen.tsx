import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Fingerprint, LogIn, Key, Loader2, ArrowRight } from 'lucide-react';
import { UserState } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserState) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [step, setStep] = useState<'method' | 'credentials' | '2fa' | 'face'>('method');
  const [method, setMethod] = useState<'email' | 'google' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceProgress, setFaceProgress] = useState(0);

  // Focus helper for OTP inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSelectMethod = (selected: 'email' | 'google') => {
    setMethod(selected);
    if (selected === 'google') {
      // Simulate rapid Google auth popup
      setLoading(true);
      setTimeout(() => {
        setFullName('Ashok Kumar Bandi');
        setEmail('bandi.ashok@gmail.com');
        setLoading(false);
        setStep('2fa');
      }, 1200);
    } else {
      setStep('credentials');
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('2fa');
    }, 1000);
  };

  const handle2FAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => !digit)) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('face');
    }, 1000);
  };

  // Simulated Face Biometrics Scan
  useEffect(() => {
    if (step === 'face') {
      setFaceScanning(true);
      const interval = setInterval(() => {
        setFaceProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onLoginSuccess({
                isAuthenticated: true,
                email: email || 'bandi.ashok@gmail.com',
                fullName: fullName || 'Ashok Kumar Bandi',
                loginMethod: method,
                twoFactorVerified: true,
                faceBiometricVerified: true
              });
            }, 800);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div id="login-screen-container" className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-900/10 blur-3xl"></div>

      <div id="login-card" className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl z-10">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mb-3">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">One Call Home Solutions</h2>
          <p className="text-xs text-slate-400 mt-1">Guardian Standard Secure Authentication</p>
        </div>

        {/* STEP 1: SELECT LOGIN METHOD */}
        {step === 'method' && !loading && (
          <div className="space-y-4">
            <p className="text-center text-sm text-slate-300 mb-6">Choose your preferred secure login method to access the dashboard.</p>
            
            <button
              id="google-login-btn"
              onClick={() => handleSelectMethod('google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-slate-200 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              id="email-login-btn"
              onClick={() => handleSelectMethod('email')}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-750 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-slate-700 hover:border-slate-650 cursor-pointer"
            >
              <Mail className="w-5 h-5 text-slate-400" />
              <span>Sign in with Email</span>
            </button>
          </div>
        )}

        {/* STEP 2: EMAIL CREDENTIALS FORM */}
        {step === 'credentials' && (
          <form id="credentials-form" onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              id="submit-credentials-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Proceed to 2FA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('method')}
              className="w-full text-center text-xs text-slate-400 hover:text-white mt-4 transition-colors"
            >
              Back to Methods
            </button>
          </form>
        )}

        {/* STEP 3: TWO-FACTOR AUTHENTICATION */}
        {step === '2fa' && (
          <form id="2fa-form" onSubmit={handle2FAVerify} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white font-display">Two-Step Verification</h3>
              <p className="text-xs text-slate-400 mt-1">We sent a simulated security token to your registered app</p>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={1}
                  required
                  value={digit}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  className="w-12 h-14 bg-slate-950/50 border border-slate-800 text-white font-display font-bold text-xl text-center rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              ))}
            </div>

            <button
              id="verify-2fa-btn"
              type="submit"
              disabled={loading || otp.some(digit => !digit)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              ) : (
                <span>Verify Token & Next</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtp(['6', '9', '2', '8', '1', '4'])}
                className="text-xs text-amber-500 hover:text-amber-400 font-medium underline"
              >
                Auto-fill Simulated OTP (692814)
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: FACE RECOGNITION BIOMETRIC SCAN */}
        {step === 'face' && (
          <div className="space-y-6 text-center">
            <h3 className="text-lg font-bold text-white font-display">Biometric Face Authentication</h3>
            <p className="text-xs text-slate-400">Position your face within the scanner ring to complete multi-factor verification.</p>

            {/* Simulated Live Camera Container */}
            <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-dashed border-blue-500 flex items-center justify-center bg-slate-950 overflow-hidden shadow-inner">
              {/* Laser scanner line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 opacity-80 shadow-lg animate-bounce z-20" style={{ animationDuration: '3s' }}></div>

              {/* Scanning mask overlays */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80 z-10"></div>

              {/* Mock biometric node mesh map */}
              <svg className="absolute inset-4 text-emerald-500/30 w-full h-full z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="40" r="15" />
                <path d="M50,15 L50,85 M15,50 L85,50" strokeDasharray="2,2" />
                <path d="M35,40 L45,45 L50,40 L55,45 L65,40" strokeWidth="1" strokeLinecap="round" />
                <line x1="40" y1="35" x2="40" y2="36" strokeWidth="3" strokeLinecap="round" />
                <line x1="60" y1="35" x2="60" y2="36" strokeWidth="3" strokeLinecap="round" />
                <path d="M38,62 Q50,72 62,62" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <Fingerprint className="w-16 h-16 text-blue-500 animate-pulse relative z-10" />
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-100" style={{ width: `${faceProgress}%` }}></div>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {faceProgress < 100 ? `BIOMETRIC ANALYSIS: ${faceProgress}%` : 'IDENTITY FULLY VERIFIED - SECURE LOGIN APPROVED!'}
            </div>
          </div>
        )}

        {/* LOADING SCREEN */}
        {loading && step === 'method' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="text-sm text-slate-300">Synchronizing credentials with Google OAuth...</p>
          </div>
        )}

      </div>
    </div>
  );
}
