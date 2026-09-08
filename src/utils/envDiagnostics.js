/**
 * Environment diagnostics utility
 * Helps identify if environment variables are properly configured
 */

export function checkEnvironmentConfiguration() {
  const diagnostics = {
    supabase: {
      url: !!import.meta.env.VITE_SUPABASE_URL,
      anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      configured: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
    },
    youtube: {
      apiKey: !!import.meta.env.VITE_YOUTUBE_API_KEY,
      configured: !!import.meta.env.VITE_YOUTUBE_API_KEY
    },
    environment: import.meta.env.MODE || 'production'
  }

  return diagnostics
}

export function getEnvironmentIssues() {
  const diagnostics = checkEnvironmentConfiguration()
  const issues = []

  if (!diagnostics.supabase.configured) {
    if (!diagnostics.supabase.url) {
      issues.push('VITE_SUPABASE_URL is not configured')
    }
    if (!diagnostics.supabase.anonKey) {
      issues.push('VITE_SUPABASE_ANON_KEY is not configured')
    }
  }

  if (!diagnostics.youtube.configured) {
    issues.push('VITE_YOUTUBE_API_KEY is not configured')
  }

  return issues
}
