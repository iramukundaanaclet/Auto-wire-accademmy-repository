# Cloudflare Deployment Troubleshooting Guide

## Problem: YouTube Videos Not Loading on Other Machines

When you open the website on another machine, YouTube playlist videos are not available and other videos aren't showing.

## Root Cause

This is most likely a **Cloudflare environment variable configuration issue**. The environment variables (API keys) are not properly configured in Cloudflare Pages, so the deployed website doesn't have access to:
- YouTube Data API key (for playlist videos)
- Supabase credentials (for database videos)

## Diagnosis Steps

### Step 1: Check Browser Console

1. Open your deployed Cloudflare website
2. Press `F12` to open browser developer tools
3. Go to the "Console" tab
4. Look for these messages:

**If you see:**
```
YouTube API key not configured. Playlist videos will not be loaded.
```
→ **Solution:** YouTube API key is not set in Cloudflare environment variables

**If you see:**
```
Environment diagnostics: { youtube: { configured: false }, supabase: { configured: false } }
```
→ **Solution:** Both API keys are missing from Cloudflare

**If you see:**
```
YouTube API error: ...
```
→ **Solution:** YouTube API key is invalid or quota exceeded

### Step 2: Verify Cloudflare Environment Variables

1. Go to your Cloudflare Pages project
2. Click "Settings" → "Environment variables"
3. Check if these variables exist:

**Required Variables:**
```
VITE_SUPABASE_URL=https://bjaifxllozwptugjzuzk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xbiVcuhurE0r_GR01aqnKQ_dw_oQhYQ
VITE_YOUTUBE_API_KEY=AIzaSyBo2hy9ApTBAHxiiv2j5Vi9c9scAzKpn5c
```

**Common Issues:**
- ❌ Variables are missing entirely
- ❌ Variables are set in wrong environment (Preview instead of Production)
- ❌ Variable names have typos (e.g., `YOUTUBE_API_KEY` instead of `VITE_YOUTUBE_API_KEY`)
- ❌ Variable values are incomplete or incorrect

## Solutions

### Solution 1: Add Missing Environment Variables

1. **Go to Cloudflare Pages** → Your project → Settings → Environment variables
2. **Click "Add variable"** for each missing variable
3. **Set the scope** to "Production" (and "Preview" if you want)
4. **Add these exact variables:**

```
Variable Name: VITE_SUPABASE_URL
Variable Value: https://bjaifxllozwptugjzuzk.supabase.co

Variable Name: VITE_SUPABASE_ANON_KEY
Variable Value: sb_publishable_xbiVcuhurE0r_GR01aqnKQ_dw_oQhYQ

Variable Name: VITE_YOUTUBE_API_KEY
Variable Value: AIzaSyBo2hy9ApTBAHxiiv2j5Vi9c9scAzKpn5c
```

### Solution 2: Fix Incorrect Variable Names

Make sure variable names start with `VITE_`:
- ✅ `VITE_YOUTUBE_API_KEY` (correct)
- ❌ `YOUTUBE_API_KEY` (incorrect - missing VITE_ prefix)
- ❌ `youtube_api_key` (incorrect - wrong format)

### Solution 3: Trigger New Deployment

After adding/fixing environment variables:

1. **Go to "Deployments" tab** in Cloudflare Pages
2. **Click "Retry deployment"** or wait for automatic deployment
3. **Wait for build to complete** (1-2 minutes)
4. **Test the deployed website**

### Solution 4: Check YouTube API Quota

If you see "YouTube API error" in console:

1. **Go to Google Cloud Console**
2. **Check your API quota** for YouTube Data API v3
3. **Upgrade quota** if needed (free tier has daily limits)
4. **Or restrict API key** to prevent unauthorized usage

## Testing Checklist

After fixing environment variables:

### Step 1: Test on Local Machine
- ✅ Open `http://localhost:5173/videos`
- ✅ Check browser console for diagnostics
- ✅ Verify YouTube playlist videos appear
- ✅ Verify database videos appear

### Step 2: Test on Deployed Site
- ✅ Open your Cloudflare Pages URL
- ✅ Open browser console (F12)
- ✅ Check for "Environment diagnostics" log
- ✅ Verify both YouTube and database videos load
- ✅ Test video playback in modal

### Step 3: Test on Other Machine
- ✅ Open deployed URL on different device/browser
- ✅ Clear browser cache if needed
- ✅ Check browser console for errors
- ✅ Verify videos load correctly

## Common Error Messages and Solutions

### Error: "YouTube API key not configured"
**Cause:** VITE_YOUTUBE_API_KEY not set in Cloudflare
**Solution:** Add the environment variable in Cloudflare Pages settings

### Error: "Supabase not configured"
**Cause:** VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set
**Solution:** Add both Supabase environment variables in Cloudflare

### Error: "YouTube API error: quotaExceeded"
**Cause:** Daily API quota exceeded
**Solution:** Check Google Cloud Console quota or upgrade

### Error: "YouTube API error: keyInvalid"
**Cause:** API key is incorrect or restricted
**Solution:** Verify API key in Google Cloud Console and check restrictions

### Error: "No videos found in playlist"
**Cause:** Playlist is empty or playlist ID is wrong
**Solution:** Verify playlist ID: `PLesVJEd8rKWQ` and check YouTube playlist

## Quick Fix Steps

If you want the fastest solution:

1. **Go to Cloudflare Pages** → Settings → Environment variables
2. **Add these 3 variables** (exact names and values):
   ```
   VITE_SUPABASE_URL=https://bjaifxllozwptugjzuzk.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xbiVcuhurE0r_GR01aqnKQ_dw_oQhYQ
   VITE_YOUTUBE_API_KEY=AIzaSyBo2hy9ApTBAHxiiv2j5Vi9c9scAzKpn5c
   ```
3. **Set scope to "Production"**
4. **Go to Deployments** → Click "Retry deployment"
5. **Wait for build** → Test deployed website

## Additional Help

If you're still having issues:

1. **Check browser console** for specific error messages
2. **Share the console errors** for more targeted help
3. **Verify Cloudflare build logs** for build-time errors
4. **Test environment variables** are accessible in production

## Security Reminder

⚠️ **Important:** Your API keys are now in Cloudflare environment variables. This is secure because:
- Environment variables are encrypted in Cloudflare
- They are not exposed in the built files
- They are only used during build time
- They are not accessible to website visitors

However, you should still:
- Restrict your YouTube API key in Google Cloud Console
- Add your website URLs to HTTP referrers
- Limit API key to YouTube Data API v3 only
