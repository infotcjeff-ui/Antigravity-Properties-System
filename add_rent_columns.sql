-- Migration to add missing rent columns to the rents table
-- Run this in the Supabase SQL Editor

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
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_status TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS rent_out_description TEXT;

ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_number TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_reference_number TEXT;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_monthly_rental NUMERIC;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_periods INTEGER;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE rents ADD COLUMN IF NOT EXISTS renting_deposit NUMERIC;
