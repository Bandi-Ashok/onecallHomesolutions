-- Seed service categories (28 main categories)
INSERT INTO service_categories (name, slug, icon, description, display_order, is_emergency_available) VALUES
('Cleaning Services', 'cleaning', 'broom', 'Complete home and office cleaning solutions including deep cleaning, bathroom, kitchen, and specialized cleaning.', 1, false),
('Painting Services', 'painting', 'paint-brush', 'Interior, exterior, decorative painting and specialized coatings for residential and commercial properties.', 2, false),
('Interior Design', 'interior-design', 'lamp', 'Complete interior design services from modular kitchens to full home interiors with 3D visualization.', 3, false),
('Waterproofing', 'waterproofing', 'droplet', 'Roof, basement, bathroom and structural waterproofing with warranty-backed solutions.', 4, false),
('Plumbing Services', 'plumbing', 'wrench', 'Full plumbing services from leak repairs to complete pipeline installation and bathroom fittings.', 5, true),
('Electrical Services', 'electrical', 'zap', 'Electrical installation, wiring, repairs and safety audits by certified electricians.', 6, true),
('Home Appliances', 'appliances', 'tv', 'AC, refrigerator, washing machine, TV and all home appliance repair and installation.', 7, true),
('Smart Home & Security', 'smart-home', 'shield', 'CCTV installation, smart locks, home automation and security system setup.', 8, false),
('Pest Control', 'pest-control', 'bug', 'Residential and commercial pest control including termite, cockroach, and bed bug treatments.', 9, false),
('Packers & Movers', 'packers-movers', 'truck', 'Complete house shifting, packing, loading and transportation services.', 10, false),
('Construction & Civil', 'construction', 'building', 'Building construction, renovation, masonry, tiling and structural works.', 11, false),
('Roofing & PVC Sheets', 'roofing', 'cloud', 'PVC roofing, metal roofing, polycarbonate sheets and shed construction.', 12, false),
('Beauty & Personal Care', 'beauty', 'scissors', 'At-home salon services for women and men including bridal packages.', 13, false),
('Event Management', 'events', 'gift', 'Complete event planning and decoration for weddings, birthdays and corporate events.', 14, false),
('Driver & Travel', 'driver', 'car', 'Professional driver services, car rental and travel coordination.', 15, false),
('Garden & Outdoor', 'garden', 'flower', 'Landscaping, lawn care, solar installation and outdoor maintenance.', 16, false),
('Corporate Services', 'corporate', 'briefcase', 'Office maintenance, facility management and commercial contracts.', 17, false),
('Rental Property Mgmt', 'property-management', 'home', 'Complete property management for landlords, tenants and Airbnb hosts.', 18, false),
('Emergency Services', 'emergency', 'alert-triangle', '24/7 emergency plumbing, electrical and other urgent home repairs.', 19, true),
('AMC Plans', 'amc', 'calendar', 'Annual Maintenance Contracts for complete home care with priority support.', 20, false),
('Home Inspection', 'inspection', 'search', 'Pre-purchase inspection, structural audit and safety assessments.', 21, false),
('Eco-Friendly Services', 'eco-friendly', 'leaf', 'Green cleaning, rainwater harvesting and sustainable home solutions.', 22, false),
('Product Sales', 'products', 'shopping-bag', 'Sales and installation of fans, lights, purifiers and home products.', 23, false),
('Senior Citizen Care', 'senior-care', 'heart', 'Priority home maintenance and safety modifications for elderly.', 24, false),
('Furniture & Carpentry', 'carpentry', 'tool', 'Furniture assembly, repair and custom carpentry work.', 25, false),
('Laundry & Dry Clean', 'laundry', 'shirt', 'Pick-up and delivery laundry, dry cleaning and shoe care services.', 26, false),
('Vehicle Care', 'vehicle', 'circle', 'Doorstep car wash, detailing and vehicle maintenance coordination.', 27, false),
('Healthcare at Home', 'healthcare', 'activity', 'Physiotherapy, nursing care and wellness services at home.', 28, false);

-- Insert sample services for key categories
INSERT INTO services (category_id, name, slug, description, base_price, unit, duration_minutes) VALUES
-- Cleaning Services
((SELECT id FROM service_categories WHERE slug='cleaning'), 'Full House Deep Cleaning', 'full-house-deep-cleaning', 'Complete deep cleaning of entire house including all rooms, bathrooms, and kitchen', 2999, 'per house', 360),
((SELECT id FROM service_categories WHERE slug='cleaning'), 'Bathroom Deep Cleaning', 'bathroom-deep-cleaning', 'Deep cleaning of bathrooms including tiles, fixtures, and disinfection', 599, 'per bathroom', 90),
((SELECT id FROM service_categories WHERE slug='cleaning'), 'Kitchen Deep Cleaning', 'kitchen-deep-cleaning', 'Deep cleaning of kitchen including chimney, cabinets, and appliances', 999, 'per kitchen', 120),
((SELECT id FROM service_categories WHERE slug='cleaning'), 'Sofa Cleaning', 'sofa-cleaning', 'Professional shampooing and cleaning of sofas and upholstery', 499, 'per seater', 60),
((SELECT id FROM service_categories WHERE slug='cleaning'), 'Water Tank Cleaning', 'water-tank-cleaning', 'Complete cleaning and disinfection of overhead water tanks', 999, 'per tank', 120),
-- Plumbing
((SELECT id FROM service_categories WHERE slug='plumbing'), 'Tap/Faucet Installation', 'tap-installation', 'Installation of new taps, faucets, and mixers', 299, 'per tap', 60),
((SELECT id FROM service_categories WHERE slug='plumbing'), 'Water Leakage Repair', 'leakage-repair', 'Detection and repair of water leakages in pipes and fittings', 499, 'per repair', 90),
((SELECT id FROM service_categories WHERE slug='plumbing'), 'Bathroom Fittings', 'bathroom-fitting', 'Installation of commode, shower, and bathroom accessories', 999, 'per fitting', 120),
((SELECT id FROM service_categories WHERE slug='plumbing'), 'Water Motor Installation', 'motor-installation', 'Installation and connection of water pumps and motors', 1299, 'per motor', 180),
-- Electrical
((SELECT id FROM service_categories WHERE slug='electrical'), 'Fan Installation', 'fan-installation', 'Installation of ceiling fans, exhaust fans, and table fans', 249, 'per fan', 45),
((SELECT id FROM service_categories WHERE slug='electrical'), 'Switchboard Installation', 'switchboard-installation', 'Installation of modular switches and switchboards', 399, 'per board', 60),
((SELECT id FROM service_categories WHERE slug='electrical'), 'Short Circuit Repair', 'short-circuit-repair', 'Diagnosis and repair of short circuits and electrical faults', 599, 'per repair', 90),
((SELECT id FROM service_categories WHERE slug='electrical'), 'Complete House Wiring', 'house-wiring', 'New house wiring with conduit and proper earthing', 25000, 'per house', 480),
-- Appliances
((SELECT id FROM service_categories WHERE slug='appliances'), 'AC Service', 'ac-service', 'Complete AC servicing including gas filling and coil cleaning', 499, 'per AC', 90),
((SELECT id FROM service_categories WHERE slug='appliances'), 'AC Installation', 'ac-installation', 'Installation of split or window AC with proper mounting', 699, 'per AC', 120),
((SELECT id FROM service_categories WHERE slug='appliances'), 'Refrigerator Repair', 'fridge-repair', 'Diagnosis and repair of refrigerator cooling issues', 399, 'inspection', 60),
((SELECT id FROM service_categories WHERE slug='appliances'), 'Washing Machine Repair', 'washing-machine-repair', 'Repair of top-load and front-load washing machines', 449, 'inspection', 60),
-- Painting
((SELECT id FROM service_categories WHERE slug='painting'), 'Interior Wall Painting', 'interior-painting', 'Professional interior wall painting with premium paint', 12, 'per sq ft', 480),
((SELECT id FROM service_categories WHERE slug='painting'), 'Exterior Wall Painting', 'exterior-painting', 'Weather-resistant exterior painting with waterproof coating', 15, 'per sq ft', 480),
((SELECT id FROM service_categories WHERE slug='painting'), 'Texture Painting', 'texture-painting', 'Designer texture painting for accent walls', 80, 'per sq ft', 240),
-- Pest Control
((SELECT id FROM service_categories WHERE slug='pest-control'), 'Cockroach Control', 'cockroach-control', 'Gel-based cockroach treatment with 1-year warranty', 799, 'per house', 45),
((SELECT id FROM service_categories WHERE slug='pest-control'), 'Termite Treatment', 'termite-treatment', 'Anti-termite treatment with 5-year warranty', 4, 'per sq ft', 180),
((SELECT id FROM service_categories WHERE slug='pest-control'), 'Bed Bug Treatment', 'bedbug-treatment', 'Complete bed bug elimination with heat treatment', 1499, 'per room', 90),
-- Interior Design
((SELECT id FROM service_categories WHERE slug='interior-design'), 'Modular Kitchen', 'modular-kitchen', 'Complete modular kitchen design and installation', 150000, 'per kitchen', 7200),
((SELECT id FROM service_categories WHERE slug='interior-design'), 'Wardrobe Design', 'wardrobe-design', 'Custom wardrobe design and installation', 40000, 'per bedroom', 4800),
((SELECT id FROM service_categories WHERE slug='interior-design'), 'False Ceiling', 'false-ceiling', 'Gypsum and POP false ceiling with lighting', 150, 'per sq ft', 960),
-- Beauty at Home
((SELECT id FROM service_categories WHERE slug='beauty'), 'Women Facial & Cleanup', 'womens-facial', 'Deep cleansing facial with premium products', 599, 'per session', 45),
((SELECT id FROM service_categories WHERE slug='beauty'), 'Women Haircut & Styling', 'womens-haircut', 'Professional haircut, styling and treatment', 349, 'per session', 30),
((SELECT id FROM service_categories WHERE slug='beauty'), 'Men Haircut & Grooming', 'mens-grooming', 'Complete men grooming with haircut and beard styling', 299, 'per session', 30),
((SELECT id FROM service_categories WHERE slug='beauty'), 'Bridal Makeup Package', 'bridal-makeup', 'Complete bridal makeup and hairstyling package', 8999, 'per package', 180),
-- Packers & Movers
((SELECT id FROM service_categories WHERE slug='packers-movers'), 'Local House Shifting', 'local-shifting', 'Complete packaging and moving within city', 4999, 'per BHK', 480),
((SELECT id FROM service_categories WHERE slug='packers-movers'), 'Inter-City Moving', 'intercity-moving', 'Long-distance moving with insurance', 15000, 'per BHK', 1440),
-- Carpentry
((SELECT id FROM service_categories WHERE slug='carpentry'), 'Furniture Assembly', 'furniture-assembly', 'Assembly of flat-pack furniture from IKEA, etc.', 499, 'per item', 60),
((SELECT id FROM service_categories WHERE slug='carpentry'), 'Door Repair', 'door-repair', 'Repair of door hinges, locks and frames', 349, 'per door', 45),
-- Smart Home
((SELECT id FROM service_categories WHERE slug='smart-home'), 'CCTV Installation', 'cctv-installation', 'HD CCTV camera installation with remote viewing', 1999, 'per camera', 90),
((SELECT id FROM service_categories WHERE slug='smart-home'), 'Smart Lock Installation', 'smart-lock-installation', 'Digital smart lock with mobile app integration', 2499, 'per lock', 60),
-- Emergency Services
((SELECT id FROM service_categories WHERE slug='emergency'), 'Emergency Plumber', 'emergency-plumber', '24/7 emergency plumbing repair within 30 minutes', 999, 'emergency', 90),
((SELECT id FROM service_categories WHERE slug='emergency'), 'Emergency Electrician', 'emergency-electrician', '24/7 emergency electrical repair within 30 minutes', 999, 'emergency', 90),
((SELECT id FROM service_categories WHERE slug='emergency'), 'Water Leakage Emergency', 'water-leak-emergency', 'Urgent water leakage control and repair', 1299, 'emergency', 60);

-- AMC Plans
INSERT INTO amc_plans (name, tier, monthly_price, annual_price, discount_percent, features, visit_count_per_year) VALUES
('Silver Care', 'silver', 999, 9999, 5, '["Basic maintenance", "5% discount on services", "Standard booking priority", "Service history dashboard"]', 2),
('Gold Care', 'gold', 1999, 19999, 10, '["Priority booking", "10% discount on services", "1 free cleaning per month", "24/7 phone support", "Free annual inspection"]', 4),
('Platinum Care', 'platinum', 3999, 39999, 20, '["Emergency coverage 24/7", "20% discount on services", "Dedicated relationship manager", "Zero visit charges", "Free quarterly inspections", "Premium service queue"]', 12),
('Corporate Plan', 'corporate', 9999, 99999, 25, '["Custom SLA", "Dedicated team", "Monthly MIS reports", "Priority emergency response", "Invoice billing", "Multiple property management"]', 24);