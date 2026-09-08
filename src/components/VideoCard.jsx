import { useState } from 'react'

function VideoCard({ video, category, onWatch }) {
  const [imageError, setImageError] = useState(false)

  const categoryName = category?.name || video.category || 'Uncategorized'
  const thumbnailUrl = video.thumbnailUrl || video.thumbnail

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
      <div className="relative aspect-video bg-gray-900 cursor-pointer group" onClick={() => onWatch(video)}>
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="text-2xl font-bold mb-2">{video.title}</div>
              <div className="text-sm text-gray-300">{categoryName}</div>
            </div>
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-electric-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {video.featured && (
          <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-electric-100 text-electric-700 rounded-full text-xs font-medium">
            {categoryName}
          </span>
          <span className="text-xs text-gray-500">{formatDate(video.createdAt)}</span>
        </div>
        <h3 className="font-semibold text-navy-900 mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
        <button
          onClick={() => onWatch(video)}
          className="w-full px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Watch Video
        </button>
      </div>
    </div>
  )
}

export default VideoCard
