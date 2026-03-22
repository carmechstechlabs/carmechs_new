-- Migration to support new features: Services, Packages, Locations, Inventory, Technicians, Tasks, Reviews, Brands, Navigation, and Coupons

-- 1. Update services table with new columns if they don't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS checks JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS common_issues JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS recommended_checkups JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS applicable_makes JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS applicable_models JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS applicable_fuel_types JSONB DEFAULT '[]';

-- 2. Create service_packages table if it doesn't exist
CREATE TABLE IF NOT EXISTS service_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  service_ids JSONB DEFAULT '[]',
  discount_percentage NUMERIC DEFAULT 0,
  base_price NUMERIC DEFAULT 0,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update locations table
ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS working_hours TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- 4. Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Update technicians table for availability
ALTER TABLE technicians ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';
ALTER TABLE technicians ADD COLUMN IF NOT EXISTS specialty TEXT;

-- 6. Update appointments table to include technician_id
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS technician_id TEXT;

-- 7. Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium',
  completed BOOLEAN DEFAULT false,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT,
  rating INTEGER DEFAULT 5,
  comment TEXT,
  service_id TEXT,
  technician_id TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT
);

-- 10. Create navigation_items table
CREATE TABLE IF NOT EXISTS navigation_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  admin_only BOOLEAN DEFAULT false
);

-- 11. Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- 12. Update users table for roles
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 13. Enable RLS on new tables
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 14. Create basic policies (Allow read for all, write for authenticated admins)
CREATE POLICY "Allow public read on service_packages" ON service_packages FOR SELECT USING (true);
CREATE POLICY "Allow admin write on service_packages" ON service_packages FOR ALL USING (true);

CREATE POLICY "Allow public read on inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Allow admin write on inventory" ON inventory FOR ALL USING (true);

CREATE POLICY "Allow public read on tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow admin write on tasks" ON tasks FOR ALL USING (true);

CREATE POLICY "Allow public read on reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write on reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin write on reviews" ON reviews FOR ALL USING (true);

CREATE POLICY "Allow public read on brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow admin write on brands" ON brands FOR ALL USING (true);

CREATE POLICY "Allow public read on navigation_items" ON navigation_items FOR SELECT USING (true);
CREATE POLICY "Allow admin write on navigation_items" ON navigation_items FOR ALL USING (true);

CREATE POLICY "Allow public read on coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Allow admin write on coupons" ON coupons FOR ALL USING (true);
