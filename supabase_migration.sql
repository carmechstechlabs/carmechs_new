-- CarMechs Comprehensive Supabase Migration Script
-- This script creates all necessary tables, enables Realtime, and seeds initial data.

-- 1. TABLE CREATION
--------------------------------------------------------------------------------

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  price TEXT,
  base_price NUMERIC,
  duration TEXT,
  checks TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car Makes Table
CREATE TABLE IF NOT EXISTS car_makes (
  name TEXT PRIMARY KEY,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car Models Table
CREATE TABLE IF NOT EXISTS car_models (
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (name, make)
);

-- Fuel Types Table
CREATE TABLE IF NOT EXISTS fuel_types (
  name TEXT PRIMARY KEY,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  fuel TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  wallet_balance NUMERIC DEFAULT 0,
  referral_code TEXT UNIQUE,
  referrals_count INTEGER DEFAULT 0,
  referred_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_purchase NUMERIC DEFAULT 0,
  expiry_date TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  service_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Config Table (for settings, ui_settings, api_keys)
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. REALTIME ENABLEMENT
--------------------------------------------------------------------------------
-- Note: You may need to enable this manually in the Supabase Dashboard under Database -> Replication
-- if the publication doesn't exist yet.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE car_makes;
ALTER PUBLICATION supabase_realtime ADD TABLE car_models;
ALTER PUBLICATION supabase_realtime ADD TABLE fuel_types;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE brands;
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE site_config;

-- 3. INITIAL SEED DATA
--------------------------------------------------------------------------------

-- Seed Services
INSERT INTO services (id, title, description, features, price, base_price, duration, checks) VALUES
('periodic', 'Periodic Services', 'Comprehensive car service packages for complete peace of mind.', ARRAY['Oil Change', 'Filter Replacement', 'Brake Check', 'Fluid Top-up'], '₹1999', 1999, '4-6 Hours', ARRAY['Engine Oil Replacement', 'Oil Filter Replacement', 'Air Filter Cleaning', 'Coolant Top-up', 'Brake Fluid Top-up', 'Battery Water Top-up', 'Wiper Fluid Top-up', 'Heater/Spark Plugs Checking', 'Car Wash & Vacuuming', 'Brake Pads & Shoes Cleaning']),
('tyres', 'Tyres & Wheels', 'Expert tyre services including alignment and balancing.', ARRAY['Wheel Alignment', 'Wheel Balancing', 'Tyre Rotation', 'Puncture Repair'], '₹999', 999, '1-2 Hours', ARRAY['Automated Wheel Balancing', 'Laser Wheel Alignment', 'Tyre Rotation (4 Wheels)', 'Tyre Health Inspection', 'Air Pressure Check', 'Steering Adjustment', 'Suspension Check']),
('batteries', 'Batteries', 'Battery health check and replacement services.', ARRAY['Battery Testing', 'Charging System Check', 'Terminal Cleaning', 'Replacement'], '₹3499', 3499, '30-60 Minutes', ARRAY['Battery Voltage Check', 'Alternator Charging Check', 'Terminal Cleaning & Greasing', 'Distilled Water Top-up', 'Battery Health Report', 'Old Battery Buyback', 'Warranty Registration']),
('denting', 'Denting & Painting', 'Restore your car''s look with our premium painting services.', ARRAY['Scratch Removal', 'Dent Repair', 'Full Body Paint', 'Polishing'], 'Custom', 4999, '2-5 Days', ARRAY['Grade A Primer Application', 'Premium Paint Matching', '3-Layer Painting Process', 'Clear Coat Application', 'Rubbing & Polishing', 'Panel Dent Removal', 'Rust Protection Coating']),
('ac', 'AC Service', 'Keep your car cool with our AC maintenance packages.', ARRAY['Gas Refill', 'Cooling Coil Cleaning', 'Compressor Check', 'Leak Test'], '₹1499', 1499, '2-3 Hours', ARRAY['AC Gas Refill (up to 400g)', 'Cooling Coil Cleaning', 'Condenser Cleaning', 'AC Vent Cleaning', 'Compressor Oil Check', 'Leakage Inspection', 'Cabin Filter Cleaning']),
('spa', 'Car Spa & Cleaning', 'Deep cleaning services for interior and exterior.', ARRAY['Interior Detailing', 'Exterior Wash', 'Waxing', 'Upholstery Cleaning'], '₹1199', 1199, '3-4 Hours', ARRAY['Complete Interior Vacuuming', 'Dashboard Cleaning & Polishing', 'Seats Dry Cleaning', 'Roof & Floor Cleaning', 'Exterior Foam Wash', 'Tyre Dressing', 'Glass Cleaning'])
ON CONFLICT (id) DO NOTHING;

-- Seed Car Makes
INSERT INTO car_makes (name, price) VALUES
('Toyota', 500),
('Honda', 500),
('Ford', 500),
('BMW', 2000),
('Mercedes', 2000),
('Audi', 2000),
('Hyundai', 0),
('Kia', 0)
ON CONFLICT (name) DO NOTHING;

-- Seed Car Models
INSERT INTO car_models (name, make, price) VALUES
('Corolla', 'Toyota', 200),
('Camry', 'Toyota', 500),
('Fortuner', 'Toyota', 1000),
('City', 'Honda', 200),
('Civic', 'Honda', 400),
('Amaze', 'Honda', 0),
('EcoSport', 'Ford', 300),
('Endeavour', 'Ford', 1200),
('3 Series', 'BMW', 1500),
('5 Series', 'BMW', 2500),
('X5', 'BMW', 3500),
('C-Class', 'Mercedes', 1500),
('E-Class', 'Mercedes', 2500),
('A4', 'Audi', 1500),
('Q7', 'Audi', 3500),
('Creta', 'Hyundai', 300),
('Verna', 'Hyundai', 300),
('Seltos', 'Kia', 300),
('Sonet', 'Kia', 0)
ON CONFLICT (name, make) DO NOTHING;

-- Seed Fuel Types
INSERT INTO fuel_types (name, price) VALUES
('Petrol', 0),
('Diesel', 400),
('CNG', 200),
('Electric', 600)
ON CONFLICT (name) DO NOTHING;

-- Seed Admin User
INSERT INTO users (id, name, email, phone, password, role, verified, blocked, wallet_balance, referral_code, referrals_count) VALUES
('1', 'Admin User', 'admin@carmechs.in', '1234567890', 'admin', 'admin', TRUE, FALSE, 1000, 'ADMIN123', 0)
ON CONFLICT (id) DO NOTHING;

-- Seed Brands
INSERT INTO brands (id, name, image_url) VALUES
('1', 'Toyota', 'https://picsum.photos/seed/toyota/200/100'),
('2', 'Honda', 'https://picsum.photos/seed/honda/200/100'),
('3', 'Ford', 'https://picsum.photos/seed/ford/200/100'),
('4', 'BMW', 'https://picsum.photos/seed/bmw/200/100'),
('5', 'Mercedes', 'https://picsum.photos/seed/mercedes/200/100'),
('6', 'Audi', 'https://picsum.photos/seed/audi/200/100')
ON CONFLICT (id) DO NOTHING;

-- Seed Locations
INSERT INTO locations (id, name, is_popular) VALUES
('1', 'New Delhi', TRUE),
('2', 'Mumbai', TRUE),
('3', 'Bangalore', TRUE),
('4', 'Hyderabad', TRUE),
('5', 'Chennai', TRUE),
('6', 'Kolkata', TRUE),
('7', 'Pune', FALSE),
('8', 'Ahmedabad', FALSE),
('9', 'Gurgaon', FALSE),
('10', 'Noida', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Config
INSERT INTO site_config (key, value) VALUES
('settings', '{"logoText": "CarMechs", "logoUrl": "", "email": "assist@carmechs.in", "phone": "+91-70034-35356", "address": "Newtown, Kolkata 700156", "whatsapp": "+917003435356", "referralRewardAmount": 500, "facebook": "https://facebook.com/carmechs", "instagram": "https://instagram.com/carmechs", "twitter": "https://twitter.com/carmechs", "footerDescription": "Premium car service at your doorstep. We provide expert care for your vehicle with free pickup and drop facility.", "privacyPolicyUrl": "/privacy", "termsOfServiceUrl": "/terms"}'),
('ui_settings', '{"heroTitle": "Expert Car Service at Your Doorstep", "heroSubtitle": "Professional mechanics, transparent pricing, and guaranteed satisfaction.", "heroBgImage": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop", "heroBgOpacity": 0.6, "primaryColor": "#0f172a", "whyChooseTitle": "Why Choose CarMechs?", "whyChooseDescription": "We are committed to providing the best car service experience. With our team of expert mechanics and state-of-the-art workshops, your car is in safe hands.", "whyChooseImage": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "features": [{"title": "Genuine Parts", "description": "We use only 100% genuine OEM/OES spare parts.", "iconName": "ShieldCheck"}, {"title": "Timely Delivery", "description": "We value your time and ensure on-time delivery.", "iconName": "Clock"}, {"title": "Transparent Pricing", "description": "Upfront pricing with no hidden charges.", "iconName": "IndianRupee"}, {"title": "Expert Mechanics", "description": "Highly trained and certified mechanics.", "iconName": "Wrench"}], "testimonialText": "Best service I''ve ever had! My car runs smoother than ever.", "testimonialAuthor": "Alex Johnson", "testimonialRating": 4.9, "adminLogin": {"loginTitle": "Terminal 01", "loginSubtitle": "Security Clearance Required", "loginBgColor": "#050505", "loginAccentColor": "#fc9c0a", "loginTerminalId": "ID_REQ_001"}, "userLogin": {"loginTitle": "Welcome back", "loginSubtitle": "Enter your details to access your account", "loginBgColor": "#050505", "loginAccentColor": "#3b82f6", "showGoogleLogin": true, "showPhoneLogin": true}}')
ON CONFLICT (key) DO NOTHING;
