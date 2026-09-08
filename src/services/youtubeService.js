const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const PLAYLIST_ID = 'PLesVJEd8rKWQ'

/**
 * Fetch videos from YouTube playlist
 * Requires YouTube Data API v3
 */
export async function fetchPlaylistVideos() {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured. Playlist videos will not be loaded.')
    return []
  }

  try {
    console.log('Fetching YouTube playlist:', PLAYLIST_ID)
    console.log('API Key configured:', YOUTUBE_API_KEY ? 'Yes' : 'No')

    // Fetch playlist items
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${PLAYLIST_ID}&maxResults=50&key=${YOUTUBE_API_KEY}`
    )

    console.log('YouTube API response status:', playlistResponse.status)

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}))
      console.error('YouTube API error details:', errorData)
      throw new Error(`YouTube API error: ${playlistResponse.statusText} - ${JSON.stringify(errorData)}`)
    }

    const playlistData = await playlistResponse.json()
    console.log('YouTube API response items count:', playlistData.items?.length || 0)

    if (!playlistData.items || playlistData.items.length === 0) {
      console.log('No videos found in playlist')
      return []
    }

    // Transform YouTube playlist items to match our video format
    const videos = playlistData.items
      .filter(item => item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId)
      .map(item => {
        const snippet = item.snippet
        const videoId = snippet.resourceId.videoId

        return {
          id: `youtube_${videoId}`, // Prefix to distinguish from database videos
          title: snippet.title,
          description: snippet.description || '',
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          youtubeVideoId: videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnailUrl: snippet.thumbnails?.maxres?.url ||
                       snippet.thumbnails?.high?.url ||
                       snippet.thumbnails?.medium?.url ||
                       snippet.thumbnails?.default?.url ||
                       `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          categoryId: null, // YouTube playlist videos don't have our categories
          status: 'published',
          featured: false,
          displayOrder: 0,
          createdAt: snippet.publishedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFromPlaylist: true // Flag to identify playlist videos
        }
      })

    console.log('Successfully fetched playlist videos:', videos.length)
    return videos
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error)
    throw error
  }
}

/**
 * Check if YouTube API is configured
 */
export function isYouTubeAPIConfigured() {
  return !!YOUTUBE_API_KEY
}
