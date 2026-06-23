import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link, useLocation, Outlet, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import { servicesApi, bookingApi, notificationApi, partnerApi, dashboardApi, couponApi, userApi, walletApi, referralApi } from './lib/api'
import { generateBookingNumber, getAvailableDates, timeSlots, formatDate, formatRelativeTime, showToast, validateField, validationRules } from './lib/utils'
import { AuthPage } from './pages/auth/AuthPage'
import { Hop as Home, Wrench, Calendar, Bell, User, Phone, Shield, Clock, Star, ChevronRight, TriangleAlert as AlertTriangle, ArrowRight, Gift, Users, Wallet, Search, X, Check, MapPin, DollarSign, TrendingUp, LogOut, ChartBar as BarChart3, Send, Plus, CircleCheck as CheckCircle, Circle as XCircle, Tag, Mail, CircleAlert as AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import './styles/mobile.css'

const iconMap: Record<string, string> = {
  cleaning: '🧹', painting: '🎨', 'interior-design': '🏠', waterproofing: '💧',
  plumbing: '🔧', electrical: '⚡', appliances: '📺', 'smart-home': '🛡️',
  'pest-control': '🐜', 'packers-movers': '🚚', construction: '🏗️', roofing: '☁️',
  beauty: '💇', events: '🎁', driver: '🚗', garden: '🌻',
  corporate: '💼', 'property-management': '🏡', emergency: '🚨', amc: '📅',
  inspection: '🔍', 'eco-friendly': '🌿', products: '🛍️', 'senior-care': '❤️',
  carpentry: '🔨', laundry: '👔', vehicle: '🚙', healthcare: '💊',
}

// Toast Component
function ToastContainer() {
  const [toasts, setToasts] = useState<{id: string; message: string; type: string}[]>([])

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      setToasts(prev => [...prev, { id: Date.now().toString(), message: e.detail.message, type: e.detail.type || 'info' }])
      setTimeout(() => setToasts(prev => prev.slice(1)), 4000)
    }
    window.addEventListener('toast' as any, handleToast)
    return () => window.removeEventListener('toast' as any, handleToast)
  }, [])

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
      ))}
    </div>
  )
}

function BottomNav() {
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) loadUnread()
  }, [user])

  async function loadUnread() {
    try {
      const { count } = await notificationApi.getUnreadCount(user.id)
      setUnread(count || 0)
    } catch {}
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/services', icon: Wrench, label: 'Services' },
    { to: '/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/notifications', icon: Bell, label: 'Notifs', badge: unread },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <Link key={item.to} to={item.to} className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}>
          <div className="nav-icon-wrapper">
            <item.icon size={22} />
            {item.badge && item.badge > 0 && <span className="badge">{item.badge > 9 ? '9+' : item.badge}</span>}
          </div>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

function MobileLayout() {
  return (
    <div className="mobile-app">
      <main className="mobile-content"><Outlet /></main>
      <BottomNav />
      <ToastContainer />
    </div>
  )
}

function HomePage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data, error: catError } = await servicesApi.getCategories()
      if (catError) throw new Error('Failed to load categories')
      setCategories(data || [])

      if (user && profile) {
        const { data: wallet } = await walletApi.getBalance(profile.user_id)
        setWalletBalance(wallet?.balance || 0)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const quickServices = [
    { icon: '🧹', label: 'Cleaning', slug: 'cleaning' },
    { icon: '🔧', label: 'Plumbing', slug: 'plumbing' },
    { icon: '⚡', label: 'Electrical', slug: 'electrical' },
    { icon: '❄️', label: 'AC Service', slug: 'appliances' },
    { icon: '🐜', label: 'Pest', slug: 'pest-control' },
    { icon: '💇', label: 'Beauty', slug: 'beauty' },
    { icon: '🚚', label: 'Moving', slug: 'packers-movers' },
    { icon: '🎨', label: 'Paint', slug: 'painting' },
  ]

  if (error) {
    return (
      <div className="mobile-page">
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={load}>
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-page">
      <header className="mobile-header">
        <div className="header-top">
          <div className="greeting">
            <h1>Hello, {profile?.full_name?.split(' ')[0] || 'Guest'}!</h1>
            <p>What service do you need today?</p>
          </div>
          <Link to="/notifications" className="notification-btn"><Bell size={20} /></Link>
        </div>
        {user && (
          <Link to="/wallet" className="wallet-card">
            <div className="wallet-info"><Wallet size={20} /><div><span className="label">Wallet</span><span className="amount">₹{walletBalance.toLocaleString()}</span></div></div>
          </Link>
        )}
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search services..." />
        </div>
      </header>

      <section className="quick-services">
        <div className="section-title"><h2>Quick Services</h2><Link to="/services">View All <ChevronRight size={14} /></Link></div>
        {loading ? <div className="loading-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" />)}</div> : (
          <div className="quick-grid">
            {quickServices.map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="quick-item">
                <div className="quick-icon">{s.icon}</div>
                <span>{s.label}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Link to="/emergency" className="emergency-banner">
        <div className="emergency-icon"><AlertTriangle size={24} /></div>
        <div className="emergency-info"><h3>24/7 Emergency Service</h3><p>Get help in 30-60 minutes</p></div>
        <ArrowRight size={20} />
      </Link>

      <section className="offers-section">
        <div className="section-title"><h2>Special Offers</h2></div>
        <div className="offers-scroll">
          <div className="offer-card"><div className="offer-badge">NEW USER</div><h3>Get 20% OFF</h3><p>On your first booking</p><span className="code">Use: FIRST20</span></div>
          <div className="offer-card gold"><Gift size={20} /><h3>Referral Bonus</h3><p>Earn ₹100 per friend</p><Link to="/referral">Invite Friends</Link></div>
        </div>
      </section>

      <section className="all-categories">
        <div className="section-title"><h2>All Services</h2><Link to="/services">See All <ChevronRight size={14} /></Link></div>
        {loading ? <div className="loading-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" />)}</div> : (
          <div className="categories-grid">
            {categories.slice(0, 8).map(cat => (
              <Link key={cat.id} to={`/services/${cat.slug}`} className="category-item">
                <div className="category-icon">{iconMap[cat.slug] || '🔧'}</div>
                <span className="category-name">{cat.name}</span>
                {cat.is_emergency_available && <span className="emergency-tag">24/7</span>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="why-us">
        <h2>Why OneCall?</h2>
        <div className="features-grid">
          <div className="feature-item"><Shield size={24} /><h4>Verified Partners</h4><p>Background checked</p></div>
          <div className="feature-item"><Clock size={24} /><h4>On-Time</h4><p>Guaranteed punctuality</p></div>
          <div className="feature-item"><Star size={24} /><h4>Quality</h4><p>7-day warranty</p></div>
          <div className="feature-item"><Phone size={24} /><h4>24/7 Support</h4><p>Always here</p></div>
        </div>
      </section>

      <div className="bottom-spacer"></div>
    </div>
  )
}

function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data, error: loadError } = await servicesApi.getCategories()
      if (loadError) throw loadError
      setCategories(data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  if (error) {
    return (
      <div className="mobile-page">
        <header className="page-header"><h1>Services</h1></header>
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Failed to load services</h3>
          <button className="btn btn-primary" onClick={load}><RefreshCw size={18} /> Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-page">
      <header className="page-header"><h1>Services</h1><p>300+ home services</p></header>
      <div className="search-container sticky">
        <div className="search-box">
          <Search size={20} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
          {search && <button onClick={() => setSearch('')}><X size={18} /></button>}
        </div>
      </div>
      <div className="categories-list">
        {loading ? <div className="loading-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" />)}</div> : (
          filtered.length === 0 ? (
            <div className="empty-state"><Search size={48} /><h3>No services found</h3><p>Try a different search term</p></div>
          ) : (
            filtered.map(cat => (
              <Link key={cat.id} to={`/services/${cat.slug}`} className="category-card">
                <div className="category-icon">{iconMap[cat.slug] || '🔧'}</div>
                <div className="category-info"><h3>{cat.name}</h3><p>{cat.description?.substring(0, 60)}...</p></div>
                {cat.is_emergency_available && <span className="badge emergency">24/7</span>}
                <ChevronRight size={20} />
              </Link>
            ))
          )
        )}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function ServiceDetailPage() {
  const { category } = useLocation().pathname.match(/\/services\/(?<category>[^/]+)/)?.groups || {}
  const [cat, setCat] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [category])

  async function load() {
    if (!category) { setLoading(false); return }
    try {
      const { data: cats } = await servicesApi.getCategories()
      const found = cats?.find(c => c.slug === category)
      if (found) {
        setCat(found)
        const { data: servs } = await servicesApi.getByCategory(found.id)
        setServices(servs || [])
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (loading) return <div className="mobile-page loading"><div className="spinner" /></div>
  if (error) return <div className="mobile-page"><div className="error-state"><AlertCircle size={48} /><h3>Error loading services</h3><button className="btn btn-primary" onClick={load}>Retry</button></div></div>
  if (!cat) return <div className="mobile-page"><div className="empty-state"><Wrench size={48} /><h3>Category not found</h3><Link to="/services" className="btn btn-primary">Browse Services</Link></div></div>

  return (
    <div className="mobile-page">
      <header className="page-header with-back">
        <Link to="/services" className="back-btn"><ArrowLeft size={20} /></Link>
        <div className="header-content"><span className="category-icon-lg">{iconMap[category] || '🔧'}</span><h1>{cat.name}</h1></div>
      </header>
      {cat.is_emergency_available && <div className="emergency-bar"><Shield size={16} />24/7 Emergency Available</div>}
      <div className="services-list">
        {services.length === 0 ? (
          <div className="empty-state"><Wrench size={48} /><h3>No services available</h3></div>
        ) : (
          services.map(s => (
            <div key={s.id} className="service-card">
              <div className="service-info"><h3>{s.name}</h3><p>{s.description}</p></div>
              <div className="service-action">
                <div className="price">₹{s.base_price.toLocaleString()}<span className="unit">/{s.unit?.replace('per ', '')}</span></div>
                <Link to={`/booking?service=${s.id}`} className="btn btn-primary">Book</Link>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function BookingsPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => { if (user && profile) load() }, [user, profile])

  async function load() {
    try {
      const { data, error: loadError } = await bookingApi.getByCustomer(profile!.id)
      if (loadError) throw loadError
      setBookings(data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function cancelBooking(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(bookingId)
    try {
      const { error: cancelError } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
      if (cancelError) throw cancelError
      showToast('Booking cancelled', 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel', 'error')
    }
    setCancellingId(null)
  }

  if (!user) return <div className="mobile-page auth-required"><Calendar size={48} /><h2>Sign in to view bookings</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="mobile-page">
      <header className="page-header"><h1>My Bookings</h1></header>
      <div className="filter-panel">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load bookings</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><Calendar size={48} /><h3>No bookings{filter !== 'all' ? ` with status "${filter}"` : ' yet'}</h3><Link to="/services" className="btn btn-primary">Browse Services</Link></div>
      ) : (
        <div className="bookings-list">
          {filtered.map(b => (
            <div key={b.id} className="booking-card" onClick={() => navigate(`/booking/${b.id}`)}>
              <div className="booking-header"><span className="booking-id">#{b.booking_number}</span><span className={`status ${b.status}`}>{b.status.replace('_', ' ')}</span></div>
              <h3 className="service-name">{b.service?.name || 'Service'}</h3>
              <div className="booking-details">
                <div className="detail"><Calendar size={14} /><span>{b.scheduled_date ? formatDate(b.scheduled_date) : 'TBD'}</span></div>
                <div className="detail"><Clock size={14} /><span>{b.scheduled_time_slot || 'TBD'}</span></div>
              </div>
              <div className="booking-footer">
                <span className="amount">₹{(b.final_price || 0).toLocaleString()}</span>
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); cancelBooking(b.id) }} disabled={cancellingId === b.id}>
                    {cancellingId === b.id ? <span className="spinner-sm" /> : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (user) load() }, [user])

  async function load() {
    try {
      const { data, error: loadError } = await notificationApi.getForUser(user!.id)
      if (loadError) throw loadError
      setNotifications(data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function markAllRead() {
    try {
      await notificationApi.markAllAsRead(user!.id)
      load()
    } catch {}
  }

  if (!user) return <Navigate to="/auth" />

  return (
    <div className="mobile-page">
      <header className="page-header"><h1>Notifications</h1>{notifications.some(n => !n.is_read) && <button className="btn btn-sm btn-outline" onClick={markAllRead}>Mark all read</button>}</header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : notifications.length === 0 ? (
        <div className="empty-state"><Bell size={48} /><h3>No notifications</h3></div>
      ) : (
        <div className="notifications-list">
          {notifications.map(n => (
            <div key={n.id} className={`notification-item ${!n.is_read ? 'unread' : ''}`}>
              <div className="noti-icon">{n.type === 'booking' ? <Calendar size={20} /> : n.type === 'promotion' ? <Gift size={20} /> : <Bell size={20} />}</div>
              <div className="noti-content"><h4>{n.title}</h4><p>{n.body}</p><span className="noti-time">{formatRelativeTime(n.created_at)}</span></div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function BookingDetailPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('id')
  const navigate = useNavigate()
  const [booking, setBooking] = useState<any>(null)
  const [tracking, setTracking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => { if (bookingId && user) load() }, [bookingId, user])

  async function load() {
    try {
      const { data, error: loadError } = await supabase.from('bookings').select('*, service:services(*), customer:profiles(*)').eq('id', bookingId).single()
      if (loadError) throw loadError
      setBooking(data)

      const { data: trackData } = await supabase.from('tracking_updates').select('*').eq('booking_id', bookingId).order('created_at', { ascending: true })
      setTracking(trackData || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function cancelBooking() {
    if (!confirm('Are you sure you want to cancel?')) return
    setCancelling(true)
    try {
      const { error: cancelError } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
      if (cancelError) throw cancelError
      showToast('Booking cancelled', 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel', 'error')
    }
    setCancelling(false)
  }

  if (!user) return <Navigate to="/auth" />
  if (loading) return <div className="mobile-page loading"><div className="spinner" /></div>
  if (error || !booking) return <div className="mobile-page"><div className="error-state"><AlertCircle size={48} /><h3>Booking not found</h3><button className="btn btn-primary" onClick={() => navigate('/bookings')}>Back to Bookings</button></div></div>

  const statusSteps = ['pending', 'confirmed', 'in_progress', 'completed']
  const currentStep = statusSteps.indexOf(booking.status)

  return (
    <div className="mobile-page booking-detail-page">
      <header className="page-header with-back"><button className="back-btn" onClick={() => navigate('/bookings')}><ArrowLeft size={20} /></button><h1>Booking #{booking.booking_number}</h1></header>

      <div className="status-timeline">
        {statusSteps.map((step, idx) => (
          <div key={step} className={`timeline-step ${idx <= currentStep ? 'completed' : ''} ${idx === currentStep ? 'current' : ''}`}>
            <div className="step-marker">{idx < currentStep ? <Check size={14} /> : idx + 1}</div>
            <div className="step-label">{step.replace('_', ' ').toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className="booking-info-card">
        <h2>{booking.service?.name || 'Service'}</h2>
        <div className="info-row"><span className="label">Status:</span><span className={`status ${booking.status}`}>{booking.status.replace('_', ' ')}</span></div>
        <div className="info-row"><span className="label">Date:</span><span>{booking.scheduled_date ? formatDate(booking.scheduled_date) : 'TBD'}</span></div>
        <div className="info-row"><span className="label">Time:</span><span>{booking.scheduled_time_slot || 'TBD'}</span></div>
        <div className="info-row"><span className="label">Address:</span><span>{booking.address}{booking.city ? `, ${booking.city}` : ''}</span></div>
        <div className="info-row"><span className="label">Amount:</span><span className="amount">₹{(booking.final_price || 0).toLocaleString()}</span></div>
        {booking.notes && <div className="info-row"><span className="label">Notes:</span><span>{booking.notes}</span></div>}
      </div>

      {tracking.length > 0 && (
        <div className="tracking-section">
          <h3>Updates</h3>
          {tracking.map(t => (
            <div key={t.id} className="tracking-item">
              <div className="track-icon">{t.status === 'en_route' ? <ArrowRight size={16} /> : t.status === 'arrived' ? <MapPin size={16} /> : <CheckCircle size={16} />}</div>
              <div className="track-info"><span className="track-status">{t.status.replace('_', ' ')}</span><span className="track-time">{formatRelativeTime(t.created_at)}</span></div>
            </div>
          ))}
        </div>
      )}

      {(booking.status === 'pending' || booking.status === 'confirmed') && (
        <button className="btn btn-danger btn-block" onClick={cancelBooking} disabled={cancelling}>{cancelling ? 'Cancelling...' : 'Cancel Booking'}</button>
      )}

      <div className="bottom-spacer"></div>
    </div>
  )
}

function PartnerActiveJobsPage() {
  const { user, profile } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actioningId, setActioningId] = useState<string | null>(null)

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        const { data, error: loadError } = await supabase.from('bookings').select('*, service:services(*)').eq('technician_id', partner.id).in('status', ['confirmed', 'in_progress']).order('scheduled_date')
        if (loadError) throw loadError
        setJobs(data || [])
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function startJob(bookingId: string) {
    setActioningId(bookingId)
    try {
      const { error: updateError } = await supabase.from('bookings').update({ status: 'in_progress' }).eq('id', bookingId)
      if (updateError) throw updateError
      const otp = Math.floor(1000 + Math.random() * 9000).toString()
      await supabase.from('bookings').update({ otp }).eq('id', bookingId)
      showToast('Job started! Customer will be notified.', 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to start job', 'error')
    }
    setActioningId(null)
  }

  async function completeJob(bookingId: string) {
    setActioningId(bookingId)
    try {
      const { error: updateError } = await supabase.from('bookings').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', bookingId)
      if (updateError) throw updateError
      showToast('Job completed successfully!', 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to complete job', 'error')
    }
    setActioningId(null)
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Active Jobs</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state"><Wrench size={48} /><h3>No active jobs</h3><p>Accept a job request to get started</p><Link to="/partner/jobs" className="btn btn-primary">View Job Requests</Link></div>
      ) : (
        <div className="active-jobs-list">
          {jobs.map(j => (
            <div key={j.id} className="active-job-card">
              <div className="job-header"><span className="booking-id">#{j.booking_number}</span><span className={`status ${j.status}`}>{j.status.replace('_', ' ')}</span></div>
              <h3>{j.service?.name}</h3>
              <div className="job-details">
                <div className="detail"><MapPin size={14} /><span>{j.address?.substring(0, 40)}...</span></div>
                <div className="detail"><Calendar size={14} /><span>{j.scheduled_date ? formatDate(j.scheduled_date) : 'TBD'}</span></div>
                <div className="detail"><Clock size={14} /><span>{j.scheduled_time_slot || 'TBD'}</span></div>
                {j.otp && <div className="detail"><Shield size={14} /><span className="otp">OTP: {j.otp}</span></div>}
              </div>
              <div className="job-actions">
                {j.status === 'confirmed' && <button className="btn btn-primary" onClick={() => startJob(j.id)} disabled={actioningId === j.id}>{actioningId === j.id ? 'Starting...' : 'Start Job'}</button>}
                {j.status === 'in_progress' && <button className="btn btn-success" onClick={() => completeJob(j.id)} disabled={actioningId === j.id}>{actioningId === j.id ? 'Completing...' : 'Complete Job'}</button>}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function ProfilePage() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalBookings: 0, walletBalance: 0, referrals: 0 })

  useEffect(() => { if (user && profile) loadStats() }, [user, profile])

  async function loadStats() {
    try {
      const custStats = await dashboardApi.getCustomerStats(profile!.id)
      const { data: wallet } = await walletApi.getBalance(profile!.user_id)
      const { data: refCode } = await referralApi.getCode(profile!.user_id)
      setStats({
        totalBookings: custStats.totalBookings,
        walletBalance: wallet?.balance || 0,
        referrals: refCode?.total_referrals || 0
      })
    } catch {}
  }

  async function handleLogout() {
    try {
      await logout()
      navigate('/auth')
    } catch {}
  }

  if (!user) return <div className="mobile-page auth-required"><User size={48} /><h2>Sign in</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  return (
    <div className="mobile-page">
      <div className="profile-header">
        <div className="profile-avatar"><User size={32} /></div>
        <div className="profile-info">
          <h1>{profile?.full_name || 'User'}</h1>
          <p className="email">{profile?.email || user.email}</p>
          <span className={`membership-badge tier-${profile?.membership_tier || 'free'}`}>{profile?.membership_tier || 'Free'} Member</span>
        </div>
      </div>
      <div className="stats-card">
        <div className="stat-item"><Calendar size={20} /><span className="stat-value">{stats.totalBookings}</span><span className="stat-label">Bookings</span></div>
        <div className="stat-item"><Wallet size={20} /><span className="stat-value">₹{stats.walletBalance}</span><span className="stat-label">Wallet</span></div>
        <div className="stat-item"><Users size={20} /><span className="stat-value">{stats.referrals}</span><span className="stat-label">Referrals</span></div>
      </div>
      <div className="menu-section">
        <h3>Account</h3>
        <div className="menu-list">
          <Link to="/wallet" className="menu-item"><div className="menu-icon"><Wallet size={20} /></div><span>Wallet</span><ChevronRight size={18} /></Link>
          <Link to="/coupons" className="menu-item"><div className="menu-icon"><Gift size={20} /></div><span>My Coupons</span><ChevronRight size={18} /></Link>
          <Link to="/referral" className="menu-item"><div className="menu-icon"><Users size={20} /></div><span>Refer & Earn</span><ChevronRight size={18} /></Link>
          <Link to="/privacy" className="menu-item"><div className="menu-icon"><Shield size={20} /></div><span>Privacy Policy</span><ChevronRight size={18} /></Link>
          <Link to="/terms" className="menu-item"><div className="menu-icon"><FileText size={20} /></div><span>Terms & Conditions</span><ChevronRight size={18} /></Link>
          <Link to="/contact" className="menu-item"><div className="menu-icon"><Mail size={20} /></div><span>Contact Us</span><ChevronRight size={18} /></Link>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}><LogOut size={20} /><span>Sign Out</span></button>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function EmergencyPage() {
  const [step, setStep] = useState<'select' | 'location' | 'done'>('select')
  const [issue, setIssue] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingNumber, setBookingNumber] = useState('')
  const { profile } = useAuth()

  const types = [
    { icon: '💧', label: 'Water Leakage' },
    { icon: '⚡', label: 'Electrical Fault' },
    { icon: '🚽', label: 'Bathroom Emergency' },
    { icon: '❄️', label: 'AC Breakdown' },
  ]

  async function submit() {
    const addrError = validateField(address, validationRules.address)
    if (addrError) { setError(addrError); return }
    if (!city) { setError('City is required'); return }

    setLoading(true)
    setError('')
    try {
      const bn = generateBookingNumber()
      setBookingNumber(bn)
      await bookingApi.create({
        customer_id: profile?.id,
        final_price: 999,
        is_emergency: true,
        notes: `Emergency: ${issue}`,
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time_slot: 'EMERGENCY',
        address, city, pincode,
        status: 'pending',
      })
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Failed to submit request')
    }
    setLoading(false)
  }

  return (
    <div className="mobile-page">
      <header className="emergency-header"><div className="pulse-icon"><AlertTriangle size={32} /></div><h1>24/7 Emergency</h1></header>
      {step === 'select' && (
        <div className="emergency-content">
          <h2>What's the emergency?</h2>
          <div className="emergency-types">
            {types.map(t => (
              <button key={t.label} className={`emergency-type ${issue === t.label ? 'selected' : ''}`} onClick={() => setIssue(t.label)}>
                <span className="icon">{t.icon}</span><span className="label">{t.label}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep('location')} disabled={!issue}>Continue</button>
        </div>
      )}
      {step === 'location' && (
        <div className="emergency-content">
          <button className="back-link" onClick={() => setStep('select')}><ArrowLeft size={16} /> Back</button>
          <h2>Your Location</h2>
          <div className="form-group">
            <label>Address *</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" rows={2} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Pincode" maxLength={6} />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="btn btn-danger btn-block btn-lg" onClick={submit} disabled={loading}>{loading ? 'Requesting...' : 'Request Emergency Service – ₹999'}</button>
        </div>
      )}
      {step === 'done' && (
        <div className="emergency-success">
          <div className="success-icon"><Check size={32} /></div>
          <h2>Help is on the way!</h2>
          <p className="booking-number">Booking: #{bookingNumber}</p>
          <p>We'll contact you within 30 minutes</p>
          <a href="tel:+911234567890" className="emergency-phone"><Phone size={24} />Call Now: +91 1234567890</a>
          <Link to="/bookings" className="btn btn-outline">View Booking</Link>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function BookingPage() {
  const { user, profile } = useAuth()
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('service')
  const [service, setService] = useState<any>(null)
  const [step, setStep] = useState<'details' | 'schedule' | 'address' | 'confirm'>('details')
  const [loading, setLoading] = useState(false)
  const [serviceLoading, setServiceLoading] = useState(true)
  const [addresses, setAddresses] = useState<any[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '', pincode: '' })
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)

  const dates = getAvailableDates()

  useEffect(() => { if (serviceId) loadService() }, [serviceId])
  useEffect(() => { if (user && profile) loadAddresses() }, [user, profile])

  async function loadService() {
    try {
      const { data, error: loadError } = await servicesApi.getById(serviceId!)
      if (loadError) throw loadError
      setService(data)
    } catch (err: any) {
      setError(err.message)
    }
    setServiceLoading(false)
  }

  async function loadAddresses() {
    try {
      const { data } = await userApi.getAddresses(profile!.id)
      const addrList = data || []
      setAddresses(addrList)
      if (addrList.length > 0 && addrList[0].is_default) {
        setSelectedAddress(addrList[0].id)
      }
    } catch {}
  }

  async function applyCoupon() {
    if (!couponCode) return
    setError('')
    try {
      const { data, error: couponError } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).single()
      if (couponError || !data) {
        setError('Invalid or expired coupon code')
        return
      }
      if (data.min_order_value > service?.base_price) {
        setError(`Minimum order ₹${data.min_order_value} required`)
        return
      }
      setAppliedCoupon(data)
    } catch {
      setError('Invalid coupon code')
    }
  }

  function calculateTotal() {
    let total = service?.base_price || 0
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'percentage') {
        const discount = Math.min(total * appliedCoupon.discount_value / 100, appliedCoupon.max_discount || total)
        total = total - discount
      } else {
        total = total - appliedCoupon.discount_value
      }
    }
    return Math.max(0, Math.round(total))
  }

  async function submitBooking() {
    const addr = selectedAddress ? addresses.find(a => a.id === selectedAddress) : newAddress
    if (!addr?.address) { setError('Please provide an address'); return }
    if (!selectedDate) { setError('Please select a date'); return }
    if (!selectedTime) { setError('Please select a time slot'); return }

    setLoading(true)
    setError('')
    try {
      const bookingNumber = generateBookingNumber()
      const { error: insertError } = await supabase.from('bookings').insert({
        booking_number: bookingNumber,
        customer_id: profile?.id,
        service_id: serviceId,
        scheduled_date: selectedDate,
        scheduled_time_slot: selectedTime,
        address: addr.address,
        city: addr.city,
        pincode: addr.pincode,
        notes,
        final_price: calculateTotal(),
        status: 'pending',
        coupon_id: appliedCoupon?.id,
        discount_amount: appliedCoupon ? (service.base_price - calculateTotal()) : 0,
      })

      if (insertError) throw insertError
      setSuccess(true)
      setTimeout(() => { window.location.href = '/bookings' }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    }
    setLoading(false)
  }

  if (!user) {
    return <div className="mobile-page auth-required"><Calendar size={48} /><h2>Sign in to book a service</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>
  }

  if (serviceLoading) return <div className="mobile-page loading"><div className="spinner" /></div>
  if (!service) return <div className="mobile-page"><div className="empty-state"><Wrench size={48} /><h3>Service not found</h3><Link to="/services" className="btn btn-primary">Browse Services</Link></div></div>

  if (success) {
    return (
      <div className="mobile-page">
        <div className="success-state">
          <CheckCircle size={64} style={{ color: 'var(--success)' }} />
          <h2>Booking Confirmed!</h2>
          <p>Your booking has been placed successfully.</p>
          <p>Redirecting to bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-page booking-page">
      <header className="page-header with-back">
        <Link to={`/services/${service.category?.slug || 'services'}`} className="back-btn"><ArrowLeft size={20} /></Link>
        <h1>Book Service</h1>
      </header>

      <div className="progress-steps">
        <span className={step === 'details' ? 'active' : ''}>1. Details</span>
        <span className={step === 'schedule' ? 'active' : ''}>2. Schedule</span>
        <span className={step === 'address' ? 'active' : ''}>3. Address</span>
        <span className={step === 'confirm' ? 'active' : ''}>4. Confirm</span>
      </div>

      <div className="booking-modal">
        {step === 'details' && (
          <div className="modal-body">
            <div className="service-summary">
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <div className="price-info">
                <span className="base-price">₹{service.base_price?.toLocaleString()}</span>
                <span className="unit">/{service.unit?.replace('per ', '')}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any specific requirements..." rows={3} />
            </div>
            <button className="btn btn-primary btn-block" onClick={() => setStep('schedule')}>Continue</button>
          </div>
        )}

        {step === 'schedule' && (
          <div className="modal-body">
            <div className="form-group">
              <label>Select Date *</label>
              <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
                <option value="">Choose a date</option>
                {dates.map(d => <option key={d} value={d}>{formatDate(d)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Time Slot *</label>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button key={slot} className={`time-slot ${selectedTime === slot ? 'selected' : ''}`} onClick={() => setSelectedTime(slot)}>{slot}</button>
                ))}
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep('details')}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep('address')} disabled={!selectedDate || !selectedTime}>Continue</button>
            </div>
          </div>
        )}

        {step === 'address' && (
          <div className="modal-body">
            {addresses.length > 0 && (
              <div className="saved-addresses">
                <h3>Saved Addresses</h3>
                {addresses.map(addr => (
                  <div key={addr.id} className={`address-option ${selectedAddress === addr.id ? 'selected' : ''}`} onClick={() => { setSelectedAddress(addr.id); setNewAddress({ label: '', address: '', city: '', pincode: '' }); }}>
                    <span className="address-label">{addr.label || 'Home'}</span>
                    <p>{addr.address}, {addr.city} - {addr.pincode}</p>
                    {addr.is_default && <span className="default-tag">Default</span>}
                  </div>
                ))}
              </div>
            )}
            <div className="new-address-form">
              <h3>{addresses.length > 0 ? 'Or add new address' : 'Add Address'}</h3>
              <div className="form-group">
                <input type="text" value={newAddress.label} onChange={e => { setNewAddress({ ...newAddress, label: e.target.value }); setSelectedAddress(''); }} placeholder="Label (Home/Office)" />
              </div>
              <div className="form-group">
                <textarea value={newAddress.address} onChange={e => { setNewAddress({ ...newAddress, address: e.target.value }); setSelectedAddress(''); }} placeholder="Full Address *" rows={2} />
              </div>
              <div className="form-row">
                <input type="text" value={newAddress.city} onChange={e => { setNewAddress({ ...newAddress, city: e.target.value }); setSelectedAddress(''); }} placeholder="City *" />
                <input type="text" value={newAddress.pincode} onChange={e => { setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }); setSelectedAddress(''); }} placeholder="Pincode" maxLength={6} />
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep('schedule')}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep('confirm')} disabled={!selectedAddress && !newAddress.address}>Continue</button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="modal-body">
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item"><span>Service</span><span>{service.name}</span></div>
              <div className="summary-item"><span>Date</span><span>{formatDate(selectedDate)}</span></div>
              <div className="summary-item"><span>Time</span><span>{selectedTime}</span></div>
              <div className="summary-item"><span>Address</span><span>{(addresses.find(a => a.id === selectedAddress)?.address || newAddress.address)?.substring(0, 30)}...</span></div>
              <div className="summary-divider"></div>
              <div className="summary-item"><span>Base Price</span><span>₹{service.base_price?.toLocaleString()}</span></div>
              {appliedCoupon && (
                <div className="summary-item discount"><span>Coupon ({appliedCoupon.code})</span><span>-₹{(service.base_price - calculateTotal()).toLocaleString()}</span></div>
              )}
              <div className="summary-item total"><span>Total</span><span>₹{calculateTotal().toLocaleString()}</span></div>
            </div>

            <div className="coupon-section">
              <h4>Apply Coupon</h4>
              <div className="coupon-input">
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" />
                <button className="btn btn-sm btn-outline" onClick={applyCoupon} disabled={!couponCode}>Apply</button>
              </div>
              {appliedCoupon && <div className="coupon-applied"><Check size={16} /> {appliedCoupon.code} applied - You save ₹{(service.base_price - calculateTotal()).toLocaleString()}</div>}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep('address')}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={submitBooking} disabled={loading}>
                {loading ? 'Processing...' : `Confirm Booking – ₹${calculateTotal().toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function WalletPage() {
  const { user, profile } = useAuth()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (user && profile) load() }, [user, profile])

  async function load() {
    try {
      let walletData = null
      const { data: existing, error: walletError } = await walletApi.getBalance(profile!.user_id)
      if (walletError && walletError.code !== 'PGRST116') throw walletError
      if (!existing) {
        const { data: newWallet, error: createError } = await walletApi.createWallet(profile!.user_id)
        if (createError) throw createError
        walletData = newWallet
      } else {
        walletData = existing
      }
      setWallet(walletData)

      if (walletData) {
        const { data: txns } = await walletApi.getTransactions(walletData.id)
        setTransactions(txns || [])
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!user) return <div className="mobile-page auth-required"><Wallet size={48} /><h2>Sign in to view wallet</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  return (
    <div className="mobile-page wallet-page">
      <header className="page-header with-back">
        <Link to="/profile" className="back-btn"><ArrowLeft size={20} /></Link>
        <h1>Wallet</h1>
      </header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load wallet</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : (
        <>
          <div className="wallet-balance-card">
            <p>Available Balance</p>
            <h2>₹{wallet?.balance?.toLocaleString() || 0}</h2>
            <button className="btn btn-primary" disabled>Add Money</button>
          </div>
          <div className="transactions-section">
            <h3>Transaction History</h3>
            {transactions.length === 0 ? (
              <div className="empty-state"><p>No transactions yet</p></div>
            ) : (
              <div className="transactions-list">
                {transactions.map(t => (
                  <div key={t.id} className="txn-item">
                    <div className="txn-info">
                      <span className="txn-type">{t.type}</span>
                      <span className="txn-desc">{t.description || '-'}</span>
                      <span className="txn-date">{formatRelativeTime(t.created_at)}</span>
                    </div>
                    <span className={`txn-amount ${['credit', 'cashback', 'referral'].includes(t.type) ? 'positive' : 'negative'}`}>
                      {['debit'].includes(t.type) ? '-' : '+'}₹{t.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function CouponsPage() {
  const { user } = useAuth()
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([])
  const [myCoupons, setMyCoupons] = useState<any[]>([])
  const [tab, setTab] = useState<'available' | 'my'>('available')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (user) load() }, [user])

  async function load() {
    try {
      const { data: coupons, error: couponError } = await couponApi.getAll()
      if (couponError) throw couponError
      setAvailableCoupons(coupons || [])
      const { data: userCoupons } = await supabase.from('user_coupons').select('*, coupon:coupons(*)').eq('user_id', user!.id)
      setMyCoupons(userCoupons || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function claimCoupon(couponId: string) {
    try {
      const { error: claimError } = await supabase.from('user_coupons').insert({ user_id: user!.id, coupon_id: couponId })
      if (claimError) throw claimError
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to claim coupon', 'error')
    }
  }

  if (!user) return <div className="mobile-page auth-required"><Gift size={48} /><h2>Sign in to view coupons</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  return (
    <div className="mobile-page coupons-page">
      <header className="page-header with-back">
        <Link to="/profile" className="back-btn"><ArrowLeft size={20} /></Link>
        <h1>Coupons</h1>
      </header>
      <div className="tabs">
        <button className={`tab ${tab === 'available' ? 'active' : ''}`} onClick={() => setTab('available')}>Available ({availableCoupons.length})</button>
        <button className={`tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Coupons ({myCoupons.length})</button>
      </div>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load coupons</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : (
        <div className="coupons-list">
          {tab === 'available' ? (
            availableCoupons.length === 0 ? <div className="empty-state"><Gift size={48} /><h3>No coupons available</h3></div> : availableCoupons.map(c => (
              <div key={c.id} className="coupon-card">
                <div className="coupon-value">
                  <span>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</span>
                  <small>OFF</small>
                </div>
                <div className="coupon-info">
                  <h4>{c.description || c.code}</h4>
                  <p>Min order: ₹{c.min_order_value?.toLocaleString()}</p>
                  <span className="validity">Valid until {formatDate(c.valid_until)}</span>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => claimCoupon(c.id)}>Claim</button>
              </div>
            ))
          ) : (
            myCoupons.length === 0 ? <div className="empty-state"><Gift size={48} /><h3>No claimed coupons</h3><p>Claim coupons from the available tab</p></div> : myCoupons.map(uc => (
              <div key={uc.id} className={`coupon-card ${uc.is_used ? 'used' : 'claimed'}`}>
                <div className="coupon-value">
                  <span>{uc.coupon?.discount_type === 'percentage' ? `${uc.coupon.discount_value}%` : `₹${uc.coupon.discount_value}`}</span>
                </div>
                <div className="coupon-info">
                  <h4>{uc.coupon?.code}</h4>
                  <p className={uc.is_used ? 'text-muted' : 'text-success'}>{uc.is_used ? 'Used' : 'Available'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function ReferralPage() {
  const { user, profile } = useAuth()
  const [referralCode, setReferralCode] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => { if (user && profile) load() }, [user, profile])

  async function load() {
    try {
      // Use user.id directly since referral_codes.user_id references auth.users
      const { data: code, error: codeError } = await supabase.from('referral_codes').select('*').eq('user_id', profile!.user_id).maybeSingle()
      if (codeError) throw codeError
      if (!code) {
        const newCode = `REF${profile!.user_id.substring(0, 6).toUpperCase()}`
        const { data: newRef, error: createError } = await supabase.from('referral_codes').insert({ user_id: profile!.user_id, code: newCode }).select().single()
        if (createError) throw createError
        setReferralCode(newRef)
      } else {
        setReferralCode(code)
      }

      const { data: refs } = await supabase.from('referrals').select('*, referee:profiles!referee_id(full_name)').eq('referrer_id', profile!.user_id)
      setReferrals(refs || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const copyCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareLink = () => {
    const text = `Use my referral code ${referralCode?.code} to get ₹100 off on your first booking with One Call Home Solutions!`
    if (navigator.share) {
      navigator.share({ title: 'One Call Referral', text })
    } else {
      navigator.clipboard.writeText(text)
      showToast('Referral link copied!', 'success')
    }
  }

  if (!user) return <div className="mobile-page auth-required"><Users size={48} /><h2>Sign in to view referrals</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  return (
    <div className="mobile-page referral-page">
      <header className="referral-hero">
        <h2>Refer & Earn</h2>
        <p>Get ₹100 for every friend who books!</p>
      </header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : (
        <>
          <div className="referral-card">
            <h3>Your Referral Code</h3>
            <div className="referral-code-display">{referralCode?.code || 'Loading...'}</div>
            <div className="referral-actions">
              <button className="btn btn-outline" onClick={copyCode}>{copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Code</>}</button>
              <button className="btn btn-primary" onClick={shareLink}><Share2 size={18} /> Share</button>
            </div>
          </div>
          <div className="earnings-card">
            <div className="earning-stat">
              <span className="value">₹{referralCode?.total_earnings?.toLocaleString() || 0}</span>
              <span className="label">Total Earnings</span>
            </div>
            <div className="earning-stat">
              <span className="value">{referralCode?.total_referrals || 0}</span>
              <span className="label">Friends Referred</span>
            </div>
          </div>
          <div className="referrals-list">
            <h3>Your Referrals</h3>
            {referrals.length === 0 ? (
              <div className="empty-state"><p>Share your code with friends to start earning!</p></div>
            ) : (
              referrals.map(r => (
                <div key={r.id} className="referral-item">
                  <div className="referee-info">
                    <span className="name">{r.referee?.full_name || 'Friend'}</span>
                    <span className="date">{formatRelativeTime(r.created_at)}</span>
                  </div>
                  <span className="reward">+₹{r.reward_amount}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Partner Module
function PartnerLayout() {
  const location = useLocation()
  return (
    <div className="partner-app">
      <header className="partner-header">
        <div className="partner-brand"><Shield size={24} /><span>Partner App</span></div>
        <Link to="/partner/profile" className="profile-link"><User size={20} /></Link>
      </header>
      <main className="partner-content"><Outlet /></main>
      <nav className="partner-nav">
        <Link to="/partner" className={`partner-nav-item ${location.pathname === '/partner' ? 'active' : ''}`}><Home size={20} /><span>Home</span></Link>
        <Link to="/partner/jobs" className={`partner-nav-item ${location.pathname.startsWith('/partner/jobs') ? 'active' : ''}`}><Wrench size={20} /><span>Jobs</span></Link>
        <Link to="/partner/withdrawals" className={`partner-nav-item ${location.pathname.startsWith('/partner/withdrawals') ? 'active' : ''}`}><DollarSign size={20} /><span>Money</span></Link>
        <Link to="/partner/kyc" className={`partner-nav-item ${location.pathname.startsWith('/partner/kyc') ? 'active' : ''}`}><Shield size={20} /><span>KYC</span></Link>
      </nav>
    </div>
  )
}

function PartnerDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ totalEarnings: 0, totalJobs: 0, completedJobs: 0, avgRating: 0 })
  const [partnerData, setPartnerData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && profile?.role === 'partner') load()
    else setLoading(false)
  }, [user, profile])

  async function load() {
    try {
      const { data: partner, error: partnerError } = await partnerApi.getProfile(user!.id)
      if (partnerError) throw partnerError
      setPartnerData(partner)
      if (partner) {
        const statsData = await dashboardApi.getPartnerStats(partner.id)
        setStats(statsData)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!user || profile?.role !== 'partner') {
    return <div className="mobile-page auth-required"><Shield size={48} /><h2>Partner Access Required</h2><p>You need a partner account to access this area.</p><Link to="/auth" className="btn btn-primary">Sign In</Link></div>
  }

  if (loading) return <div className="partner-page loading"><div className="spinner" /></div>

  if (error) {
    return <div className="partner-page"><div className="error-state"><AlertCircle size={48} /><h3>Error loading dashboard</h3><button className="btn btn-primary" onClick={load}>Retry</button></div></div>
  }

  return (
    <div className="partner-page">
      <div className="stats-grid">
        <div className="stat-card"><DollarSign size={24} /><div className="stat-value">₹{stats.totalEarnings.toLocaleString()}</div><div className="stat-label">Total Earnings</div></div>
        <div className="stat-card"><Wrench size={24} /><div className="stat-value">{stats.totalJobs}</div><div className="stat-label">Total Jobs</div></div>
        <div className="stat-card"><Star size={24} /><div className="stat-value">{stats.avgRating.toFixed(1)}</div><div className="stat-label">Rating</div></div>
        <div className="stat-card"><CheckCircle size={24} /><div className="stat-value">{stats.completedJobs}</div><div className="stat-label">Completed</div></div>
      </div>
      <div className="availability-section">
        <h3>Your Availability</h3>
        <button
          className={`btn ${partnerData?.is_available ? 'btn-success' : 'btn-secondary'} btn-block`}
          onClick={async () => {
            if (partnerData) {
              try {
                await partnerApi.setAvailability(partnerData.id, !partnerData.is_available)
                load()
              } catch (err: any) {
                showToast(err.message || 'Failed to update availability', 'error')
              }
            }
          }}
        >
          {partnerData?.is_available ? <><CheckCircle size={18} /> Online - Accepting Jobs</> : <><XCircle size={18} /> Offline - Not Accepting Jobs</>}
        </button>
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function PartnerJobsPage() {
  const { user, profile } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        const { data } = await partnerApi.getJobRequests(partner.id)
        setRequests(data || [])
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleAction(requestId: string, accept: boolean) {
    try {
      const { error: actionError } = await supabase.from('partner_job_requests').update({ status: accept ? 'accepted' : 'rejected' }).eq('id', requestId)
      if (actionError) throw actionError
      if (accept) {
        const req = requests.find(r => r.id === requestId)
        if (req?.booking_id && req?.partner_id) {
          const { error: bookingError } = await supabase.from('bookings').update({ technician_id: req.partner_id, status: 'confirmed' }).eq('id', req.booking_id)
          if (bookingError) throw bookingError
        }
      }
      showToast(accept ? 'Job accepted!' : 'Job declined', accept ? 'success' : 'info')
      load()
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error')
    }
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Job Requests</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : requests.length === 0 ? (
        <div className="empty-state"><Wrench size={48} /><h3>No pending requests</h3><p>Check back later for new job opportunities</p></div>
      ) : (
        <div className="job-requests">
          {requests.map(r => (
            <div key={r.id} className="job-request-card">
              <div className="job-header"><span className="booking-id">#{r.booking?.booking_number}</span><span className="price">₹{r.booking?.final_price?.toLocaleString() || 0}</span></div>
              <h3>{r.booking?.service?.name}</h3>
              <div className="job-details">
                <div className="detail"><MapPin size={14} /><span>{r.booking?.address?.substring(0, 30)}...</span></div>
                <div className="detail"><Calendar size={14} /><span>{r.booking?.scheduled_date ? formatDate(r.booking.scheduled_date) : 'TBD'}</span></div>
                <div className="detail"><Clock size={14} /><span>{r.booking?.scheduled_time_slot || 'TBD'}</span></div>
              </div>
              <div className="job-actions">
                <button className="btn btn-success" onClick={() => handleAction(r.id, true)}><Check size={18} /> Accept</button>
                <button className="btn btn-danger" onClick={() => handleAction(r.id, false)}><X size={18} /> Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function PartnerEarningsPage() {
  const { user, profile } = useAuth()
  const [earnings, setEarnings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        const { data } = await partnerApi.getEarnings(partner.id)
        setEarnings(data || [])
        setTotal(data?.filter((e: any) => e.type === 'job_payment').reduce((sum: number, e: any) => sum + e.amount, 0) || 0)
      }
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Earnings</h1></header>
      <div className="earnings-summary">
        <DollarSign size={32} />
        <span className="amount">₹{total.toLocaleString()}</span>
        <p className="label">Total Earnings</p>
      </div>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : earnings.length === 0 ? (
        <div className="empty-state"><DollarSign size={48} /><h3>No earnings yet</h3><p>Complete jobs to earn money</p></div>
      ) : (
        <div className="earnings-list">
          {earnings.map(e => (
            <div key={e.id} className={`earning-item ${e.type}`}>
              <div className="earning-icon">{e.type === 'job_payment' ? <DollarSign size={20} /> : e.type === 'bonus' ? <Gift size={20} /> : <TrendingUp size={20} />}</div>
              <div className="earning-info"><span className="type">{e.type.replace('_', ' ')}</span><span className="desc">{e.description || '-'}</span></div>
              <span className={`amount ${e.type === 'penalty' ? 'negative' : ''}`}>₹{e.amount?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function PartnerHistoryPage() {
  const { user, profile } = useAuth()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        const { data } = await partnerApi.getHistory(partner.id)
        setHistory(data || [])
      }
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Job History</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : history.length === 0 ? (
        <div className="empty-state"><Clock size={48} /><h3>No jobs completed yet</h3></div>
      ) : (
        <div className="history-list">
          {history.map(h => (
            <div key={h.id} className="history-card">
              <div className="history-header"><span className="booking-id">#{h.booking_number}</span><span className={`status ${h.status}`}>{h.status}</span></div>
              <h3>{h.service?.name}</h3>
              <div className="history-details">
                <div className="detail"><Calendar size={14} /><span>{h.scheduled_date ? formatDate(h.scheduled_date) : 'N/A'}</span></div>
                <div className="detail"><DollarSign size={14} /><span>₹{h.final_price?.toLocaleString() || 0}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function PartnerProfilePage() {
  const { user, profile, logout } = useAuth()
  const [partnerData, setPartnerData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await partnerApi.getProfile(user!.id)
      setPartnerData(data)
    } catch {}
  }

  async function handleLogout() {
    await logout()
    navigate('/auth')
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <div className="profile-header">
        <div className="profile-avatar">{partnerData?.full_name?.charAt(0) || 'P'}</div>
        <div className="profile-info">
          <h1>{partnerData?.full_name || 'Partner'}</h1>
          <p className="phone">{partnerData?.phone}</p>
          <div className="rating"><Star size={16} style={{ color: 'var(--accent)' }} /><span>{partnerData?.rating?.toFixed(1) || '0.0'}</span></div>
        </div>
      </div>
      <div className="menu-section">
        <h3>Account</h3>
        <div className="menu-list">
          <Link to="/partner/kyc" className="menu-item"><Shield size={20} /><span>KYC Verification</span><ChevronRight size={18} /></Link>
          <Link to="/partner/bank" className="menu-item"><DollarSign size={20} /><span>Bank Accounts</span><ChevronRight size={18} /></Link>
          <Link to="/partner/withdrawals" className="menu-item"><Wallet size={20} /><span>Withdrawals</span><ChevronRight size={18} /></Link>
        </div>
      </div>
      <div className="menu-section">
        <h3>Quick Links</h3>
        <div className="menu-list">
          <Link to="/partner" className="menu-item"><Home size={20} /><span>Dashboard</span><ChevronRight size={18} /></Link>
          <Link to="/partner/history" className="menu-item"><Clock size={20} /><span>Job History</span><ChevronRight size={18} /></Link>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}><LogOut size={20} /><span>Sign Out</span></button>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Admin Module
function AdminLayout() {
  const { profile } = useAuth()
  const location = useLocation()

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-brand"><Shield size={24} /><span>Admin Dashboard</span></div>
        <div className="admin-actions">
          <Link to="/admin/notifications" className="admin-link"><Send size={20} /></Link>
          <Link to="/admin/coupons" className="admin-link"><Tag size={20} /></Link>
          <Link to="/" className="admin-link"><Home size={20} /></Link>
        </div>
      </header>
      <main className="admin-content"><Outlet /></main>
      <nav className="admin-nav">
        <Link to="/admin" className={`admin-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}><BarChart3 size={20} /><span>Dashboard</span></Link>
        <Link to="/admin/applications" className={`admin-nav-item ${location.pathname.startsWith('/admin/applications') ? 'active' : ''}`}><Users size={20} /><span>Applications</span></Link>
        <Link to="/admin/kyc" className={`admin-nav-item ${location.pathname.startsWith('/admin/kyc') ? 'active' : ''}`}><Shield size={20} /><span>KYC</span></Link>
        <Link to="/admin/withdrawals" className={`admin-nav-item ${location.pathname.startsWith('/admin/withdrawals') ? 'active' : ''}`}><DollarSign size={20} /><span>Withdrawals</span></Link>
        <Link to="/admin/categories" className={`admin-nav-item ${location.pathname.startsWith('/admin/categories') ? 'active' : ''}`}><Wrench size={20} /><span>Categories</span></Link>
        <Link to="/admin/services" className={`admin-nav-item ${location.pathname.startsWith('/admin/services') ? 'active' : ''}`}><Wrench size={20} /><span>Services</span></Link>
        <Link to="/admin/bookings" className={`admin-nav-item ${location.pathname.startsWith('/admin/bookings') ? 'active' : ''}`}><Calendar size={20} /><span>Bookings</span></Link>
      </nav>
    </div>
  )
}

function AdminDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, completedBookings: 0, totalUsers: 0, totalPartners: 0, pendingBookings: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const data = await dashboardApi.getAdminStats()
      const { count: pendingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      setStats({ ...data, pendingBookings: pendingCount || 0 })
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <h1>Dashboard Overview</h1>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Error loading dashboard</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : (
        <div className="admin-stats">
          <div className="stat-card revenue"><DollarSign size={32} /><div className="value">₹{stats.totalRevenue.toLocaleString()}</div><div className="label">Total Revenue</div></div>
          <div className="stat-card bookings"><Calendar size={32} /><div className="value">{stats.totalBookings}</div><div className="label">Total Bookings</div></div>
          <div className="stat-card users"><Users size={32} /><div className="value">{stats.totalUsers}</div><div className="label">Total Users</div></div>
          <div className="stat-card partners"><Wrench size={32} /><div className="value">{stats.totalPartners}</div><div className="label">Partners</div></div>
          <div className="stat-card"><Clock size={32} /><div className="value">{stats.pendingBookings}</div><div className="label">Pending Bookings</div></div>
          <div className="stat-card"><CheckCircle size={32} /><div className="value">{stats.completedBookings}</div><div className="label">Completed</div></div>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function AdminUsersPage() {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data, error: loadError } = await userApi.getAll()
      if (loadError) throw loadError
      setUsers(data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  )

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Users</h1></header>
      <div className="search-box" style={{ margin: '0 16px 16px' }}>
        <Search size={20} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." />
      </div>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load users</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : (
        <div className="table-container">
          {filtered.length === 0 ? <div className="empty-state"><Users size={48} /><h3>No users found</h3></div> : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>{u.full_name || '-'}</td>
                    <td>{u.email || '-'}</td>
                    <td>{u.phone || '-'}</td>
                    <td><span className={`badge role-${u.role}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function AdminPartnersPage() {
  const { user, profile } = useAuth()
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data, error: loadError } = await partnerApi.getAll()
      if (loadError) throw loadError
      setPartners(data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function toggleVerification(partnerId: string, currentStatus: boolean) {
    try {
      const { error: updateError } = await supabase.from('partners').update({ is_verified: !currentStatus }).eq('id', partnerId)
      if (updateError) throw updateError
      showToast(`Partner ${!currentStatus ? 'verified' : 'unverified'}`, 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error')
    }
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Partners</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load partners</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : partners.length === 0 ? (
        <div className="empty-state"><Wrench size={48} /><h3>No partners registered</h3></div>
      ) : (
        <div className="partners-grid">
          {partners.map(p => (
            <div key={p.id} className="partner-card">
              <div className="partner-header">
                <div className="avatar">{p.full_name?.charAt(0) || 'P'}</div>
                <div className="partner-info"><h3>{p.full_name}</h3><p>{p.phone}</p></div>
              </div>
              <div className="partner-stats"><Star size={14} style={{ color: 'var(--accent)' }} /><span>{p.rating?.toFixed(1)}</span><Wrench size={14} style={{ marginLeft: 12 }} /><span>{p.total_jobs} jobs</span></div>
              <div className="partner-actions">
                <span className={`badge ${p.is_available ? 'success' : 'secondary'}`}>{p.is_available ? 'Online' : 'Offline'}</span>
                <button className={`btn btn-xs ${p.is_verified ? 'btn-outline' : 'btn-success'}`} onClick={() => toggleVerification(p.id, p.is_verified)}>{p.is_verified ? 'Unverify' : 'Verify'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function AdminBookingsPage() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const [bookingsRes, partnersRes] = await Promise.all([
        bookingApi.getAll(),
        partnerApi.getAll()
      ])
      if (bookingsRes.error) throw bookingsRes.error
      setBookings(bookingsRes.data || [])
      setPartners(partnersRes.data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function updateStatus(bookingId: string, status: string) {
    setUpdatingId(bookingId)
    try {
      const { error: updateError } = await bookingApi.updateStatus(bookingId, status)
      if (updateError) throw updateError
      showToast('Status updated', 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error')
    }
    setUpdatingId(null)
  }

  async function assignPartner(bookingId: string, partnerId: string) {
    if (!partnerId) return
    setUpdatingId(bookingId)
    try {
      const { error: assignError } = await supabase.from('bookings').update({ technician_id: partnerId, status: 'confirmed' }).eq('id', bookingId)
      if (assignError) throw assignError
      showToast('Partner assigned successfully', 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Failed to assign partner', 'error')
    }
    setUpdatingId(null)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Bookings</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load bookings</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state"><Calendar size={48} /><h3>No bookings yet</h3></div>
      ) : (
        <div className="admin-bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="admin-booking-card">
              <div className="booking-header">
                <span className="booking-id">#{b.booking_number}</span>
                <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} className="status-select" disabled={updatingId === b.id}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <h3>{b.service?.name}</h3>
              <p className="customer">{b.customer?.full_name || 'Unknown'}</p>
              <div className="booking-details">
                <span><Calendar size={14} /> {b.scheduled_date ? formatDate(b.scheduled_date) : 'TBD'}</span>
                <span><DollarSign size={14} /> ₹{b.final_price?.toLocaleString() || 0}</span>
              </div>
              <div className="partner-assign">
                <label>Assign Partner:</label>
                <select
                  value={b.technician_id || ''}
                  onChange={e => assignPartner(b.id, e.target.value)}
                  className="partner-select"
                  disabled={updatingId === b.id || b.status === 'cancelled' || b.status === 'completed'}
                >
                  <option value="">Select Partner</option>
                  {partners.filter(p => p.is_available !== false).map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} (★{p.rating?.toFixed(1) || '0.0'})</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function AdminCouponsPage() {
  const { user, profile } = useAuth()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ code: '', discount_type: 'percentage' as 'percentage' | 'fixed', discount_value: 0, min_order_value: 0, max_discount: 0 })
  const [formError, setFormError] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data, error: loadError } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
      if (loadError) throw loadError
      setCoupons(data || [])
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function createCoupon() {
    setFormError('')
    if (!formData.code || formData.code.length < 3) { setFormError('Coupon code must be at least 3 characters'); return }
    if (formData.discount_value <= 0) { setFormError('Discount value must be greater than 0'); return }

    try {
      const { error: createError } = await couponApi.create({
        ...formData,
        is_active: true,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      })
      if (createError) throw createError
      setShowForm(false)
      setFormData({ code: '', discount_type: 'percentage', discount_value: 0, min_order_value: 0, max_discount: 0 })
      showToast('Coupon created successfully', 'success')
      load()
    } catch (err: any) {
      setFormError(err.message || 'Failed to create coupon')
    }
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Coupons</h1><button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : <><Plus size={18} /> New Coupon</>}</button></header>
      {showForm && (
        <div className="coupon-form">
          <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} placeholder="Coupon Code (e.g., SAVE20)" maxLength={20} />
          <select value={formData.discount_type} onChange={e => setFormData({ ...formData, discount_type: e.target.value as any })}>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
          <input type="number" value={formData.discount_value || ''} onChange={e => setFormData({ ...formData, discount_value: parseInt(e.target.value) || 0 })} placeholder="Discount Value" min="1" />
          <input type="number" value={formData.min_order_value || ''} onChange={e => setFormData({ ...formData, min_order_value: parseInt(e.target.value) || 0 })} placeholder="Min Order Value" min="0" />
          {formData.discount_type === 'percentage' && <input type="number" value={formData.max_discount || ''} onChange={e => setFormData({ ...formData, max_discount: parseInt(e.target.value) || 0 })} placeholder="Max Discount (optional)" min="0" />}
          {formError && <div className="error-message">{formError}</div>}
          <button className="btn btn-success" onClick={createCoupon}><Check size={18} /> Create Coupon</button>
        </div>
      )}
      {loading ? <div className="loading-state"><div className="spinner" /></div> : error ? (
        <div className="error-state"><AlertCircle size={48} /><h3>Failed to load coupons</h3><button className="btn btn-primary" onClick={load}>Retry</button></div>
      ) : coupons.length === 0 ? (
        <div className="empty-state"><Tag size={48} /><h3>No coupons created</h3></div>
      ) : (
        <div className="coupons-list">{coupons.map(c => (
          <div key={c.id} className="coupon-card">
            <div className="coupon-value">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</div>
            <div className="coupon-info"><span className="code">{c.code}</span><span className="min">Min: ₹{c.min_order_value?.toLocaleString()}</span></div>
            <div className="coupon-usage"><span className={c.is_active ? 'text-success' : 'text-muted'}>{c.is_active ? 'Active' : 'Inactive'}</span><span>Used: {c.usage_count}/{c.usage_limit || '∞'}</span></div>
          </div>
        ))}</div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

function AdminNotificationsPage() {
  const { user, profile } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function sendBroadcast() {
    setError('')
    if (!title.trim()) { setError('Title is required'); return }
    if (!body.trim()) { setError('Message is required'); return }

    setSending(true)
    try {
      // Get all users to send notification
      const { data: users } = await supabase.from('profiles').select('user_id')
      if (users && users.length > 0) {
        const notifications = users.map(u => ({
          user_id: u.user_id,
          title: title.trim(),
          body: body.trim(),
          type: 'promotion',
          is_read: false
        }))
        const { error: insertError } = await supabase.from('stored_notifications').insert(notifications)
        if (insertError) throw insertError
        setTitle('')
        setBody('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send notification')
    }
    setSending(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Broadcast Notifications</h1></header>
      {success && <div className="success-message" style={{ margin: 16, padding: 16, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, color: 'var(--success)' }}>Notification sent to all users!</div>}
      <div className="broadcast-section">
        <h2>Send to All Users</h2>
        <div className="form-group">
          <label>Notification Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Special Offer Inside!" maxLength={100} />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message..." rows={4} maxLength={500} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="btn btn-primary" onClick={sendBroadcast} disabled={sending}>
          {sending ? <><RefreshCw className="spinner" size={18} /> Sending...</> : <><Send size={18} /> Send to All Users</>}
        </button>
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Legal Pages
function PrivacyPolicyPage() {
  return (
    <div className="mobile-page legal-page">
      <header className="page-header with-back"><Link to="/profile" className="back-btn"><ArrowLeft size={20} /></Link><h1>Privacy Policy</h1></header>
      <div className="legal-content">
        <p><strong>Effective Date:</strong> June 23, 2026</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, including name, phone, email, address, and payment details when you use our services.</p>
        <h2>2. How We Use Your Information</h2>
        <ul><li>To provide and manage home services</li><li>To communicate with you about bookings</li><li>To send promotional offers (with your consent)</li><li>To improve our services</li></ul>
        <h2>3. Information Sharing</h2>
        <p>We share your contact details with service partners only for fulfilling your bookings. We do not sell your data to third parties.</p>
        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data.</p>
        <h2>5. Your Rights</h2>
        <p>You can request access, correction, or deletion of your data by contacting us.</p>
        <h2>6. Contact</h2>
        <p>Email: privacy@onecallhomesolutions.com</p>
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function TermsPage() {
  return (
    <div className="mobile-page legal-page">
      <header className="page-header with-back"><Link to="/profile" className="back-btn"><ArrowLeft size={20} /></Link><h1>Terms & Conditions</h1></header>
      <div className="legal-content">
        <p><strong>Effective Date:</strong> June 23, 2026</p>
        <h2>1. Service Agreement</h2>
        <p>By using One Call Home Solutions, you agree to these terms for booking home services.</p>
        <h2>2. Booking & Payment</h2>
        <ul><li>Payment is collected upon service completion</li><li>Cancellations within 2 hours may incur a fee</li><li>Prices are estimates; final charges may vary</li></ul>
        <h2>3. Service Quality</h2>
        <p>We provide a 7-day warranty on completed work. Report issues within 7 days for free rectification.</p>
        <h2>4. User Conduct</h2>
        <p>Users must provide accurate information and treat service partners respectfully.</p>
        <h2>5. Liability</h2>
        <p>One Call is not liable for indirect damages. Our maximum liability is limited to the service amount paid.</p>
        <h2>6. Modifications</h2>
        <p>We may update these terms. Continued use constitutes acceptance.</p>
        <h2>7. Contact</h2>
        <p>Email: legal@onecallhomesolutions.com</p>
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const { error: insertError } = await supabase.from('contact_messages').insert({ ...formData, phone: formData.phone || null, created_at: new Date().toISOString() })
      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to send message' })
    }
    setSubmitting(false)
  }

  return (
    <div className="mobile-page contact-page">
      <header className="page-header with-back"><Link to="/profile" className="back-btn"><ArrowLeft size={20} /></Link><h1>Contact Us</h1></header>
      {submitted ? (
        <div className="success-state"><Check size={48} style={{ color: 'var(--success)' }} /><h2>Message Sent!</h2><p>We'll get back to you within 24 hours.</p></div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className={errors.name ? 'error' : ''} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className={errors.email ? 'error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Phone (Optional)</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile number" maxLength={10} />
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={4} placeholder="How can we help?" className={errors.message ? 'error' : ''} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
          {errors.form && <div className="error-message">{errors.form}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</button>
        </form>
      )}
      <div className="contact-info">
        <div className="info-item"><Phone size={20} /><span>+91 1234567890</span></div>
        <div className="info-item"><Mail size={20} /><span>support@onecallhomesolutions.com</span></div>
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Import missing icons
function FileText({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
}

function Copy({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
}

function Share2({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
}

// ==================== PARTNER REGISTRATION ====================
function PartnerRegistrationPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingApp, setExistingApp] = useState<any>(null)

  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', address: '', city: '', pincode: '',
    experience_years: 0, service_categories: [] as string[], service_areas: [] as string[], about_me: ''
  })

  useEffect(() => { if (user) checkExisting() }, [user])

  async function checkExisting() {
    const { data } = await supabase.from('partner_applications').select('*').eq('user_id', user!.id).order('applied_at', { ascending: false }).limit(1).maybeSingle()
    if (data) setExistingApp(data)
  }

  async function submitApplication() {
    if (!formData.full_name || !formData.phone || formData.service_categories.length === 0) {
      setError('Please fill all required fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('partner_applications').insert({
        user_id: user!.id,
        ...formData,
        status: 'applied'
      })
      if (insertError) throw insertError
      showToast('Application submitted successfully!', 'success')
      checkExisting()
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!user) return <Navigate to="/auth" />
  if (existingApp && existingApp.status !== 'rejected') {
    return (
      <div className="mobile-page">
        <header className="page-header"><h1>Application Status</h1></header>
        <div className="status-card">
          <div className={`status-badge ${existingApp.status}`}>{existingApp.status.toUpperCase()}</div>
          <h2>{existingApp.full_name}</h2>
          <p>Applied: {formatDate(existingApp.applied_at)}</p>
          {existingApp.status === 'approved' && (
            <div className="success-box">
              <CheckCircle size={32} style={{ color: 'var(--success)' }} />
              <h3>Congratulations!</h3>
              <p>Your application has been approved.</p>
              <button className="btn btn-primary" onClick={() => navigate('/partner')}>Go to Dashboard</button>
            </div>
          )}
          {existingApp.status === 'rejected' && (
            <div className="error-box">
              <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
              <h3>Application Rejected</h3>
              <p>{existingApp.reject_reason || 'Please contact support for more information.'}</p>
              <button className="btn btn-primary" onClick={() => setExistingApp(null)}>Apply Again</button>
            </div>
          )}
          {existingApp.status === 'applied' && (
            <div className="pending-box">
              <Clock size={32} style={{ color: 'var(--warning)' }} />
              <h3>Under Review</h3>
              <p>We're reviewing your application. This usually takes 2-3 business days.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-page registration-page">
      <header className="page-header with-back"><Link to="/" className="back-btn"><ArrowLeft size={20} /></Link><h1>Become a Partner</h1></header>

      <div className="progress-bar">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="line" style={{ background: step >= 2 ? 'var(--primary)' : '#ddd' }}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className="line" style={{ background: step >= 3 ? 'var(--primary)' : '#ddd' }}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {step === 1 && (
        <div className="form-section">
          <h2>Personal Details</h2>
          <div className="form-group"><label>Full Name *</label><input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Enter your full name" /></div>
          <div className="form-group"><label>Phone Number *</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="10-digit mobile number" maxLength={10} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="your@email.com" /></div>
          <div className="form-group"><label>Address *</label><textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Complete address" rows={2} /></div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" /></div>
            <div className="form-group"><label>Pincode</label><input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})} placeholder="6-digit" maxLength={6} /></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => setStep(2)}>Next: Service Details <ArrowRight size={18} /></button>
        </div>
      )}

      {step === 2 && (
        <div className="form-section">
          <h2>Service Details</h2>
          <div className="form-group">
            <label>Experience (Years)</label>
            <input type="number" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})} min="0" max="50" />
          </div>
          <div className="form-group">
            <label>Service Categories *</label>
            <div className="checkbox-grid">
              {['cleaning', 'plumbing', 'electrical', 'painting', 'carpentry', 'pest-control', 'appliances', 'gardening'].map(cat => (
                <label key={cat} className="checkbox-item">
                  <input type="checkbox" checked={formData.service_categories.includes(cat)} onChange={e => {
                    const cats = e.target.checked
                      ? [...formData.service_categories, cat]
                      : formData.service_categories.filter(c => c !== cat)
                    setFormData({...formData, service_categories: cats})
                  }} />
                  <span>{iconMap[cat]} {cat.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Service Areas</label>
            <div className="chip-input">
              <input type="text" placeholder="Add area and press Enter" onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setFormData({...formData, service_areas: [...formData.service_areas, e.currentTarget.value.trim()]})
                  e.currentTarget.value = ''
                }
              }} />
              <div className="chips">
                {formData.service_areas.map(area => (
                  <span key={area} className="chip removable" onClick={() => setFormData({...formData, service_areas: formData.service_areas.filter(a => a !== area)})}>{area} <X size={14} /></span>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>About Yourself</label>
            <textarea value={formData.about_me} onChange={e => setFormData({...formData, about_me: e.target.value})} placeholder="Tell us about your experience and skills..." rows={3} />
          </div>
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Review <ArrowRight size={18} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-section">
          <h2>Review Application</h2>
          <div className="review-card">
            <h3>Personal Details</h3>
            <div className="review-row"><span>Name:</span><span>{formData.full_name}</span></div>
            <div className="review-row"><span>Phone:</span><span>{formData.phone}</span></div>
            {formData.email && <div className="review-row"><span>Email:</span><span>{formData.email}</span></div>}
            <div className="review-row"><span>Address:</span><span>{formData.address}, {formData.city} - {formData.pincode}</span></div>
          </div>
          <div className="review-card">
            <h3>Service Details</h3>
            <div className="review-row"><span>Experience:</span><span>{formData.experience_years} years</span></div>
            <div className="review-row"><span>Categories:</span><span>{formData.service_categories.join(', ')}</span></div>
            <div className="review-row"><span>Areas:</span><span>{formData.service_areas.join(', ') || 'Not specified'}</span></div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => setStep(2)}><ArrowLeft size={18} /> Back</button>
            <button className="btn btn-primary" onClick={submitApplication} disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
          </div>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== PARTNER KYC ====================
function PartnerKYCPage() {
  const { user, profile } = useAuth()
  const [partner, setPartner] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const docTypes = [
    { key: 'aadhaar_front', label: 'Aadhaar Card (Front)', required: true },
    { key: 'aadhaar_back', label: 'Aadhaar Card (Back)', required: true },
    { key: 'pan_card', label: 'PAN Card', required: true },
    { key: 'profile_photo', label: 'Profile Photo', required: true },
    { key: 'bank_passbook', label: 'Bank Passbook / Cancelled Cheque', required: true }
  ]

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partnerData } = await partnerApi.getProfile(user!.id)
      setPartner(partnerData)
      if (partnerData) {
        const { data: docs } = await supabase.from('kyc_documents').select('*').eq('partner_id', partnerData.id)
        setDocuments(docs || [])
      }
    } catch {}
    setLoading(false)
  }

  async function uploadDocument(docType: string, file: File) {
    if (!partner) return
    setUploading(true)
    setUploadProgress(0)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user!.id}/${docType}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('kyc-documents').getPublicUrl(fileName)

      // Save reference in database
      const { error: dbError } = await supabase.from('kyc_documents').upsert({
        partner_id: partner.id,
        document_type: docType,
        document_url: urlData.publicUrl
      }, { onConflict: 'partner_id,document_type' })

      if (dbError) throw dbError
      showToast(`${docTypes.find(d => d.key === docType)?.label} uploaded!`, 'success')
      load()
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error')
    }
    setUploading(false)
    setUploadProgress(0)
  }

  async function deleteDocument(docId: string) {
    if (!confirm('Delete this document?')) return
    try {
      await supabase.from('kyc_documents').delete().eq('id', docId)
      showToast('Document deleted', 'info')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />
  if (loading) return <div className="partner-page loading"><div className="spinner" /></div>

  const verifiedCount = documents.filter(d => d.is_verified).length
  const allUploaded = docTypes.every(dt => documents.some(d => d.document_type === dt.key))

  return (
    <div className="partner-page kyc-page">
      <header className="page-header with-back"><Link to="/partner/profile" className="back-btn"><ArrowLeft size={20} /></Link><h1>KY Verification</h1></header>

      <div className="kyc-status-card">
        <div className="status-ring">
          <div className="ring-progress" style={{ '--progress': `${(verifiedCount / docTypes.length) * 100}%` } as any}>
            <span>{verifiedCount}/{docTypes.length}</span>
          </div>
        </div>
        <h3>{verifiedCount === docTypes.length ? 'All Documents Verified!' : allUploaded ? 'Under Review' : 'Upload Pending'}</h3>
        <p>{partner?.is_verified ? 'Your KYC is complete.' : 'Upload required documents to start receiving jobs.'}</p>
      </div>

      <div className="documents-list">
        {docTypes.map(dt => {
          const doc = documents.find(d => d.document_type === dt.key)
          return (
            <div key={dt.key} className="document-card">
              <div className="doc-info">
                <h4>{dt.label}</h4>
                {dt.required && <span className="required-badge">Required</span>}
                {doc && <span className={`status-badge ${doc.is_verified ? 'verified' : 'pending'}`}>{doc.is_verified ? 'Verified' : 'Pending'}</span>}
              </div>
              {doc ? (
                <div className="doc-preview">
                  <img src={doc.document_url} alt={dt.label} onClick={() => window.open(doc.document_url, '_blank')} />
                  {!doc.is_verified && <button className="btn btn-sm btn-danger" onClick={() => deleteDocument(doc.id)}>Delete</button>}
                  {doc.reject_reason && <p className="reject-reason">Rejected: {doc.reject_reason}</p>}
                </div>
              ) : (
                <div className="upload-area">
                  <label className="upload-btn">
                    <input type="file" accept="image/*,.pdf" onChange={e => e.target.files?.[0] && uploadDocument(dt.key, e.target.files[0])} disabled={uploading} />
                    {uploading ? <span className="spinner-sm" /> : <Plus size={20} />}
                    <span>Upload</span>
                  </label>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {uploading && (
        <div className="upload-overlay">
          <div className="upload-modal">
            <div className="spinner" />
            <p>Uploading... {uploadProgress}%</p>
          </div>
        </div>
      )}

      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== PARTNER BANK ACCOUNTS ====================
function PartnerBankPage() {
  const { user, profile } = useAuth()
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ account_holder_name: '', bank_name: '', account_number: '', confirm_account_number: '', ifsc_code: '', account_type: 'savings' })
  const [formError, setFormError] = useState('')

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        const { data } = await supabase.from('partner_bank_accounts').select('*').eq('partner_id', partner.id).order('created_at', { ascending: false })
        setBanks(data || [])
      }
    } catch {}
    setLoading(false)
  }

  async function addBank() {
    setFormError('')
    if (!formData.account_holder_name || !formData.bank_name || !formData.account_number) {
      setFormError('Please fill all fields')
      return
    }
    if (formData.account_number !== formData.confirm_account_number) {
      setFormError('Account numbers do not match')
      return
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase())) {
      setFormError('Invalid IFSC code format')
      return
    }

    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        const { error } = await supabase.from('partner_bank_accounts').insert({
          partner_id: partner.id,
          ...formData,
          ifsc_code: formData.ifsc_code.toUpperCase(),
          is_primary: banks.length === 0
        })
        if (error) throw error
        showToast('Bank account added!', 'success')
        setShowForm(false)
        setFormData({ account_holder_name: '', bank_name: '', account_number: '', confirm_account_number: '', ifsc_code: '', account_type: 'savings' })
        load()
      }
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  async function setPrimary(id: string) {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      if (partner) {
        await supabase.from('partner_bank_accounts').update({ is_primary: false }).eq('partner_id', partner.id)
        await supabase.from('partner_bank_accounts').update({ is_primary: true }).eq('id', id)
        showToast('Primary account updated', 'success')
        load()
      }
    } catch {}
  }

  async function deleteBank(id: string) {
    if (!confirm('Delete this bank account?')) return
    try {
      await supabase.from('partner_bank_accounts').delete().eq('id', id)
      showToast('Bank account deleted', 'info')
      load()
    } catch {}
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />
  if (loading) return <div className="partner-page loading"><div className="spinner" /></div>

  return (
    <div className="partner-page bank-page">
      <header className="page-header with-back"><Link to="/partner/profile" className="back-btn"><ArrowLeft size={20} /></Link><h1>Bank Accounts</h1></header>

      <div className="bank-list">
        {banks.length === 0 ? (
          <div className="empty-state"><DollarSign size={48} /><h3>No bank accounts added</h3><p>Add a bank account to receive withdrawals</p></div>
        ) : banks.map(b => (
          <div key={b.id} className={`bank-card ${b.is_primary ? 'primary' : ''}`}>
            {b.is_primary && <span className="primary-badge">Primary</span>}
            <h3>{b.bank_name}</h3>
            <p className="account-holder">{b.account_holder_name}</p>
            <p className="account-number">****{b.account_number.slice(-4)}</p>
            <p className="ifsc">IFSC: {b.ifsc_code}</p>
            <div className="bank-actions">
              {!b.is_primary && <button className="btn btn-sm btn-outline" onClick={() => setPrimary(b.id)}>Set Primary</button>}
              <button className="btn btn-sm btn-danger" onClick={() => deleteBank(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="form-modal">
          <div className="form-section">
            <h3>Add Bank Account</h3>
            <div className="form-group"><label>Account Holder Name</label><input type="text" value={formData.account_holder_name} onChange={e => setFormData({...formData, account_holder_name: e.target.value})} placeholder="Name as per bank records" /></div>
            <div className="form-group"><label>Bank Name</label><input type="text" value={formData.bank_name} onChange={e => setFormData({...formData, bank_name: e.target.value})} placeholder="e.g., HDFC Bank" /></div>
            <div className="form-group"><label>Account Number</label><input type="text" value={formData.account_number} onChange={e => setFormData({...formData, account_number: e.target.value.replace(/\D/g, '')})} placeholder="Enter account number" /></div>
            <div className="form-group"><label>Confirm Account Number</label><input type="text" value={formData.confirm_account_number} onChange={e => setFormData({...formData, confirm_account_number: e.target.value.replace(/\D/g, '')})} placeholder="Re-enter account number" /></div>
            <div className="form-group"><label>IFSC Code</label><input type="text" value={formData.ifsc_code} onChange={e => setFormData({...formData, ifsc_code: e.target.value.toUpperCase()})} placeholder="e.g., HDFC0001234" maxLength={11} /></div>
            <div className="form-group"><label>Account Type</label>
              <select value={formData.account_type} onChange={e => setFormData({...formData, account_type: e.target.value})}>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
            </div>
            {formError && <div className="error-message">{formError}</div>}
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addBank}>Add Account</button>
            </div>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary btn-block floating-btn" onClick={() => setShowForm(true)}><Plus size={18} /> Add Bank Account</button>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== PARTNER WITHDRAWALS ====================
function PartnerWithdrawalsPage() {
  const { user, profile } = useAuth()
  const [partner, setPartner] = useState<any>(null)
  const [banks, setBanks] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partnerData } = await partnerApi.getProfile(user!.id)
      setPartner(partnerData)
      if (partnerData) {
        const [banksRes, withdrawalsRes] = await Promise.all([
          supabase.from('partner_bank_accounts').select('*').eq('partner_id', partnerData.id).eq('is_verified', true),
          supabase.from('withdrawal_requests').select('*, bank:partner_bank_accounts(*)').eq('partner_id', partnerData.id).order('created_at', { ascending: false })
        ])
        setBanks(banksRes.data || [])
        setWithdrawals(withdrawalsRes.data || [])
        if (banksRes.data && banksRes.data.length > 0) setSelectedBank(banksRes.data[0].id)
      }
    } catch {}
    setLoading(false)
  }

  async function requestWithdrawal() {
    setFormError('')
    const amt = parseFloat(amount)
    if (!amt || amt < 100) { setFormError('Minimum withdrawal is ₹100'); return }
    if (!selectedBank) { setFormError('Please select a bank account'); return }
    if (amt > (partner?.wallet_balance || 0)) { setFormError('Insufficient balance'); return }

    try {
      const { error } = await supabase.from('withdrawal_requests').insert({
        partner_id: partner.id,
        bank_account_id: selectedBank,
        amount: amt,
        status: 'pending'
      })
      if (error) throw error
      showToast('Withdrawal request submitted!', 'success')
      setShowForm(false)
      setAmount('')
      load()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />
  if (loading) return <div className="partner-page loading"><div className="spinner" /></div>

  return (
    <div className="partner-page withdrawals-page">
      <header className="page-header"><h1>Withdrawals</h1></header>

      <div className="balance-card">
        <p>Available Balance</p>
        <h2>₹{(partner?.wallet_balance || 0).toLocaleString()}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} disabled={banks.length === 0 || (partner?.wallet_balance || 0) < 100}><DollarSign size={18} /> Request Withdrawal</button>
        {banks.length === 0 && <p className="warning">Add a verified bank account first</p>}
      </div>

      {showForm && (
        <div className="withdrawal-form">
          <h3>Request Withdrawal</h3>
          <div className="form-group"><label>Amount (Min ₹100)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" /></div>
          <div className="form-group"><label>Bank Account</label>
            <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
              {banks.map(b => <option key={b.id} value={b.id}>{b.bank_name} ****{b.account_number.slice(-4)}</option>)}
            </select>
          </div>
          {formError && <div className="error-message">{formError}</div>}
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={requestWithdrawal}>Submit Request</button>
          </div>
        </div>
      )}

      <div className="withdrawals-list">
        <h3>Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <div className="empty-state"><Clock size={32} /><p>No withdrawals yet</p></div>
        ) : withdrawals.map(w => (
          <div key={w.id} className="withdrawal-card">
            <div className="w-header"><span className="amount">₹{w.amount.toLocaleString()}</span><span className={`status ${w.status}`}>{w.status}</span></div>
            <p className="bank-info">{w.bank?.bank_name} ****{w.bank?.account_number?.slice(-4)}</p>
            <p className="date">{formatDate(w.created_at)}</p>
            {w.reject_reason && <p className="reject-reason">Rejected: {w.reject_reason}</p>}
            {w.transaction_reference && <p className="txn-ref">Ref: {w.transaction_reference}</p>}
          </div>
        ))}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== ADMIN KYC VERIFICATION ====================
function AdminKYCPage() {
  const { user, profile } = useAuth()
  const [pendingKYC, setPendingKYC] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await supabase.from('kyc_documents').select('*, partner:partners(*, user:profiles!user_id(*))').eq('is_verified', false).order('uploaded_at', { ascending: true })
      setPendingKYC(data || [])
    } catch {}
    setLoading(false)
  }

  async function approveDoc(docId: string) {
    try {
      const { error } = await supabase.from('kyc_documents').update({ is_verified: true, verified_by: user!.id, verified_at: new Date().toISOString() }).eq('id', docId)
      if (error) throw error
      showToast('Document approved', 'success')
      setSelectedDoc(null)
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function rejectDoc(docId: string) {
    if (!rejectReason.trim()) { showToast('Please provide rejection reason', 'error'); return }
    try {
      const { error } = await supabase.from('kyc_documents').update({ is_verified: false, reject_reason: rejectReason, verified_by: user!.id, verified_at: new Date().toISOString() }).eq('id', docId)
      if (error) throw error
      showToast('Document rejected', 'info')
      setSelectedDoc(null)
      setRejectReason('')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />
  if (loading) return <div className="admin-page loading"><div className="spinner" /></div>

  return (
    <div className="admin-page kyc-admin-page">
      <header className="page-header"><h1>KYC Verification</h1></header>

      {pendingKYC.length === 0 ? (
        <div className="empty-state"><CheckCircle size={48} /><h3>All caught up!</h3><p>No pending KYC documents</p></div>
      ) : (
        <div className="kyc-pending-list">
          {pendingKYC.map(doc => (
            <div key={doc.id} className="kyc-card" onClick={() => setSelectedDoc(doc)}>
              <div className="kyc-preview"><img src={doc.document_url} alt={doc.document_type} /></div>
              <div className="kyc-info">
                <h4>{doc.document_type.replace('_', ' ').toUpperCase()}</h4>
                <p>{doc.partner?.full_name || 'Unknown Partner'}</p>
                <span className="upload-time">{formatRelativeTime(doc.uploaded_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDoc && (
        <div className="kyc-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => { setSelectedDoc(null); setRejectReason('') }}><X size={24} /></button>
            <img src={selectedDoc.document_url} alt="Document" className="full-doc" />
            <div className="doc-details">
              <h3>{selectedDoc.document_type.replace('_', ' ').toUpperCase()}</h3>
              <p><strong>Partner:</strong> {selectedDoc.partner?.full_name}</p>
              <p><strong>Phone:</strong> {selectedDoc.partner?.phone}</p>
              <p><strong>Uploaded:</strong> {formatDate(selectedDoc.uploaded_at)}</p>
            </div>
            <div className="form-group">
              <label>Rejection Reason (if rejecting)</label>
              <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g., Image unclear, document expired" />
            </div>
            <div className="btn-row">
              <button className="btn btn-danger" onClick={() => rejectDoc(selectedDoc.id)}>Reject</button>
              <button className="btn btn-success" onClick={() => approveDoc(selectedDoc.id)}>Approve</button>
            </div>
          </div>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== ADMIN PARTNER APPLICATIONS ====================
function AdminApplicationsPage() {
  const { user, profile } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('applied')
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await supabase.from('partner_applications').select('*').order('applied_at', { ascending: false })
      setApplications(data || [])
    } catch {}
    setLoading(false)
  }

  async function approveApplication(app: any) {
    try {
      // Create partner record
      const { data: newPartner, error: partnerError } = await supabase.from('partners').insert({
        user_id: app.user_id,
        full_name: app.full_name,
        phone: app.phone,
        email: app.email,
        address: app.address,
        city: app.city,
        pincode: app.pincode,
        categories: app.service_categories,
        is_verified: true,
        is_available: true,
        rating: 5.0
      }).select().single()

      if (partnerError) throw partnerError

      // Update application status
      await supabase.from('partner_applications').update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user!.id,
        partner_id: newPartner.id
      }).eq('id', app.id)

      // Update user profile role
      await supabase.from('profiles').update({ role: 'partner' }).eq('user_id', app.user_id)

      showToast('Application approved!', 'success')
      setSelectedApp(null)
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function rejectApplication(app: any) {
    if (!rejectReason.trim()) { showToast('Please provide rejection reason', 'error'); return }
    try {
      await supabase.from('partner_applications').update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user!.id,
        reject_reason: rejectReason
      }).eq('id', app.id)
      showToast('Application rejected', 'info')
      setSelectedApp(null)
      setRejectReason('')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />
  if (loading) return <div className="admin-page loading"><div className="spinner" /></div>

  const filtered = applications.filter(a => a.status === filter)

  return (
    <div className="admin-page applications-page">
      <header className="page-header"><h1>Partner Applications</h1></header>

      <div className="filter-panel">
        {['applied', 'approved', 'rejected'].map(s => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)} ({applications.filter(a => a.status === s).length})</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>No {filter} applications</h3></div>
      ) : (
        <div className="applications-list">
          {filtered.map(app => (
            <div key={app.id} className="application-card" onClick={() => setSelectedApp(app)}>
              <div className="app-header"><h3>{app.full_name}</h3><span className={`status ${app.status}`}>{app.status}</span></div>
              <p className="phone">{app.phone}</p>
              <p className="categories">{app.service_categories?.join(', ')}</p>
              <p className="applied">Applied: {formatRelativeTime(app.applied_at)}</p>
            </div>
          ))}
        </div>
      )}

      {selectedApp && (
        <div className="application-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => { setSelectedApp(null); setRejectReason('') }}><X size={24} /></button>
            <h2>{selectedApp.full_name}</h2>
            <div className="app-details">
              <div className="detail-row"><span>Phone:</span><span>{selectedApp.phone}</span></div>
              {selectedApp.email && <div className="detail-row"><span>Email:</span><span>{selectedApp.email}</span></div>}
              <div className="detail-row"><span>Address:</span><span>{selectedApp.address}, {selectedApp.city} - {selectedApp.pincode}</span></div>
              <div className="detail-row"><span>Experience:</span><span>{selectedApp.experience_years} years</span></div>
              <div className="detail-row"><span>Categories:</span><span>{selectedApp.service_categories?.join(', ')}</span></div>
              <div className="detail-row"><span>Service Areas:</span><span>{selectedApp.service_areas?.join(', ')}</span></div>
              {selectedApp.about_me && <div className="detail-row full"><span>About:</span><span>{selectedApp.about_me}</span></div>}
            </div>
            {selectedApp.status === 'applied' && (
              <>
                <div className="form-group">
                  <label>Rejection Reason (if rejecting)</label>
                  <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g., Insufficient experience" />
                </div>
                <div className="btn-row">
                  <button className="btn btn-danger" onClick={() => rejectApplication(selectedApp)}>Reject</button>
                  <button className="btn btn-success" onClick={() => approveApplication(selectedApp)}>Approve</button>
                </div>
              </>
            )}
            {selectedApp.status === 'rejected' && <p className="reject-reason">Rejection: {selectedApp.reject_reason}</p>}
          </div>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== ADMIN WITHDRAWAL MANAGEMENT ====================
function AdminWithdrawalsPage() {
  const { user, profile } = useAuth()
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [txnRef, setTxnRef] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await supabase.from('withdrawal_requests').select('*, partner:partners(*), bank:partner_bank_accounts(*)').order('created_at', { ascending: false })
      setWithdrawals(data || [])
    } catch {}
    setLoading(false)
  }

  async function approveWithdrawal(w: any) {
    try {
      const { error } = await supabase.from('withdrawal_requests').update({
        status: 'approved',
        processed_at: new Date().toISOString(),
        transaction_reference: txnRef
      }).eq('id', w.id)
      if (error) throw error
      showToast('Withdrawal approved', 'success')
      setTxnRef('')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function rejectWithdrawal(w: any, reason: string) {
    try {
      await supabase.from('withdrawal_requests').update({ status: 'rejected', reject_reason: reason, processed_at: new Date().toISOString() }).eq('id', w.id)
      // Refund to partner wallet
      await supabase.from('partners').update({ wallet_balance: supabase.rpc('increment_wallet', { amount: w.amount }) }).eq('id', w.partner_id)
      showToast('Withdrawal rejected, amount refunded', 'info')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function markPaid(w: any) {
    try {
      await supabase.from('withdrawal_requests').update({ status: 'paid', processed_at: new Date().toISOString() }).eq('id', w.id)
      showToast('Marked as paid', 'success')
      load()
    } catch {}
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />
  if (loading) return <div className="admin-page loading"><div className="spinner" /></div>

  const filtered = withdrawals.filter(w => w.status === filter)

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Withdrawal Requests</h1></header>

      <div className="filter-panel">
        {['pending', 'approved', 'paid', 'rejected'].map(s => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s} ({withdrawals.filter(w => w.status === s).length})</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><DollarSign size={48} /><h3>No {filter} requests</h3></div>
      ) : (
        <div className="withdrawals-admin-list">
          {filtered.map(w => (
            <div key={w.id} className="withdrawal-admin-card">
              <div className="w-header"><span className="partner-name">{w.partner?.full_name}</span><span className="amount">₹{w.amount.toLocaleString()}</span></div>
              <p className="bank-info">{w.bank?.bank_name} ****{w.bank?.account_number?.slice(-4)}</p>
              <p className="ifsc">IFSC: {w.bank?.ifsc_code}</p>
              <p className="date">{formatDate(w.created_at)}</p>
              {w.status === 'pending' && (
                <div className="actions">
                  <input type="text" placeholder="Transaction Reference" value={txnRef} onChange={e => setTxnRef(e.target.value)} />
                  <div className="btn-row">
                    <button className="btn btn-danger btn-sm" onClick={() => { const reason = prompt('Rejection reason:'); reason && rejectWithdrawal(w, reason) }}>Reject</button>
                    <button className="btn btn-success btn-sm" onClick={() => approveWithdrawal(w)}>Approve</button>
                  </div>
                </div>
              )}
              {w.status === 'approved' && <button className="btn btn-primary btn-sm" onClick={() => markPaid(w)}>Mark as Paid</button>}
              {w.transaction_reference && <p className="txn-ref">Ref: {w.transaction_reference}</p>}
            </div>
          ))}
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== ADMIN CATEGORIES ====================
function AdminCategoriesPage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '', display_order: 0 })
  const [formError, setFormError] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await supabase.from('service_categories').select('*').order('display_order')
      setCategories(data || [])
    } catch {}
    setLoading(false)
  }

  async function saveCategory() {
    setFormError('')
    if (!formData.name || !formData.slug) { setFormError('Name and slug are required'); return }
    try {
      if (editingId) {
        await supabase.from('service_categories').update(formData).eq('id', editingId)
        showToast('Category updated', 'success')
      } else {
        await supabase.from('service_categories').insert(formData)
        showToast('Category created', 'success')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', slug: '', description: '', icon: '', display_order: 0 })
      load()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? All services in this category will also be deleted.')) return
    try {
      await supabase.from('service_categories').delete().eq('id', id)
      showToast('Category deleted', 'info')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />
  if (loading) return <div className="admin-page loading"><div className="spinner" /></div>

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Service Categories</h1><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Plus size={16} /> Add</button></header>

      {showForm && (
        <div className="form-section">
          <h3>{editingId ? 'Edit' : 'Add'} Category</h3>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Cleaning" /></div>
            <div className="form-group"><label>Slug</label><input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="cleaning" /></div>
          </div>
          <div className="form-group"><label>Description</label><input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description" /></div>
          <div className="form-row">
            <div className="form-group"><label>Icon (emoji)</label><input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="🧹" /></div>
            <div className="form-group"><label>Order</label><input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} /></div>
          </div>
          {formError && <div className="error-message">{formError}</div>}
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', slug: '', description: '', icon: '', display_order: 0 }) }}>Cancel</button>
            <button className="btn btn-primary" onClick={saveCategory}>Save</button>
          </div>
        </div>
      )}

      <div className="categories-list">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <span className="cat-icon">{cat.icon || '📁'}</span>
            <div className="cat-info"><h3>{cat.name}</h3><p>{cat.slug}</p></div>
            <div className="cat-actions">
              <button className="btn btn-sm btn-outline" onClick={() => { setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '', display_order: cat.display_order }); setEditingId(cat.id); setShowForm(true) }}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// ==================== ADMIN SERVICES ====================
function AdminServicesPage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [catFilter, setCatFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', category_id: '', description: '', base_price: 0, unit: 'per service', duration_minutes: 60, is_active: true })
  const [formError, setFormError] = useState('')

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const [catRes, svcRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('display_order'),
        supabase.from('services').select('*, category:service_categories(*)').order('created_at', { ascending: false })
      ])
      setCategories(catRes.data || [])
      setServices(svcRes.data || [])
    } catch {}
    setLoading(false)
  }

  async function saveService() {
    setFormError('')
    if (!formData.name || !formData.slug || !formData.category_id) { setFormError('Name, slug, and category are required'); return }
    try {
      if (editingId) {
        await supabase.from('services').update(formData).eq('id', editingId)
        showToast('Service updated', 'success')
      } else {
        await supabase.from('services').insert(formData)
        showToast('Service created', 'success')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', slug: '', category_id: '', description: '', base_price: 0, unit: 'per service', duration_minutes: 60, is_active: true })
      load()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service?')) return
    try {
      await supabase.from('services').delete().eq('id', id)
      showToast('Service deleted', 'info')
      load()
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await supabase.from('services').update({ is_active: !current }).eq('id', id)
      showToast(`Service ${!current ? 'activated' : 'deactivated'}`, 'success')
      load()
    } catch {}
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />
  if (loading) return <div className="admin-page loading"><div className="spinner" /></div>

  const filtered = catFilter === 'all' ? services : services.filter(s => s.category_id === catFilter)

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Services</h1><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Plus size={16} /> Add</button></header>

      <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="cat-filter">
        <option value="all">All Categories</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {showForm && (
        <div className="form-section">
          <h3>{editingId ? 'Edit' : 'Add'} Service</h3>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Deep Cleaning" /></div>
            <div className="form-group"><label>Slug</label><input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="deep-cleaning" /></div>
          </div>
          <div className="form-group"><label>Category</label>
            <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Description</label><input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Service description" /></div>
          <div className="form-row">
            <div className="form-group"><label>Base Price (₹)</label><input type="number" value={formData.base_price} onChange={e => setFormData({...formData, base_price: parseFloat(e.target.value) || 0})} /></div>
            <div className="form-group"><label>Unit</label><input type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="per service" /></div>
            <div className="form-group"><label>Duration (mins)</label><input type="number" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value) || 60})} /></div>
          </div>
          <label className="checkbox-label"><input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} /> Active</label>
          {formError && <div className="error-message">{formError}</div>}
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null) }}>Cancel</button>
            <button className="btn btn-primary" onClick={saveService}>Save</button>
          </div>
        </div>
      )}

      <div className="services-list">
        {filtered.map(s => (
          <div key={s.id} className={`service-card ${!s.is_active ? 'inactive' : ''}`}>
            <div className="svc-info">
              <h3>{s.name}</h3>
              <p className="cat">{s.category?.name}</p>
              <p className="price">₹{s.base_price} {s.unit}</p>
            </div>
            <div className="svc-actions">
              <button className={`btn btn-sm ${s.is_active ? 'btn-outline' : 'btn-secondary'}`} onClick={() => toggleActive(s.id, s.is_active)}>{s.is_active ? 'Active' : 'Inactive'}</button>
              <button className="btn btn-sm btn-outline" onClick={() => { setFormData({ name: s.name, slug: s.slug, category_id: s.category_id, description: s.description || '', base_price: s.base_price, unit: s.unit, duration_minutes: s.duration_minutes, is_active: s.is_active }); setEditingId(s.id); setShowForm(true) }}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteService(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1B3A5C', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#C9972C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 16 }}>ONE CALL</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Home Solutions</div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<MobileLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:category" element={<ServiceDetailPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/booking/detail" element={<BookingDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/partner-register" element={<PartnerRegistrationPage />} />
      </Route>
      <Route path="/partner" element={<PartnerLayout />}>
        <Route index element={<PartnerDashboard />} />
        <Route path="jobs" element={<PartnerJobsPage />} />
        <Route path="active" element={<PartnerActiveJobsPage />} />
        <Route path="earnings" element={<PartnerEarningsPage />} />
        <Route path="history" element={<PartnerHistoryPage />} />
        <Route path="profile" element={<PartnerProfilePage />} />
        <Route path="kyc" element={<PartnerKYCPage />} />
        <Route path="bank" element={<PartnerBankPage />} />
        <Route path="withdrawals" element={<PartnerWithdrawalsPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="kyc" element={<AdminKYCPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="services" element={<AdminServicesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}