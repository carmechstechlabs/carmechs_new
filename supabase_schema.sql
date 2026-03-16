-- SQL Schema for CarMechs Supabase Database

-- 1. services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  base_price NUMERIC DEFAULT 0,
  duration TEXT,
  features TEXT[],
  checks TEXT[],
  icon_url TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. car_makes
CREATE TABLE IF NOT EXISTS car_makes (
  name TEXT PRIMARY KEY,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. car_models
CREATE TABLE IF NOT EXISTS car_models (
  name TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. fuel_types
CREATE TABLE IF NOT EXISTS fuel_types (
  name TEXT PRIMARY KEY,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. brands
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. locations
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. inventory
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  price NUMERIC DEFAULT 0,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. coupons
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  expiry_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_id TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. service_packages
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  password TEXT,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  wallet_balance NUMERIC DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  referrals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_title TEXT,
  service_id TEXT,
  make TEXT,
  model TEXT,
  fuel TEXT,
  date DATE,
  time TEXT,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount NUMERIC,
  technician_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. site_config
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
