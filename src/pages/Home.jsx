import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getFeaturedVideos, getCategories } from '../utils/videoStorage'

function Home() {
  const [featuredVideos, setFeaturedVideos] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const featured = getFeaturedVideos()
    const cats = getCategories()
    setFeaturedVideos(featured.slice(0, 3)) // Show only top 3 featured videos
    setCategories(cats)
  }, [])
  return (
    <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn Vehicle Electrical Systems the Interactive Way
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Understand automotive wiring, electrical components, testing, and fault diagnosis through visual lessons and practical simulations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/learn"
                className="px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors text-center"
              >
                Start Learning
              </Link>
              <Link
                to="/wiring-lab"
                className="px-8 py-4 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors text-center"
              >
                Explore Wiring Lab
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-navy-700 rounded-2xl p-4 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop"
                alt="Automotive electrical system"
                className="rounded-xl w-full h-80 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `
                    <div class="h-80 bg-navy-600 rounded-xl flex items-center justify-center">
                      <div class="text-center p-8">
                        <svg class="w-24 h-24 text-electric-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p class="text-white text-lg">Automotive Electrical Systems</p>
                        <p class="text-gray-400 text-sm">Interactive Learning Platform</p>
                      </div>
                    </div>
                  `
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-accent-600 rounded-full p-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Learn', description: 'Study electrical theory and components', icon: '📚' },
            { step: '02', title: 'Explore', description: 'View interactive wiring diagrams', icon: '🔧' },
            { step: '03', title: 'Test', description: 'Practice with virtual multimeter', icon: '🔋' },
            { step: '04', title: 'Diagnose', description: 'Troubleshoot simulated faults', icon: '🔍' },
          ].map((item) => (
            <div key={item.step} className="text-center bg-navy-800 rounded-xl p-6 hover:bg-navy-700 transition-colors">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-electric-400 mb-2">{item.step}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-navy-800 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=600&h=300&fit=crop"
              alt="Wiring diagrams"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Wiring Lab</h3>
              <p className="text-gray-300 mb-6">
                Build and test electrical circuits in a safe, interactive environment. Learn how components connect and current flows through systems.
              </p>
              <Link
                to="/wiring-lab"
                className="text-electric-400 hover:text-electric-300 font-semibold"
              >
                Try Wiring Lab →
              </Link>
            </div>
          </div>
          <div className="bg-navy-800 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=300&fit=crop"
              alt="Multimeter testing"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Diagnostics Lab</h3>
              <p className="text-gray-300 mb-6">
                Practice diagnosing electrical faults with simulated scenarios. Use a virtual multimeter to test circuits and identify problems.
              </p>
              <Link
                to="/diagnostics"
                className="text-electric-400 hover:text-electric-300 font-semibold"
              >
                Try Diagnostics Lab →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Brands Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-navy-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Explore Vehicle Brands</h2>
          <p className="text-gray-300 mb-6">
            Discover modern vehicle brands, their electrical systems, and pricing information. Understanding different vehicle manufacturers helps you work with various automotive electrical systems.
          </p>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['Toyota', 'BMW', 'Mercedes', 'Tesla', 'Ford', 'Honda', 'Volkswagen', 'Hyundai'].map((brand, index) => (
              <div key={index} className="bg-navy-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-electric-400 mb-1">{brand}</div>
              </div>
            ))}
          </div>
          <Link
            to="/vehicles"
            className="inline-block px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors"
          >
            Explore All Brands →
          </Link>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">EV Electrical Systems BASICS</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Watch this comprehensive introduction to electric vehicle electrical systems. Learn the fundamentals of EV power distribution, battery systems, and charging infrastructure.
          </p>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/mNOYS-duUJY"
              title="EV Electrical Systems BASICS"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      {featuredVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Latest Automotive Videos</h2>
              <p className="text-gray-300">Watch featured automotive learning content</p>
            </div>
            <Link
              to="/videos"
              className="px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors"
            >
              View All Videos
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map(video => {
              const category = categories.find(c => c.id === video.categoryId)
              return (
                <div key={video.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 bg-electric-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {video.featured && (
                      <div className="absolute top-3 left-3 bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-electric-100 text-electric-700 rounded-full text-xs font-medium">
                        {category?.name || 'Uncategorized'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
                    <Link
                      to="/videos"
                      className="w-full px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors text-sm inline-block text-center"
                    >
                      Watch Video
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-electric-400 mb-2">10+</div>
            <div className="text-gray-300">Learning Modules</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-electric-400 mb-2">50+</div>
            <div className="text-gray-300">Interactive Diagrams</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-electric-400 mb-2">100+</div>
            <div className="text-gray-300">Quiz Questions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-electric-400 mb-2">24/7</div>
            <div className="text-gray-300">Access</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-navy-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-electric-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                JD
              </div>
              <div>
                <div className="text-white font-semibold">John Doe</div>
                <div className="text-gray-400 text-sm">Automotive Student</div>
              </div>
            </div>
            <p className="text-gray-300">
              "The interactive wiring diagrams made understanding complex circuits so much easier. I finally understand how current flows through automotive systems!"
            </p>
          </div>
          <div className="bg-navy-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                SM
              </div>
              <div>
                <div className="text-white font-semibold">Sarah Miller</div>
                <div className="text-gray-400 text-sm">Mechanic</div>
              </div>
            </div>
            <p className="text-gray-300">
              "The diagnostics lab helped me improve my troubleshooting skills significantly. The virtual multimeter feels just like the real thing!"
            </p>
          </div>
          <div className="bg-navy-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-electric-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                MJ
              </div>
              <div>
                <div className="text-white font-semibold">Mike Johnson</div>
                <div className="text-gray-400 text-sm">Auto Instructor</div>
              </div>
            </div>
            <p className="text-gray-300">
              "I use this platform with my students. The visual learning approach helps them grasp electrical concepts that used to be difficult to teach."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-electric-600 to-electric-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students learning automotive electrical systems through interactive lessons and practical simulations.
          </p>
          <Link
            to="/learn"
            className="px-8 py-4 bg-white hover:bg-gray-100 text-navy-900 font-semibold rounded-lg transition-colors inline-block"
          >
            Start Learning Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
