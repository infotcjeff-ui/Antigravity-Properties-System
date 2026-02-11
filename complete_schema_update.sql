-- Complete Schema Update for Full Data Sync
-- Run this to ensure ALL columns exist for Properties, Proprietors, and Rents

-- ==== PROPRIETORS TABLE ====
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'company';
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'group_company';
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS english_name TEXT;
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS short_name TEXT;

-- ==== PROPERTIES TABLE ====
-- Convert ENUM columns to TEXT (if not already done)
ALTER TABLE properties ALTER COLUMN land_use TYPE TEXT;

-- Add all missing columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES proprietors(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_index TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_area TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS google_drive_plan_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_planning_permission BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS notes TEXT;

-- Ensure JSONB types and drop defaults first for safe conversion
ALTER TABLE properties ALTER COLUMN images DROP DEFAULT;
ALTER TABLE properties ALTER COLUMN geo_maps DROP DEFAULT;

ALTER TABLE properties ALTER COLUMN images TYPE JSONB USING to_jsonb(images);
ALTER TABLE properties ALTER COLUMN geo_maps TYPE JSONB USING to_jsonb(geo_maps);
ALTER TABLE properties ALTER COLUMN location TYPE JSONB USING to_jsonb(location);

ALTER TABLE properties ALTER COLUMN images SET DEFAULT '[]'::JSONB;
ALTER TABLE properties ALTER COLUMN geo_maps SET DEFAULT '[]'::JSONB;

-- ==== RENTS TABLE ====
ALTER TABLE rents ADD COLUMN IF NOT EXISTS proprietor_id UUID REFERENCES proprietors(id);
ALTER TABLE rents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES proprietors(id);
ALTER TABLE rents ADD COLUMN IF NOT EXISTS location TEXT;1r
ALTER TABLE rents ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS notes TEXT;

-- Done! Now all fields will be synced.
