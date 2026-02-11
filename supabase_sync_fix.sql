-- ==== SUPABASE SYNC FIX ====
-- Execute this script in your Supabase SQL Editor to ensure the database matches the code.

-- 1. Ensure PROPRIETORS table has all fields
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'company';
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'group_company';
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS english_name TEXT;
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS short_name TEXT;

-- 2. Ensure PROPERTIES table has required fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_index TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_area TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS google_drive_plan_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_planning_permission BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES proprietors(id);

-- 3. Fix JSONB columns (images, geo_maps, location)
-- First, drop defaults so type change can proceed
ALTER TABLE properties ALTER COLUMN images DROP DEFAULT;
ALTER TABLE properties ALTER COLUMN geo_maps DROP DEFAULT;

-- Now convert to JSONB using to_jsonb()
ALTER TABLE properties ALTER COLUMN images TYPE JSONB USING to_jsonb(images);
ALTER TABLE properties ALTER COLUMN geo_maps TYPE JSONB USING to_jsonb(geo_maps);
ALTER TABLE properties ALTER COLUMN location TYPE JSONB USING to_jsonb(location);

-- Re-add the default values
ALTER TABLE properties ALTER COLUMN images SET DEFAULT '[]'::JSONB;
ALTER TABLE properties ALTER COLUMN geo_maps SET DEFAULT '[]'::JSONB;

-- 4. Ensure RENTS table has all fields
ALTER TABLE rents ADD COLUMN IF NOT EXISTS proprietor_id UUID REFERENCES proprietors(id);
ALTER TABLE rents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES proprietors(id);
ALTER TABLE rents ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS notes TEXT;

-- DONE! Your sync issues should be resolved now.
