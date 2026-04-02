-- 20260402000001_fix_missing_columns.sql
-- Fix missing columns reported by schema cache errors

-- 1. services: applicable_fuel_types
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='applicable_fuel_types') THEN
        ALTER TABLE services ADD COLUMN applicable_fuel_types JSONB DEFAULT '[]';
    END IF;
END $$;

-- 2. car_makes: price
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='car_makes' AND column_name='price') THEN
        ALTER TABLE car_makes ADD COLUMN price NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 3. car_models: make
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='car_models' AND column_name='make') THEN
        ALTER TABLE car_models ADD COLUMN make TEXT;
    END IF;
END $$;

-- 4. fuel_types: price
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fuel_types' AND column_name='price') THEN
        ALTER TABLE fuel_types ADD COLUMN price NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 5. service_packages: base_price
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_packages' AND column_name='base_price') THEN
        ALTER TABLE service_packages ADD COLUMN base_price NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 6. technicians: availability
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='technicians' AND column_name='availability') THEN
        ALTER TABLE technicians ADD COLUMN availability TEXT;
    END IF;
END $$;
