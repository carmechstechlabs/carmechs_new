-- Create tables for CarMechs application

-- Enable Realtime for all tables
-- Note: You need to manually enable Realtime for these tables in the Supabase Dashboard 
-- or run: alter publication supabase_realtime add table <table_name>;

-- Services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  base_price NUMERIC,
  duration TEXT,
  features TEXT[],
  checks TEXT[],
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Car Makes
CREATE TABLE IF NOT EXISTS car_makes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Car Models
CREATE TABLE IF NOT EXISTS car_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, make)
);

-- Fuel Types
CREATE TABLE IF NOT EXISTS fuel_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings (Single row table)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  logo_text TEXT,
  logo_url TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  whatsapp TEXT,
  referral_reward_amount NUMERIC DEFAULT 500,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT,
  footer_description TEXT,
  privacy_policy_url TEXT,
  terms_of_service_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UI Settings (Single row table)
CREATE TABLE IF NOT EXISTS ui_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_bg_image TEXT,
  hero_bg_opacity NUMERIC DEFAULT 0.5,
  primary_color TEXT,
  why_choose_title TEXT,
  why_choose_description TEXT,
  why_choose_image TEXT,
  features JSONB,
  testimonial_text TEXT,
  testimonial_author TEXT,
  testimonial_rating NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys (Single row table)
CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  google_client_id TEXT,
  firebase_api_key TEXT,
  firebase_auth_domain TEXT,
  firebase_project_id TEXT,
  firebase_storage_bucket TEXT,
  firebase_messaging_sender_id TEXT,
  firebase_app_id TEXT,
  razorpay_key_id TEXT,
  razorpay_key_secret TEXT,
  paytm_mid TEXT,
  paytm_merchant_key TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT false,
  blocked BOOLEAN DEFAULT false,
  wallet_balance NUMERIC DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by TEXT REFERENCES users(id),
  referrals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  fuel TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE car_makes;
ALTER PUBLICATION supabase_realtime ADD TABLE car_models;
ALTER PUBLICATION supabase_realtime ADD TABLE fuel_types;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
ALTER PUBLICATION supabase_realtime ADD TABLE ui_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE api_keys;
ALTER PUBLICATION supabase_realtime ADD TABLE brands;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- Storage Buckets
-- Note: You need to create these buckets in the Supabase Dashboard and set appropriate RLS policies.
-- Bucket name: 'logos'
-- Bucket name: 'hero'
-- Bucket name: 'brands'
