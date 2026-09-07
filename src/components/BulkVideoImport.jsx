import { useState, useEffect } from 'react'
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  validateYouTubeUrl
} from '../utils/videoUtils'
import { getCategories, addVideo, videoExists } from '../utils/videoStorage'

function BulkVideoImport({ onComplete, onCancel }) {
  const [urls, setUrls] = useState('')
  const [defaultCategoryId, setDefaultCategoryId] = useState('')
  const [defaultStatus, setDefaultStatus] = useState('published')
  const [defaultFeatured, setDefaultFeatured] = useState(false)
  const [categories, setCategories] = useState([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const cats = getCategories()
    setCategories(cats)
    if (cats.length > 0) {
      setDefaultCategoryId(cats[0].id)
    }
  }, [])

  const handleImport = () => {
    setProcessing(true)
    setResults(null)

    const urlList = urls.split('\n').map(url => url.trim()).filter(url => url.length > 0)
    
    let added = 0
    let duplicates = 0
    let invalid = 0
    const processedResults = []

    urlList.forEach((url, index) => {
      if (!validateYouTubeUrl(url)) {
        invalid++
        processedResults.push({ url, status: 'invalid', message: 'Invalid YouTube URL' })
        return
      }

      const videoId = extractYouTubeVideoId(url)
      
      if (videoExists(videoId)) {
        duplicates++
        processedResults.push({ url, status: 'duplicate', message: 'Video already exists' })
        return
      }

      const videoData = {
        title: `Video ${index + 1}`,
        youtubeUrl: url,
        youtubeVideoId: videoId,
        embedUrl: getYouTubeEmbedUrl(videoId),
        thumbnailUrl: getYouTubeThumbnail(videoId),
        description: '',
        categoryId: defaultCategoryId,
        status: defaultStatus,
        featured: defaultFeatured,
        displayOrder: 0
      }

      addVideo(videoData)
      added++
      processedResults.push({ url, status: 'added', message: 'Successfully added' })
    })

    setResults({
      total: urlList.length,
      added,
      duplicates,
      invalid,
      details: processedResults
    })
    setProcessing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URLs (one per line)</label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent font-mono text-sm"
          placeholder="https://youtu.be/mNOYS-duUJY&#10;https://youtu.be/VIDEO_ID_2&#10;https://youtu.be/VIDEO_ID_3"
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste multiple YouTube URLs, one per line. The system will automatically extract video IDs and create video records.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default Category</label>
        <select
          value={defaultCategoryId}
          onChange={(e) => setDefaultCategoryId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default Status</label>
        <select
          value={defaultStatus}
          onChange={(e) => setDefaultStatus(e.target.value)}
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
          checked={defaultFeatured}
          onChange={(e) => setDefaultFeatured(e.target.checked)}
          className="w-4 h-4 text-electric-600 border-gray-300 rounded focus:ring-electric-500"
        />
        <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
          Mark all as featured
        </label>
      </div>

      {results && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Import Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-navy-900">{results.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{results.added}</div>
              <div className="text-sm text-gray-600">Added</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{results.duplicates}</div>
              <div className="text-sm text-gray-600">Duplicates</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{results.invalid}</div>
              <div className="text-sm text-gray-600">Invalid</div>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.details.map((result, index) => (
              <div key={index} className={`text-sm p-2 rounded ${
                result.status === 'added' ? 'bg-green-100 text-green-800' :
                result.status === 'duplicate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className="font-medium">{result.message}</div>
                <div className="text-xs opacity-75 truncate">{result.url}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleImport}
          disabled={processing || !urls.trim()}
          className="flex-1 px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Import Videos'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default BulkVideoImport
