-- Seed Data for CarMechs Tech Labs

-- 1. Categories
INSERT INTO categories (id, name, description, icon_name) VALUES
('cat_1', 'Periodic Maintenance', 'Regular oil changes, filter replacements, and general health checks.', 'Wrench'),
('cat_2', 'AC & Electrical', 'Air conditioning service, battery replacement, and wiring diagnostics.', 'Zap'),
('cat_3', 'Body & Paint', 'Dent removal, scratch repair, and full body repainting services.', 'PaintBucket'),
('cat_4', 'Tires & Wheels', 'Wheel alignment, balancing, and tire replacement services.', 'Disc'),
('cat_5', 'Deep Cleaning', 'Interior detailing, exterior polishing, and engine bay cleaning.', 'Sparkles'),
('cat_6', 'Wheel Alignment & Balancing', 'Precision alignment and balancing for smooth driving.', 'Disc')
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
INSERT INTO car_makes (id, name, price) VALUES
('make_1', 'Toyota', 500),
('make_2', 'Honda', 500),
('make_3', 'BMW', 2000),
('make_4', 'Mercedes', 2500),
('make_5', 'Audi', 2000),
('make_6', 'Porsche', 5000),
('make_7', 'Jaguar', 4000),
('make_8', 'Land Rover', 4500),
('make_9', 'Lexus', 3500),
('make_10', 'Hyundai', 300),
('make_11', 'Tata', 200),
('make_12', 'Mahindra', 300),
('make_13', 'Volkswagen', 600),
('make_14', 'Skoda', 600),
('make_15', 'Kia', 400),
('make_16', 'MG', 500)
ON CONFLICT (id) DO NOTHING;

-- 4. Car Models
INSERT INTO car_models (id, name, make, price) VALUES
('model_1', 'Corolla', 'Toyota', 0),
('model_2', 'Camry', 'Toyota', 500),
('model_3', 'Fortuner', 'Toyota', 1000),
('model_4', 'Civic', 'Honda', 0),
('model_5', 'City', 'Honda', 0),
('model_6', 'Accord', 'Honda', 500),
('model_7', '3 Series', 'BMW', 0),
('model_8', '5 Series', 'BMW', 1000),
('model_9', '7 Series', 'BMW', 2000),
('model_10', 'C-Class', 'Mercedes', 0),
('model_11', 'E-Class', 'Mercedes', 1000),
('model_12', 'S-Class', 'Mercedes', 2000),
('model_13', 'A4', 'Audi', 0),
('model_14', 'A6', 'Audi', 1000),
('model_15', 'Q7', 'Audi', 2000),
('model_16', '911 Carrera', 'Porsche', 5000),
('model_17', 'Cayenne', 'Porsche', 3000),
('model_18', 'XF', 'Jaguar', 1500),
('model_19', 'F-PACE', 'Jaguar', 2000),
('model_20', 'Range Rover', 'Land Rover', 3000),
('model_21', 'Defender', 'Land Rover', 2500),
('model_22', 'ES', 'Lexus', 1000),
('model_23', 'RX', 'Lexus', 2000),
('model_24', 'Creta', 'Hyundai', 0),
('model_25', 'Verna', 'Hyundai', 0),
('model_26', 'Nexon', 'Tata', 0),
('model_27', 'Harrier', 'Tata', 500),
('model_28', 'Safari', 'Tata', 700),
('model_29', 'Thar', 'Mahindra', 0),
('model_30', 'XUV700', 'Mahindra', 500)
ON CONFLICT (id) DO NOTHING;

-- 5. Fuel Types
INSERT INTO fuel_types (id, name, price) VALUES
('fuel_1', 'Petrol', 0),
('fuel_2', 'Diesel', 300),
('fuel_3', 'Electric', 800),
('fuel_4', 'CNG', 200),
('fuel_5', 'Hybrid', 600)
ON CONFLICT (id) DO NOTHING;

-- 6. Users
INSERT INTO users (id, name, email, phone, password, role, verified, wallet_balance, referral_code) VALUES
('1', 'Admin User', 'carmechstechlabs@gmail.com', '1234567890', 'Admin@270389', 'admin', true, 1000, 'ADMIN123'),
('2', 'Test Viewer', 'viewer@carmechs.in', '0987654321', 'viewer', 'viewer', true, 250, 'VIEWER456')
ON CONFLICT (id) DO NOTHING;

-- 7. Technicians
INSERT INTO technicians (id, name, specialty, status, rating) VALUES
('tech1', 'Rajesh Kumar', 'Engine Specialist', 'available', 4.8),
('tech2', 'Amit Singh', 'Electrical Expert', 'busy', 4.5),
('tech3', 'Suresh Raina', 'Body & Paint', 'available', 4.7),
('tech4', 'Vijay Verma', 'AC Specialist', 'off', 4.6)
ON CONFLICT (id) DO NOTHING;

-- 8. Navigation Items
INSERT INTO navigation_items (id, label, path, order_index, is_active, admin_only) VALUES
('nav_1', 'Home', '/', 1, true, false),
('nav_2', 'Services', '/services', 2, true, false),
('nav_3', 'Brands', '/#brands', 3, true, false),
('nav_4', 'Locations', '/#locations', 4, true, false),
('nav_5', 'About', '/about', 5, true, false),
('nav_6', 'Contact', '/contact', 6, true, false)
ON CONFLICT (id) DO NOTHING;

-- 9. Site Config
INSERT INTO site_config (key, value) VALUES
('settings', '{"logoText": "CarMechs", "email": "support@carmechs.in", "phone": "+91 1234567890", "address": "Kolkata, West Bengal", "whatsapp": "+91 1234567890", "referralRewardAmount": 500}'),
('ui_settings', '{"heroTitle": "Expert Car Care at Your Doorstep", "heroSubtitle": "Professional car services, repairs and maintenance with transparent pricing.", "primaryColor": "#e31e24", "darkMode": false}'),
('api_keys', '{"googleClientId": "", "firebaseApiKey": ""}')
ON CONFLICT (key) DO NOTHING;
