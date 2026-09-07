import { useState, useEffect } from 'react'
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  validateYouTubeUrl
} from '../utils/videoUtils'
import { getCategories } from '../utils/videoStorage'

function VideoForm({ video, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    categoryId: '',
    status: 'published',
    featured: false,
    displayOrder: 0
  })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [urlPreview, setUrlPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
    
    if (video) {
      setFormData({
        title: video.title,
        youtubeUrl: video.youtubeUrl,
        description: video.description,
        categoryId: video.categoryId,
        status: video.status,
        featured: video.featured,
        displayOrder: video.displayOrder || 0
      })
    }
  }, [video])

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleUrlChange = (e) => {
    const url = e.target.value
    setFormData({ ...formData, youtubeUrl: url })
    setError('')

    if (url && validateYouTubeUrl(url)) {
      const videoId = extractYouTubeVideoId(url)
      setUrlPreview({
        videoId,
        embedUrl: getYouTubeEmbedUrl(videoId),
        thumbnailUrl: getYouTubeThumbnail(videoId)
      })
    } else {
      setUrlPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a video title')
      setLoading(false)
      return
    }

    if (!formData.youtubeUrl.trim()) {
      setError('Please enter a YouTube URL')
      setLoading(false)
      return
    }

    if (!validateYouTubeUrl(formData.youtubeUrl)) {
      setError('Please enter a valid YouTube video URL')
      setLoading(false)
      return
    }

    if (!formData.categoryId) {
      setError('Please select a category')
      setLoading(false)
      return
    }

    const videoId = extractYouTubeVideoId(formData.youtubeUrl)
    const videoData = {
      title: formData.title,
      youtubeUrl: formData.youtubeUrl,
      youtubeVideoId: videoId,
      embedUrl: getYouTubeEmbedUrl(videoId),
      thumbnailUrl: getYouTubeThumbnail(videoId),
      description: formData.description,
      categoryId: formData.categoryId,
      status: formData.status,
      featured: formData.featured,
      displayOrder: formData.displayOrder
    }

    try {
      await onSubmit(videoData)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Failed to save video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
          placeholder="Enter video title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
        <input
          type="url"
          value={formData.youtubeUrl}
          onChange={handleUrlChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
          placeholder="https://youtu.be/..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
        </p>
      </div>

      {urlPreview && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">URL Preview</p>
          <div className="flex items-center gap-4">
            <img
              src={urlPreview.thumbnailUrl}
              alt="Thumbnail preview"
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <strong>Video ID:</strong> {urlPreview.videoId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Embed URL:</strong> {urlPreview.embedUrl}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
          placeholder="Enter video description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
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
        <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
          Featured video
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
        <input
          type="number"
          value={formData.displayOrder}
          onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (video ? 'Update Video' : 'Add Video')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default VideoForm
