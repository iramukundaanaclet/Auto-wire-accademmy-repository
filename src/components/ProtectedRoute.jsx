import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Not Available</h2>
          <p className="text-gray-600 mb-4">
            Admin pages require Supabase authentication. Please configure your Supabase credentials in the .env file.
          </p>
          <a href="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
