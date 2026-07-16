import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Award, 
  Bot, 
  LogOut, 
  CheckCircle2, 
  UserCheck, 
  Zap, 
  ClipboardList, 
  Calendar, 
  Menu,
  Clock,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { Booking, UserState } from './types';
import LoginScreen from './components/LoginScreen';
import ServiceExplorer from './components/ServiceExplorer';
import EmergencySOS from './components/EmergencySOS';
import AICostEstimator from './components/AICostEstimator';
import AMCOverview from './components/AMCOverview';
import LiveChatBot from './components/LiveChatBot';

export default function App() {
  const [user, setUser] = useState<UserState | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'sos' | 'estimator' | 'amc' | 'bookings'>('services');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize with some simulated historical bookings for Ashok
  useEffect(() => {
    if (user && user.isAuthenticated) {
      setBookings([
        {
          id: 'BC-583921',
          serviceId: 'cleaning',
          serviceName: 'Cleaning Services',
          subServiceName: 'Bathroom Grout & Tile Cleaning',
          customerName: user.fullName,
          email: user.email,
          phone: '+91 8019318625',
          date: '2026-07-16',
          timeSlot: '10:00 AM - 12:00 PM',
          address: 'Flat 304, Green Heights, Gachibowli, Hyderabad, TS',
          status: 'completed',
          technician: 'Rajesh Kumar'
        },
        {
          id: 'BC-204918',
          serviceId: 'electrical',
          serviceName: 'Electrical Services',
          subServiceName: 'Smart Switch & DB Box Setup',
          customerName: user.fullName,
          email: user.email,
          phone: '+91 8019318625',
          date: '2026-07-20',
          timeSlot: '02:00 PM - 04:00 PM',
          address: 'Flat 304, Green Heights, Gachibowli, Hyderabad, TS',
          status: 'dispatched',
          technician: 'Vikram Singh'
        }
      ]);
    }
  }, [user]);

  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setActiveTab('bookings'); // auto switch to booking log to show live dispatch progress
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If user is not logged in, render the secure authentication page (Google + Email + 2FA + Face Biometrics)
  if (!user || !user.isAuthenticated) {
    return <LoginScreen onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 24/7 Top Quick Alert Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-300">Guardian Standard Shield Active</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>📞 Direct dispatch line: 1800-CALL-HOME</span>
            <span className="hidden md:inline">⚡ Local Zone SLA: 30 Min Response</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Branding Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('services')}>
              <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-base font-extrabold font-display text-slate-900 leading-none tracking-tight">One Call</h1>
                <p className="text-[9px] font-mono font-bold text-amber-500 mt-0.5 tracking-widest uppercase">Home Solutions</p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'services', label: '28 Core Divisions' },
                { id: 'sos', label: '🚨 Emergency SOS (24/7)' },
                { id: 'estimator', label: '🧮 AI Price Estimator' },
                { id: 'amc', label: '🏆 Annual Protection AMC' },
                { id: 'bookings', label: '📋 My Active Dispatches' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Authenticated User Quick Controls */}
            <div className="hidden md:flex items-center gap-3 border-l border-slate-150 pl-4">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900">{user.fullName}</span>
                <span className="block text-[9px] font-mono font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded mt-0.5">
                  ● BIOMETRIC APPROVED
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 p-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                title="Log Out Security Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="bg-slate-100 p-2 rounded-xl text-slate-600 border border-slate-200"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2">
            {[
              { id: 'services', label: '28 Core Divisions' },
              { id: 'sos', label: '🚨 Emergency SOS (24/7)' },
              { id: 'estimator', label: '🧮 AI Price Estimator' },
              { id: 'amc', label: '🏆 Annual Protection AMC' },
              { id: 'bookings', label: '📋 My Active Dispatches' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-50 text-slate-700 border border-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner introduction with dynamic alert updates */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-900/10 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <span className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                Your Safety Home Our Priority
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight tracking-tight">
                Complete Household Management & Repair Solutions
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                India's premier security audited multi-service platform. Get on-demand, scheduled or 24/7 emergency dispatch of background-verified, technical specialists for any plumbing, electrical, cleaning, civil, or personal wellness need.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('sos')}
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95 cursor-pointer border border-red-500/30 shrink-0 uppercase tracking-wider text-xs animate-pulse"
            >
              🚨 Active Emergency SOS
            </button>
          </div>
        </div>

        {/* Tab rendering */}
        <div id="active-tab-container" className="transition-all duration-300">
          {activeTab === 'services' && (
            <ServiceExplorer 
              onAddBooking={handleAddBooking} 
              onNavigateToSOS={() => setActiveTab('sos')} 
            />
          )}

          {activeTab === 'sos' && (
            <EmergencySOS />
          )}

          {activeTab === 'estimator' && (
            <AICostEstimator />
          )}

          {activeTab === 'amc' && (
            <AMCOverview />
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900">Your Active Dispatch Logs</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time status tracking of secure household service tickets</p>
                </div>
                <button
                  onClick={() => setActiveTab('services')}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Request New Service
                </button>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {booking.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 font-display">{booking.serviceName}</h4>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs font-semibold text-slate-500">{booking.subServiceName}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-slate-600 pt-1.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.date} ({booking.timeSlot})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs" title={booking.address}>{booking.address}</span>
                        </div>
                        {booking.technician && (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Tech: <strong className="text-slate-800">{booking.technician}</strong> (Aadhaar Verified)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Status controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      {booking.status === 'dispatched' && (
                        <>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                            🚨 Dispatch Active
                          </span>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Cancel Ticket
                          </button>
                        </>
                      )}

                      {booking.status === 'completed' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Completed
                        </span>
                      )}

                      {booking.status === 'cancelled' && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {bookings.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-inner">
                    <p className="text-slate-500 text-sm">No active dispatches found for your account.</p>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="text-xs font-semibold text-blue-900 hover:underline mt-2"
                    >
                      Browse services and place a booking now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Floating Secure AI Chatbot powered by Groq LLaMA-3 */}
      <LiveChatBot />

      {/* Corporate Operations & Worker Compliance Footnotes */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Key Metrics / Footnotes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-800 text-center md:text-left">
            <div>
              <strong className="block text-xl text-white font-mono font-extrabold">300+</strong>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Professional Services</span>
            </div>
            <div>
              <strong className="block text-xl text-white font-mono font-extrabold">24 / 7</strong>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Emergency dispatch</span>
            </div>
            <div>
              <strong className="block text-xl text-white font-mono font-extrabold">30 MIN</strong>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">SLA Local Zone Response</span>
            </div>
            <div>
              <strong className="block text-xl text-white font-mono font-extrabold">100%</strong>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Verified Aadhaar Back-Checks</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5">
              <h5 className="font-extrabold font-display text-white text-sm">ONE CALL HOME SOLUTIONS</h5>
              <p className="text-[11px] leading-relaxed max-w-xl">
                One Call Home Solutions is built on the belief that every household deserves reliable, professional, and affordable home management services at the touch of a button. We bridge the gap between skilled professionals and homeowners — delivering trust, quality, and convenience under a single unified brand.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 font-mono space-y-1 leading-none">
              <p>© 2026 One Call Home Solutions. All Rights Reserved.</p>
              <p>Platform Standards: Guardian Compliance v2.9.2</p>
              <p className="text-amber-500">Your Safety Home Our Priority.</p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
