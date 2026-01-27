# Supabase Setup Guide - Creating Admin User

## Step 1: Create Admin User in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `gmpkqwrkechzojbqhfxx`
3. Navigate to **Authentication** → **Users** in the left sidebar
4. Click **Add User** button
5. Fill in the form:
   - **Email**: `infotcjeff2@gmail.com`
   - **Password**: `@tcjeff09`
   - **Auto Confirm User**: ✅ Check this box (important!)
6. Click **Create User**

## Step 2: Add Admin Profile

After creating the user, you need to add a profile record:

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- First, get the user ID
SELECT id, email FROM auth.users WHERE email = 'infotcjeff2@gmail.com';

-- Then insert the profile (replace 'USER_ID_HERE' with the actual ID from above)
INSERT INTO profiles (id, role, full_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'infotcjeff2@gmail.com'),
  'admin',
  'Jeff Admin'
);
```

4. Click **Run** or press `Ctrl+Enter`

## Step 3: Verify Setup

Run this query to verify everything is set up correctly:

```sql
SELECT 
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'infotcjeff2@gmail.com';
```

You should see:
- Email: `infotcjeff2@gmail.com`
- Role: `admin`
- Full Name: `Jeff Admin`

## Step 4: Login to Application

1. Go to http://localhost:3000
2. You should see the login page
3. Enter:
   - **Email**: `infotcjeff2@gmail.com`
   - **Password**: `@tcjeff09`
4. Click **Sign In**

You should be redirected to the admin dashboard!

---

## Alternative: Run Database Schema First

If you haven't run the database schema yet, you need to do that first:

1. Go to **SQL Editor** in Supabase Dashboard
2. Open the file: `c:\antigravity\propreties\supabase\schema.sql`
3. Copy ALL the contents
4. Paste into the SQL Editor
5. Click **Run**

This will create all the tables (profiles, proprietors, properties, transactions) and set up Row Level Security.

---

## Troubleshooting

### Error: "profiles table does not exist"
- You need to run the schema.sql file first (see Alternative section above)

### Error: "Invalid login credentials"
- Make sure you checked "Auto Confirm User" when creating the user
- Try resetting the password in Supabase Dashboard

### Error: "User not found"
- The user was created but profile wasn't added
- Run Step 2 again to add the profile

### Can't see admin dashboard after login
- Check that the profile role is set to 'admin' (not 'client')
- Run the verification query from Step 3
