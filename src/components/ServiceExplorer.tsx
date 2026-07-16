import React, { useState } from 'react';
import { Search, Sparkles, Clock, MapPin, CheckCircle2, ChevronRight, Calendar, User, Mail, Phone, ShoppingBag, ArrowRight } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { ServiceCategory, Booking } from '../types';

interface ServiceExplorerProps {
  onAddBooking: (booking: Booking) => void;
  onNavigateToSOS: () => void;
}

export default function ServiceExplorer({ onAddBooking, onNavigateToSOS }: ServiceExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'popular' | 'emergency' | 'repair' | 'cleaning' | 'outdoor'>('all');
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  
  // Booking Form State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [chosenSubService, setChosenSubService] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingInstructions, setBookingInstructions] = useState('');
  
  // Simulation Flow States
  const [bookingStep, setBookingStep] = useState<'form' | 'submitting' | 'success'>('form');
  const [simulatedProgressText, setSimulatedProgressText] = useState('');

  // Filter Categories Logic
  const filteredServices = servicesData.filter(s => {
    // Search query check
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.longDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.subservices.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter type check
    if (activeCategoryFilter === 'popular') return s.popular === true;
    if (activeCategoryFilter === 'emergency') return s.id === 'emergency-sos';
    if (activeCategoryFilter === 'repair') {
      return ['plumbing', 'electrical', 'home-appliances', 'furniture-assembly', 'waterproofing'].includes(s.id);
    }
    if (activeCategoryFilter === 'cleaning') {
      return ['cleaning', 'pest-control', 'laundry', 'vehicle-care'].includes(s.id);
    }
    if (activeCategoryFilter === 'outdoor') {
      return ['garden-outdoor', 'roofing', 'construction'].includes(s.id);
    }

    return true; // 'all'
  });

  const handleOpenBooking = (service: ServiceCategory, subName?: string) => {
    setSelectedService(service);
    setChosenSubService(subName || service.subservices[0]?.name || '');
    setBookingStep('form');
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !customerName || !customerEmail || !customerPhone || !bookingDate || !bookingAddress) return;

    setBookingStep('submitting');
    setSimulatedProgressText('Contacting nearest verified contractors...');

    setTimeout(() => {
      setSimulatedProgressText('Performing Aadhaar background and credentials check...');
    }, 1200);

    setTimeout(() => {
      setSimulatedProgressText('Syncing security protocols with dispatch hub...');
    }, 2400);

    setTimeout(() => {
      const technicianList = ['Rajesh Kumar', 'Vikram Singh', 'Anil Mehta', 'Suresh Patel', 'Karan Johar', 'Neha Sharma'];
      const assignedTech = technicianList[Math.floor(Math.random() * technicianList.length)];
      
      const newBooking: Booking = {
        id: `BC-${Math.floor(100000 + Math.random() * 900000)}`,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        subServiceName: chosenSubService,
        customerName,
        email: customerEmail,
        phone: customerPhone,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        address: bookingAddress,
        instructions: bookingInstructions,
        status: 'dispatched',
        technician: assignedTech
      };

      onAddBooking(newBooking);
      setBookingStep('success');
    }, 3600);
  };

  return (
    <div id="service-explorer-root" className="space-y-6">
      
      {/* Search and Category Filtering Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all 28 core home solutions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Service filter tags */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {[
              { id: 'all', label: 'All 28 Divisions' },
              { id: 'popular', label: '★ Popular' },
              { id: 'emergency', label: '🚨 Emergency' },
              { id: 'repair', label: '🛠️ Repair & Fix' },
              { id: 'cleaning', label: '✨ Clean & Care' },
              { id: 'outdoor', label: '🏡 Outdoor & Civil' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategoryFilter === tab.id
                    ? 'bg-blue-900 text-white shadow-sm shadow-blue-900/10'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Service Categories */}
      <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Service Header image with styling overlays */}
            <div className="relative h-44 overflow-hidden bg-slate-200">
              <img
                src={service.image}
                alt={service.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
              
              {/* Category indices and popular tag */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-amber-400 border border-slate-700/50 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider">
                DIV {service.number}
              </div>

              {service.popular && (
                <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                  Popular
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-bold text-blue-200 bg-blue-950/80 backdrop-blur-sm px-2 py-0.5 rounded tracking-widest uppercase">
                  Starting from {service.startingPrice}
                </span>
                <h3 className="text-base font-bold font-display text-white mt-1 drop-shadow-sm">{service.name}</h3>
              </div>
            </div>

            {/* Core Description */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{service.description}</p>
                
                {/* List of high-fidelity subservices (Max 3 shown for elegance, with expandable drawer) */}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Key Sub-Divisions:</span>
                <div className="space-y-1.5 mb-5">
                  {service.subservices.slice(0, 3).map((sub, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900 mt-1.5 shrink-0"></span>
                      <span className="font-semibold">{sub.name}</span>
                    </div>
                  ))}
                  {service.subservices.length > 3 && (
                    <div className="text-[10px] text-slate-400 font-mono italic">
                      + {service.subservices.length - 3} more specialist options
                    </div>
                  )}
                </div>
              </div>

              {/* Action triggers */}
              <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                <button
                  onClick={() => handleOpenBooking(service)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  Book Service
                </button>
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setBookingModalOpen(false);
                    // trigger a detailed view popup
                  }}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold p-2.5 rounded-xl border border-slate-200/50 transition-colors cursor-pointer text-xs"
                  title="View full specs"
                >
                  Specs
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-inner">
            <p className="text-slate-500 text-sm">No service divisions found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategoryFilter('all'); }}
              className="text-xs font-semibold text-blue-900 hover:underline mt-2"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Specs Detailed View Overlay Card */}
      {selectedService && !bookingModalOpen && (
        <div id="service-specs-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative font-sans">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold p-2 cursor-pointer"
            >
              &times;
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-slate-100 border border-slate-200 text-blue-900 text-xs font-mono font-bold px-2.5 py-1 rounded">
                DIV {selectedService.number}
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900">{selectedService.name}</h2>
            </div>

            <img
              src={selectedService.image}
              alt={selectedService.name}
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
            />

            <p className="text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-150">
              {selectedService.longDescription}
            </p>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Complete Subservice Directory & Specifications:</h3>
            <div className="space-y-4 mb-6">
              {selectedService.subservices.map((sub, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-slate-900">{sub.name}</span>
                    <button
                      onClick={() => handleOpenBooking(selectedService!, sub.name)}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer"
                    >
                      Instant Book
                    </button>
                  </div>
                  {sub.description && (
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{sub.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400">Standard starting price: <strong className="text-slate-800">{selectedService.startingPrice}</strong></span>
              <button
                onClick={() => handleOpenBooking(selectedService!)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Book Complete Division
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Booking Modal */}
      {bookingModalOpen && selectedService && (
        <div id="booking-modal-overlay" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden font-sans border border-slate-200">
            
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base font-display">Service Dispatch Booking</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Division {selectedService.number} — {selectedService.name}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Step 1: Form Inputs */}
            {bookingStep === 'form' && (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Selected Specialty</label>
                    <select
                      value={chosenSubService}
                      onChange={e => setChosenSubService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900 font-semibold"
                    >
                      {selectedService.subservices.map((sub, i) => (
                        <option key={i} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ashok Kumar"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ashok@gmail.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preferred Slot</label>
                    <select
                      value={bookingTimeSlot}
                      onChange={e => setBookingTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900"
                    >
                      <option>08:00 AM - 10:00 AM</option>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>02:00 PM - 04:00 PM</option>
                      <option>04:00 PM - 06:00 PM</option>
                      <option>06:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerName('Ashok Kumar Bandi');
                        setCustomerEmail('bandibandiashokkumar@gmail.com');
                        setCustomerPhone('+91 8019318625');
                        setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                        setBookingAddress('Flat 304, Green Heights, Gachibowli, Hyderabad, TS');
                      }}
                      className="w-full mt-5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold py-2 px-1.5 rounded-lg transition-colors"
                    >
                      📋 Auto-fill My Details
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dispatch & Physical Service Address</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter complete door address, apartment name, street and city..."
                    value={bookingAddress}
                    onChange={e => setBookingAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Additional Guidelines or Security Rules (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Call before arrival, wear mask, park in visitors slot"
                    value={bookingInstructions}
                    onChange={e => setBookingInstructions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Estimates standard base quote: <strong className="text-slate-800">{selectedService.startingPrice}</strong></span>
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <span>Secure Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Simulated Submission Progress */}
            {bookingStep === 'submitting' && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-900 animate-spin"></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Guardian Standard Verification In Progress</h4>
                  <p className="text-xs text-slate-400 mt-1">Please wait as we secure dispatch credentials...</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 py-2.5 px-4 rounded-xl text-[11px] font-mono text-slate-600 animate-pulse">
                  {simulatedProgressText}
                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation Screen */}
            {bookingStep === 'success' && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 font-display">Secure Dispatch Booking Confirmed!</h4>
                  <p className="text-xs text-slate-400 mt-1">Your service ticket has been initialized under safety standards.</p>
                </div>

                <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-left space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Service:</span><span className="font-semibold text-slate-800">{selectedService.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Specialty:</span><span className="font-semibold text-slate-800">{chosenSubService}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Assigned Tech:</span><span className="font-bold text-blue-900">● {customerName ? 'Assigned' : 'Searching...'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">SLA Standard:</span><span className="font-semibold text-amber-600">Background Checked & Insured</span></div>
                </div>

                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
