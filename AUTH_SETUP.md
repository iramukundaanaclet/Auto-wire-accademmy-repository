# Admin Authentication Setup Guide

## Overview

Your AutoWire Academy website now has **authentication** to protect admin pages:
- ✅ **Admin users** can add, edit, and delete videos
- ✅ **Public visitors** can only watch videos
- ✅ Admin pages (`/admin/videos`, `/admin/categories`) are protected

## Setup Steps

### 1. Create Your Admin Account

1. **Open your Supabase project:**
   ```
   https://bjaifxllozwptugjzuzk.supabase.co
   ```

2. **Navigate to Authentication:**
   - Click "Authentication" in the left sidebar
   - Click "Users"

3. **Create your admin user:**
   - Click the "Add User" button
   - Enter your email address
   - Enter a secure password
   - Click "Create User"

4. **Auto-confirm the user (optional but recommended):**
   - In the Authentication → Users page
   - Find your newly created user
   - Click the "Confirm" button to skip email verification
   - This allows you to login immediately without email verification

### 2. Test the Login

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your website:**
   ```
   http://localhost:5173
   ```

3. **Try to access admin pages:**
   - Go to `http://localhost:5173/admin/videos`
   - You should be automatically redirected to the login page

4. **Login with your credentials:**
   - Enter the email and password you created in Supabase
   - Click "Sign in"
   - You should be redirected to the Video Management page

5. **Test the protection:**
   - Sign out using the "Sign Out" button
   - Try to access `http://localhost:5173/admin/videos` again
   - You should be redirected to login again

### 3. How It Works

#### **Authentication Flow:**
```
User → Login Page → Supabase Auth → Session Created → Access Admin Pages
```

#### **Protected Routes:**
- `/admin/videos` - Only accessible when logged in
- `/admin/categories` - Only accessible when logged in
- `/login` - Public page for authentication

#### **Public Routes (No login required):**
- `/` - Home page
- `/videos` - Public video viewing
- `/learn` - Learning modules
- `/wiring-lab` - Wiring exercises
- `/diagnostics` - Diagnostic scenarios
- `/vehicles` - Vehicle information
- All other pages

### 4. Security Features

#### **Row Level Security (RLS) Policies:**
Your database has RLS policies that:
- ✅ Allow **public users** to read published videos
- ✅ Allow **authenticated users** to read all videos (including drafts)
- ✅ Allow **authenticated users** to add, edit, and delete videos
- ✅ Allow **public users** to read all categories
- ✅ Allow **authenticated users** to add, edit, and delete categories

#### **Frontend Protection:**
- ✅ `ProtectedRoute` component checks authentication
- ✅ Unauthenticated users are redirected to login
- ✅ Admin pages show "Sign Out" button
- ✅ Session persists across page refreshes

### 5. Managing Users

#### **To Add More Admin Users:**
1. Go to Supabase → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Click "Create User"

#### **To Remove Access:**
1. Go to Supabase → Authentication → Users
2. Find the user you want to remove
3. Click "Delete"

#### **To Reset Password:**
1. Go to Supabase → Authentication → Users
2. Find the user
3. Click "Reset Password"
4. The user will receive an email to reset their password

### 6. Troubleshooting

#### **Problem: Login says "Invalid login credentials"**
- **Solution:** Check that you're using the correct email and password
- **Solution:** Make sure the user is created in Supabase Authentication
- **Solution:** If email verification is required, confirm the user in Supabase dashboard

#### **Problem: Redirected to login even after signing in**
- **Solution:** Check browser console for errors
- **Solution:** Make sure Supabase credentials are correct in `.env`
- **Solution:** Clear browser cookies and try again

#### **Problem: Can't add/edit videos even when logged in**
- **Solution:** Check that RLS policies are set up correctly
- **Solution:** Run the `supabase/schema.sql` script if not already done
- **Solution:** Check browser console for RLS permission errors

### 7. Production Deployment

When deploying to Cloudflare or other hosting:

1. **Add environment variables:**
   ```
   VITE_SUPABASE_URL=https://bjaifxllozwptugjzuzk.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xbiVcuhurE0r_GR01aqnKQ_dw_oQhYQ
   ```

2. **Do NOT commit `.env` file** (it's already in `.gitignore`)

3. **Create your admin user in the production Supabase project**

4. **Test the login flow on the deployed site**

## Summary

✅ **Authentication is now fully integrated**
✅ **Admin pages are protected**
✅ **Public users can only watch videos**
✅ **Only authenticated users can manage content**
✅ **Security is enforced at both frontend and database level**

**Your website is ready for production use with secure admin access!**
