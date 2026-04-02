-- 20260402000000_update_periodic_maintenance.sql
-- Update Periodic Maintenance service details

UPDATE services 
SET 
  description = 'Comprehensive multi-point inspection and oil change service to ensure optimal engine performance and longevity.',
  features = '["Engine Oil Change", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Check", "Battery Water Top-up"]'::jsonb,
  checks = '["Engine Oil Replacement", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Top-up", "Battery Water Top-up", "Spark Plug Cleaning", "Brake Pad Cleaning", "Exterior Wash", "Interior Vacuuming"]'::jsonb
WHERE id = 'ser_1';

-- Update Car Spa & Cleaning (ser_5) as well for consistency with app state
UPDATE services
SET
  title = 'Car Spa & Cleaning',
  description = 'Detailed interior and exterior cleaning process for a spotless, showroom-like finish.',
  features = '["Interior Vacuuming", "Dashboard Polishing", "Upholstery Cleaning", "Exterior Foam Wash", "Tyre Dressing"]'::jsonb,
  checks = '["Stain Removal", "Odor Elimination", "Glass Clarity", "Paint Shine"]'::jsonb
WHERE id = 'ser_5';
