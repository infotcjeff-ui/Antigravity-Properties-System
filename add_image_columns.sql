-- Add Image and Media Support to Properties Table
-- Run this to ensure all image-related columns exist

-- 1. Convert land_use from ENUM to TEXT (CRITICAL FIX)
ALTER TABLE properties ALTER COLUMN land_use TYPE TEXT;

-- 2. Ensure image columns exist (using JSONB for arrays)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS geo_maps JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS google_drive_plan_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS location JSONB;

-- 3. Ensure other missing columns exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_index TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_area TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_planning_permission BOOLEAN DEFAULT false;

-- Done! Now you can sync images and all other fields.
