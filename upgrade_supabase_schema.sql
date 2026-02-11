-- FINAL RESCUE SQL for P2 Migration (v2)
-- This script fixes "invalid input value for enum" errors by converting restricted columns to TEXT

-- 1. DROP problematic legacy triggers
DROP TRIGGER IF EXISTS handle_proprietors_updated_at ON proprietors;
DROP TRIGGER IF EXISTS handle_properties_updated_at ON properties;
DROP TRIGGER IF EXISTS handle_transactions_updated_at ON transactions;

-- 2. Convert restricted ENUM columns to TEXT (CRITICAL FIX)
-- This allows the table to accept any string value like 'Holding' or 'holding'
ALTER TABLE properties ALTER COLUMN status TYPE TEXT;
ALTER TABLE properties ALTER COLUMN type TYPE TEXT;

-- 3. Ensure core columns exist and are relaxed
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE proprietors ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE properties ADD COLUMN IF NOT EXISTS proprietor_id UUID REFERENCES proprietors(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Fix Transactions (Legacy Fallback)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS date DATE DEFAULT NOW();

-- 5. Create Rents table (Full Featured P2 Table)
CREATE TABLE IF NOT EXISTS rents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    proprietor_id UUID REFERENCES proprietors(id),
    amount NUMERIC,
    currency TEXT DEFAULT 'HKD',
    type TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Open permissions for Migration
ALTER TABLE proprietors ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Global Sync Access" ON proprietors;
CREATE POLICY "Global Sync Access" ON proprietors FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Global Sync Access" ON properties;
CREATE POLICY "Global Sync Access" ON properties FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Global Sync Access" ON transactions;
CREATE POLICY "Global Sync Access" ON transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Global Sync Access" ON rents;
CREATE POLICY "Global Sync Access" ON rents FOR ALL USING (true) WITH CHECK (true);

-- 7. Final Cache Refresh
NOTIFY pgrst, 'reload schema';
COMMENT ON TABLE properties IS 'ENUMs converted to TEXT for P2 migration';
