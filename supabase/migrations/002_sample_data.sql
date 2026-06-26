-- Sample data for services
-- Cleaning Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Residential Cleaning', 'Cleaning Services', 'Complete home cleaning including rooms, kitchen, and bathroom', 1500, 120, true),
  ('Bathroom Deep Cleaning', 'Cleaning Services', 'Professional bathroom cleaning with disinfection', 800, 90, true),
  ('Kitchen Cleaning', 'Cleaning Services', 'Deep cleaning of kitchen appliances and surfaces', 1200, 100, true),
  ('Furniture Cleaning', 'Cleaning Services', 'Professional sofa and furniture cleaning', 2000, 150, true),
  ('Window & Glass Cleaning', 'Cleaning Services', 'Window, mirror, and glass surface cleaning', 600, 60, true);

-- Painting Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Interior Painting', 'Painting Services', 'Room interior painting with premium paints', 5000, 480, true),
  ('Exterior Painting', 'Painting Services', 'Building exterior and wall painting', 8000, 600, true),
  ('Decorative Painting', 'Painting Services', 'Custom decorative wall art and designs', 3000, 240, true),
  ('Wood Painting', 'Painting Services', 'Wood furniture and door painting', 2000, 180, true),
  ('Metal Painting', 'Painting Services', 'Metal gates and railings painting', 1500, 120, true);

-- Plumbing Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Pipe Installation', 'Plumbing Services', 'New water pipe installation and fitting', 2000, 120, true),
  ('Leak Repair', 'Plumbing Services', 'Repair of water leaks and pipe damage', 1500, 90, true),
  ('Bathroom Plumbing', 'Plumbing Services', 'Bathroom fixtures installation and repair', 3000, 150, true),
  ('Emergency Plumbing', 'Plumbing Services', 'Urgent plumbing issues 24/7', 2500, 60, true),
  ('Water Tank Service', 'Plumbing Services', 'Water tank cleaning and maintenance', 2000, 180, true);

-- Electrical Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Wiring Installation', 'Electrical Services', 'Complete electrical wiring for homes', 5000, 300, true),
  ('Light Installation', 'Electrical Services', 'Ceiling fan and light fitting installation', 1500, 60, true),
  ('Switch Board Repair', 'Electrical Services', 'Switchboard and circuit breaker repair', 2000, 90, true),
  ('Emergency Electrical', 'Electrical Services', 'Urgent electrical repairs 24/7', 2500, 60, true),
  ('Solar Installation', 'Electrical Services', 'Solar panel and inverter installation', 15000, 480, true);

-- Home Appliance Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('AC Service & Repair', 'Home Appliance Services', 'Air conditioner maintenance and repair', 1500, 120, true),
  ('Refrigerator Repair', 'Home Appliance Services', 'Fridge repair and maintenance', 1200, 90, true),
  ('Washing Machine Repair', 'Home Appliance Services', 'Washing machine servicing and repair', 1500, 120, true),
  ('TV Repair', 'Home Appliance Services', 'Television repair and troubleshooting', 1500, 90, true),
  ('Water Purifier Service', 'Home Appliance Services', 'Water purifier maintenance and filter change', 800, 60, true);

-- Smart Home & Security Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('CCTV Installation', 'Smart Home & Security Services', 'CCTV camera installation and setup', 8000, 240, true),
  ('Home Automation', 'Smart Home & Security Services', 'Smart lighting and device automation', 5000, 300, true),
  ('Fire Safety Setup', 'Smart Home & Security Services', 'Fire alarm and safety equipment installation', 3000, 180, true),
  ('Network Setup', 'Smart Home & Security Services', 'WiFi and network installation', 2000, 120, true),
  ('Security System', 'Smart Home & Security Services', 'Complete home security system installation', 10000, 360, true);

-- Pest Control Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Residential Pest Control', 'Pest Control Services', 'Indoor pest control for homes', 2000, 120, true),
  ('Termite Treatment', 'Pest Control Services', 'Termite control and treatment', 3000, 180, true),
  ('Cockroach Control', 'Pest Control Services', 'Cockroach and insect elimination', 1500, 90, true),
  ('Mosquito Control', 'Pest Control Services', 'Mosquito and vector pest control', 1000, 60, true),
  ('Commercial Pest Control', 'Pest Control Services', 'Office and commercial space pest control', 5000, 240, true);

-- Interior Design Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Home Interior Design', 'Interior Design Services', 'Complete home interior design consultation', 10000, 480, true),
  ('Commercial Design', 'Interior Design Services', 'Office and commercial space design', 15000, 600, true),
  ('Space Planning', 'Interior Design Services', 'Room layout and space optimization', 5000, 180, true),
  ('Luxury Interior', 'Interior Design Services', 'Premium luxury interior design', 25000, 720, true),
  ('Design Consultation', 'Interior Design Services', 'Professional design advice and consultation', 3000, 120, true);

-- Waterproofing Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Roof Waterproofing', 'Waterproofing Services', 'Roof waterproofing treatment', 8000, 360, true),
  ('Bathroom Waterproofing', 'Waterproofing Services', 'Bathroom waterproofing and sealing', 3000, 240, true),
  ('Exterior Waterproofing', 'Waterproofing Services', 'External wall waterproofing', 5000, 300, true),
  ('Basement Sealing', 'Waterproofing Services', 'Basement and foundation waterproofing', 6000, 300, true),
  ('Terrace Waterproofing', 'Waterproofing Services', 'Terrace floor waterproofing', 4000, 180, true);

-- Packers & Movers Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('House Shifting', 'Packers & Movers Services', 'Complete house relocation service', 20000, 480, true),
  ('Office Relocation', 'Packers & Movers Services', 'Commercial office shifting', 30000, 600, true),
  ('Packing Service', 'Packers & Movers Services', 'Professional packing of goods', 10000, 360, true),
  ('Transportation', 'Packers & Movers Services', 'Goods transportation service', 5000, 240, true),
  ('Unpacking Service', 'Packers & Movers Services', 'Unpacking and setup at new location', 5000, 180, true);

-- Emergency Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('24/7 Emergency Plumbing', 'Emergency Services', 'Round-the-clock emergency plumbing', 3000, 60, true),
  ('24/7 Emergency Electrical', 'Emergency Services', 'Round-the-clock emergency electrical', 3500, 60, true),
  ('24/7 Emergency AC', 'Emergency Services', 'Emergency AC and cooling issues', 3000, 90, true),
  ('24/7 Emergency Roof', 'Emergency Services', 'Emergency roof and leakage repair', 4000, 120, true),
  ('24/7 Emergency Sewage', 'Emergency Services', 'Emergency sewage and drainage repair', 5000, 120, true);

-- Additional categories sample services (at least 5 per category)
-- Construction & Civil Works
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Home Renovation', 'Construction & Civil Works', 'Complete home renovation project', 50000, 1440, true),
  ('Masonry Work', 'Construction & Civil Works', 'Brick laying and masonry work', 8000, 480, true),
  ('Tiling Service', 'Construction & Civil Works', 'Floor and wall tiling installation', 10000, 360, true),
  ('Fabrication Work', 'Construction & Civil Works', 'Custom metal and steel fabrication', 15000, 480, true),
  ('Building Structure', 'Construction & Civil Works', 'Building construction and structure work', 100000, 2880, true);

-- Roofing & PVC Sheet Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('PVC Roofing', 'Roofing & PVC Sheet Services', 'PVC roof installation and replacement', 8000, 360, true),
  ('UPVC Installation', 'Roofing & PVC Sheet Services', 'UPVC window and door installation', 6000, 240, true),
  ('Metal Roofing', 'Roofing & PVC Sheet Services', 'Metal sheet roofing installation', 10000, 420, true),
  ('Structural Roofing', 'Roofing & PVC Sheet Services', 'Structural steel roofing', 15000, 480, true),
  ('Roof Maintenance', 'Roofing & PVC Sheet Services', 'Roof inspection and maintenance', 3000, 180, true);

-- Furniture Assembly & Carpentry
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Furniture Assembly', 'Furniture Assembly & Carpentry', 'Assembly of ready-made furniture', 1500, 120, true),
  ('Custom Carpentry', 'Furniture Assembly & Carpentry', 'Custom wooden furniture making', 8000, 480, true),
  ('Wardrobe Assembly', 'Furniture Assembly & Carpentry', 'Wardrobe and cabinet assembly', 2000, 120, true),
  ('Furniture Repair', 'Furniture Assembly & Carpentry', 'Furniture repair and restoration', 2500, 180, true),
  ('Shelving Installation', 'Furniture Assembly & Carpentry', 'Wall shelving and rack installation', 3000, 180, true);

-- Garden & Outdoor Services
insert into public.services (name, category, description, price, estimated_time, is_active) values
  ('Gardening Service', 'Garden & Outdoor Services', 'Garden maintenance and landscaping', 3000, 180, true),
  ('Outdoor Maintenance', 'Garden & Outdoor Services', 'Outdoor area maintenance and cleanup', 2000, 120, true),
  ('Solar Garden Lights', 'Garden & Outdoor Services', 'Solar lighting for garden and outdoor', 2500, 120, true),
  ('Lawn Care', 'Garden & Outdoor Services', 'Lawn mowing and grass treatment', 2000, 120, true),
  ('Outdoor Furniture', 'Garden & Outdoor Services', 'Outdoor furniture setup and maintenance', 3000, 180, true);

-- Sample AMC Plan
insert into public.amc_plans (name, description, price, benefits, validity_days) values
  ('Silver', 'Basic AMC with standard benefits', 4999, '["Free quarterly inspection", "10% discount on services", "Priority support", "Free basic repairs"]', 365),
  ('Gold', 'Premium AMC with extended benefits', 9999, '["Free monthly inspection", "15% discount on services", "24/7 priority support", "Free repairs up to 3", "Free annual deep cleaning"]', 365),
  ('Platinum', 'Premium Plus AMC', 19999, '["Free monthly inspection", "20% discount on services", "24/7 VIP support", "Unlimited repairs", "Free 2x deep cleaning", "Free annual maintenance"]', 365),
  ('Corporate', 'Corporate office AMC', 49999, '["Weekly inspection", "25% discount on services", "Dedicated account manager", "Unlimited repairs", "Free 4x deep cleaning", "Custom maintenance plan"]', 365);
