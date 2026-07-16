import { ServiceCategory } from '../types';

export const servicesData: ServiceCategory[] = [
  {
    id: 'cleaning',
    number: '01',
    name: 'Cleaning Services',
    description: 'Deep residential, bathroom, kitchen, and upholstery sanitation.',
    longDescription: 'Premium deep sanitation services using high-grade eco-friendly chemicals, professional scrubbers, and industrial vacuums. We guarantee dust-free, hygienic results.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹499',
    popular: true,
    subservices: [
      { name: 'Full House Deep Cleaning', description: 'Complete chemical floor scrubbing, window pane shining, and intensive sanitizing.' },
      { name: 'Bathroom Grout & Tile Cleaning', description: 'Acid-free tile scrubbing, lime scale removal, and disinfection of all fixtures.' },
      { name: 'Kitchen Modular & Chimney Service', description: 'De-greasing stoves, modular cabinet inside/out clean, and filter oil removal.' },
      { name: 'Sofa, Carpet & Mattress Vacuuming', description: 'Dry vacuuming followed by wet shampooing and extraction to extract deep allergens.' },
      { name: 'High-Rise Balcony & Glass Polish', description: 'Exterior window wiping with specialized water-repellent safety equipment.' },
      { name: 'Overhead & Sump Water Tank Sanitization', description: 'Six-stage cleaning including sludge removal, high-pressure washing, and UV treatment.' }
    ]
  },
  {
    id: 'painting',
    number: '02',
    name: 'Painting Services',
    description: 'Dustless interior & exterior wall painting, textures, and premium varnishing.',
    longDescription: 'Professional painting with moisture-reading diagnostics, wall-fissure crack repair, double puttying, and luxury brand finishes with absolute zero-dust cleanup.',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹4,999',
    subservices: [
      { name: 'Interior Wall Luxury Painting', description: 'Rich premium emulsions, smooth texture accents, and protective ceiling coatings.' },
      { name: 'Exterior Facade Weatherproof Coat', description: 'Rain-resistant and dust-repellent external shields to guard building integrity.' },
      { name: 'Designer Pattern & 3D Wall Art', description: 'Bespoke stencil work, ombre shades, and custom geometric feature walls.' },
      { name: 'Metal Railing & Wooden Polish', description: 'Anti-corrosion grill painting and high-sheen varnish on doors and cabinets.' },
      { name: 'Anti-Fungal Damp Proof Protection', description: 'Base chemical coatings designed to suppress active fungal/mould growth points.' }
    ]
  },
  {
    id: 'interior-design',
    number: '03',
    name: 'Interior Design Services',
    description: 'Bespoke modular kitchens, false ceilings, and premium 3D visualizations.',
    longDescription: 'Turnkey interior redesign by expert architects. From Vastu-compliant 2D space planning to delivery of custom modular wardrobes and smart lighting configurations.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹14,999',
    popular: true,
    subservices: [
      { name: 'Modular Kitchen Space Layout', description: 'Tailored L-shape or parallel counters with pull-out drawers and soft-close hinges.' },
      { name: 'False Ceiling & Warm Ambience Light', description: 'Beautiful gypsum boards styled with warm glowing indirect LED coves.' },
      { name: 'Wardrobe & Smart Storage Units', description: 'Sleek sliding doors, integrated mirrors, and hidden multi-drawer cabinets.' },
      { name: 'Home Cinema & Sound Panel Curation', description: 'Acoustic padded wall panels, dark accent ceilings, and optimum wire routing.' },
      { name: 'Complete 3D Space Walkthrough', description: 'Virtual reality walkthroughs of your future living spaces before buying material.' }
    ]
  },
  {
    id: 'waterproofing',
    number: '04',
    name: 'Waterproofing Services',
    description: 'Terrace slab, wet area chemical coating, and crack sealing.',
    longDescription: 'Durable liquid polyurethane membrane injection and polymer coatings designed to prevent water seepage, tile leaks, and foundation rot with a certified warranty.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹1,999',
    subservices: [
      { name: 'Terrace Slab Waterproofing', description: 'Layered elastomeric paint membrane over concrete to block rain seepages.' },
      { name: 'Under-Tile Bathroom Sealing', description: 'Invisible grout filling and chemical floor seal without breaking tiles.' },
      { name: 'Exterior Wall Rain Barrier', description: 'High-build water-repelling wall shields to stop moisture-wicking.' },
      { name: 'Basement & Sump Tank Lining', description: 'Negative-pressure chemical treatment to counter underground spring seepage.' }
    ]
  },
  {
    id: 'plumbing',
    number: '05',
    name: 'Plumbing Services',
    description: 'Leak detection, pipeline repair, pressure pumps, and sanitary fixtures.',
    longDescription: 'Emergency and standard plumbing. We cover CPVC pipe fittings, geyser connections, high-pressure pump installation, and drain-cleaning services with modern tools.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹199',
    popular: true,
    subservices: [
      { name: 'Leak Detection & Pipe Repair', description: 'Surgical acoustic listening to find invisible pipe cracks inside solid walls.' },
      { name: 'Tap, Shower & Mixer Replacements', description: 'Sleek chrome fixtures installation with optimal water sealing washers.' },
      { name: 'Water Pump & Motor Tuning', description: 'Pressure booster installation, automatic controller wiring, and silent motors.' },
      { name: 'EWC Toilet & Flush Tank Repair', description: 'Replacing internal syphon valves, dual flush upgrades, and commode sealing.' },
      { name: 'High-Velocity Clog Clearing', description: 'Motorized drain-snaking to clear deep soap and hair blockages instantly.' }
    ]
  },
  {
    id: 'electrical',
    number: '06',
    name: 'Electrical Services',
    description: 'House rewiring, EV charger points, switchboards, and electrical audits.',
    longDescription: 'Trained electricians specializing in safe house rewiring, MCB diagnostics, smart EV charger points, and earthing setups. Safeguarding homes against short-circuits.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹199',
    subservices: [
      { name: 'Smart Switch & DB Box Setup', description: 'Shockproof main boards with safety fuses and properly rated overload MCBs.' },
      { name: 'Chandelier & Accent Lighting Mount', description: 'Anchored overhead hanging fixtures with secure, beautiful wiring work.' },
      { name: 'EV Charger Point Installation', description: 'Dedicated heavy-duty power lines with surge protectors for safe vehicle charging.' },
      { name: 'Full House Copper Rewiring', description: 'FRLS (Flame Retardant Low Smoke) copper line cabling through conduits.' },
      { name: 'Copper Earthing & Lightning Arrester', description: 'Physical copper plate grounding to diffuse grid spikes and storms safely.' }
    ]
  },
  {
    id: 'home-appliances',
    number: '07',
    name: 'Home Appliance Services',
    description: 'AC deep service, gas recharging, washing machines, and smart TV mounts.',
    longDescription: 'Certified appliance repair. High-pressure jet AC servicing, refrigerator coolant recharging, washing machine drum cleaning, and smart wall mount configurations.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹349',
    subservices: [
      { name: 'AC Hydro-Jet Servicing', description: 'High-pressure indoor coil cleaning and drain tray flushing to boost cooling.' },
      { name: 'Refrigerator Coolant Recharge', description: 'Eco-friendly R134a or R600a gas top-ups with complete compressor diagnosis.' },
      { name: 'Washing Machine Descaling', description: 'Tub removal, mineral scaling wash, and belt/spinner realignment.' },
      { name: 'Smart TV Wall Mounting', description: 'Rigid steel bracket alignment, secure drywall drilling, and hidden wiring.' },
      { name: 'Ro Purifier Filter Cartridge Swap', description: 'Pre-filter, sediment, activated carbon, and reverse osmosis membrane change.' }
    ]
  },
  {
    id: 'smart-home',
    number: '08',
    name: 'Smart Home & Security Services',
    description: 'IP cameras, smart locks, Alexa/Google Home integration, and fire alarms.',
    longDescription: 'Transform your home into a secure digital environment. We install biometric smart locks, HD IP cameras with remote viewing, mesh WiFi systems, and smart lights.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹999',
    subservices: [
      { name: 'Smart Biometric Door Lock', description: 'Fingerprint, card, password, and mechanical override physical locks.' },
      { name: 'CCTV IP Camera Setup', description: '4K outdoor cameras, wireless NVR config, and live streams on mobile.' },
      { name: 'Alexa / Google Home Automation', description: 'Voice controls for lights, AC, curtains, and geysers configured seamlessly.' },
      { name: 'Mesh WiFi & Cable Laying', description: 'High-speed internet wiring and zero-dead-zone whole-home WiFi networks.' },
      { name: 'Smoke & Fire Alarm Integration', description: 'Battery-operated detectors connected with in-app sirens and notifications.' }
    ]
  },
  {
    id: 'pest-control',
    number: '09',
    name: 'Pest Control Services',
    description: 'Cockroach gel treatment, termite proofing, and safe mosquito fogging.',
    longDescription: 'Odourless, herbal-formulated pest control treatments targeting cockroaches, termites, bedbugs, rodents, and mosquitoes. Fully safe for kids and pets.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹599',
    subservices: [
      { name: 'Cockroach Herbal Gel Infusion', description: 'Dots of organic bait placed in hidden hinges to eliminate nesting.' },
      { name: 'Pre/Post Termite Wall Injection', description: 'Chemical barrier drilling in walls to create an impenetrable termite shield.' },
      { name: 'Bedbug Thermal & Chemical Sweep', description: 'Intense steam extraction and professional insecticide treatment.' },
      { name: 'Mosquito Nets & Bird Spike Setup', description: 'Magnetic window net meshes and polycarbonate balcony pigeon spikes.' }
    ]
  },
  {
    id: 'packers-movers',
    number: '10',
    name: 'Packers & Movers Services',
    description: 'Local and domestic shifting, bubble-wrap packing, and secure storage.',
    longDescription: 'Worry-free relocations. Features triple-layer packing (bubble wrap, corrugated sheets, stretch wrap), GPS-tracked transport trucks, and loading/unloading.',
    image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹2,999',
    subservices: [
      { name: 'Full House Shifting Package', description: 'Full service packing, loading, transport, unloading, and unpacking.' },
      { name: 'Fragile Glass & Antique Wrap', description: 'High-density foam sheets and custom wooden crating for precious art.' },
      { name: 'Office IT Equipment Relocation', description: 'Secure packing of computers, servers, UPS backups, and heavy furniture.' },
      { name: 'Two-Wheeler Secure Transport', description: 'Wooden crate boxing and fluid draining for inter-city bike shipping.' }
    ]
  },
  {
    id: 'construction',
    number: '11',
    name: 'Construction & Civil Works',
    description: 'Custom masonry, plastering, marble layout, and metal fabrication.',
    longDescription: 'Professional masonry, concrete columns, floor tiling, wall plastering, and sturdy metal fabrication works. Handled by experienced civil engineers.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹9,999',
    subservices: [
      { name: 'Vitrified Tiling & Italian Marble', description: 'Level-guided tile laying, chemical spacers, and mirror-finish marble polishing.' },
      { name: 'MS & SS Grill Fabrication', description: 'Heavy-duty balcony railings, window safety frames, and automatic gates.' },
      { name: 'Brick Plastering & Crack Stitching', description: 'Structural polymer concrete plastering and reinforced wall stitching.' },
      { name: 'Modular Partition & Drywall Setup', description: 'Quick drywall setups with glass wool inserts for acoustic office spaces.' }
    ]
  },
  {
    id: 'roofing',
    number: '12',
    name: 'Roofing & PVC Sheet Services',
    description: 'Polycarbonate sheds, UPVC roofing, car parking shields, and truss fabrication.',
    longDescription: 'Weather-proof outdoor shading solutions. From industrial-grade color coated sheets to elegant translucent polycarbonate roofs for patios.',
    image: 'https://images.unsplash.com/photo-1632759162453-195c73792f67?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹3,499',
    subservices: [
      { name: 'Polycarbonate Transparent Shed', description: 'Chic metal framework with UV-protected sheets for patios and balconies.' },
      { name: 'UPVC Thermal Sheet Roofing', description: 'Sound-dampened, heat-insulated multi-layered roofing sheets.' },
      { name: 'Car Parking Cantilever Shading', description: 'High-tensile steel frame with weather-proof color-coated iron sheets.' },
      { name: 'Heavy Structural Truss Welds', description: 'Welded girder framework for warehouses, factories, and terraces.' }
    ]
  },
  {
    id: 'beauty-salon',
    number: '13',
    name: 'Beauty & Personal Care Services',
    description: 'Salon at home, express facials, wedding makeover, and men’s grooming.',
    longDescription: 'Indulge in certified salon-grade facials, body waxing, hair spas, and artistic bridal makeovers in the absolute comfort of your own living room.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹399',
    subservices: [
      { name: 'Classic Gold & O2 Facial', description: 'Multilayer scrubbing, steam extraction, and glowing nutrient face massage.' },
      { name: 'Honey-Waxing & Foot Pedicure', description: 'Smooth warm wax body hair removal and deep herbal scrub pedicure.' },
      { name: 'Men’s Beard Grooming & Haircut', description: 'Precise hair trimming, razor-edge outline shaving, and cool clay face wrap.' },
      { name: 'Premium Hair Spa & Mask', description: 'Hydrating moisture masks followed by intense nutritional oil therapies.' }
    ]
  },
  {
    id: 'event-management',
    number: '14',
    name: 'Event Management Services',
    description: 'Birthday celebrations, LED stage setups, and catering coordination.',
    longDescription: 'Turnkey event planning for weddings, birthday parties, baby showers, or corporate launches. Covers floral decor, professional sound, and high-quality setup rentals.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹4,999',
    subservices: [
      { name: 'Thematic Balloon & LED Setup', description: 'Stunning balloon arches, fairy light drop-downs, and custom backdrops.' },
      { name: 'Premium Floral Mandap & Entryways', description: 'Fresh, fragrant jasmine, rose, or orchid decorations for holy events.' },
      { name: 'Pro DJ & Sound Rental', description: 'High-wattage active speakers, dynamic club lasers, and professional mixers.' },
      { name: 'Interactive Photo Booths', description: 'Custom printed backdrops, funny props, and digital polaroid outputs.' }
    ]
  },
  {
    id: 'driver-travel',
    number: '15',
    name: 'Driver & Travel Services',
    description: 'Outstation trips, monthly chauffeur contracts, and airport pickup/drops.',
    longDescription: 'Verified, professional drivers with deep knowledge of highways and safe defensive driving techniques. Available on hourly, daily, or retainer contracts.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹499',
    subservices: [
      { name: 'Outstation Long-Drive Chauffeur', description: 'Experienced highway-expert drivers for secure, pleasant road journeys.' },
      { name: 'Monthly Office Retainer Driver', description: 'Punctual personal driver assigned for daily comfortable office commuting.' },
      { name: 'Airport Express Pickup & Drop', description: 'On-time scheduled luxury cab pickups with reliable bag handling support.' },
      { name: 'Hourly Emergency Night Driver', description: 'Safely escape tiring late night commutes with on-demand drivers.' }
    ]
  },
  {
    id: 'garden-outdoor',
    number: '16',
    name: 'Garden & Outdoor Services',
    description: 'Vertical garden setup, vertical design, lawn grooming, and solar cleanings.',
    longDescription: 'Expert garden design, vertical green plant walls, lawn trimming, organic pesticide treatments, and professional solar panel washing and tuning.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹299',
    subservices: [
      { name: 'Vertical Green Wall Design', description: 'Space-saving drip-automated vertical plant frames for balconies.' },
      { name: 'Lawn Trimming & Organic Soil Mix', description: 'Rotary lawn grooming, compost enrichment, and systemic root pest defense.' },
      { name: 'Borewell Cleaning & Diagnostics', description: 'Endoscopic underground water diagnostics and mud-flushing treatments.' },
      { name: 'Solar Panel Chemical Glass Wash', description: 'Specialized mineral-free water washing to boost panel generation capacity.' }
    ]
  },
  {
    id: 'corporate-services',
    number: '17',
    name: 'Corporate & Commercial Services',
    description: 'Office housekeeping, electrical audits, and full facility contracts.',
    longDescription: 'Complete facilities management solutions designed for schools, corporate IT offices, retail clinics, malls, and factories under specialized custom SLAs.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹9,999',
    subservices: [
      { name: 'Daily Corporate Housekeeping', description: 'Round-the-clock office floor sanitization, washroom upkeep, and pantry cleaning.' },
      { name: 'Commercial AC Duct Maintenance', description: 'Centralized chiller check, coil flushing, and periodic air filter wash.' },
      { name: 'Retail Store Maintenance Contract', description: 'Preventative structural, electric, plumbing, and aesthetic maintenance packages.' },
      { name: 'High-Volume Warehouse Pest Flush', description: 'Eco-certified rodent control traps, thermal fogging, and grain preservation.' }
    ]
  },
  {
    id: 'rental-property',
    number: '18',
    name: 'Rental Property Management',
    description: 'Pre-rent deep clean, tenant handover painting, and routine inspections.',
    longDescription: 'Turnkey property management. Pre-rental damage inspections, professional paint touch-ups, appliance health checks, and Airbnb guest-turnover cleanings.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹1,499',
    subservices: [
      { name: 'Tenant Handover Restoration', description: 'Fast single-day paint touch-ups and extensive deep sanitation of bathroom/kitchen.' },
      { name: 'Routine Quarterly Asset Inspection', description: 'Thorough leak and wire checkups with detailed PDF reports mailed to owners.' },
      { name: 'Airbnb Turnaround & Linen Swap', description: 'Hotel-style guest turn, fresh sheet replacement, and coffee/shampoo restock.' }
    ]
  },
  {
    id: 'emergency-sos',
    number: '19',
    name: 'Emergency Services (24/7)',
    description: 'Burst pipe repair, blackouts, urgent roof leaks, and rapid response.',
    longDescription: 'Our 24/7 Priority Emergency dispatch. We guarantee a verified professional at your doorstep within 30-60 minutes to resolve critical safety incidents.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹599',
    popular: true,
    subservices: [
      { name: 'Emergency Plumbing Pipe Burst', description: 'Immediate main supply valve shutoff, pipe replacement, and water extraction.' },
      { name: 'Short-Circuit Blackout Diagnostic', description: 'Resolving burnt switches, blown main line MCBs, and power lines restoration.' },
      { name: 'Active Ceiling Silt Repair', description: 'Urgent temporary roof weatherproofing to secure homes during severe downpours.' },
      { name: 'Critical Server Power Backup Fix', description: 'Restoring damaged line inverters, backup batteries, and generator circuits.' }
    ]
  },
  {
    id: 'amc',
    number: '20',
    name: 'Annual Maintenance Contracts',
    description: 'Quarterly general check, preventative care, and zero visit charges.',
    longDescription: 'Structured peace of mind. Covers scheduled quarterly electrical safety tests, plumbing checks, periodic pest controls, and free emergency visits.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹2,999',
    subservices: [
      { name: 'Quarterly Home Wellness Audit', description: 'Proactive inspection of pressure pumps, switchboards, and moisture walls.' },
      { name: 'Priority Emergency dispatch Pass', description: 'First-in-queue dispatch prioritization bypassing standard service queues.' },
      { name: 'Zero Visit & Diagnostic Charges', description: 'Pay only for actual replacement parts, zero fees on engineer door visits.' }
    ]
  },
  {
    id: 'home-inspection',
    number: '21',
    name: 'Home Inspection Services',
    description: 'Thermal moisture scanning, electrical safety checks, and handover reports.',
    longDescription: 'Pre-purchase and RERA handover snag listing. We utilize thermal cameras to find hidden damp spots, test tap pressure, and verify circuit load safety.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹1,999',
    subservices: [
      { name: 'Thermal Seepage Mapping', description: 'Using non-invasive infrared cameras to detect moisture behind brickwork.' },
      { name: 'Electrical Grid Safety Audit', description: 'Verifying active grounding loop resistors, insulation leakage, and circuit breaker speed.' },
      { name: 'RERA Handover Detailed Snag List', description: 'A massive 150+ check report on wall level, paint peel, and hollow tile cracks.' }
    ]
  },
  {
    id: 'eco-friendly',
    number: '22',
    name: 'Eco-Friendly & Green Services',
    description: 'Rainwater harvesting, graywater filters, water savers, and organic cleaning.',
    longDescription: 'Sustainable ecological additions. Installing smart rainwater collectors, water-saving tap aerators, greywater filters, and backyard compost units.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹1,299',
    subservices: [
      { name: 'Rainwater Harvesting Setup', description: 'Physical roof collectors, sediment filters, and recharge well installations.' },
      { name: 'Water-Saving Faucet Aerator', description: 'Smart brass aerator inserts to reduce water flow by 40% while preserving pressure.' },
      { name: 'Organic Home Deep Cleaning', description: 'Using non-toxic, chemical-free enzymatic formulas for safe floor scrubbing.' }
    ]
  },
  {
    id: 'product-sales',
    number: '23',
    name: 'Product Sales & Installation',
    description: 'Energy-saving ceiling fans, brass faucets, smart locks, and water softeners.',
    longDescription: 'Buy premium home components with instant door delivery and professional installation included. Fully backed by company warranty support.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹899',
    subservices: [
      { name: 'BLDC Energy Saving Fan', description: 'Whisper-quiet brushless fan delivery, sturdy hook mounting, and wire check.' },
      { name: 'Water Softener Filter System', description: 'Centralized line sediment filters to eliminate hard water staining.' },
      { name: 'Modular Touch Switches & Panels', description: 'Installing beautiful scratchproof smart glass switches with remote pairing.' }
    ]
  },
  {
    id: 'senior-care',
    number: '24',
    name: 'Senior Citizen Home Care',
    description: 'Grab bar installation, slip protection, and priority security buttons.',
    longDescription: 'Safety modifications to support elderly independence. Installing solid stainless grab bars, slip-resistant floor treatments, and physical emergency call buttons.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹799',
    subservices: [
      { name: 'Bathroom Grab Bar Installation', description: 'Anchor-drilled rust-free heavy steel handles for toilet and bath steps.' },
      { name: 'Anti-Slip Etching Treatment', description: 'Chemical acid-free wash to increase tile grip traction and prevent falls.' },
      { name: 'Emergency Alarm Button Setup', description: 'Battery-powered RF bedside buttons connected to a loud central household alarm.' }
    ]
  },
  {
    id: 'furniture-assembly',
    number: '25',
    name: 'Furniture Assembly & Carpentry',
    description: 'IKEA flat-pack assembly, lock repairs, and custom hardwood shelving.',
    longDescription: 'Professional assembly of complex imported wardrobes, TV units, desks, hinge replacements, lock repairs, and custom woodworking solutions.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹249',
    subservices: [
      { name: 'Flat-Pack Furniture Assembly', description: 'Experienced assembly of modular beds, cupboards, and dining tables.' },
      { name: 'Hinge Realignment & Door Repair', description: 'Fixing drooping kitchen cabinet doors and oiling squeaking hinges.' },
      { name: 'Smart Security Lock Retrofitting', description: 'Precise door mortise cuts to install keyless entry systems.' }
    ]
  },
  {
    id: 'laundry',
    number: '26',
    name: 'Laundry & Dry Cleaning',
    description: 'Premium dry cleaning, steam iron, saree care, and rapid laundry.',
    longDescription: 'Premium textile care. Safe chemical cleaning of suits, delicate wedding silk sarees, carpets, blankets, and standard wash & fold services with doorstep pick-and-drop.',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹99',
    subservices: [
      { name: 'Suit & Silk Dry Cleaning', description: 'Delicate zero-water chemical wash to preserve premium textures and colors.' },
      { name: 'Blanket & Quilt Sanitization', description: 'Intense warm-water detergent washing, sanitizing, and soft packaging.' },
      { name: 'Doorstep Wash & Fold Service', description: 'Same-day weight-basis wash, dry, and clean fold bundle delivery.' }
    ]
  },
  {
    id: 'vehicle-care',
    number: '27',
    name: 'Vehicle Care Services',
    description: 'Foam washing, deep vacuuming, battery jump-starts, and tyre checks.',
    longDescription: 'Convenient doorstep car and bike maintenance. Complete high-pressure foam washes, interior vacuuming, battery jump-starts, and tyre air checks.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1ecc6f?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹199',
    subservices: [
      { name: 'Doorstep High-Pressure Foam Wash', description: 'Deep external foaming, microfibre cloth wipe, and tyres polish spray.' },
      { name: 'Car Interior Deep Vacuum & Clean', description: 'Dashboard detailing, floor carpet vacuuming, and fabric seat sanitizing.' },
      { name: 'Emergency Battery Jump-Start', description: 'Technician dispatch with booster cables to start dead vehicle batteries.' }
    ]
  },
  {
    id: 'healthcare',
    number: '28',
    name: 'Healthcare & Wellness at Home',
    description: 'Home physiotherapy, nursing, lab test sample pickups, and yoga trainers.',
    longDescription: 'Bring medical attention and fitness support to your home. On-demand clinical physiotherapists, post-surgery care nursing, and expert personal trainers.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₹599',
    subservices: [
      { name: 'Home Physiotherapy Session', description: 'Personalized recovery exercises guided by a certified physical therapist.' },
      { name: 'Post-Surgery Nursing Care', description: 'Dressing, vitals monitoring, medication administration, and feeding tubes support.' },
      { name: 'Home Yoga & Strength Trainer', description: 'Personalized fitness coaching sessions in your backyard or living room.' }
    ]
  }
];
