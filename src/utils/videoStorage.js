import { generateId, formatDate } from './videoUtils'

const VIDEOS_KEY = 'autowire_videos'
const CATEGORIES_KEY = 'autowire_video_categories'

// Initial categories
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

// Initial video
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

/**
 * Get all videos from localStorage
 */
export function getVideos() {
  try {
    const videos = localStorage.getItem(VIDEOS_KEY)
    if (!videos) {
      // Initialize with the sample video
      const initialVideos = [INITIAL_VIDEO]
      localStorage.setItem(VIDEOS_KEY, JSON.stringify(initialVideos))
      return initialVideos
    }
    return JSON.parse(videos)
  } catch (error) {
    console.error('Error reading videos from localStorage:', error)
    return []
  }
}

/**
 * Save videos to localStorage
 */
export function saveVideos(videos) {
  try {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos))
    return true
  } catch (error) {
    console.error('Error saving videos to localStorage:', error)
    return false
  }
}

/**
 * Add a new video
 */
export function addVideo(videoData) {
  const videos = getVideos()
  const newVideo = {
    id: generateId(),
    ...videoData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  videos.push(newVideo)
  saveVideos(videos)
  return newVideo
}

/**
 * Update an existing video
 */
export function updateVideo(videoId, videoData) {
  const videos = getVideos()
  const index = videos.findIndex(v => v.id === videoId)
  if (index !== -1) {
    videos[index] = {
      ...videos[index],
      ...videoData,
      updatedAt: new Date().toISOString()
    }
    saveVideos(videos)
    return videos[index]
  }
  return null
}

/**
 * Delete a video
 */
export function deleteVideo(videoId) {
  const videos = getVideos()
  const filteredVideos = videos.filter(v => v.id !== videoId)
  saveVideos(filteredVideos)
  return filteredVideos
}

/**
 * Get a single video by ID
 */
export function getVideoById(videoId) {
  const videos = getVideos()
  return videos.find(v => v.id === videoId) || null
}

/**
 * Get published videos only
 */
export function getPublishedVideos() {
  const videos = getVideos()
  return videos.filter(v => v.status === 'published')
}

/**
 * Get featured videos only
 */
export function getFeaturedVideos() {
  const videos = getPublishedVideos()
  return videos.filter(v => v.featured)
}

/**
 * Get videos by category
 */
export function getVideosByCategory(categoryId) {
  const videos = getPublishedVideos()
  return videos.filter(v => v.categoryId === categoryId)
}

/**
 * Search videos
 */
export function searchVideos(query) {
  const videos = getPublishedVideos()
  const searchTerm = query.toLowerCase()
  return videos.filter(v =>
    v.title.toLowerCase().includes(searchTerm) ||
    v.description.toLowerCase().includes(searchTerm)
  )
}

/**
 * Check if video already exists (by YouTube video ID)
 */
export function videoExists(youtubeVideoId) {
  const videos = getVideos()
  return videos.some(v => v.youtubeVideoId === youtubeVideoId)
}

/**
 * Get video statistics
 */
export function getVideoStats() {
  const videos = getVideos()
  return {
    total: videos.length,
    published: videos.filter(v => v.status === 'published').length,
    drafts: videos.filter(v => v.status === 'draft').length,
    featured: videos.filter(v => v.featured).length
  }
}

/**
 * Get categories from localStorage
 */
export function getCategories() {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    if (!categories) {
      // Initialize with default categories
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES))
      return INITIAL_CATEGORIES
    }
    return JSON.parse(categories)
  } catch (error) {
    console.error('Error reading categories from localStorage:', error)
    return INITIAL_CATEGORIES
  }
}

/**
 * Save categories to localStorage
 */
export function saveCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    return true
  } catch (error) {
    console.error('Error saving categories to localStorage:', error)
    return false
  }
}

/**
 * Add a new category
 */
export function addCategory(categoryData) {
  const categories = getCategories()
  const newCategory = {
    id: generateId(),
    ...categoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  categories.push(newCategory)
  saveCategories(categories)
  return newCategory
}

/**
 * Update a category
 */
export function updateCategory(categoryId, categoryData) {
  const categories = getCategories()
  const index = categories.findIndex(c => c.id === categoryId)
  if (index !== -1) {
    categories[index] = {
      ...categories[index],
      ...categoryData,
      updatedAt: new Date().toISOString()
    }
    saveCategories(categories)
    return categories[index]
  }
  return null
}

/**
 * Delete a category
 */
export function deleteCategory(categoryId) {
  const categories = getCategories()
  const filteredCategories = categories.filter(c => c.id !== categoryId)
  saveCategories(filteredCategories)
  return filteredCategories
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId) {
  const categories = getCategories()
  return categories.find(c => c.id === categoryId) || null
}

/**
 * Initialize data if not present
 */
export function initializeVideoData() {
  if (!localStorage.getItem(VIDEOS_KEY)) {
    saveVideos([INITIAL_VIDEO])
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    saveCategories(INITIAL_CATEGORIES)
  }
}
