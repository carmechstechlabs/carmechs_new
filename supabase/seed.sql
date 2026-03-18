-- Seed Data for CarMechs Tech Labs

-- 1. Service Categories
INSERT INTO service_categories (id, name, description, icon_name) VALUES
('cat_1', 'Periodic Maintenance', 'Regular oil changes, filter replacements, and general health checks.', 'Wrench'),
('cat_2', 'AC & Electrical', 'Air conditioning service, battery replacement, and wiring diagnostics.', 'Zap'),
('cat_3', 'Body & Paint', 'Dent removal, scratch repair, and full body repainting services.', 'PaintBucket'),
('cat_4', 'Tires & Wheels', 'Wheel alignment, balancing, and tire replacement services.', 'Disc'),
('cat_5', 'Deep Cleaning', 'Interior detailing, exterior polishing, and engine bay cleaning.', 'Sparkles')
ON CONFLICT (id) DO NOTHING;

-- 2. Services
INSERT INTO services (id, title, description, price, duration, base_price, estimated_price, estimated_duration, icon_name, category_id, features, checks) VALUES
('ser_1', 'Periodic Maintenance', 'Comprehensive oil change, filter replacement, and 60-point safety inspection.', '₹1,499', '90 Mins', 1499, 1499, '90 Mins', 'Wrench', 'cat_1', '["Engine Oil Replacement", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Top-up", "60-Point Inspection"]', '["Engine Oil Level", "Brake Pad Wear", "Tyre Pressure", "Battery Health", "Fluid Levels", "Lights & Horn"]'),
('ser_2', 'AC Service & Repair', 'Cooling coil cleaning, gas refill, and compressor health check for maximum cooling.', '₹1,999', '2 Hours', 1999, 1999, '2 Hours', 'Zap', 'cat_2', '["AC Gas Refill", "Condenser Cleaning", "Cooling Coil Inspection", "Cabin Filter Cleaning", "Compressor Oil Top-up"]', '["Vent Temperature", "Gas Pressure", "Compressor Noise", "Leakage Test", "Belt Tension"]'),
('ser_3', 'Brake Maintenance', 'Brake pad replacement and disc resurfacing for ultimate stopping power.', '₹899', '60 Mins', 899, 899, '60 Mins', 'ShieldCheck', 'cat_1', '["Brake Pad Cleaning", "Disc Resurfacing", "Brake Fluid Top-up", "Caliper Greasing"]', '["Brake Pad Thickness", "Disc Condition", "Brake Line Integrity", "Pedal Feel"]'),
('ser_4', 'Wheel Care', 'Precision wheel alignment and balancing for a smoother, safer ride.', '₹699', '45 Mins', 699, 699, '45 Mins', 'Disc', 'cat_4', '["3D Wheel Alignment", "Wheel Balancing", "Tyre Rotation", "Nitrogen Inflation"]', '["Alignment Angles", "Wheel Runout", "Tyre Tread Depth", "Suspension Play"]'),
('ser_5', 'Ceramic Coating', '9H Nano-ceramic coating for ultimate paint protection and mirror-like shine.', '₹14,999', '2 Days', 14999, 14999, '2 Days', 'Sparkles', 'cat_5', '["Surface Decontamination", "Multi-stage Paint Correction", "9H Ceramic Application", "Interior Protection", "Glass Coating"]', '["Paint Thickness", "Surface Smoothness", "Hydrophobic Effect", "Gloss Level"]'),
('ser_6', 'Engine Overhaul', 'Complete engine disassembly, cleaning, and replacement of worn components.', '₹45,000', '7 Days', 45000, 45000, '7 Days', 'Settings', 'cat_1', '["Engine Block Honing", "Piston Ring Replacement", "Bearing Replacement", "Gasket Set Renewal", "Timing Chain/Belt Replacement"]', '["Compression Test", "Oil Pressure", "Cooling System Pressure", "Leakage Test"]')
ON CONFLICT (id) DO NOTHING;

-- 3. Car Makes
INSERT INTO car_makes (id, name) VALUES
('mk_1', 'Toyota'),
('mk_2', 'Honda'),
('mk_3', 'BMW'),
('mk_4', 'Mercedes'),
('mk_5', 'Audi'),
('mk_6', 'Porsche'),
('mk_7', 'Jaguar'),
('mk_8', 'Land Rover'),
('mk_9', 'Lexus'),
('mk_10', 'Hyundai'),
('mk_11', 'Tata'),
('mk_12', 'Mahindra'),
('mk_13', 'Volkswagen'),
('mk_14', 'Skoda'),
('mk_15', 'Kia'),
('mk_16', 'MG')
ON CONFLICT (id) DO NOTHING;

-- 4. Fuel Types
INSERT INTO fuel_types (id, name) VALUES
('ft_1', 'Petrol'),
('ft_2', 'Diesel'),
('ft_3', 'Electric'),
('ft_4', 'CNG'),
('ft_5', 'Hybrid')
ON CONFLICT (id) DO NOTHING;

-- 5. Technicians
INSERT INTO technicians (id, name, specialty, status) VALUES
('tech1', 'Rajesh Kumar', 'Engine Specialist', 'available'),
('tech2', 'Amit Singh', 'Electrical Expert', 'busy'),
('tech3', 'Suresh Raina', 'Body & Paint', 'available'),
('tech4', 'Vijay Verma', 'AC Specialist', 'off')
ON CONFLICT (id) DO NOTHING;

-- 6. Navigation Items
INSERT INTO navigation_items (id, label, path, order_index, is_active, admin_only) VALUES
('nav_1', 'Home', '/', 1, true, false),
('nav_2', 'Services', '/services', 2, true, false),
('nav_3', 'Brands', '/#brands', 3, true, false),
('nav_4', 'Locations', '/#locations', 4, true, false),
('nav_5', 'About', '/about', 5, true, false),
('nav_6', 'Contact', '/contact', 6, true, false)
ON CONFLICT (id) DO NOTHING;
