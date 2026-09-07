import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VideoForm from '../components/VideoForm'
import BulkVideoImport from '../components/BulkVideoImport'
import VideoModal from '../components/VideoModal'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  getVideoStats,
  getCategories,
  videoExists
} from '../utils/videoStorage'
import { formatDate } from '../utils/videoUtils'

function VideoManagement() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, featured: 0 })
  const [view, setView] = useState('list') // 'list', 'add', 'edit', 'bulk'
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoForModal, setSelectedVideoForModal] = useState(null)
  const [selectedVideoCategory, setSelectedVideoCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [searchQuery, filterCategory, filterStatus])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [vids, cats, videoStats] = await Promise.all([
        getVideos(),
        getCategories(),
        getVideoStats()
      ])
      setVideos(vids)
      setCategories(cats)
      setStats(videoStats)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const filterVideos = async () => {
    try {
      setLoading(true)
      let filtered = await getVideos()

      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase()
        filtered = filtered.filter(v =>
          v.title.toLowerCase().includes(searchTerm) ||
          v.description.toLowerCase().includes(searchTerm)
        )
      }

      if (filterCategory !== 'all') {
        filtered = filtered.filter(v => v.categoryId === filterCategory)
      }

      if (filterStatus !== 'all') {
        filtered = filtered.filter(v => v.status === filterStatus)
      }

      setVideos(filtered)
    } catch (err) {
      console.error('Error filtering videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVideo = async (videoData) => {
    try {
      const exists = await videoExists(videoData.youtubeVideoId)
      if (exists) {
        alert('This video already exists in the database')
        return
      }
      await addVideo(videoData)
      await loadData()
      setView('list')
    } catch (err) {
      console.error('Error adding video:', err)
      alert('Failed to add video. Please try again.')
    }
  }

  const handleEditVideo = async (videoData) => {
    try {
      await updateVideo(selectedVideo.id, videoData)
      await loadData()
      setView('list')
      setSelectedVideo(null)
    } catch (err) {
      console.error('Error updating video:', err)
      alert('Failed to update video. Please try again.')
    }
  }

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteVideo(videoId)
      await loadData()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting video:', err)
      alert('Failed to delete video. Please try again.')
    }
  }

  const handleToggleStatus = async (video) => {
    try {
      const newStatus = video.status === 'published' ? 'draft' : 'published'
      await updateVideo(video.id, { status: newStatus })
      await loadData()
    } catch (err) {
      console.error('Error toggling status:', err)
      alert('Failed to update video status. Please try again.')
    }
  }

  const handleToggleFeatured = async (video) => {
    try {
      await updateVideo(video.id, { featured: !video.featured })
      await loadData()
    } catch (err) {
      console.error('Error toggling featured:', err)
      alert('Failed to update featured status. Please try again.')
    }
  }

  const handleViewVideo = (video) => {
    const category = categories.find(c => c.id === video.categoryId)
    setSelectedVideoForModal(video)
    setSelectedVideoCategory(category)
  }

  const handleBulkImportComplete = async () => {
    await loadData()
    setView('list')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (err) {
      console.error('Error signing out:', err)
      alert('Failed to sign out. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Video Management</h1>
          <p className="text-gray-600">Manage YouTube videos, categories, and content</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Supabase Configuration Notice */}
      {!isSupabaseConfigured && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Supabase Not Configured</h3>
          <p className="text-blue-700 mb-4">
            The video system is currently running in fallback mode using localStorage. To enable cloud database sharing across devices, configure your Supabase credentials in the .env file.
          </p>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-navy-900 mb-2">Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Copy your Project URL and anon/public key from Settings → API</li>
              <li>Add them to your .env file (see .env.example for format)</li>
              <li>Run the SQL schema from supabase/schema.sql in Supabase SQL Editor</li>
              <li>Restart the development server</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">
              See SUPABASE_SETUP.md for detailed instructions.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-navy-900 mb-2">{loading ? '...' : stats.total}</div>
          <div className="text-gray-600">Total Videos</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">{loading ? '...' : stats.published}</div>
          <div className="text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{loading ? '...' : stats.drafts}</div>
          <div className="text-gray-600">Drafts</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-electric-600 mb-2">{loading ? '...' : stats.featured}</div>
          <div className="text-gray-600">Featured</div>
        </div>
      </div>

      {/* Main Content */}
      {view === 'list' && (
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('add')}
                  className="px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
                >
                  Add Video
                </button>
                <button
                  onClick={() => setView('bulk')}
                  className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors"
                >
                  Bulk Import
                </button>
                <Link
                  to="/admin/categories"
                  className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors"
                >
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>

          {/* Videos Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-electric-600"></div>
                <p className="text-gray-600 mt-2">Loading videos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {videos.map((video) => {
                      const category = categories.find(c => c.id === video.categoryId)
                      return (
                        <tr key={video.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-20 h-12 object-cover rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-navy-900">{video.title}</div>
                                <div className="text-xs text-gray-500 truncate max-w-xs">{video.youtubeUrl}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-electric-100 text-electric-700">
                              {category?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              video.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {video.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {video.featured ? (
                              <span className="text-accent-500">★ Featured</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(video.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewVideo(video)}
                                className="text-electric-600 hover:text-electric-700"
                                title="View"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedVideo(video)
                                  setView('edit')
                                }}
                                className="text-navy-600 hover:text-navy-700"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleToggleStatus(video)}
                                className="text-yellow-600 hover:text-yellow-700"
                                title={video.status === 'published' ? 'Unpublish' : 'Publish'}
                              >
                                {video.status === 'published' ? (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => handleToggleFeatured(video)}
                                className="text-accent-600 hover:text-accent-700"
                                title="Toggle Featured"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(video)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && videos.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                <p className="text-gray-600">Add your first video to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'add' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Add New Video</h2>
            <button
              onClick={() => setView('list')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <VideoForm onSubmit={handleAddVideo} onCancel={() => setView('list')} />
        </div>
      )}

      {view === 'edit' && selectedVideo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Edit Video</h2>
            <button
              onClick={() => {
                setView('list')
                setSelectedVideo(null)
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <VideoForm
            video={selectedVideo}
            onSubmit={handleEditVideo}
            onCancel={() => {
              setView('list')
              setSelectedVideo(null)
            }}
          />
        </div>
      )}

      {view === 'bulk' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Bulk Import Videos</h2>
            <button
              onClick={() => setView('list')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <BulkVideoImport onComplete={handleBulkImportComplete} onCancel={() => setView('list')} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Delete Video</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVideo(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideoForModal && (
        <VideoModal
          video={selectedVideoForModal}
          category={selectedVideoCategory}
          relatedVideos={[]}
          onClose={() => setSelectedVideoForModal(null)}
          onRelatedVideoClick={() => {}}
        />
      )}
    </div>
  )
}

export default VideoManagement
