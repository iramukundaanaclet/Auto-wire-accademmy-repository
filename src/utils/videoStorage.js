import { supabase } from '../lib/supabase'
import { generateId, formatDate } from './videoUtils'

const VIDEOS_KEY = 'autowire_videos'
const CATEGORIES_KEY = 'autowire_video_categories'

// Legacy localStorage functions for migration
const getLocalVideos = () => {
  try {
    const videos = localStorage.getItem(VIDEOS_KEY)
    return videos ? JSON.parse(videos) : []
  } catch (error) {
    console.error('Error reading videos from localStorage:', error)
    return []
  }
}

const getLocalCategories = () => {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    return categories ? JSON.parse(categories) : []
  } catch (error) {
    console.error('Error reading categories from localStorage:', error)
    return []
  }
}

/**
 * Convert database record to frontend format
 */
const convertVideoFromDB = (dbVideo) => ({
  id: dbVideo.id,
  title: dbVideo.title,
  description: dbVideo.description,
  youtubeUrl: dbVideo.youtube_url,
  youtubeVideoId: dbVideo.youtube_video_id,
  embedUrl: `https://www.youtube.com/embed/${dbVideo.youtube_video_id}`,
  thumbnailUrl: dbVideo.thumbnail_url,
  categoryId: dbVideo.category_id,
  status: dbVideo.status,
  featured: dbVideo.featured,
  displayOrder: dbVideo.display_order,
  createdAt: dbVideo.created_at,
  updatedAt: dbVideo.updated_at
})

const convertVideoToDB = (video) => ({
  title: video.title,
  description: video.description,
  youtube_url: video.youtubeUrl,
  youtube_video_id: video.youtubeVideoId,
  thumbnail_url: video.thumbnailUrl,
  category_id: video.categoryId,
  status: video.status,
  featured: video.featured,
  display_order: video.displayOrder
})

const convertCategoryFromDB = (dbCategory) => ({
  id: dbCategory.id,
  name: dbCategory.name,
  description: dbCategory.description,
  createdAt: dbCategory.created_at,
  updatedAt: dbCategory.updated_at
})

const convertCategoryToDB = (category) => ({
  name: category.name,
  description: category.description
})

/**
 * Get all videos from Supabase
 */
export async function getVideos() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

/**
 * Add a new video to Supabase
 */
export async function addVideo(videoData) {
  try {
    const dbData = convertVideoToDB(videoData)
    const { data, error } = await supabase
      .from('videos')
      .insert(dbData)
      .select()
      .single()

    if (error) throw error
    return convertVideoFromDB(data)
  } catch (error) {
    console.error('Error adding video:', error)
    throw error
  }
}

/**
 * Update an existing video in Supabase
 */
export async function updateVideo(videoId, videoData) {
  try {
    const dbData = convertVideoToDB(videoData)
    const { data, error } = await supabase
      .from('videos')
      .update(dbData)
      .eq('id', videoId)
      .select()
      .single()

    if (error) throw error
    return convertVideoFromDB(data)
  } catch (error) {
    console.error('Error updating video:', error)
    throw error
  }
}

/**
 * Delete a video from Supabase
 */
export async function deleteVideo(videoId) {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}

/**
 * Get a single video by ID
 */
export async function getVideoById(videoId) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single()

    if (error) throw error
    return convertVideoFromDB(data)
  } catch (error) {
    console.error('Error fetching video:', error)
    return null
  }
}

/**
 * Get published videos only
 */
export async function getPublishedVideos() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error fetching published videos:', error)
    return []
  }
}

/**
 * Get featured videos only
 */
export async function getFeaturedVideos() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error fetching featured videos:', error)
    return []
  }
}

/**
 * Get videos by category
 */
export async function getVideosByCategory(categoryId) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error fetching videos by category:', error)
    return []
  }
}

/**
 * Search videos
 */
export async function searchVideos(query) {
  try {
    const searchTerm = query.toLowerCase()
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error searching videos:', error)
    return []
  }
}

/**
 * Check if video already exists (by YouTube video ID)
 */
export async function videoExists(youtubeVideoId) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('id')
      .eq('youtube_video_id', youtubeVideoId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (error) {
    console.error('Error checking video existence:', error)
    return false
  }
}

/**
 * Get video statistics
 */
export async function getVideoStats() {
  try {
    const { data: allVideos, error: allError } = await supabase
      .from('videos')
      .select('status, featured')

    if (allError) throw allError

    return {
      total: allVideos.length,
      published: allVideos.filter(v => v.status === 'published').length,
      drafts: allVideos.filter(v => v.status === 'draft').length,
      featured: allVideos.filter(v => v.featured).length
    }
  } catch (error) {
    console.error('Error fetching video stats:', error)
    return { total: 0, published: 0, drafts: 0, featured: 0 }
  }
}

/**
 * Get categories from Supabase
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data.map(convertCategoryFromDB)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Add a new category to Supabase
 */
export async function addCategory(categoryData) {
  try {
    const dbData = convertCategoryToDB(categoryData)
    const { data, error } = await supabase
      .from('categories')
      .insert(dbData)
      .select()
      .single()

    if (error) throw error
    return convertCategoryFromDB(data)
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

/**
 * Update a category in Supabase
 */
export async function updateCategory(categoryId, categoryData) {
  try {
    const dbData = convertCategoryToDB(categoryData)
    const { data, error } = await supabase
      .from('categories')
      .update(dbData)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error
    return convertCategoryFromDB(data)
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

/**
 * Delete a category from Supabase
 */
export async function deleteCategory(categoryId) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (error) throw error
    return convertCategoryFromDB(data)
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

/**
 * Migrate localStorage videos to Supabase
 */
export async function migrateLocalStorageVideos() {
  try {
    const localVideos = getLocalVideos()
    if (localVideos.length === 0) {
      return { success: true, migrated: 0, duplicates: 0, errors: 0 }
    }

    let migrated = 0
    let duplicates = 0
    let errors = 0

    for (const video of localVideos) {
      try {
        // Check if video already exists in Supabase
        const exists = await videoExists(video.youtubeVideoId)
        if (exists) {
          duplicates++
          continue
        }

        // Add video to Supabase
        await addVideo(video)
        migrated++
      } catch (error) {
        console.error('Error migrating video:', error)
        errors++
      }
    }

    return { success: true, migrated, duplicates, errors }
  } catch (error) {
    console.error('Error during migration:', error)
    return { success: false, migrated: 0, duplicates: 0, errors: 1 }
  }
}

/**
 * Check if localStorage has videos to migrate
 */
export function hasLocalStorageVideos() {
  const localVideos = getLocalVideos()
  return localVideos.length > 0
}

/**
 * Initialize data (legacy compatibility)
 */
export function initializeVideoData() {
  // This function is kept for compatibility but no longer initializes localStorage
  // The database is initialized by the SQL schema
  console.log('Video data initialization: Using Supabase database')
}
