import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Wiring Lab', path: '/wiring-lab' },
    { name: 'Diagnostics', path: '/diagnostics' },
    { name: 'Diagrams', path: '/diagrams' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Progress', path: '/progress' },
  ]

  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="AutoWire Academy Home">
            <div className="w-8 h-8 bg-electric-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">AutoWire Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-electric-600 text-white'
                    : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/learn"
              className="ml-4 px-4 py-2 bg-accent-600 hover:bg-accent-700 rounded-md text-sm font-medium transition-colors"
            >
              Start Learning
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-electric-500"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
          >
            {!isOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-800" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-electric-600 text-white'
                    : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/learn"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 mt-4 bg-accent-600 hover:bg-accent-700 rounded-md text-base font-medium text-center"
            >
              Start Learning
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
