import { ShieldCheck, Sparkles, AlertTriangle, Check, Award } from 'lucide-react';

export default function AMCOverview() {
  const plans = [
    {
      id: 'silver',
      name: 'Silver Pass',
      price: '₹2,999 / year',
      color: 'border-slate-300 text-slate-700 bg-slate-50',
      badgeColor: 'bg-slate-200 text-slate-800',
      description: 'Perfect for standard apartment households wanting hassle-free basic inspections.',
      perks: [
        'Quarterly Home Wellness Audits',
        'Plumbing Minor Leak Check',
        'Electrical Safety Inspection',
        'Standard Booking slots',
        '5% Flat Discount across all 28 divisions'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Guardian',
      price: '₹5,999 / year',
      color: 'border-amber-400 text-slate-900 bg-amber-50/20 shadow-md',
      badgeColor: 'bg-amber-100 text-amber-800',
      popular: true,
      description: 'Our most popular plan. Elevates safety checks and gives free home deep cleans.',
      perks: [
        'All Silver inclusions included',
        'Pest Control (Quarterly treatment)',
        'Priority SLA slot dispatches',
        '1 Free Deep House Cleaning / Year',
        'AC Service (2x per year checkups)',
        '10% Flat Discount across all 28 divisions'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum Fortress',
      price: '₹11,999 / year',
      color: 'border-blue-900 text-slate-900 bg-blue-50/10 shadow-lg',
      badgeColor: 'bg-blue-100 text-blue-900',
      description: 'The ultimate shield. Includes 24/7 dedicated Emergency Hotline dispatches.',
      perks: [
        'All Gold inclusions included',
        '24/7 Zero-Visits Emergency Priority Pass',
        'Free Painting touch-ups (annual)',
        'Dedicated Household Relationship Manager',
        'Digital Audit Reports sent directly to family',
        '20% Flat Discount across all 28 divisions'
      ]
    }
  ];

  return (
    <div id="amc-overview-root" className="space-y-8 font-sans">
      
      {/* Banner introduction */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-amber-400 text-[10px] font-bold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            Annual Maintenance Contracts
          </div>
          <h3 className="text-lg font-bold font-display text-white">Preventative Care Subscriptions</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Protect your family and building from emergencies with proactive inspections and background-verified technicians. Never pay visit or diagnostic charges again.
          </p>
        </div>
        <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
          <p>✔ Zero Doorstep Callout Fees</p>
          <p>✔ Priority 24/7 Dispatch SLAs</p>
        </div>
      </div>

      {/* Grid of plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${plan.color}`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${plan.badgeColor}`}>
                  {plan.name}
                </span>
                {plan.popular && (
                  <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                    Best Choice
                  </span>
                )}
              </div>

              <div className="mb-4">
                <span className="text-2xl font-mono font-extrabold text-slate-900">{plan.price}</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.description}</p>
              </div>

              {/* Perks list */}
              <ul className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                {plan.perks.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => alert(`Initializing secure signup for ${plan.name}. Our billing representative will coordinate details via OTP.`)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                plan.popular
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              Subscribe Standard Plan
            </button>
          </div>
        ))}
      </div>

      {/* Corporate AMC section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">💼 Commercial & Office Enterprise AMC</h4>
          <p className="text-xs text-slate-500 max-w-xl">
            Custom facility management plans for IT parks, retail showrooms, healthcare clinics, and schools. Features dedicated onsite engineers, weekly checklists, and complete GST compliance invoicing.
          </p>
        </div>
        <button
          onClick={() => alert('Our facility management team will reach out within 2 hours. Preparing customizable B2B contract proposal.')}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          Request Enterprise Custom SLA
        </button>
      </div>

    </div>
  );
}
