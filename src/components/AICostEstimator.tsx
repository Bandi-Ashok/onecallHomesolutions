import { useState } from 'react';
import { Calculator, Sparkles, AlertCircle, ArrowRight, Home, ShieldAlert } from 'lucide-react';

export default function AICostEstimator() {
  const [propertyType, setPropertyType] = useState<'1BHK' | '2BHK' | '3BHK' | 'Villa'>('2BHK');
  const [serviceCategory, setServiceCategory] = useState<'deep_clean' | 'painting' | 'waterproof' | 'pest_control' | 'electrical_wiring'>('deep_clean');
  const [tier, setTier] = useState<'silver' | 'gold' | 'platinum'>('gold');
  const [addOns, setAddOns] = useState<string[]>([]);

  // Simple pricing configuration
  const basePrices: Record<string, number> = {
    '1BHK': 1500,
    '2BHK': 2500,
    '3BHK': 3500,
    'Villa': 6000
  };

  const categoryMultiplier: Record<string, number> = {
    'deep_clean': 1.0,
    'painting': 3.5,
    'waterproof': 2.8,
    'pest_control': 0.8,
    'electrical_wiring': 2.2
  };

  const tierMultiplier: Record<string, number> = {
    'silver': 0.95, // 5% discount
    'gold': 0.90, // 10% discount
    'platinum': 0.80 // 20% discount
  };

  const addOnPrices: Record<string, number> = {
    'disinfection': 499,
    'express_dispatch': 349,
    'post_cleanup_warranty': 599
  };

  const handleAddOnToggle = (id: string) => {
    if (addOns.includes(id)) {
      setAddOns(addOns.filter(item => item !== id));
    } else {
      setAddOns([...addOns, id]);
    }
  };

  // Calculate final estimate
  const base = basePrices[propertyType] || 2500;
  const multCat = categoryMultiplier[serviceCategory] || 1.0;
  const multTier = tierMultiplier[tier] || 1.0;
  
  let subtotal = base * multCat;
  let discounted = subtotal * multTier;
  
  const addOnsTotal = addOns.reduce((sum, current) => sum + (addOnPrices[current] || 0), 0);
  const total = Math.round(discounted + addOnsTotal);

  return (
    <div id="ai-estimator-root" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
          <Calculator className="w-5 h-5 text-blue-900" />
        </div>
        <div>
          <h3 className="font-bold text-base font-display text-slate-900">AI-Powered Price Estimator</h3>
          <p className="text-xs text-slate-500">Calculate instant, transparent quotes dynamically with pre-applied loyalty discounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input selectors */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Property Size</label>
            <div className="grid grid-cols-4 gap-2">
              {(['1BHK', '2BHK', '3BHK', 'Villa'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                    propertyType === type
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Service Segment</label>
            <select
              value={serviceCategory}
              onChange={e => setServiceCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-900 font-semibold"
            >
              <option value="deep_clean">✨ Deep Sanitization & Cleaning</option>
              <option value="painting">🎨 Luxury Wall Painting</option>
              <option value="waterproof">🔏 Damp Proof Waterproofing</option>
              <option value="pest_control">🐜 Herbal Pest & Mosquito Control</option>
              <option value="electrical_wiring">⚡ Full Conduit Rewiring</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Your Membership Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'silver', label: 'Silver (5% off)' },
                { id: 'gold', label: 'Gold (10% off)' },
                { id: 'platinum', label: 'Platinum (20% off)' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setTier(p.id as any)}
                  className={`py-2 px-1 text-center rounded-lg border text-[11px] font-semibold cursor-pointer transition-all ${
                    tier === p.id
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Safety & Quality Add-ons</label>
            <div className="space-y-2">
              {[
                { id: 'disinfection', label: 'Full post-service disinfection scan (+₹499)' },
                { id: 'express_dispatch', label: 'Express priority weekend dispatcher (+₹349)' },
                { id: 'post_cleanup_warranty', label: '30-day extended rework warranty (+₹599)' }
              ].map(addOn => (
                <label key={addOn.id} className="flex items-center gap-2.5 bg-slate-50 border border-slate-150 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={addOns.includes(addOn.id)}
                    onChange={() => handleAddOnToggle(addOn.id)}
                    className="rounded border-slate-300 text-blue-950 focus:ring-blue-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-medium">{addOn.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic pricing summary display */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between border border-slate-800 shadow-lg">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Guardian Standard Quote</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-900/50 px-2 py-0.5 rounded uppercase tracking-wider">Estimated</span>
            </div>

            <div className="space-y-2 py-4 text-xs">
              <div className="flex justify-between text-slate-400"><span>Base Rate ({propertyType}):</span><span>₹{base}</span></div>
              <div className="flex justify-between text-slate-400"><span>Category weight:</span><span>x {categoryMultiplier[serviceCategory]}</span></div>
              <div className="flex justify-between text-slate-400"><span>Membership Tier:</span><span className="text-amber-400">x {tierMultiplier[tier]} ({tier.toUpperCase()})</span></div>
              {addOns.length > 0 && (
                <div className="flex justify-between text-slate-400"><span>Add-ons:</span><span>+ ₹{addOnsTotal}</span></div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">TOTAL INC TAXES</span>
                <span className="text-xs text-slate-500 line-through">₹{Math.round((base * categoryMultiplier[serviceCategory]) + addOnsTotal)}</span>
              </div>
              <span className="text-3xl font-mono font-extrabold text-amber-400">₹{total}</span>
            </div>

            <div className="bg-blue-950/40 border border-blue-900/30 rounded-xl p-3 text-[10px] text-slate-400 flex gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Quotes are binding up to 7 days. Pricing includes verified background audits and physical safety kits of all responding technicians.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
