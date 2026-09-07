import { useState } from 'react'
import VideoPlayer from './VideoPlayer'
import { formatDate } from '../utils/videoUtils'

function VideoModal({ video, category, relatedVideos, onClose, onRelatedVideoClick }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="bg-navy-900 p-6 pb-4">
            <VideoPlayer video={video} />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-electric-100 text-electric-700 rounded-full text-sm font-medium">
              {category?.name || 'Uncategorized'}
            </span>
            {video.featured && (
              <span className="px-3 py-1 bg-accent-500 text-white rounded-full text-sm font-medium">
                Featured
              </span>
            )}
            <span className="text-sm text-gray-500">{formatDate(video.createdAt)}</span>
          </div>

          <h2 className="text-2xl font-bold text-navy-900 mb-4">{video.title}</h2>
          <p className="text-gray-600 mb-6">{video.description}</p>

          {relatedVideos && relatedVideos.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Related Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedVideos.slice(0, 4).map((relatedVideo) => (
                  <div
                    key={relatedVideo.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => onRelatedVideoClick(relatedVideo)}
                  >
                    <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {imageError ? (
                        <div className="w-full h-full bg-navy-600 flex items-center justify-center">
                          <div className="text-white text-xs text-center px-2">{relatedVideo.title}</div>
                        </div>
                      ) : (
                        <img
                          src={relatedVideo.thumbnailUrl}
                          alt={relatedVideo.title}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-navy-900 text-sm line-clamp-2">{relatedVideo.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(relatedVideo.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoModal
