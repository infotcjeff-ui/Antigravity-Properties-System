-- RBAC & User Management Migration

-- 1. Create app_users table
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add created_by column to existing tables
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES app_users(id);
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES app_users(id);
ALTER TABLE rents ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES app_users(id);

-- 3. Create initial admin user
-- Password is 'admin' (In a real app, this should be hashed)
INSERT INTO app_users (username, password, role)
VALUES ('admin', 'admin', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 4. Set owner for existing records (Optional: defaults to the new admin)
DO $$
DECLARE
    admin_id UUID;
BEGIN
    SELECT id INTO admin_id FROM app_users WHERE username = 'admin' LIMIT 1;
    
    UPDATE properties SET created_by = admin_id WHERE created_by IS NULL;
    UPDATE proprietors SET created_by = admin_id WHERE created_by IS NULL;
    UPDATE rents SET created_by = admin_id WHERE created_by IS NULL;
END $$;
