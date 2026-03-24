-- CarMechs Tech Labs - Full Schema Migration

-- services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  duration TEXT,
  base_price NUMERIC DEFAULT 0,
  estimated_price NUMERIC DEFAULT 0,
  estimated_duration TEXT,
  icon_name TEXT,
  category_id TEXT,
  image_url TEXT,
  icon_url TEXT,
  features JSONB DEFAULT '[]',
  checks JSONB DEFAULT '[]',
  common_issues JSONB DEFAULT '[]',
  recommended_checkups JSONB DEFAULT '[]',
  applicable_makes JSONB DEFAULT '[]',
  applicable_models JSONB DEFAULT '[]',
  applicable_fuel_types JSONB DEFAULT '[]',
  time_estimate TEXT,
  warranty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- car_makes
CREATE TABLE IF NOT EXISTS car_makes (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  image_url TEXT,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- car_models
CREATE TABLE IF NOT EXISTS car_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  make_id TEXT REFERENCES car_makes(id),
  year TEXT,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, make)
);

-- fuel_types
CREATE TABLE IF NOT EXISTS fuel_types (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- brands
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- locations
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_popular BOOLEAN DEFAULT false,
  working_hours TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- inventory
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'in_stock',
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- coupons
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- reviews
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

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- service_packages
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

-- vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  make TEXT,
  model TEXT,
  year TEXT,
  fuel_type TEXT,
  license_plate TEXT,
  vin TEXT,
  last_service_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar TEXT,
  password TEXT,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT false,
  blocked BOOLEAN DEFAULT false,
  wallet_balance NUMERIC DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  referrals_count INTEGER DEFAULT 0,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  service_title TEXT,
  service_id TEXT,
  make TEXT,
  model TEXT,
  fuel TEXT,
  fuel_type TEXT,
  year TEXT,
  license_plate TEXT,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount NUMERIC DEFAULT 0,
  wallet_used NUMERIC DEFAULT 0,
  final_paid NUMERIC DEFAULT 0,
  location_name TEXT,
  technician_id TEXT,
  workshop_id TEXT,
  customer_name TEXT,
  car_model TEXT,
  total_price NUMERIC DEFAULT 0,
  issue_photos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- tasks
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

-- site_config
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- contact_submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- technicians
CREATE TABLE IF NOT EXISTS technicians (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialty TEXT,
  experience TEXT,
  hourly_rate NUMERIC DEFAULT 0,
  certifications JSONB DEFAULT '[]',
  services_offered JSONB DEFAULT '[]',
  availability TEXT,
  status TEXT DEFAULT 'available',
  rating NUMERIC DEFAULT 5,
  review_count INTEGER DEFAULT 0,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  car_model TEXT,
  image TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- navigation_items
CREATE TABLE IF NOT EXISTS navigation_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  admin_only BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- workshops
CREATE TABLE IF NOT EXISTS workshops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  description TEXT,
  logo_url TEXT,
  rating NUMERIC DEFAULT 5,
  reviews_count INTEGER DEFAULT 0,
  services_offered JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  owner_id TEXT,
  working_hours JSONB DEFAULT '{}',
  location JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- service_requests
CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT,
  user_phone TEXT,
  make TEXT,
  model TEXT,
  year TEXT,
  problem_description TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow public read for most, admin write for all)
CREATE POLICY "Allow public read on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public write on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow public read on car_makes" ON car_makes FOR SELECT USING (true);
CREATE POLICY "Allow public write on car_makes" ON car_makes FOR ALL USING (true);
CREATE POLICY "Allow public read on car_models" ON car_models FOR SELECT USING (true);
CREATE POLICY "Allow public write on car_models" ON car_models FOR ALL USING (true);
CREATE POLICY "Allow public read on fuel_types" ON fuel_types FOR SELECT USING (true);
CREATE POLICY "Allow public write on fuel_types" ON fuel_types FOR ALL USING (true);
CREATE POLICY "Allow public read on brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public write on brands" ON brands FOR ALL USING (true);
CREATE POLICY "Allow public read on locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow public write on locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow public read on inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Allow public write on inventory" ON inventory FOR ALL USING (true);
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public write on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow public read on coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Allow public write on coupons" ON coupons FOR ALL USING (true);
CREATE POLICY "Allow public read on reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public write on reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Allow public read on notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow public write on notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow public read on service_packages" ON service_packages FOR SELECT USING (true);
CREATE POLICY "Allow public write on service_packages" ON service_packages FOR ALL USING (true);
CREATE POLICY "Allow public read on vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public write on vehicles" ON vehicles FOR ALL USING (true);
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public write on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow public read on appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow public write on appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow public read on tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public write on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow public read on site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Allow public write on site_config" ON site_config FOR ALL USING (true);
CREATE POLICY "Allow public read on contact_submissions" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public write on contact_submissions" ON contact_submissions FOR ALL USING (true);
CREATE POLICY "Allow public read on technicians" ON technicians FOR SELECT USING (true);
CREATE POLICY "Allow public write on technicians" ON technicians FOR ALL USING (true);
CREATE POLICY "Allow public read on testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public write on testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow public read on navigation_items" ON navigation_items FOR SELECT USING (true);
CREATE POLICY "Allow public write on navigation_items" ON navigation_items FOR ALL USING (true);
CREATE POLICY "Allow public read on workshops" ON workshops FOR SELECT USING (true);
CREATE POLICY "Allow public write on workshops" ON workshops FOR ALL USING (true);
CREATE POLICY "Allow public read on service_requests" ON service_requests FOR SELECT USING (true);
CREATE POLICY "Allow public write on service_requests" ON service_requests FOR ALL USING (true);

-- Enable Realtime
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
ALTER PUBLICATION supabase_realtime ADD TABLE navigation_items;
ALTER PUBLICATION supabase_realtime ADD TABLE workshops;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
