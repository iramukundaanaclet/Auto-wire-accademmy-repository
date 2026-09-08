import { useState, useEffect } from 'react'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'
import {
  getPublishedVideos,
  getFeaturedVideos,
  getVideosByCategory,
  searchVideos,
  getCategories
} from '../utils/videoStorage'
import { fetchPlaylistVideos, isYouTubeAPIConfigured } from '../services/youtubeService'
import { checkEnvironmentConfiguration, getEnvironmentIssues } from '../utils/envDiagnostics'

function Videos() {
  const [videos, setVideos] = useState([])
  const [featuredVideos, setFeaturedVideos] = useState([])
  const [playlistVideos, setPlaylistVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoCategory, setSelectedVideoCategory] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPlaylistNotice, setShowPlaylistNotice] = useState(false)

  useEffect(() => {
    loadVideos()
    loadCategories()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [selectedCategory, searchQuery])

  const loadVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Log environment diagnostics
      const envDiagnostics = checkEnvironmentConfiguration()
      console.log('Environment diagnostics:', envDiagnostics)

      const envIssues = getEnvironmentIssues()
      if (envIssues.length > 0) {
        console.warn('Environment configuration issues:', envIssues)
      }

      // Load Supabase videos
      const [published, featured] = await Promise.all([
        getPublishedVideos(),
        getFeaturedVideos()
      ])
      setVideos(published)
      setFeaturedVideos(featured)

      // Load YouTube playlist videos if API is configured
      if (isYouTubeAPIConfigured()) {
        try {
          const playlist = await fetchPlaylistVideos()
          setPlaylistVideos(playlist)
          if (playlist.length > 0) {
            setShowPlaylistNotice(true)
          }
        } catch (playlistError) {
          console.error('Error loading playlist videos:', playlistError)
          // Don't fail the entire page if playlist fails
          setPlaylistVideos([])
          // Show error message for playlist loading
          setError(`YouTube playlist loading failed: ${playlistError.message}. Database videos will still work.`)
        }
      }
    } catch (err) {
      console.error('Error loading videos:', err)
      setError('Failed to load videos. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      setCategories(cats)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const filterVideos = async () => {
    try {
      setLoading(true)
      let filtered = await getPublishedVideos()

      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(v => v.categoryId === selectedCategory)
      }

      // Apply search filter
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase()
        filtered = filtered.filter(v =>
          v.title.toLowerCase().includes(searchTerm) ||
          v.description.toLowerCase().includes(searchTerm)
        )
      }

      setVideos(filtered)

      // Also filter playlist videos
      if (playlistVideos.length > 0) {
        let filteredPlaylist = playlistVideos
        if (searchQuery) {
          const searchTerm = searchQuery.toLowerCase()
          filteredPlaylist = filteredPlaylist.filter(v =>
            v.title.toLowerCase().includes(searchTerm) ||
            v.description.toLowerCase().includes(searchTerm)
          )
        }
        setPlaylistVideos(filteredPlaylist)
      }
    } catch (err) {
      console.error('Error filtering videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchVideo = async (video) => {
    const category = categories.find(c => c.id === video.categoryId)

    // For playlist videos, show other playlist videos as related
    // For database videos, show database videos from same category
    let related = []
    if (video.isFromPlaylist) {
      related = playlistVideos
        .filter(v => v.id !== video.id)
        .slice(0, 4)
    } else {
      const allPublished = await getPublishedVideos()
      related = allPublished
        .filter(v => v.categoryId === video.categoryId && v.id !== video.id)
        .slice(0, 4)
    }

    setSelectedVideo(video)
    setSelectedVideoCategory(category)
    setRelatedVideos(related)
  }

  const handleRelatedVideoClick = async (video) => {
    const category = categories.find(c => c.id === video.categoryId)

    // Handle related videos based on video type
    let related = []
    if (video.isFromPlaylist) {
      related = playlistVideos
        .filter(v => v.id !== video.id)
        .slice(0, 4)
    } else {
      const allPublished = await getPublishedVideos()
      related = allPublished
        .filter(v => v.categoryId === video.categoryId && v.id !== video.id)
        .slice(0, 4)
    }

    setSelectedVideo(video)
    setSelectedVideoCategory(category)
    setRelatedVideos(related)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Automotive Learning Videos</h1>
        <p className="text-gray-600">Learn automotive technology through practical and educational videos.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Videos</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-electric-600"></div>
          <p className="text-gray-600 mt-2">Loading videos...</p>
        </div>
      )}

      {/* Featured Videos */}
      {!loading && featuredVideos.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Featured Automotive Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map(video => {
              const category = categories.find(c => c.id === video.categoryId)
              return (
                <VideoCard
                  key={video.id}
                  video={video}
                  category={category}
                  onWatch={handleWatchVideo}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* YouTube Playlist Videos */}
      {!loading && playlistVideos.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">AutoWire Academy Playlist</h2>
            <span className="text-sm text-gray-500">{playlistVideos.length} videos</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📺 Videos from our YouTube playlist. <a href="https://youtube.com/playlist?list=PLesVJEd8rKWQ" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">View on YouTube</a>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlistVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                category={null}
                onWatch={handleWatchVideo}
              />
            ))}
          </div>
        </div>
      )}

      {/* YouTube API Not Configured Notice */}
      {!loading && !isYouTubeAPIConfigured() && (
        <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">YouTube Playlist Integration Available</h3>
          <p className="text-yellow-700 mb-4">
            To automatically load videos from your YouTube playlist, add your YouTube Data API key to the .env file.
          </p>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-navy-900 mb-2">Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>Create a project and enable YouTube Data API v3</li>
              <li>Create an API key with YouTube Data API v3 enabled</li>
              <li>Add it to your .env file: VITE_YOUTUBE_API_KEY=your_api_key</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      )}

      {/* All Database Videos */}
      {!loading && videos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-navy-900 mb-6">
            {selectedCategory === 'all' ? 'Database Videos' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => {
              const category = categories.find(c => c.id === video.categoryId)
              return (
                <VideoCard
                  key={video.id}
                  video={video}
                  category={category}
                  onWatch={handleWatchVideo}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && playlistVideos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          category={selectedVideoCategory}
          relatedVideos={relatedVideos}
          onClose={() => setSelectedVideo(null)}
          onRelatedVideoClick={handleRelatedVideoClick}
        />
      )}
    </div>
  )
}

export default Videos
