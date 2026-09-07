# Supabase Setup Guide for AutoWire Academy

This guide will help you set up Supabase for the Video Management System migration from localStorage to a shared online database.

## What You'll Need

- A Supabase account (free tier is sufficient)
- Your AutoWire Academy project

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: AutoWire Academy (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose a region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to the **Settings** tab
2. Navigate to **API** in the left sidebar
3. Copy the following values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon/public** key: This is your `VITE_SUPABASE_ANON_KEY`

⚠️ **Important**: Only use the `anon/public` key in your frontend. Never use the `service_role` key in browser code.

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (same level as `package.json`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Example:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Make sure `.env` is in your `.gitignore` file (it should be by default)

## Step 4: Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/schema.sql` from your project
5. Paste it into the SQL Editor
6. Click "Run" to execute the SQL script

This will create:
- `categories` table with default automotive categories
- `videos` table with proper structure
- Row Level Security (RLS) policies
- The initial "EV Electrical Systems BASICS" video
- Triggers for automatic timestamp updates

## Step 5: Verify Database Setup

1. Go to **Table Editor** in Supabase
2. You should see two tables: `categories` and `videos`
3. Click on `categories` - you should see 10 default categories
4. Click on `videos` - you should see the initial EV Electrical Systems video

## Step 6: Install Dependencies

If you haven't already, install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 7: Start Your Development Server

```bash
npm run dev
```

## Step 8: Test the System

### Admin Dashboard Testing

1. Navigate to `http://localhost:5173/admin/videos`
2. You should see the Video Management Dashboard
3. Try adding a new YouTube video
4. Verify it appears in the list
5. Try editing, publishing/unpublishing, and deleting

### Public Website Testing

1. Navigate to `http://localhost:5173/videos`
2. You should see the public videos page
3. The initial EV Electrical Systems video should be visible
4. Try searching and filtering

### Cross-Device Testing

1. Add a video from one browser
2. Open the website in a different browser (incognito window)
3. The video should be visible in both places
4. This confirms the shared database is working

## Step 9: Migrate Existing LocalStorage Videos

If you have videos stored in localStorage from the previous system:

1. Go to the Admin Video Management page
2. You should see a yellow notification: "Local Storage Videos Detected"
3. Click "Import Existing Videos to Cloud"
4. Wait for the migration to complete
5. Review the migration results
6. The videos will now be available to all users/devices

## Step 10: Database Security Notes

### Row Level Security (RLS)

The system includes these security policies:

**Public Visitors:**
- Can READ published videos only
- Can READ all categories
- Cannot modify any data

**Authenticated Users (Future Enhancement):**
- Can READ all videos (including drafts)
- Can CREATE, UPDATE, DELETE videos
- Can CREATE, UPDATE, DELETE categories

Currently, the system uses the `anon` key which allows public read access. For production use, you may want to implement proper authentication.

## Troubleshooting

### Videos not loading

1. Check that your `.env` file has the correct Supabase URL and key
2. Verify the database tables exist in Supabase
3. Check the browser console for error messages
4. Ensure you're using the `anon` key, not `service_role`

### Migration not working

1. Check that you have videos in localStorage
2. Verify your Supabase connection is working
3. Check browser console for error messages

### Permission errors

1. Verify RLS policies are correctly set up
2. Ensure you're using the correct API key
3. Check that the tables exist in your Supabase project

## Deployment

When deploying to production:

1. Add your Supabase environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Never commit `.env` to version control
3. Use environment variable management provided by your hosting platform
4. Consider implementing proper authentication for admin access

## Database Backup

Supabase automatically handles backups, but you can:

1. Go to **Database** → **Backups** in Supabase
2. Create manual backups before major changes
3. Set up point-in-time recovery if needed

## Support

If you encounter issues:

1. Check the Supabase dashboard for database errors
2. Review the browser console for JavaScript errors
3. Verify your environment variables are correctly set
4. Ensure the SQL schema was executed successfully

## Next Steps

After setup is complete:

1. Add your automotive educational videos
2. Organize them using categories
3. Feature important videos on the homepage
4. Test the system across different devices
5. Consider implementing authentication for admin access

## Important Notes

- The system now uses Supabase PostgreSQL instead of localStorage
- All videos are shared across all devices and users
- Published videos are visible to everyone
- Draft videos are only visible in the admin dashboard
- The initial EV Electrical Systems video is preserved in the database
- Existing localStorage videos can be migrated to the cloud
