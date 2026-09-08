// Static video configuration for AutoWire Academy
// This file stores all YouTube video information without requiring a database
// To add new videos, you can either:
// 1. Edit this file directly, or
// 2. Use the Admin Video Management interface

export const initialVideos = [
  {
    id: 'ev-electrical-basics',
    youtubeId: 'mNOYS-duUJY',
    title: 'EV Electrical Systems BASICS',
    description: 'An introductory video about EV electrical systems and their basic components.',
    thumbnail: 'https://img.youtube.com/vi/mNOYS-duUJY/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/mNOYS-duUJY',
    category: 'Electrical System',
    featured: true,
    createdAt: '2026-09-07T00:00:00.000Z'
  }
]

export const categories = [
  'Automobile Technology',
  'Engine',
  'Transmission',
  'Braking System',
  'Electrical System',
  'Diagnostics',
  'Suspension',
  'Vehicle Maintenance',
  'Body Repair',
  'Vehicle Painting',
  'Mechanical Engineering',
  'Tutorials',
  'Other'
]

// Helper function to generate YouTube thumbnail URL
export function getYouTubeThumbnail(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
}

// Helper function to generate YouTube embed URL
export function getYouTubeEmbedUrl(youtubeId) {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`
}

// Helper function to extract YouTube ID from various URL formats
export function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
