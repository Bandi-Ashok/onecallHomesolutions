import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link, useLocation, Outlet, useSearchParams } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import { servicesApi, bookingApi, notificationApi, partnerApi, dashboardApi, couponApi, userApi, walletApi, referralApi } from './lib/api'
import { generateBookingNumber, getAvailableDates, timeSlots, formatDate, formatRelativeTime } from './lib/utils'
import { AuthPage } from './pages/auth/AuthPage'
import { Hop as Home, Wrench, Calendar, Bell, User, Phone, Shield, Clock, Star, ChevronRight, TriangleAlert as AlertTriangle, ArrowRight, Gift, Users, Wallet, Search, X, Check, MapPin, DollarSign, TrendingUp, Settings, LogOut, ChartBar as BarChart3, Send, Plus, CircleCheck as CheckCircle, Circle as XCircle, Tag, Mail } from 'lucide-react'
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
    </div>
  )
}

function HomePage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const { data } = await servicesApi.getCategories()
      setCategories(data || [])
    } catch {}
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
            <div className="wallet-info"><Wallet size={20} /><div><span className="label">Wallet</span><span className="amount">₹0</span></div></div>
          </Link>
        )}
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search services..." />
        </div>
      </header>

      <section className="quick-services">
        <div className="section-title"><h2>Quick Services</h2><Link to="/services">View All <ChevronRight size={14} /></Link></div>
        <div className="quick-grid">
          {quickServices.map(s => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="quick-item">
              <div className="quick-icon">{s.icon}</div>
              <span>{s.label}</span>
            </Link>
          ))}
        </div>
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

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await servicesApi.getCategories()
      setCategories(data || [])
    } catch {}
    setLoading(false)
  }

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

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
          filtered.map(cat => (
            <Link key={cat.id} to={`/services/${cat.slug}`} className="category-card">
              <div className="category-icon">{iconMap[cat.slug] || '🔧'}</div>
              <div className="category-info"><h3>{cat.name}</h3><p>{cat.description?.substring(0, 60)}...</p></div>
              {cat.is_emergency_available && <span className="badge emergency">24/7</span>}
              <ChevronRight size={20} />
            </Link>
          ))
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

  useEffect(() => { load() }, [category])

  async function load() {
    try {
      const { data: cats } = await servicesApi.getCategories()
      const found = cats?.find(c => c.slug === category)
      if (found) {
        setCat(found)
        const { data: servs } = await servicesApi.getByCategory(found.id)
        setServices(servs || [])
      }
    } catch {}
    setLoading(false)
  }

  if (loading) return <div className="mobile-page loading"><div className="spinner" /></div>
  if (!cat) return <div className="mobile-page"><h2>Category not found</h2><Link to="/services" className="btn btn-primary">Browse Services</Link></div>

  return (
    <div className="mobile-page">
      <header className="page-header with-back">
        <Link to="/services" className="back-btn">←</Link>
        <div className="header-content"><span className="category-icon-lg">{iconMap[category] || '🔧'}</span><h1>{cat.name}</h1></div>
      </header>
      {cat.is_emergency_available && <div className="emergency-bar"><Shield size={16} />24/7 Emergency Available</div>}
      <div className="services-list">
        {services.map(s => (
          <div key={s.id} className="service-card">
            <div className="service-info"><h3>{s.name}</h3><p>{s.description}</p></div>
            <div className="service-action">
              <div className="price">₹{s.base_price.toLocaleString()}<span className="unit">/{s.unit.replace('per ', '')}</span></div>
              <Link to={`/booking?service=${s.id}`} className="btn btn-primary">Book</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function BookingsPage() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile) load() }, [user, profile])

  async function load() {
    try {
      const { data } = await bookingApi.getByCustomer(profile!.id)
      setBookings(data || [])
    } catch {}
    setLoading(false)
  }

  if (!user) return <div className="mobile-page auth-required"><Calendar size={48} /><h2>Sign in to view bookings</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  return (
    <div className="mobile-page">
      <header className="page-header"><h1>My Bookings</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : bookings.length === 0 ? (
        <div className="empty-state"><Calendar size={48} /><h3>No bookings yet</h3><Link to="/services" className="btn btn-primary">Browse Services</Link></div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-header"><span className="booking-id">#{b.booking_number}</span><span className={`status ${b.status}`}>{b.status}</span></div>
              <h3 className="service-name">{b.service?.name || 'Service'}</h3>
              <div className="booking-details">
                <div className="detail"><Calendar size={14} /><span>{b.scheduled_date}</span></div>
                <div className="detail"><Clock size={14} /><span>{b.scheduled_time_slot}</span></div>
              </div>
              <div className="booking-footer"><span className="amount">₹{(b.final_price || 0).toLocaleString()}</span></div>
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

  useEffect(() => { if (user) load() }, [user])

  async function load() {
    try {
      const { data } = await notificationApi.getForUser(user!.id)
      setNotifications(data || [])
    } catch {}
    setLoading(false)
  }

  return (
    <div className="mobile-page">
      <header className="page-header"><h1>Notifications</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : notifications.length === 0 ? (
        <div className="empty-state"><Bell size={48} /><h3>No notifications</h3></div>
      ) : (
        <div className="notifications-list">
          {notifications.map(n => (
            <div key={n.id} className={`notification-item ${!n.is_read ? 'unread' : ''}`}>
              <div className="noti-icon"><Bell size={20} /></div>
              <div className="noti-content"><h4>{n.title}</h4><p>{n.body}</p></div>
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
  const navigate = () => window.location.href = '/auth'

  async function handleLogout() {
    await logout()
    navigate()
  }

  if (!user) return <div className="mobile-page auth-required"><User size={48} /><h2>Sign in</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>

  return (
    <div className="mobile-page">
      <div className="profile-header">
        <div className="profile-avatar"><User size={32} /></div>
        <div className="profile-info">
          <h1>{profile?.full_name || 'User'}</h1>
          <p className="email">{profile?.email || user.email}</p>
        </div>
      </div>
      <div className="stats-card">
        <Link to="/wallet" className="stat-item"><Wallet size={20} /><span className="stat-label">Wallet</span></Link>
        <Link to="/referral" className="stat-item"><Users size={20} /><span className="stat-label">Referrals</span></Link>
        <Link to="/coupons" className="stat-item"><Gift size={20} /><span className="stat-label">Coupons</span></Link>
      </div>
      <div className="menu-section">
        <h3>Account</h3>
        <div className="menu-list">
          <Link to="/wallet" className="menu-item"><div className="menu-icon"><Wallet size={20} /></div><span>Wallet</span><ChevronRight size={18} /></Link>
          <Link to="/coupons" className="menu-item"><div className="menu-icon"><Gift size={20} /></div><span>My Coupons</span><ChevronRight size={18} /></Link>
          <Link to="/referral" className="menu-item"><div className="menu-icon"><Users size={20} /></div><span>Refer & Earn</span><ChevronRight size={18} /></Link>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}><span>Sign Out</span></button>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function EmergencyPage() {
  const [step, setStep] = useState<'select' | 'location' | 'done'>('select')
  const [issue, setIssue] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()

  const types = [
    { icon: '💧', label: 'Water Leakage' },
    { icon: '⚡', label: 'Electrical Fault' },
    { icon: '🚽', label: 'Bathroom Emergency' },
    { icon: '❄️', label: 'AC Breakdown' },
  ]

  async function submit() {
    if (!address || !city || !issue) return
    setLoading(true)
    try {
      await bookingApi.create({
        customer_id: profile?.id,
        final_price: 999,
        is_emergency: true,
        notes: `Emergency: ${issue}`,
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time_slot: 'EMERGENCY',
        address, city, pincode: '',
        status: 'pending',
      })
      setStep('done')
    } catch {}
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
          <h2>Your Location</h2>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
          <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
          <button className="btn btn-danger btn-block btn-lg" onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Request Emergency Service'}</button>
        </div>
      )}
      {step === 'done' && (
        <div className="emergency-success">
          <div className="success-icon"><Check size={32} /></div>
          <h2>Help is on the way!</h2>
          <a href="tel:+911234567890" className="emergency-phone"><Phone size={24} />+91 1234567890</a>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Booking Page with full flow
function BookingPage() {
  const { user, profile } = useAuth()
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('service')
  const [service, setService] = useState<any>(null)
  const [step, setStep] = useState<'details' | 'schedule' | 'address' | 'confirm'>('details')
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [error, setError] = useState('')

  // Form state
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '', pincode: '' })
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [useWallet, _setUseWallet] = useState(false)

  const dates = getAvailableDates()

  useEffect(() => { if (serviceId) loadService() }, [serviceId])
  useEffect(() => { if (user && profile) loadAddresses() }, [user, profile])

  async function loadService() {
    try {
      const { data } = await servicesApi.getById(serviceId!)
      setService(data)
    } catch {}
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
    try {
      const { data } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).single()
      if (data) {
        setAppliedCoupon(data)
        setError('')
      } else {
        setError('Invalid coupon code')
      }
    } catch {
      setError('Invalid coupon code')
    }
  }

  function calculateTotal() {
    let total = service?.base_price || 0
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'percentage') {
        total = total - (total * appliedCoupon.discount_value / 100)
      } else {
        total = total - appliedCoupon.discount_value
      }
    }
    if (useWallet) {
      total = Math.max(0, total - 100)
    }
    return Math.round(total)
  }

  async function submitBooking() {
    if (!selectedAddress || !selectedDate || !selectedTime) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      const bookingNumber = generateBookingNumber()
      const addr = addresses.find(a => a.id === selectedAddress) || newAddress

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
        wallet_used: useWallet ? 100 : 0,
      })

      if (insertError) throw insertError

      window.location.href = '/bookings'
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="mobile-page auth-required">
        <Calendar size={48} />
        <h2>Sign in to book a service</h2>
        <Link to="/auth" className="btn btn-primary">Sign In</Link>
      </div>
    )
  }

  if (!service) {
    return <div className="mobile-page loading"><div className="spinner" /></div>
  }

  return (
    <div className="mobile-page booking-page">
      <header className="page-header with-back">
        <Link to={`/services/${service.category?.slug || 'services'}`} className="back-btn">←</Link>
        <div className="header-content">
          <h1>Book Service</h1>
        </div>
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
                <span className="base-price">₹{service.base_price}</span>
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
              <label>Select Date</label>
              <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
                <option value="">Choose a date</option>
                {dates.map(d => (
                  <option key={d} value={d}>{formatDate(d)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Time Slot</label>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
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
                  <div
                    key={addr.id}
                    className={`address-option ${selectedAddress === addr.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <span className="address-label">{addr.label || 'Home'}</span>
                    <p>{addr.address}, {addr.city}</p>
                    {addr.is_default && <span className="default-tag">Default</span>}
                  </div>
                ))}
              </div>
            )}
            <div className="new-address-form">
              <h3>{addresses.length > 0 ? 'Or add new address' : 'Add Address'}</h3>
              <div className="form-row">
                <input type="text" value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Label (Home/Office)" />
              </div>
              <div className="form-group">
                <textarea value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} placeholder="Full Address" rows={2} />
              </div>
              <div className="form-row">
                <input type="text" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="City" />
                <input type="text" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} placeholder="Pincode" maxLength={6} />
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
              <div className="summary-item"><span>Address</span><span>{addresses.find(a => a.id === selectedAddress)?.address || newAddress.address}</span></div>
              <div className="summary-divider"></div>
              <div className="summary-item"><span>Base Price</span><span>₹{service.base_price}</span></div>
              {appliedCoupon && (
                <div className="summary-item discount"><span>Coupon Discount</span><span>-₹{appliedCoupon.discount_type === 'percentage' ? Math.round(service.base_price * appliedCoupon.discount_value / 100) : appliedCoupon.discount_value}</span></div>
              )}
              <div className="summary-item total"><span>Total</span><span>₹{calculateTotal()}</span></div>
            </div>

            <div className="coupon-section">
              <h4>Apply Coupon</h4>
              <div className="coupon-input">
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" />
                <button className="btn btn-sm btn-outline" onClick={applyCoupon}>Apply</button>
              </div>
              {appliedCoupon && <div className="coupon-applied"><Check size={16} /> {appliedCoupon.code} applied</div>}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep('address')}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={submitBooking} disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${calculateTotal()}`}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Wallet Page
function WalletPage() {
  const { user, profile } = useAuth()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile) load() }, [user, profile])

  async function load() {
    try {
      let walletData = null
      const { data: existing } = await walletApi.getBalance(profile!.id)
      if (!existing) {
        const { data: newWallet } = await walletApi.createWallet(profile!.id)
        walletData = newWallet
      } else {
        walletData = existing
      }
      setWallet(walletData)

      if (walletData) {
        const { data: txns } = await walletApi.getTransactions(walletData.id)
        setTransactions(txns || [])
      }
    } catch {}
    setLoading(false)
  }

  if (!user) {
    return <div className="mobile-page auth-required"><Wallet size={48} /><h2>Sign in to view wallet</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>
  }

  return (
    <div className="mobile-page wallet-page">
      <header className="page-header"><h1>Wallet</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <>
          <div className="wallet-balance-card">
            <p>Available Balance</p>
            <h2>₹{wallet?.balance || 0}</h2>
            <button className="btn btn-primary">Add Money</button>
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
                    <span className={`txn-amount ${t.type === 'credit' || t.type === 'cashback' || t.type === 'referral' ? 'positive' : 'negative'}`}>
                      {t.type === 'debit' ? '-' : '+'}₹{t.amount}
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

// Coupons Page
function CouponsPage() {
  const { user } = useAuth()
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([])
  const [myCoupons, setMyCoupons] = useState<any[]>([])
  const [tab, setTab] = useState<'available' | 'my'>('available')
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user) load() }, [user])

  async function load() {
    try {
      const { data: coupons } = await couponApi.getAll()
      setAvailableCoupons(coupons || [])
      const { data: userCoupons } = await supabase.from('user_coupons').select('*, coupon:coupons(*)').eq('user_id', user!.id)
      setMyCoupons(userCoupons || [])
    } catch {}
    setLoading(false)
  }

  async function claimCoupon(couponId: string) {
    try {
      await supabase.from('user_coupons').insert({ user_id: user!.id, coupon_id: couponId })
      load()
    } catch {}
  }

  if (!user) {
    return <div className="mobile-page auth-required"><Gift size={48} /><h2>Sign in to view coupons</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>
  }

  return (
    <div className="mobile-page coupons-page">
      <header className="page-header"><h1>Coupons</h1></header>
      <div className="tabs">
        <button className={`tab ${tab === 'available' ? 'active' : ''}`} onClick={() => setTab('available')}>Available</button>
        <button className={`tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Coupons</button>
      </div>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="coupons-list">
          {tab === 'available' ? (
            availableCoupons.map(c => (
              <div key={c.id} className="coupon-card">
                <div className="coupon-value">
                  <span>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</span>
                  <small>OFF</small>
                </div>
                <div className="coupon-info">
                  <h4>{c.description || c.code}</h4>
                  <p>Min order: ₹{c.min_order_value}</p>
                  <span className="validity">Valid until {formatDate(c.valid_until)}</span>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => claimCoupon(c.id)}>Claim</button>
              </div>
            ))
          ) : (
            myCoupons.map(uc => (
              <div key={uc.id} className={`coupon-card ${uc.is_used ? 'used' : 'claimed'}`}>
                <div className="coupon-value">
                  <span>{uc.coupon?.discount_type === 'percentage' ? `${uc.coupon.discount_value}%` : `₹${uc.coupon.discount_value}`}</span>
                </div>
                <div className="coupon-info">
                  <h4>{uc.coupon?.code}</h4>
                  <p>{uc.is_used ? 'Used' : 'Available'}</p>
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

// Referral Page
function ReferralPage() {
  const { user, profile } = useAuth()
  const [referralCode, setReferralCode] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile) load() }, [user, profile])

  async function load() {
    try {
      const { data: code } = await referralApi.getCode(profile!.id)
      if (!code) {
        const newCode = `REF${profile!.id.slice(0, 6).toUpperCase()}`
        const { data: newRef } = await supabase.from('referral_codes').insert({ user_id: profile!.id, code: newCode }).select().single()
        setReferralCode(newRef)
      } else {
        setReferralCode(code)
      }

      const { data: refs } = await supabase.from('referrals').select('*, referee:profiles!referee_id(full_name)').eq('referrer_id', profile!.id)
      setReferrals(refs || [])
    } catch {}
    setLoading(false)
  }

  const copyCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code)
    }
  }

  const shareLink = () => {
    const text = `Use my referral code ${referralCode?.code} to get ₹100 off on your first booking with One Call Home Solutions!`
    if (navigator.share) {
      navigator.share({ title: 'One Call Referral', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  if (!user) {
    return <div className="mobile-page auth-required"><Users size={48} /><h2>Sign in to view referrals</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>
  }

  return (
    <div className="mobile-page referral-page">
      <header className="referral-hero">
        <h2>Refer & Earn</h2>
        <p>Get ₹100 for every friend who books!</p>
      </header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <>
          <div className="referral-card">
            <h3>Your Referral Code</h3>
            <div className="referral-code-display">{referralCode?.code || 'Loading...'}</div>
            <div className="referral-actions">
              <button className="btn btn-outline" onClick={copyCode}><Check size={18} /> Copy Code</button>
              <button className="btn btn-primary" onClick={shareLink}><ArrowRight size={18} /> Share</button>
            </div>
          </div>
          <div className="earnings-card">
            <div className="earning-stat">
              <span className="value">₹{referralCode?.total_earnings || 0}</span>
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
              <div className="empty-state"><p>No referrals yet. Share your code with friends!</p></div>
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

// Legal Pages
function PrivacyPolicyPage() {
  return (
    <div className="mobile-page legal-page">
      <header className="page-header with-back">
        <Link to="/profile" className="back-btn">←</Link>
        <h1>Privacy Policy</h1>
      </header>
      <div className="legal-content">
        <p><strong>Effective Date:</strong> June 20, 2025</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, including name, phone, email, address, and payment details when you use our services.</p>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and manage home services</li>
          <li>To communicate with you about bookings</li>
          <li>To send promotional offers (with your consent)</li>
          <li>To improve our services</li>
        </ul>
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
      <header className="page-header with-back">
        <Link to="/profile" className="back-btn">←</Link>
        <h1>Terms & Conditions</h1>
      </header>
      <div className="legal-content">
        <p><strong>Effective Date:</strong> June 20, 2025</p>
        <h2>1. Service Agreement</h2>
        <p>By using One Call Home Solutions, you agree to these terms for booking home services.</p>
        <h2>2. Booking & Payment</h2>
        <ul>
          <li>Payment is collected upon service completion</li>
          <li>Cancellations within 2 hours may incur a fee</li>
          <li>Prices are estimates; final charges may vary</li>
        </ul>
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
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await supabase.from('contact_messages').insert({ ...formData, created_at: new Date().toISOString() })
      setSubmitted(true)
    } catch {}
    setSubmitting(false)
  }

  return (
    <div className="mobile-page contact-page">
      <header className="page-header with-back">
        <Link to="/profile" className="back-btn">←</Link>
        <h1>Contact Us</h1>
      </header>
      {submitted ? (
        <div className="success-state">
          <Check size={48} />
          <h2>Message Sent!</h2>
          <p>We'll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} maxLength={10} />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={4} required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
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

// Partner Module
function PartnerLayout() {
  return (
    <div className="partner-app">
      <header className="partner-header">
        <div className="partner-brand">
          <Shield size={24} />
          <span>Partner App</span>
        </div>
        <Link to="/partner/profile" className="profile-link"><User size={20} /></Link>
      </header>
      <main className="partner-content"><Outlet /></main>
      <nav className="partner-nav">
        <Link to="/partner" className="partner-nav-item"><Home size={20} /><span>Home</span></Link>
        <Link to="/partner/jobs" className="partner-nav-item"><Wrench size={20} /><span>Jobs</span></Link>
        <Link to="/partner/earnings" className="partner-nav-item"><DollarSign size={20} /><span>Earnings</span></Link>
        <Link to="/partner/history" className="partner-nav-item"><Clock size={20} /><span>History</span></Link>
      </nav>
    </div>
  )
}

function PartnerDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ totalEarnings: 0, totalJobs: 0, completedJobs: 0, avgRating: 0 })
  const [partnerData, setPartnerData] = useState<any>(null)
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && profile?.role === 'partner') load()
  }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      setPartnerData(partner)
      const statsData = await dashboardApi.getPartnerStats(partner.id)
      setStats(statsData)
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'partner') {
    return <div className="mobile-page auth-required"><Shield size={48} /><h2>Partner Access Required</h2><Link to="/auth" className="btn btn-primary">Sign In as Partner</Link></div>
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
              await partnerApi.setAvailability(partnerData.id, !partnerData.is_available)
              load()
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

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data: partner } = await partnerApi.getProfile(user!.id)
      const { data } = await partnerApi.getJobRequests(partner.id)
      setRequests(data || [])
    } catch {}
    setLoading(false)
  }

  async function handleAction(requestId: string, accept: boolean) {
    try {
      await supabase.rpc('handle_job_request', { request_id: requestId, accept })
      load()
    } catch {}
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Job Requests</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : requests.length === 0 ? (
        <div className="empty-state"><Wrench size={48} /><h3>No pending requests</h3></div>
      ) : (
        <div className="job-requests">
          {requests.map(r => (
            <div key={r.id} className="job-request-card">
              <div className="job-header"><span className="booking-id">#{r.booking?.booking_number}</span><span className="price">₹{r.booking?.final_price || 0}</span></div>
              <h3>{r.booking?.service?.name}</h3>
              <div className="job-details">
                <div className="detail"><MapPin size={14} /><span>{r.booking?.address}</span></div>
                <div className="detail"><Calendar size={14} /><span>{r.booking?.scheduled_date}</span></div>
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
      const { data } = await partnerApi.getEarnings(partner.id)
      setEarnings(data || [])
      setTotal(data?.filter((e: any) => e.type === 'job_payment').reduce((sum: number, e: any) => sum + e.amount, 0) || 0)
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Earnings</h1></header>
      <div className="earnings-summary">
        <div className="total-earnings"><DollarSign size={32} /><span className="amount">₹{total.toLocaleString()}</span></div>
        <p className="label">Total Earnings</p>
      </div>
      <div className="earnings-list">
        {loading ? <div className="loading-state"><div className="spinner" /></div> : earnings.map(e => (
          <div key={e.id} className={`earning-item ${e.type}`}>
            <div className="earning-icon">{e.type === 'job_payment' ? <DollarSign size={20} /> : e.type === 'bonus' ? <Gift size={20} /> : <TrendingUp size={20} />}</div>
            <div className="earning-info"><span className="type">{e.type.replace('_', ' ')}</span><span className="desc">{e.description}</span></div>
            <span className={`amount ${e.type === 'penalty' ? 'negative' : ''}`}>₹{e.amount}</span>
          </div>
        ))}
      </div>
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
      const { data } = await partnerApi.getHistory(partner.id)
      setHistory(data || [])
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <header className="page-header"><h1>Job History</h1></header>
      {loading ?<div className="loading-state"><div className="spinner" /></div> : history.length === 0 ? (
        <div className="empty-state"><Clock size={48} /><h3>No jobs completed yet</h3></div>
      ) : (
        <div className="history-list">
          {history.map(h=> (
            <div key={h.id} className="history-card">
              <div className="history-header"><span className="booking-id">#{h.booking_number}</span><span className={`status ${h.status}`}>{h.status}</span></div>
              <h3>{h.service?.name}</h3>
              <div className="history-details">
                <div className="detail"><Calendar size={14} /><span>{h.scheduled_date}</span></div>
                <div className="detail"><DollarSign size={14} /><span>₹{h.final_price || 0}</span></div>
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

  useEffect(() => { if (user && profile?.role === 'partner') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await partnerApi.getProfile(user!.id)
      setPartnerData(data)
    } catch {}
  }

  async function handleLogout() {
    await logout()
    window.location.href = '/auth'
  }

  if (!user || profile?.role !== 'partner') return <Navigate to="/auth" />

  return (
    <div className="partner-page">
      <div className="profile-header">
        <div className="profile-avatar">{partnerData?.full_name?.charAt(0) || 'P'}</div>
        <div className="profile-info">
          <h1>{partnerData?.full_name || 'Partner'}</h1>
          <p className="phone">{partnerData?.phone}</p>
          <div className="rating"><Star size={16} /><span>{partnerData?.rating?.toFixed(1) || '0.0'}</span></div>
        </div>
      </div>
      <div className="menu-section">
        <h3>Settings</h3>
        <div className="menu-list">
          <Link to="/partner" className="menu-item"><Settings size={20} /><span>Dashboard</span><ChevronRight size={18} /></Link>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}><LogOut size={20} /><span>Sign Out</span></button>
      <div className="bottom-spacer"></div>
    </div>
  )
}

// Admin Module
function AdminLayout() {
  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-brand"><Shield size={24} /><span>Admin Dashboard</span></div>
        <div className="admin-actions"><Link to="/admin/notifications" className="admin-link"><Send size={20} /></Link><Link to="/admin/coupons" className="admin-link"><Tag size={20} /></Link></div>
      </header>
      <main className="admin-content"><Outlet /></main>
      <nav className="admin-nav">
        <Link to="/admin" className="admin-nav-item"><BarChart3 size={20} /><span>Dashboard</span></Link>
        <Link to="/admin/users" className="admin-nav-item"><Users size={20} /><span>Users</span></Link>
        <Link to="/admin/partners" className="admin-nav-item"><Wrench size={20} /><span>Partners</span></Link>
        <Link to="/admin/bookings" className="admin-nav-item"><Calendar size={20} /><span>Bookings</span></Link>
      </nav>
    </div>
  )
}

function AdminDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, completedBookings: 0, totalUsers: 0, totalPartners: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const data = await dashboardApi.getAdminStats()
      setStats(data)
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <h1>Dashboard Overview</h1>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="admin-stats">
          <div className="stat-card revenue"><DollarSign size={32} /><div className="value">₹{stats.totalRevenue.toLocaleString()}</div><div className="label">Total Revenue</div></div>
          <div className="stat-card bookings"><Calendar size={32} /><div className="value">{stats.totalBookings}</div><div className="label">Total Bookings</div></div>
          <div className="stat-card users"><Users size={32} /><div className="value">{stats.totalUsers}</div><div className="label">Total Users</div></div>
          <div className="stat-card partners"><Wrench size={32} /><div className="value">{stats.totalPartners}</div><div className="label">Partners</div></div>
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

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await userApi.getAll()
      setUsers(data || [])
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Users</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="table-container">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.full_name || '-'}</td>
                  <td>{u.email || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td><span className={`badge role-${u.role}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
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

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await partnerApi.getAll()
      setPartners(data || [])
    } catch {}
    setLoading(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Partners</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="partners-grid">
          {partners.map(p => (
            <div key={p.id} className="partner-card">
              <div className="partner-header">
                <div className="avatar">{p.full_name?.charAt(0) || 'P'}</div>
                <div className="partner-info"><h3>{p.full_name}</h3><p>{p.phone}</p></div>
              </div>
              <div className="partner-stats"><Star size={14} /><span>{p.rating?.toFixed(1)}</span><Wrench size={14} /><span>{p.total_jobs} jobs</span></div>
              <div className="partner-actions">
                <span className={`badge status-${p.is_available ? 'online' : 'offline'}`}>{p.is_available ? 'Online' : 'Offline'}</span>
                <span className={`badge verified-${p.is_verified ? 'yes' : 'no'}`}>{p.is_verified ? 'Verified' : 'Pending'}</span>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await bookingApi.getAll()
      setBookings(data || [])
    } catch {}
    setLoading(false)
  }

  async function updateStatus(bookingId: string, status: string) {
    try {
      await bookingApi.updateStatus(bookingId, status)
      load()
    } catch {}
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Bookings</h1></header>
      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="admin-bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="admin-booking-card">
              <div className="booking-header">
                <span className="booking-id">#{b.booking_number}</span>
                <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} className="status-select">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <h3>{b.service?.name}</h3>
              <p className="customer">{b.customer?.full_name}</p>
              <div className="booking-details">
                <span><Calendar size={14} /> {b.scheduled_date}</span>
                <span><DollarSign size={14} /> ₹{b.final_price || 0}</span>
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
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ code: '', discount_type: 'percentage', discount_value: 0, min_order_value: 0, max_discount: 0 })

  useEffect(() => { if (user && profile?.role === 'admin') load() }, [user, profile])

  async function load() {
    try {
      const { data } = await couponApi.getAll()
      setCoupons(data || [])
    } catch {}
    setLoading(false)
  }

  async function createCoupon() {
    try {
      await couponApi.create({ ...formData, is_active: true, valid_from: new Date().toISOString(), valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() })
      setShowForm(false)
      setFormData({ code: '', discount_type: 'percentage', discount_value: 0, min_order_value: 0, max_discount: 0 })
      load()
    } catch {}
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Coupons</h1><button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={18} /> New Coupon</button></header>
      {showForm && (
        <div className="coupon-form">
          <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="Coupon Code" />
          <select value={formData.discount_type} onChange={e => setFormData({ ...formData, discount_type: e.target.value })}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input type="number" value={formData.discount_value} onChange={e => setFormData({ ...formData, discount_value: parseInt(e.target.value) })} placeholder="Discount Value" />
          <input type="number" value={formData.min_order_value} onChange={e => setFormData({ ...formData, min_order_value: parseInt(e.target.value) })} placeholder="Min Order Value" />
          <button className="btn btn-success" onClick={createCoupon}><Check size={18} /> Create</button>
        </div>
      )}
      <div className="coupons-list">
        {loading ? <div className="loading-state"><div className="spinner" /></div> : coupons.map(c => (
          <div key={c.id} className="coupon-card">
            <div className="coupon-value">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</div>
            <div className="coupon-info"><span className="code">{c.code}</span><span className="min">Min: ₹{c.min_order_value}</span></div>
            <div className="coupon-usage">Used: {c.usage_count}/{c.usage_limit || '∞'}</div>
          </div>
        ))}
      </div>
      <div className="bottom-spacer"></div>
    </div>
  )
}

function AdminNotificationsPage() {
  const { user, profile } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  async function sendBroadcast() {
    if (!title || !body) return
    setSending(true)
    try {
      await supabase.from('stored_notifications').insert({
        user_id: 'broadcast',
        title,
        body,
        type: 'promotion',
      })
      setTitle('')
      setBody('')
    } catch {}
    setSending(false)
  }

  if (!user || profile?.role !== 'admin') return <Navigate to="/auth" />

  return (
    <div className="admin-page">
      <header className="page-header"><h1>Broadcast Notifications</h1></header>
      <div className="broadcast-section">
        <h2>Send to All Users</h2>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification Title" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Message body..." rows={4} />
        <button className="btn btn-primary" onClick={sendBroadcast} disabled={sending}>
          {sending ? <div className="spinner" /> : <><Send size={18} /> Send Broadcast</>}
        </button>
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
          <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>ONE CALL</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Home Solutions</div>
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
      </Route>
      <Route path="/partner" element={<PartnerLayout />}>
        <Route index element={<PartnerDashboard />} />
        <Route path="jobs" element={<PartnerJobsPage />} />
        <Route path="earnings" element={<PartnerEarningsPage />} />
        <Route path="history" element={<PartnerHistoryPage />} />
        <Route path="profile" element={<PartnerProfilePage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
