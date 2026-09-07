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

function Videos() {
  const [videos, setVideos] = useState([])
  const [featuredVideos, setFeaturedVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoCategory, setSelectedVideoCategory] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      const [published, featured] = await Promise.all([
        getPublishedVideos(),
        getFeaturedVideos()
      ])
      setVideos(published)
      setFeaturedVideos(featured)
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
    } catch (err) {
      console.error('Error filtering videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchVideo = async (video) => {
    const category = categories.find(c => c.id === video.categoryId)
    const allPublished = await getPublishedVideos()
    const related = allPublished
      .filter(v => v.categoryId === video.categoryId && v.id !== video.id)
      .slice(0, 4)

    setSelectedVideo(video)
    setSelectedVideoCategory(category)
    setRelatedVideos(related)
  }

  const handleRelatedVideoClick = (video) => {
    handleWatchVideo(video)
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

      {/* All Videos */}
      {!loading && (
        <div>
          <h2 className="text-2xl font-bold text-navy-900 mb-6">
            {selectedCategory === 'all' ? 'All Videos' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          {videos.length > 0 ? (
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
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
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
