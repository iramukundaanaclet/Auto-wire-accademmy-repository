import { useState } from 'react'

function Vehicles() {
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')

  const brands = [
    {
      id: 1,
      name: 'Toyota',
      country: 'Japan',
      industry: 'Automotive',
      priceRange: '$15,000 - $80,000',
      description: 'Known for reliability, fuel efficiency, and hybrid technology',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
      models: ['Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander']
    },
    {
      id: 2,
      name: 'BMW',
      country: 'Germany',
      industry: 'Luxury Automotive',
      priceRange: '$35,000 - $150,000',
      description: 'Premium vehicles with advanced technology and performance',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54d?w=600&h=400&fit=crop',
      models: ['3 Series', '5 Series', 'X5', '7 Series', 'X3']
    },
    {
      id: 3,
      name: 'Mercedes-Benz',
      country: 'Germany',
      industry: 'Luxury Automotive',
      priceRange: '$40,000 - $200,000',
      description: 'Luxury vehicles with cutting-edge safety and comfort features',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb98b7d?w=600&h=400&fit=crop',
      models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE']
    },
    {
      id: 4,
      name: 'Ford',
      country: 'United States',
      industry: 'Automotive',
      priceRange: '$20,000 - $90,000',
      description: 'American innovation with powerful engines and truck expertise',
      image: 'https://images.unsplash.com/photo-1580274459197-24cd3c04b497?w=600&h=400&fit=crop',
      models: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus']
    },
    {
      id: 5,
      name: 'Honda',
      country: 'Japan',
      industry: 'Automotive',
      priceRange: '$18,000 - $60,000',
      description: 'Reliable and efficient vehicles with advanced safety features',
      image: 'https://images.unsplash.com/photo-1617788188033-11f892829c01?w=600&h=400&fit=crop',
      models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit']
    },
    {
      id: 6,
      name: 'Volkswagen',
      country: 'Germany',
      industry: 'Automotive',
      priceRange: '$22,000 - $70,000',
      description: 'German engineering with focus on performance and design',
      image: 'https://images.unsplash.com/photo-1606220935494-9b55e3b3f5b9?w=600&h=400&fit=crop',
      models: ['Golf', 'Passat', 'Tiguan', 'Atlas', 'ID.4']
    },
    {
      name: 'Hyundai',
      country: 'South Korea',
      industry: 'Automotive',
      priceRange: '$16,000 - $55,000',
      description: 'Value-focused vehicles with excellent warranties and technology',
      image: 'https://images.unsplash.com/photo-15334733592779-9339954b6b5d?w=600&h=400&fit=crop',
      models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona']
    },
    {
      id: 7,
      name: 'Tesla',
      country: 'United States',
      industry: 'Electric Vehicles',
      priceRange: '$40,000 - $130,000',
      description: 'Leading electric vehicle manufacturer with advanced autopilot technology',
      image: 'https://images.unsplash.com/photo-1560958073674-3d3797185847?w=600&h=400&fit=crop',
      models: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
    },
    {
      id: 8,
      name: 'Nissan',
      country: 'Japan',
      industry: 'Automotive',
      priceRange: '$15,000 - $60,000',
      description: 'Innovative vehicles with focus on electric and hybrid technology',
      image: 'https://images.unsplash.com/photo-1609521263974-f7262d988c45?w=600&h=400&fit=crop',
      models: ['Altima', 'Rogue', 'Leaf', 'Pathfinder', 'Sentra']
    }
  ]

  const industries = ['all', 'Automotive', 'Luxury Automotive', 'Electric Vehicles']

  const countries = ['all', 'Japan', 'Germany', 'United States', 'South Korea']

  const filteredBrands = brands.filter(brand => {
    const matchesBrand = selectedBrand === 'all' || brand.name.toLowerCase().includes(selectedBrand.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || brand.industry === selectedIndustry
    return matchesBrand && matchesIndustry
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Vehicle Brands & Models</h1>
        <p className="text-gray-600">Explore modern vehicle brands, pricing, and industry information</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Discover Modern Vehicles</h2>
        <p className="text-gray-300 mb-6">
          Explore the latest vehicle brands, compare prices, and learn about automotive industry innovations from around the world.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-navy-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-electric-400 mb-1">8+</div>
            <div className="text-gray-300 text-sm">Brands</div>
          </div>
          <div className="bg-navy-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-electric-400 mb-1">50+</div>
            <div className="text-gray-300 text-sm">Models</div>
          </div>
          <div className="bg-navy-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-electric-400 mb-1">5+</div>
            <div className="text-gray-300 text-sm">Countries</div>
          </div>
          <div className="bg-navy-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-electric-400 mb-1">3+</div>
            <div className="text-gray-300 text-sm">Industries</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country} value={country}>
                  {country === 'all' ? 'All Countries' : country}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search brands..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `
                    <div class="h-48 bg-navy-600 flex items-center justify-center">
                      <div class="text-center text-white p-4">
                        <div class="text-2xl font-bold mb-2">${brand.name}</div>
                        <div class="text-sm text-gray-300">${brand.country}</div>
                      </div>
                    </div>
                  `
                }}
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-navy-900">
                {brand.industry}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-navy-900">{brand.name}</h3>
                <span className="text-sm text-gray-500">{brand.country}</span>
              </div>
              <p className="text-gray-600 mb-4">{brand.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">Price Range:</span>
                  <div className="font-semibold text-navy-900">{brand.priceRange}</div>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-500 mb-2 block">Popular Models:</span>
                <div className="flex flex-wrap gap-2">
                  {brand.models.map((model, index) => (
                    <span key={index} className="px-2 py-1 bg-electric-100 text-electric-700 rounded-full text-xs">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Information */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900 mb-6">Automotive Industry Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Traditional Automotive</h3>
            <p className="text-gray-600 mb-4">
              Established manufacturers focusing on internal combustion engines with decades of engineering expertise.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-navy-900 rounded-full mr-2"></div>
                <span className="text-gray-700">Toyota, Honda, Ford, Nissan</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-navy-900 rounded-full mr-2"></div>
                <span className="text-gray-700">Focus: Reliability & Value</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Luxury Automotive</h3>
            <p className="text-gray-600 mb-4">
              Premium brands offering advanced technology, superior comfort, and performance vehicles.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-accent-500 rounded-full mr-2"></div>
                <span className="text-gray-700">BMW, Mercedes-Benz, Audi</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-accent-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Focus: Premium Features</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Electric Vehicles</h3>
            <p className="text-gray-600 mb-4">
              Leading the transition to sustainable transportation with advanced battery technology and autonomous driving.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-electric-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Tesla, BYD, Rivian</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-electric-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Focus: Innovation & Sustainability</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-electric-600 to-electric-700 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Interested in Learning About These Vehicles?</h2>
        <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
          Understanding vehicle electrical systems is essential for modern automotive work. Start your learning journey with AutoWire Academy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white hover:bg-gray-100 text-navy-900 font-semibold rounded-lg transition-colors">
            Start Learning
          </button>
          <button className="px-8 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-lg transition-colors">
            Explore Wiring Lab
          </button>
        </div>
      </div>
    </div>
  )
}

export default Vehicles
