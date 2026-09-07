-- Enable Supabase Auth
-- This script enables authentication for your Supabase project

-- Note: Supabase Auth is enabled by default in all Supabase projects
-- You just need to create users in the Supabase dashboard or via the API

-- To create an admin user:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Authentication → Users
-- 3. Click "Add User"
-- 4. Enter email and password
-- 5. Click "Create User"

-- The RLS policies in schema.sql already support authenticated users:
-- - Authenticated users can read, insert, update, and delete videos
-- - Authenticated users can read, insert, update, and delete categories
-- - Public users can only read published videos and all categories

-- No additional SQL changes are needed for authentication
-- The authentication is handled by the Supabase client library
