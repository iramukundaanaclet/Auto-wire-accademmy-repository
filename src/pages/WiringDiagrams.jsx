import { useState } from 'react'

function WiringDiagrams() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiagram, setSelectedDiagram] = useState(null)
  const [uploadedDiagrams, setUploadedDiagrams] = useState({})

  const categories = [
    { id: 'all', name: 'All Diagrams' },
    { id: 'starting', name: 'Starting System' },
    { id: 'charging', name: 'Charging System' },
    { id: 'lighting', name: 'Lighting System' },
    { id: 'ignition', name: 'Ignition System' },
    { id: 'sensors', name: 'Sensors' },
    { id: 'actuators', name: 'Actuators' },
    { id: 'basic', name: 'Basic Circuits' }
  ]

  const diagrams = [
    {
      id: 1,
      name: 'Basic Lighting Circuit',
      category: 'basic',
      description: 'Simple circuit with battery, switch, and lamp',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      name: 'Starting System Circuit',
      category: 'starting',
      description: 'Battery, ignition switch, relay, solenoid, and starter motor',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      name: 'Charging System Circuit',
      category: 'charging',
      description: 'Alternator, voltage regulator, and battery connection',
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      name: 'Headlight Circuit',
      category: 'lighting',
      description: 'Headlight switch, relay, and headlights',
      difficulty: 'Beginner'
    },
    {
      id: 5,
      name: 'Ignition Coil Circuit',
      category: 'ignition',
      description: 'Ignition coil, spark plug, and control module',
      difficulty: 'Advanced'
    },
    {
      id: 6,
      name: 'Crankshaft Position Sensor',
      category: 'sensors',
      description: 'CKP sensor wiring to ECU',
      difficulty: 'Intermediate'
    },
    {
      id: 7,
      name: 'Fuel Injector Circuit',
      category: 'actuators',
      description: 'ECU control to fuel injector',
      difficulty: 'Intermediate'
    },
    {
      id: 8,
      name: 'Cooling Fan Circuit',
      category: 'actuators',
      description: 'Temperature sensor, relay, and cooling fan',
      difficulty: 'Beginner'
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDiagrams = diagrams.filter(diagram => {
    const matchesCategory = selectedCategory === 'all' || diagram.category === selectedCategory
    const matchesSearch = diagram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diagram.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDiagramUrl = (diagramId, url) => {
    if (url) {
      setUploadedDiagrams(prev => ({
        ...prev,
        [diagramId]: url
      }))
    }
  }

  const handleDiagramUpload = (event, diagramId) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedDiagrams(prev => ({
          ...prev,
          [diagramId]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Wiring Diagrams</h1>
        <p className="text-gray-600">Browse simplified educational wiring diagrams</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search diagrams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiagrams.map((diagram) => (
          <div key={diagram.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-navy-900">{diagram.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(diagram.difficulty)}`}>
                {diagram.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{diagram.description}</p>
            <button
              onClick={() => setSelectedDiagram(diagram)}
              className="w-full px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
            >
              Open Diagram
            </button>
          </div>
        ))}
      </div>

      {filteredDiagrams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No diagrams found matching your search.</p>
        </div>
      )}

      {/* Diagram Modal */}
      {selectedDiagram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-900">{selectedDiagram.name}</h2>
                <button
                  onClick={() => setSelectedDiagram(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedDiagram.description}</p>

              {/* Diagram Display Area */}
              <div className="bg-gray-100 rounded-lg p-8 mb-6 min-h-96 flex items-center justify-center relative">
                {uploadedDiagrams[selectedDiagram.id] ? (
                  <img
                    src={uploadedDiagrams[selectedDiagram.id]}
                    alt={selectedDiagram.name}
                    className="max-w-full max-h-96 object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mb-4">No diagram uploaded yet</p>
                    <p className="text-sm text-gray-400">Upload a diagram to view it here</p>
                  </div>
                )}
              </div>

              {/* Upload Options */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload from computer</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDiagramUpload(e, selectedDiagram.id)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or paste diagram URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/diagram.jpg"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleDiagramUrl(selectedDiagram.id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`diagram-url-${selectedDiagram.id}`)
                          if (input && input.value) {
                            handleDiagramUrl(selectedDiagram.id, input.value)
                            input.value = ''
                          }
                        }}
                        className="px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg"
                      >
                        Add URL
                      </button>
                    </div>
                    <input
                      type="text"
                      id={`diagram-url-${selectedDiagram.id}`}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> You can upload diagrams from cloud storage (Google Drive, Dropbox), image hosting sites (Imgur, Flickr), or any platform with public URLs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WiringDiagrams
