-- Supabase Migration File

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
  multiplier NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car Models Table
CREATE TABLE IF NOT EXISTS car_models (
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  multiplier NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (name, make)
);

-- Fuel Types Table
CREATE TABLE IF NOT EXISTS fuel_types (
  name TEXT PRIMARY KEY,
  multiplier NUMERIC DEFAULT 1.0,
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
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  wallet_balance NUMERIC DEFAULT 0,
  referral_code TEXT UNIQUE,
  referrals_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Config Table (for settings, ui_settings, api_keys)
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE car_makes;
ALTER PUBLICATION supabase_realtime ADD TABLE car_models;
ALTER PUBLICATION supabase_realtime ADD TABLE fuel_types;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE brands;
ALTER PUBLICATION supabase_realtime ADD TABLE site_config;
