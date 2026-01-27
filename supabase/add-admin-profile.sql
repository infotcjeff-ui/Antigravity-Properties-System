-- ============================================
-- CREATE ADMIN USER PROFILE
-- ============================================
-- Run this AFTER creating the user in Supabase Auth Dashboard
-- Email: infotcjeff2@gmail.com
-- Password: @tcjeff09
-- ============================================

-- Add admin profile for the user
INSERT INTO profiles (id, role, full_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'infotcjeff2@gmail.com'),
  'admin',
  'Jeff Admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = 'Jeff Admin';

-- Verify the profile was created
SELECT 
  u.email,
  u.confirmed_at,
  p.role,
  p.full_name,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'infotcjeff2@gmail.com';
