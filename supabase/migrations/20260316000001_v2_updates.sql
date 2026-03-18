-- Updated Schema Migration for CarMechs Tech Labs (v2)
-- This migration adds missing tables and enhances existing ones for a complete workshop management system.

-- 1. BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  phone TEXT,
  email TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  is_popular BOOLEAN DEFAULT false,
  working_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INVENTORY
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  price DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'in_stock', -- 'in_stock', 'low_stock', 'out_of_stock'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed'
  discount_value DECIMAL NOT NULL,
  min_order_amount DECIMAL DEFAULT 0,
  max_discount DECIMAL,
  expiry_date TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TECHNICIANS
CREATE TABLE IF NOT EXISTS technicians (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  specialty TEXT,
  status TEXT DEFAULT 'available', -- 'available', 'busy', 'off'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES users(id),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT,
  fuel_type TEXT,
  license_plate TEXT,
  vin TEXT,
  last_service_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES users(id),
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_id TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SITE CONFIG
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. UPDATES TO EXISTING TABLES
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password TEXT;

ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS service_id TEXT;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS service_title TEXT;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS license_plate TEXT;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS amount DECIMAL;
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS issue_photos JSONB DEFAULT '[]';

-- 11. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- 12. RLS POLICIES
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access for authenticated users" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON inventory FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON coupons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON technicians FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON site_config FOR ALL USING (auth.role() = 'authenticated');
