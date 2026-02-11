-- Migration to change has_planning_permission from BOOLEAN to TEXT
-- This is needed because the field now stores detailed application status.

-- 1. Create a temporary column
ALTER TABLE properties ADD COLUMN has_planning_permission_text TEXT;

-- 2. Migrate data (convert TRUE to 'Yes', FALSE to 'No', or keep as empty string)
UPDATE properties SET has_planning_permission_text = 
    CASE 
        WHEN has_planning_permission = TRUE THEN 'Yes'
        WHEN has_planning_permission = FALSE THEN 'No'
        ELSE ''
    END;

-- 3. Remove the old column
ALTER TABLE properties DROP COLUMN has_planning_permission;

-- 4. Rename the new column to the original name
ALTER TABLE properties RENAME COLUMN has_planning_permission_text TO has_planning_permission;
