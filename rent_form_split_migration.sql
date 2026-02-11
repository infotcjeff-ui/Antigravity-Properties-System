-- ==== RENT FORM SPLIT SQL MIGRATION ====
-- Execute this script in your Supabase SQL Editor to add the new rent form fields.

-- ===== RENT OUT (收租) Fields =====
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_tenancy_number TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_pricing NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_monthly_rental NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_periods INTEGER;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_total_amount NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_actual_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_deposit_received NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_deposit_receive_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_deposit_return_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_deposit_return_amount NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_lessor TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_address_detail TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_status TEXT DEFAULT 'listing';
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_description TEXT;

-- ===== RENTING (交租) Fields =====
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_number TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_reference_number TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_monthly_rental NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_periods INTEGER;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_deposit NUMERIC;

-- Make proprietorId optional (since we only use tenant now in the form)
ALTER TABLE rents ALTER COLUMN proprietor_id DROP NOT NULL;

-- DONE! Your rent forms are now ready.
