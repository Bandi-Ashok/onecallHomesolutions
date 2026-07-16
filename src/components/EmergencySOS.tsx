import { useState, useEffect } from 'react';
import { AlertOctagon, Phone, Shield, Clock, MapPin, Loader2, Play, Users, CheckCircle } from 'lucide-react';

export default function EmergencySOS() {
  const [activeSOS, setActiveSOS] = useState(false);
  const [sosType, setSosType] = useState<'plumbing' | 'electrical' | 'roofing' | 'ac' | 'custom' | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [etaSeconds, setEtaSeconds] = useState(1800); // 30 minutes in seconds
  const [sosStep, setSosStep] = useState<'trigger' | 'connecting' | 'active'>('trigger');
  const [techAssigned, setTechAssigned] = useState({
    name: 'Inspector Vikram Rathore',
    phone: '+91 99887 76655',
    vehicle: 'Emergency Unit-09 (Rapid Response Van)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  // Countdown timer for 30-min SLA
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosStep === 'active' && etaSeconds > 0) {
      timer = setInterval(() => {
        setEtaSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sosStep, etaSeconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTriggerSOS = (type: 'plumbing' | 'electrical' | 'roofing' | 'ac' | 'custom') => {
    setSosType(type);
    setSosStep('connecting');

    setTimeout(() => {
      setSosStep('active');
      setActiveSOS(true);
    }, 2500);
  };

  return (
    <div id="emergency-sos-root" className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden font-sans">
      
      {/* Visual Red Alert Header */}
      <div className="bg-gradient-to-r from-red-950 to-red-900 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center animate-pulse">
            <AlertOctagon className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-display tracking-tight">24/7 Guardian Standard Emergency SOS</h3>
            <p className="text-xs text-red-300">Absolute priority dispatch with certified 30-minute local SLA response guarantee.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-red-600/30 border border-red-500/50 px-2.5 py-1 rounded">
            HOTLINE: 1800-CALL-HOME
          </span>
        </div>
      </div>

      {/* STEP 1: TRIGGER EMERGENCY */}
      {sosStep === 'trigger' && (
        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-600">Select the type of safety critical incident below. Our closest rapid response unit will be dispatched immediately.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleTriggerSOS('plumbing')}
              className="bg-red-50/50 hover:bg-red-50 border border-red-150 rounded-xl p-5 text-center transition-all duration-200 cursor-pointer flex flex-col items-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚰</span>
              <span className="font-bold text-xs text-slate-800">Burst Water Pipe</span>
              <span className="text-[9px] text-slate-500 mt-1">Active Flooding</span>
            </button>

            <button
              onClick={() => handleTriggerSOS('electrical')}
              className="bg-red-50/50 hover:bg-red-50 border border-red-150 rounded-xl p-5 text-center transition-all duration-200 cursor-pointer flex flex-col items-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</span>
              <span className="font-bold text-xs text-slate-800">Short Circuit Blackout</span>
              <span className="text-[9px] text-slate-500 mt-1">Smoke or Sparking</span>
            </button>

            <button
              onClick={() => handleTriggerSOS('roofing')}
              className="bg-red-50/50 hover:bg-red-50 border border-red-150 rounded-xl p-5 text-center transition-all duration-200 cursor-pointer flex flex-col items-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏠</span>
              <span className="font-bold text-xs text-slate-800">Active Roof Leak</span>
              <span className="text-[9px] text-slate-500 mt-1">Severe Ingress</span>
            </button>

            <button
              onClick={() => handleTriggerSOS('ac')}
              className="bg-red-50/50 hover:bg-red-50 border border-red-150 rounded-xl p-5 text-center transition-all duration-200 cursor-pointer flex flex-col items-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">❄️</span>
              <span className="font-bold text-xs text-slate-800">HVAC Choke / Gas Leak</span>
              <span className="text-[9px] text-slate-500 mt-1">Hazardous Odour</span>
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Other Custom Urgent Emergency</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Briefly describe your active emergency..."
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => handleTriggerSOS('custom')}
                disabled={!customDescription.trim()}
                className="bg-red-900 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Trigger SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ESTABLISHING SECURE LINK */}
      {sosStep === 'connecting' && (
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <div>
            <h4 className="font-bold text-base text-slate-900 font-display">Initializing Emergency Broadcast...</h4>
            <p className="text-xs text-slate-400 mt-1">Locating nearest mobile fleet with matching safety credentials...</p>
          </div>
          <div className="flex gap-2 text-[10px] text-slate-500 font-mono">
            <span className="px-2 py-0.5 bg-slate-100 rounded border">GEO_LOCKING</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded border text-red-600 font-bold animate-pulse">INCIDENT_ALERT_BROADCAST</span>
          </div>
        </div>
      )}

      {/* STEP 3: ACTIVE EMERGENCY DISPATCH MONITOR */}
      {sosStep === 'active' && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tracking countdown */}
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block">SLA GUARANTEED ARRIVAL TIMER</span>
              <span className="text-4xl font-mono font-extrabold text-red-950 block mt-2 animate-pulse">
                {formatTime(etaSeconds)}
              </span>
              <span className="text-[11px] text-slate-500 mt-2 block">Rapid response team is actively navigating to your coordinates</span>
            </div>

            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Assigned Emergency Specialist
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={techAssigned.photo}
                  alt={techAssigned.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <h5 className="font-bold text-xs text-slate-900">{techAssigned.name}</h5>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{techAssigned.vehicle}</p>
                  <p className="text-[10px] text-blue-900 font-bold mt-1">✔ Aadhaar Background Verified & Insured</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => alert(`Connecting securely to ${techAssigned.name}...`)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-[10px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  Call Inspector
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Route Map */}
          <div className="relative bg-slate-100 rounded-2xl border border-slate-200 h-64 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/10 z-10 pointer-events-none"></div>
            
            {/* Mock Vector Street Grid */}
            <svg className="absolute inset-0 w-full h-full text-slate-300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M 10 10 L 400 10 M 10 80 L 400 80 M 10 160 L 400 160 M 10 240 L 400 240" strokeDasharray="3,3" />
              <path d="M 50 10 L 50 250 M 150 10 L 150 250 M 280 10 L 280 250 M 360 10 L 360 250" strokeDasharray="3,3" />
              
              {/* Dispatch Route Line */}
              <path d="M 50 160 L 150 160 L 150 80 L 280 80" stroke="red" strokeWidth="4" fill="none" strokeDasharray="6,3" className="animate-pulse" />
            </svg>

            {/* Target House Marker */}
            <div className="absolute top-[68px] left-[268px] z-20 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-900 animate-ping absolute"></div>
              <MapPin className="w-6 h-6 text-blue-900 drop-shadow-md relative z-10" />
              <span className="bg-blue-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1">MY HOME</span>
            </div>

            {/* Moving Dispatch Vehicle Icon */}
            <div className="absolute top-[148px] left-[68px] z-20 flex flex-col items-center animate-pulse" style={{ animationDuration: '2s' }}>
              <div className="w-3 h-3 rounded-full bg-red-600 animate-ping absolute"></div>
              <span className="text-lg relative z-10">🚒</span>
              <span className="bg-red-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">UNIT-09 TRUCK</span>
            </div>

            <div className="p-3 bg-white/95 border-t border-slate-200 text-[10px] font-mono text-slate-500 z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                <span>RAPID GPS DISPATCH CHANNEL ACTIVE</span>
              </div>
              <button
                onClick={() => { setSosStep('trigger'); setActiveSOS(false); }}
                className="text-[9px] text-red-600 font-extrabold hover:underline"
              >
                CANCEL ALERT
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
