-- Supabase Migration Script for CarMechs
-- This script creates all necessary tables for the application to function in a production environment.

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT,
    duration TEXT,
    features TEXT[],
    checks TEXT[],
    base_price NUMERIC DEFAULT 0,
    estimated_price NUMERIC DEFAULT 0,
    estimated_duration TEXT,
    icon_url TEXT,
    icon_name TEXT,
    category_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Car Makes Table
CREATE TABLE IF NOT EXISTS car_makes (
    name TEXT PRIMARY KEY,
    price NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Car Models Table
CREATE TABLE IF NOT EXISTS car_models (
    name TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Fuel Types Table
CREATE TABLE IF NOT EXISTS fuel_types (
    name TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    is_popular BOOLEAN DEFAULT FALSE,
    working_hours TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    price NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'in_stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount NUMERIC,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_id TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Service Packages Table
CREATE TABLE IF NOT EXISTS service_packages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    service_ids TEXT[],
    discount_percentage NUMERIC DEFAULT 0,
    base_price NUMERIC DEFAULT 0,
    features TEXT[],
    is_popular BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT,
    fuel_type TEXT,
    license_plate TEXT,
    vin TEXT,
    last_service_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT,
    role TEXT DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE,
    blocked BOOLEAN DEFAULT FALSE,
    wallet_balance NUMERIC DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    referrals_count INTEGER DEFAULT 0,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service_title TEXT NOT NULL,
    service_id TEXT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    fuel TEXT NOT NULL,
    year TEXT,
    license_plate TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    amount NUMERIC,
    technician_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE,
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Site Config Table
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Technicians Table
CREATE TABLE IF NOT EXISTS technicians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER DEFAULT 5,
    location TEXT,
    car_model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE car_makes;
ALTER PUBLICATION supabase_realtime ADD TABLE car_models;
ALTER PUBLICATION supabase_realtime ADD TABLE fuel_types;
ALTER PUBLICATION supabase_realtime ADD TABLE brands;
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE service_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE site_config;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE technicians;
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;

-- 21. Initial Data Seed
-- Users (Admin & Viewer)
INSERT INTO users (id, name, email, phone, password, role, verified, blocked, wallet_balance, referral_code)
VALUES 
('1', 'Admin User', 'admin@carmechs.in', '1234567890', 'Admin@270389', 'admin', true, false, 1000, 'ADMIN123'),
('2', 'Test Viewer', 'viewer@carmechs.in', '0987654321', 'viewer', 'viewer', true, false, 250, 'VIEWER456')
ON CONFLICT (id) DO NOTHING;

-- Technicians
INSERT INTO technicians (id, name, specialty, status)
VALUES 
('t1', 'Rajesh Kumar', 'Engine Specialist', 'available'),
('t2', 'Amit Singh', 'AC & Electrical', 'busy'),
('t3', 'Suresh Raina', 'Body & Paint', 'available'),
('t4', 'Vikram Rathore', 'General Service', 'available')
ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO services (id, title, description, price, duration, features, checks, base_price, estimated_price, estimated_duration, icon_name, category_id)
VALUES 
('ser_1', 'Periodic Maintenance', 'Comprehensive oil change, filter replacement, and 60-point safety inspection.', '₹1,499', '90 Mins', ARRAY['Engine Oil Replacement', 'Oil Filter Replacement', 'Air Filter Cleaning', 'Coolant Top-up', 'Brake Fluid Top-up', '60-Point Inspection'], ARRAY['Engine Oil Level', 'Brake Pad Wear', 'Tyre Pressure', 'Battery Health', 'Fluid Levels', 'Lights & Horn'], 1499, 1499, '90 Mins', 'Wrench', 'cat_1'),
('ser_2', 'AC Service & Repair', 'Cooling coil cleaning, gas refill, and compressor health check for maximum cooling.', '₹1,999', '2 Hours', ARRAY['AC Gas Refill', 'Condenser Cleaning', 'Cooling Coil Inspection', 'Cabin Filter Cleaning', 'Compressor Oil Top-up'], ARRAY['Vent Temperature', 'Gas Pressure', 'Compressor Noise', 'Leakage Test', 'Belt Tension'], 1999, 1999, '2 Hours', 'Zap', 'cat_2'),
('ser_3', 'Brake Maintenance', 'Brake pad replacement and disc resurfacing for ultimate stopping power.', '₹899', '60 Mins', ARRAY['Brake Pad Cleaning', 'Disc Resurfacing', 'Brake Fluid Top-up', 'Caliper Greasing'], ARRAY['Brake Pad Thickness', 'Disc Condition', 'Brake Line Integrity', 'Pedal Feel'], 899, 899, '60 Mins', 'ShieldCheck', 'cat_1'),
('ser_4', 'Wheel Care', 'Precision wheel alignment and balancing for a smoother, safer ride.', '₹699', '45 Mins', ARRAY['3D Wheel Alignment', 'Wheel Balancing', 'Tyre Rotation', 'Nitrogen Inflation'], ARRAY['Alignment Angles', 'Wheel Runout', 'Tyre Tread Depth', 'Suspension Play'], 699, 699, '45 Mins', 'Disc', 'cat_4'),
('ser_5', 'Ceramic Coating', '9H Nano-ceramic coating for ultimate paint protection and mirror-like shine.', '₹14,999', '2 Days', ARRAY['Surface Decontamination', 'Multi-stage Paint Correction', '9H Ceramic Application', 'Interior Protection', 'Glass Coating'], ARRAY['Paint Thickness', 'Surface Smoothness', 'Hydrophobic Effect', 'Gloss Level'], 14999, 14999, '2 Days', 'Sparkles', 'cat_5'),
('ser_6', 'Engine Overhaul', 'Complete engine disassembly, cleaning, and replacement of worn components.', '₹45,000', '7 Days', ARRAY['Engine Block Honing', 'Piston Ring Replacement', 'Bearing Replacement', 'Gasket Set Renewal', 'Timing Chain/Belt Replacement'], ARRAY['Compression Test', 'Oil Pressure', 'Cooling System Pressure', 'Leakage Test'], 45000, 45000, '7 Days', 'Settings', 'cat_1')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  base_price = EXCLUDED.base_price,
  estimated_price = EXCLUDED.estimated_price,
  estimated_duration = EXCLUDED.estimated_duration,
  icon_name = EXCLUDED.icon_name,
  category_id = EXCLUDED.category_id,
  features = EXCLUDED.features,
  checks = EXCLUDED.checks;

-- Car Makes
INSERT INTO car_makes (name, price)
VALUES 
('Toyota', 500),
('Honda', 500),
('BMW', 2000),
('Mercedes', 2500),
('Audi', 2000),
('Porsche', 5000),
('Jaguar', 4000),
('Land Rover', 4500),
('Lexus', 3500),
('Hyundai', 300),
('Tata', 200),
('Mahindra', 300),
('Volkswagen', 600),
('Skoda', 600),
('Kia', 400),
('MG', 500)
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price;

-- Car Models
INSERT INTO car_models (name, make, price)
VALUES 
('Corolla', 'Toyota', 0),
('Camry', 'Toyota', 500),
('Fortuner', 'Toyota', 1000),
('Civic', 'Honda', 0),
('City', 'Honda', 0),
('Accord', 'Honda', 500),
('3 Series', 'BMW', 0),
('5 Series', 'BMW', 1000),
('7 Series', 'BMW', 2000),
('C-Class', 'Mercedes', 0),
('E-Class', 'Mercedes', 1000),
('S-Class', 'Mercedes', 2000),
('A4', 'Audi', 0),
('A6', 'Audi', 1000),
('Q7', 'Audi', 2000),
('911 Carrera', 'Porsche', 5000),
('Cayenne', 'Porsche', 3000),
('XF', 'Jaguar', 1500),
('F-PACE', 'Jaguar', 2000),
('Range Rover', 'Land Rover', 3000),
('Defender', 'Land Rover', 2500),
('ES', 'Lexus', 1000),
('RX', 'Lexus', 2000),
('Creta', 'Hyundai', 0),
('Verna', 'Hyundai', 0),
('Nexon', 'Tata', 0),
('Harrier', 'Tata', 500),
('Safari', 'Tata', 700),
('Thar', 'Mahindra', 0),
('XUV700', 'Mahindra', 500)
ON CONFLICT (name, make) DO UPDATE SET price = EXCLUDED.price;

-- Locations
INSERT INTO locations (id, name, address, city, phone, email, latitude, longitude, is_popular, working_hours)
VALUES 
('kol-1', 'CarMechs Kolkata Hub', '123 Park Street, Near Maidan', 'Kolkata', '+91 98300 12345', 'kolkata@carmechs.in', 22.5488, 88.3522, true, '09:00 AM - 08:00 PM'),
('how-1', 'CarMechs Howrah Center', '45 Foreshore Road, Near Howrah Bridge', 'Howrah', '+91 98300 67890', 'howrah@carmechs.in', 22.5851, 88.3416, false, '09:00 AM - 07:00 PM')
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO testimonials (id, name, quote, rating, location, car_model)
VALUES 
('t1', 'Arjun Mehta', 'Exceptional service for my BMW. The transparency in pricing is what sets them apart.', 5, 'Kolkata', 'BMW 5 Series'),
('t2', 'Sneha Roy', 'Finally found a reliable workshop for my Audi in Howrah. Highly professional team.', 5, 'Howrah', 'Audi A4'),
('t3', 'Vikram Singh', 'The diagnostic accuracy is impressive. They fixed an issue that two other workshops couldn''t.', 5, 'Kolkata', 'Mercedes C-Class')
ON CONFLICT (id) DO NOTHING;

-- Fuel Types
INSERT INTO fuel_types (name)
VALUES ('Petrol'), ('Diesel'), ('CNG'), ('Electric')
ON CONFLICT (name) DO NOTHING;

-- Locations
INSERT INTO locations (id, name, address, city, phone, email, latitude, longitude, is_popular, working_hours, google_maps_url)
VALUES 
('1', 'New Delhi Hub', 'Plot 12, Okhla Phase III', 'New Delhi', '+91-11-4567-8901', 'delhi@carmechs.in', 28.5355, 77.2737, true, '09:00 AM - 08:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3505.5191!2d77.2737!3d28.5355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMyJzA3LjgiTiA3N8KwMTYnMjUuMyJF!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin'),
('2', 'Mumbai West', 'Andheri East, Near Metro Station', 'Mumbai', '+91-22-2345-6789', 'mumbai@carmechs.in', 19.1136, 72.8697, true, '09:00 AM - 09:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0!2d72.8697!3d19.1136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzQ5LjAiTiA3MsKwNTInMTAuOSJF!5e0!3m2!1sen!2sin!4v1631234567891!5m2!1sen!2sin'),
('3', 'Bangalore Tech Park', 'Whitefield Main Road', 'Bangalore', '+91-80-3456-7890', 'blr@carmechs.in', 12.9698, 77.7499, true, '08:30 AM - 07:30 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0!2d77.7499!3d12.9698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzExLjMiTiA3N8KwNDQnNTkuNiJF!5e0!3m2!1sen!2sin!4v1631234567892!5m2!1sen!2sin'),
('4', 'Kolkata Premium Hub', 'Action Area 1, Newtown', 'Kolkata', '+91-70034-35356', 'kolkata@carmechs.in', 22.5867, 88.4748, true, '09:00 AM - 08:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0!2d88.4748!3d22.5867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM1JzEyLjEiTiA4OMKwMjgnMjkuMyJF!5e0!3m2!1sen!2sin!4v1631234567893!5m2!1sen!2sin'),
('5', 'Howrah Service Center', 'GT Road, Near Howrah Maidan', 'Howrah', '+91-70034-35357', 'howrah@carmechs.in', 22.5851, 88.3248, true, '09:00 AM - 07:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0!2d88.3248!3d22.5851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM1JzA2LjQiTiA4OMKwMTknMjkuMyJF!5e0!3m2!1sen!2sin!4v1631234567894!5m2!1sen!2sin')
ON CONFLICT (id) DO NOTHING;

-- Site Config
INSERT INTO site_config (key, value)
VALUES 
('settings', '{"logoText": "CarMechs", "logoUrl": "", "email": "assist@carmechs.in", "phone": "+91-70034-35356", "address": "Newtown, Kolkata 700156", "whatsapp": "+917003435356", "referralRewardAmount": 500}'),
('ui_settings', '{"heroTitle": "Precision <br /><span class=\"text-primary\">Car Care</span>", "heroSubtitle": "Experience the next generation of car maintenance with our expert door-step service and transparent digital tracking.", "heroBgImage": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop", "adminLogin": {"loginTitle": "Admin Portal", "loginSubtitle": "CarMechs Management System", "loginBgColor": "#f8fafc", "loginAccentColor": "#e31e24", "loginTerminalId": "ADMIN_MAIN"}}')
ON CONFLICT (key) DO NOTHING;
