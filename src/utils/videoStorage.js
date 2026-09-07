import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { generateId, formatDate } from './videoUtils'

const VIDEOS_KEY = 'autowire_videos'
const CATEGORIES_KEY = 'autowire_video_categories'

// Initial categories for fallback mode
const INITIAL_CATEGORIES = [
  { id: 'cat1', name: 'Electric Vehicles', description: 'EV systems and technology' },
  { id: 'cat2', name: 'Engine Systems', description: 'Internal combustion engines' },
  { id: 'cat3', name: 'Brake Systems', description: 'Braking systems and components' },
  { id: 'cat4', name: 'Electrical Systems', description: 'Vehicle electrical wiring' },
  { id: 'cat5', name: 'Vehicle Diagnostics', description: 'Diagnostic procedures' },
  { id: 'cat6', name: 'Suspension Systems', description: 'Suspension and steering' },
  { id: 'cat7', name: 'Transmission', description: 'Transmission systems' },
  { id: 'cat8', name: 'Automotive Technology', description: 'General automotive tech' },
  { id: 'cat9', name: 'Vehicle Maintenance', description: 'Maintenance procedures' },
  { id: 'cat10', name: 'Body Repair', description: 'Body work and repair' }
]

// Initial video for fallback mode
const INITIAL_VIDEO = {
  id: generateId(),
  title: 'EV Electrical Systems BASICS',
  youtubeUrl: 'https://youtu.be/mNOYS-duUJY',
  youtubeVideoId: 'mNOYS-duUJY',
  embedUrl: 'https://www.youtube.com/embed/mNOYS-duUJY',
  thumbnailUrl: 'https://img.youtube.com/vi/mNOYS-duUJY/hqdefault.jpg',
  description: 'An introductory video about EV electrical systems and their basic components.',
  categoryId: 'cat1',
  status: 'published',
  featured: true,
  displayOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Legacy localStorage functions for fallback mode
const getLocalVideos = () => {
  try {
    const videos = localStorage.getItem(VIDEOS_KEY)
    return videos ? JSON.parse(videos) : [INITIAL_VIDEO]
  } catch (error) {
    console.error('Error reading videos from localStorage:', error)
    return [INITIAL_VIDEO]
  }
}

const getLocalCategories = () => {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    return categories ? JSON.parse(categories) : INITIAL_CATEGORIES
  } catch (error) {
    console.error('Error reading categories from localStorage:', error)
    return INITIAL_CATEGORIES
  }
}

const saveLocalVideos = (videos) => {
  try {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos))
    return true
  } catch (error) {
    console.error('Error saving videos to localStorage:', error)
    return false
  }
}

const saveLocalCategories = (categories) => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    return true
  } catch (error) {
    console.error('Error saving categories to localStorage:', error)
    return false
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
 * Get all videos from Supabase or fallback to localStorage
 */
export async function getVideos() {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for videos')
    return getLocalVideos()
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error fetching videos from Supabase, using localStorage fallback:', error)
    return getLocalVideos()
  }
}

/**
 * Add a new video to Supabase or fallback to localStorage
 */
export async function addVideo(videoData) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for addVideo')
    const videos = getLocalVideos()
    const newVideo = {
      id: generateId(),
      ...videoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    videos.push(newVideo)
    saveLocalVideos(videos)
    return newVideo
  }

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
    console.error('Error adding video to Supabase, using localStorage fallback:', error)
    return addVideo(videoData) // Fallback to localStorage
  }
}

/**
 * Update an existing video in Supabase or fallback to localStorage
 */
export async function updateVideo(videoId, videoData) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for updateVideo')
    const videos = getLocalVideos()
    const index = videos.findIndex(v => v.id === videoId)
    if (index !== -1) {
      videos[index] = {
        ...videos[index],
        ...videoData,
        updatedAt: new Date().toISOString()
      }
      saveLocalVideos(videos)
      return videos[index]
    }
    return null
  }

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
    console.error('Error updating video in Supabase, using localStorage fallback:', error)
    return updateVideo(videoId, videoData) // Fallback to localStorage
  }
}

/**
 * Delete a video from Supabase or fallback to localStorage
 */
export async function deleteVideo(videoId) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for deleteVideo')
    const videos = getLocalVideos()
    const filteredVideos = videos.filter(v => v.id !== videoId)
    saveLocalVideos(filteredVideos)
    return true
  }

  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting video from Supabase, using localStorage fallback:', error)
    return deleteVideo(videoId) // Fallback to localStorage
  }
}

/**
 * Get a single video by ID
 */
export async function getVideoById(videoId) {
  if (!isSupabaseConfigured) {
    const videos = getLocalVideos()
    return videos.find(v => v.id === videoId) || null
  }

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
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for getPublishedVideos')
    return getLocalVideos().filter(v => v.status === 'published')
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(convertVideoFromDB)
  } catch (error) {
    console.error('Error fetching published videos from Supabase, using localStorage fallback:', error)
    return getLocalVideos().filter(v => v.status === 'published')
  }
}

/**
 * Get featured videos only
 */
export async function getFeaturedVideos() {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for getFeaturedVideos')
    return getLocalVideos().filter(v => v.status === 'published' && v.featured)
  }

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
    console.error('Error fetching featured videos from Supabase, using localStorage fallback:', error)
    return getLocalVideos().filter(v => v.status === 'published' && v.featured)
  }
}

/**
 * Get videos by category
 */
export async function getVideosByCategory(categoryId) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for getVideosByCategory')
    return getLocalVideos().filter(v => v.status === 'published' && v.categoryId === categoryId)
  }

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
    console.error('Error fetching videos by category from Supabase, using localStorage fallback:', error)
    return getLocalVideos().filter(v => v.status === 'published' && v.categoryId === categoryId)
  }
}

/**
 * Search videos
 */
export async function searchVideos(query) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for searchVideos')
    const videos = getLocalVideos().filter(v => v.status === 'published')
    const searchTerm = query.toLowerCase()
    return videos.filter(v =>
      v.title.toLowerCase().includes(searchTerm) ||
      v.description.toLowerCase().includes(searchTerm)
    )
  }

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
    console.error('Error searching videos in Supabase, using localStorage fallback:', error)
    const videos = getLocalVideos().filter(v => v.status === 'published')
    const searchTerm = query.toLowerCase()
    return videos.filter(v =>
      v.title.toLowerCase().includes(searchTerm) ||
      v.description.toLowerCase().includes(searchTerm)
    )
  }
}

/**
 * Check if video already exists (by YouTube video ID)
 */
export async function videoExists(youtubeVideoId) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for videoExists')
    const videos = getLocalVideos()
    return videos.some(v => v.youtubeVideoId === youtubeVideoId)
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('id')
      .eq('youtube_video_id', youtubeVideoId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (error) {
    console.error('Error checking video existence in Supabase, using localStorage fallback:', error)
    const videos = getLocalVideos()
    return videos.some(v => v.youtubeVideoId === youtubeVideoId)
  }
}

/**
 * Get video statistics
 */
export async function getVideoStats() {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for getVideoStats')
    const videos = getLocalVideos()
    return {
      total: videos.length,
      published: videos.filter(v => v.status === 'published').length,
      drafts: videos.filter(v => v.status === 'draft').length,
      featured: videos.filter(v => v.featured).length
    }
  }

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
    console.error('Error fetching video stats from Supabase, using localStorage fallback:', error)
    const videos = getLocalVideos()
    return {
      total: videos.length,
      published: videos.filter(v => v.status === 'published').length,
      drafts: videos.filter(v => v.status === 'draft').length,
      featured: videos.filter(v => v.featured).length
    }
  }
}

/**
 * Get categories from Supabase or fallback to localStorage
 */
export async function getCategories() {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for getCategories')
    return getLocalCategories()
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data.map(convertCategoryFromDB)
  } catch (error) {
    console.error('Error fetching categories from Supabase, using localStorage fallback:', error)
    return getLocalCategories()
  }
}

/**
 * Add a new category to Supabase or fallback to localStorage
 */
export async function addCategory(categoryData) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for addCategory')
    const categories = getLocalCategories()
    const newCategory = {
      id: generateId(),
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    categories.push(newCategory)
    saveLocalCategories(categories)
    return newCategory
  }

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
    console.error('Error adding category to Supabase, using localStorage fallback:', error)
    return addCategory(categoryData) // Fallback to localStorage
  }
}

/**
 * Update a category in Supabase or fallback to localStorage
 */
export async function updateCategory(categoryId, categoryData) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for updateCategory')
    const categories = getLocalCategories()
    const index = categories.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        ...categoryData,
        updatedAt: new Date().toISOString()
      }
      saveLocalCategories(categories)
      return categories[index]
    }
    return null
  }

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
    console.error('Error updating category in Supabase, using localStorage fallback:', error)
    return updateCategory(categoryId, categoryData) // Fallback to localStorage
  }
}

/**
 * Delete a category from Supabase or fallback to localStorage
 */
export async function deleteCategory(categoryId) {
  if (!isSupabaseConfigured) {
    console.log('Using localStorage fallback for deleteCategory')
    const categories = getLocalCategories()
    const filteredCategories = categories.filter(c => c.id !== categoryId)
    saveLocalCategories(filteredCategories)
    return true
  }

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting category from Supabase, using localStorage fallback:', error)
    return deleteCategory(categoryId) // Fallback to localStorage
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId) {
  if (!isSupabaseConfigured) {
    const categories = getLocalCategories()
    return categories.find(c => c.id === categoryId) || null
  }

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
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured, skipping migration')
    return { success: false, message: 'Supabase not configured' }
  }

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
  if (!isSupabaseConfigured) {
    return false // Don't show migration if Supabase isn't configured
  }
  const localVideos = getLocalVideos()
  return localVideos.length > 1 // Only show if there are videos beyond the initial one
}

/**
 * Initialize data (legacy compatibility)
 */
export function initializeVideoData() {
  // This function is kept for compatibility but no longer initializes localStorage
  // The database is initialized by the SQL schema
  console.log('Video data initialization: Using Supabase database or localStorage fallback')
}
