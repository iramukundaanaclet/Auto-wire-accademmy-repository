import { useState, useEffect } from 'react'
import { initialVideos, categories, getYouTubeThumbnail, getYouTubeEmbedUrl, extractYouTubeId } from '../data/videos'

function AdminVideoManager() {
  const [videos, setVideos] = useState(initialVideos)
  const [bulkUrls, setBulkUrls] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null)
  const [editingVideo, setEditingVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [importResults, setImportResults] = useState(null)

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    youtubeId: '',
    title: '',
    description: '',
    category: 'Other',
    featured: false
  })

  const handleBulkImport = () => {
    const lines = bulkUrls.split('\n').filter(line => line.trim())
    const results = {
      total: lines.length,
      added: 0,
      duplicates: 0,
      invalid: 0,
      errors: []
    }

    const newVideos = []

    lines.forEach(line => {
      let youtubeId, title, description, category

      // Check for advanced format: URL | TITLE | DESCRIPTION | CATEGORY
      if (line.includes('|')) {
        const parts = line.split('|').map(part => part.trim())
        youtubeId = extractYouTubeId(parts[0])
        title = parts[1] || 'YouTube Video'
        description = parts[2] || 'Watch this video on our website.'
        category = parts[3] || 'Other'
      } else {
        // Simple format: just URL
        youtubeId = extractYouTubeId(line)
        title = 'YouTube Video'
        description = 'Watch this video on our website.'
        category = 'Other'
      }

      if (!youtubeId) {
        results.invalid++
        results.errors.push(`Invalid URL: ${line}`)
        return
      }

      // Check for duplicate
      if (videos.some(v => v.youtubeId === youtubeId)) {
        results.duplicates++
        return
      }

      // Add to new videos
      newVideos.push({
        id: `video-${youtubeId}`,
        youtubeId,
        title,
        description,
        thumbnail: getYouTubeThumbnail(youtubeId),
        embedUrl: getYouTubeEmbedUrl(youtubeId),
        category,
        featured: false,
        createdAt: new Date().toISOString()
      })

      results.added++
    })

    if (newVideos.length > 0) {
      setVideos([...videos, ...newVideos])
      setBulkUrls('')
      setImportResults(results)
    }

    setTimeout(() => setImportResults(null), 5000)
  }

  const handleAddVideo = () => {
    if (!formData.youtubeId) {
      alert('Please enter a YouTube URL or ID')
      return
    }

    const youtubeId = extractYouTubeId(formData.youtubeId) || formData.youtubeId

    // Check for duplicate
    if (videos.some(v => v.youtubeId === youtubeId)) {
      alert('This video already exists')
      return
    }

    const newVideo = {
      id: `video-${youtubeId}`,
      youtubeId,
      title: formData.title || 'YouTube Video',
      description: formData.description || 'Watch this video on our website.',
      thumbnail: getYouTubeThumbnail(youtubeId),
      embedUrl: getYouTubeEmbedUrl(youtubeId),
      category: formData.category,
      featured: formData.featured,
      createdAt: new Date().toISOString()
    }

    setVideos([...videos, newVideo])
    setFormData({
      youtubeId: '',
      title: '',
      description: '',
      category: 'Other',
      featured: false
    })
    setShowAddForm(false)
  }

  const handleEditVideo = () => {
    if (!editingVideo) return

    const updatedVideos = videos.map(v =>
      v.id === editingVideo.id
        ? {
            ...v,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            featured: formData.featured
          }
        : v
    )

    setVideos(updatedVideos)
    setEditingVideo(null)
    setFormData({
      youtubeId: '',
      title: '',
      description: '',
      category: 'Other',
      featured: false
    })
  }

  const handleDeleteVideo = (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== videoId))
    }
  }

  const handlePreview = (video) => {
    setPreviewVideo(video)
    setShowPreview(true)
  }

  const startEdit = (video) => {
    setEditingVideo(video)
    setFormData({
      youtubeId: video.youtubeId,
      title: video.title,
      description: video.description,
      category: video.category,
      featured: video.featured
    })
    setShowAddForm(true)
  }

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Video Management</h1>
        <p className="text-gray-600">Manage YouTube videos for your AutoWire Academy</p>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Import Results</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>Total URLs: {importResults.total}</li>
            <li>Videos added: {importResults.added}</li>
            <li>Duplicates skipped: {importResults.duplicates}</li>
            <li>Invalid URLs: {importResults.invalid}</li>
          </ul>
          {importResults.errors.length > 0 && (
            <div className="mt-2">
              <h4 className="font-medium text-red-700">Errors:</h4>
              <ul className="text-xs text-red-600 mt-1">
                {importResults.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Bulk Import Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Bulk Add Videos</h2>
        <p className="text-sm text-gray-600 mb-4">
          Paste multiple YouTube URLs (one per line). Format: URL or URL | Title | Description | Category
        </p>
        <textarea
          value={bulkUrls}
          onChange={(e) => setBulkUrls(e.target.value)}
          placeholder="https://youtu.be/ABC123&#10;https://youtu.be/XYZ456 | Engine Maintenance | Learn engines | Engine"
          className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent mb-4"
        />
        <button
          onClick={handleBulkImport}
          className="px-6 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
        >
          Add Videos
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL or ID</label>
              <input
                type="text"
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                placeholder="https://youtu.be/ABC123 or ABC123"
                disabled={!!editingVideo}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Video title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Video description"
                className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-electric-600 border-gray-300 rounded focus:ring-electric-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured video</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={editingVideo ? handleEditVideo : handleAddVideo}
                className="px-6 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
              >
                {editingVideo ? 'Update Video' : 'Add Video'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingVideo(null)
                  setFormData({
                    youtubeId: '',
                    title: '',
                    description: '',
                    category: 'Other',
                    featured: false
                  })
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors mb-6"
        >
          Add Single Video
        </button>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-navy-900">Video List ({filteredVideos.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredVideos.map(video => (
            <div key={video.id} className="p-4 flex items-start gap-4 hover:bg-gray-50">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-18 object-cover rounded"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-electric-100 text-electric-700 rounded">{video.category}</span>
                  <span>ID: {video.youtubeId}</span>
                  {video.featured && <span className="px-2 py-1 bg-accent-500 text-white rounded">Featured</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handlePreview(video)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={() => startEdit(video)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-navy-900">{previewVideo.title}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video">
                <iframe
                  src={previewVideo.embedUrl}
                  title={previewVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminVideoManager
