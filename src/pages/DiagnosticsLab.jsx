import { useState } from 'react'
import { incrementDiagnosticsCompleted } from '../utils/progress'

function DiagnosticsLab() {
  const [selectedTestPoint, setSelectedTestPoint] = useState(null)
  const [multimeterMode, setMultimeterMode] = useState('voltage')
  const [multimeterReading, setMultimeterReading] = useState('')
  const [diagnosis, setDiagnosis] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [showVisualGuide, setShowVisualGuide] = useState(false)
  const [uploadedImages, setUploadedImages] = useState({})
  const [uploadedVideos, setUploadedVideos] = useState({})

  const scenarios = [
    {
      title: 'Starter Motor Does Not Operate',
      description: 'The vehicle will not crank when the key is turned to the start position. The battery appears to be charged.',
      fault: 'Blown fuse in the starter circuit',
      symptoms: ['No click when turning key', 'Battery voltage is normal', 'Lights work normally'],
      testPoints: [
        { id: 'battery', name: 'Battery Positive', location: 'Battery terminal' },
        { id: 'fuse', name: 'Starter Fuse', location: 'Fuse box' },
        { id: 'relay', name: 'Starter Relay', location: 'Relay box' },
        { id: 'solenoid', name: 'Starter Solenoid', location: 'Starter motor' },
        { id: 'ground', name: 'Ground Connection', location: 'Chassis ground' }
      ],
      faultLocation: 'fuse',
      images: [
        {
          title: 'Step 1: Check Battery Voltage',
          description: 'Use multimeter to test battery voltage at terminals',
          src: '/images/diagnostics/starter-step1-battery.jpg'
        },
        {
          title: 'Step 2: Locate Starter Fuse',
          description: 'Find the starter fuse in the fuse box under the hood',
          src: '/images/diagnostics/starter-step2-fuse-location.jpg'
        },
        {
          title: 'Step 3: Test Fuse Continuity',
          description: 'Use multimeter in continuity mode to test the fuse',
          src: '/images/diagnostics/starter-step3-fuse-test.jpg'
        },
        {
          title: 'Step 4: Identify Blown Fuse',
          description: 'A blown fuse will show OL (open circuit) on multimeter',
          src: '/images/diagnostics/starter-step4-blown-fuse.jpg'
        }
      ],
      video: {
        title: 'Complete Starter Motor Diagnosis Procedure',
        description: 'Watch the full diagnostic process for starter motor issues',
        src: '/videos/diagnostics/starter-diagnosis.mp4'
      }
    },
    {
      title: 'Headlights Not Working',
      description: 'The headlights do not turn on when the headlight switch is activated. Other lights work normally.',
      fault: 'Faulty headlight relay',
      symptoms: ['No headlights', 'Parking lights work', 'Fuse is good'],
      testPoints: [
        { id: 'battery', name: 'Battery Positive', location: 'Battery terminal' },
        { id: 'fuse', name: 'Headlight Fuse', location: 'Fuse box' },
        { id: 'switch', name: 'Headlight Switch', location: 'Dashboard' },
        { id: 'relay', name: 'Headlight Relay', location: 'Relay box' },
        { id: 'ground', name: 'Ground Connection', location: 'Chassis ground' }
      ],
      faultLocation: 'relay',
      images: [
        {
          title: 'Step 1: Check Headlight Fuse',
          description: 'Locate and inspect the headlight fuse in the fuse box',
          src: '/images/diagnostics/headlight-step1-fuse.jpg'
        },
        {
          title: 'Step 2: Test Fuse Continuity',
          description: 'Use multimeter to verify fuse is good',
          src: '/images/diagnostics/headlight-step2-fuse-test.jpg'
        },
        {
          title: 'Step 3: Locate Headlight Relay',
          description: 'Find the headlight relay in the relay box',
          src: '/images/diagnostics/headlight-step3-relay-location.jpg'
        },
        {
          title: 'Step 4: Test Relay Operation',
          description: 'Test relay with multimeter or swap with known good relay',
          src: '/images/diagnostics/headlight-step4-relay-test.jpg'
        }
      ],
      video: {
        title: 'Headlight System Diagnosis Guide',
        description: 'Complete procedure for diagnosing headlight problems',
        src: '/videos/diagnostics/headlight-diagnosis.mp4'
      }
    },
    {
      title: 'Battery Not Charging',
      description: 'The battery keeps dying even though the vehicle runs. The alternator appears to be spinning.',
      fault: 'Faulty voltage regulator',
      symptoms: ['Battery voltage drops while running', 'Alternator belt is OK', 'Battery is relatively new'],
      testPoints: [
        { id: 'battery', name: 'Battery Voltage', location: 'Battery terminals' },
        { id: 'alternator', name: 'Alternator Output', location: 'Alternator B+ terminal' },
        { id: 'regulator', name: 'Voltage Regulator', location: 'Alternator/ECM' },
        { id: 'ground', name: 'Chassis Ground', location: 'Engine block' }
      ],
      faultLocation: 'regulator',
      images: [
        {
          title: 'Step 1: Test Battery Voltage',
          description: 'Measure battery voltage with engine off and running',
          src: '/images/diagnostics/charging-step1-battery-test.jpg'
        },
        {
          title: 'Step 2: Check Alternator Belt',
          description: 'Inspect alternator belt for proper tension and condition',
          src: '/images/diagnostics/charging-step2-belt-check.jpg'
        },
        {
          title: 'Step 3: Test Alternator Output',
          description: 'Measure voltage at alternator B+ terminal',
          src: '/images/diagnostics/charging-step3-alternator-test.jpg'
        },
        {
          title: 'Step 4: Test Voltage Regulator',
          description: 'Check voltage regulator output and connections',
          src: '/images/diagnostics/charging-step4-regulator-test.jpg'
        }
      ],
      video: {
        title: 'Charging System Diagnosis Tutorial',
        description: 'Complete guide to diagnosing battery charging issues',
        src: '/videos/diagnostics/charging-diagnosis.mp4'
      }
    }
  ]

  const currentScenario = scenarios[currentScenarioIndex]

  const handleImageUpload = (event, imageSrc) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImages(prev => ({
          ...prev,
          [imageSrc]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImagePaste = (event, imageSrc) => {
    const items = event.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              setUploadedImages(prev => ({
                ...prev,
                [imageSrc]: reader.result
              }))
            }
            reader.readAsDataURL(file)
            event.preventDefault()
            break
          }
        }
      }
    }
  }

  const handleImageUrl = (imageUrl, imageSrc) => {
    if (imageUrl) {
      setUploadedImages(prev => ({
        ...prev,
        [imageSrc]: imageUrl
      }))
    }
  }

  const handleVideoUpload = (event, videoSrc) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedVideos(prev => ({
          ...prev,
          [videoSrc]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoPaste = (event, videoSrc) => {
    const items = event.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('video') !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              setUploadedVideos(prev => ({
                ...prev,
                [videoSrc]: reader.result
              }))
            }
            reader.readAsDataURL(file)
            event.preventDefault()
            break
          }
        }
      }
    }
  }

  const handleVideoUrl = (videoUrl, videoSrc) => {
    if (videoUrl) {
      setUploadedVideos(prev => ({
        ...prev,
        [videoSrc]: videoUrl
      }))
    }
  }

  const getSimulatedReading = (testPoint, mode) => {
    const faultLocation = currentScenario.faultLocation

    // Voltage readings
    if (mode === 'voltage') {
      if (testPoint === 'battery') return '12.6 V' // Battery always good
      if (testPoint === faultLocation) return '0.0 V' // Fault location has no voltage
      if (faultLocation === 'fuse' && (testPoint === 'relay' || testPoint === 'solenoid')) return '0.0 V' // Downstream of blown fuse
      if (faultLocation === 'relay' && testPoint === 'switch') return '12.6 V' // Voltage before relay
      return '12.3 V' // Normal voltage elsewhere
    }

    // Continuity readings
    if (mode === 'continuity') {
      if (testPoint === faultLocation) return 'OL' // Open circuit at fault
      if (testPoint === 'battery') return 'Beep' // Good continuity
      return 'Beep' // Good continuity elsewhere
    }

    // Resistance readings
    if (mode === 'resistance') {
      if (testPoint === faultLocation) return 'OL' // Open circuit
      if (testPoint === 'battery') return '0.2 Ω' // Low resistance
      return '0.5 Ω' // Normal resistance
    }

    return '---'
  }

  const handleTest = () => {
    if (selectedTestPoint) {
      const reading = getSimulatedReading(selectedTestPoint, multimeterMode)
      setMultimeterReading(reading)
    }
  }

  const submitDiagnosis = (fault) => {
    if (fault === currentScenario.fault) {
      setDiagnosis('correct')
      incrementDiagnosticsCompleted()
    } else {
      setDiagnosis('incorrect')
    }
  }

  const resetScenario = () => {
    setSelectedTestPoint(null)
    setMultimeterReading('')
    setDiagnosis(null)
    setShowHint(false)
  }

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1)
      resetScenario()
    }
  }

  const previousScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1)
      resetScenario()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Diagnostics Lab</h1>
        <p className="text-gray-600">Practice diagnosing electrical faults</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scenario Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">{currentScenario.title}</h2>
            <p className="text-gray-700 mb-4">{currentScenario.description}</p>

            <div className="mb-4">
              <h3 className="font-medium text-navy-900 mb-2">Symptoms:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {currentScenario.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800"><strong>Hint:</strong> Use the multimeter to test different points. Check for voltage and continuity to isolate the problem.</p>
              </div>
            )}

            {diagnosis === 'correct' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">✓ Correct! {currentScenario.fault}</p>
              </div>
            )}

            {diagnosis === 'incorrect' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">Incorrect. Try testing different points with the multimeter.</p>
              </div>
            )}

            {/* Simplified Circuit Diagram */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Simplified Circuit</h3>
              <div className="font-mono text-sm text-gray-600">
                Battery → Fuse → Switch/Control → Component(s) → Ground
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">Simplified educational circuit</p>
            </div>

            {/* Test Points */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-navy-900 mb-4">Test Points</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentScenario.testPoints.map((point) => (
                  <button
                    key={point.id}
                    onClick={() => setSelectedTestPoint(point.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      selectedTestPoint === point.id
                        ? 'border-electric-500 bg-electric-50'
                        : 'border-gray-200 hover:border-electric-300'
                    }`}
                  >
                    <div className="font-medium text-navy-900">{point.name}</div>
                    <div className="text-xs text-gray-500">{point.location}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnosis Options */}
            <div>
              <h3 className="text-lg font-medium text-navy-900 mb-4">What is the fault?</h3>
              <div className="space-y-2">
                {[
                  currentScenario.fault,
                  'Dead battery',
                  'Bad ground connection',
                  'Open circuit in wiring',
                  'Faulty component'
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => submitDiagnosis(option)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-electric-500 hover:bg-electric-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Guide Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowVisualGuide(!showVisualGuide)}
                className="w-full p-4 bg-electric-50 border-2 border-electric-200 rounded-lg hover:bg-electric-100 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-electric-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-electric-700">
                  {showVisualGuide ? 'Hide Visual Guide' : 'Show Visual Guide (Images & Video)'}
                </span>
              </button>
            </div>

            {/* Visual Guide Section */}
            {showVisualGuide && (
              <div className="mt-6 space-y-6">
                {/* Step-by-Step Images */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Step-by-Step Diagnostic Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentScenario.images?.map((image, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div
                          className="h-48 bg-gray-200 flex items-center justify-center relative cursor-pointer"
                          onClick={() => document.getElementById(`upload-${index}`).click()}
                          onPaste={(e) => handleImagePaste(e, image.src)}
                        >
                          {uploadedImages[image.src] ? (
                            <img
                              src={uploadedImages[image.src]}
                              alt={image.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-500">Click to upload or paste image</p>
                              <p className="text-xs text-gray-400">{image.title}</p>
                            </div>
                          )}
                          <input
                            type="file"
                            id={`upload-${index}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, image.src)}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-navy-900 mb-1">{image.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{image.description}</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Or paste image URL..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleImageUrl(e.target.value, image.src)
                                  e.target.value = ''
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`url-${index}`)
                                if (input.value) {
                                  handleImageUrl(input.value, image.src)
                                  input.value = ''
                                }
                              }}
                              className="px-3 py-2 bg-electric-600 hover:bg-electric-700 text-white text-sm rounded-lg"
                            >
                              Add URL
                            </button>
                          </div>
                          <input
                            type="text"
                            id={`url-${index}`}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Section */}
                {currentScenario.video && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">Video Tutorial</h3>
                    <div
                      className="bg-black rounded-lg aspect-video flex items-center justify-center relative cursor-pointer"
                      onClick={() => document.getElementById('video-upload').click()}
                      onPaste={(e) => handleVideoPaste(e, currentScenario.video.src)}
                    >
                      {uploadedVideos[currentScenario.video.src] ? (
                        <video
                          controls
                          className="w-full h-full rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <source src={uploadedVideos[currentScenario.video.src]} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="text-center text-white p-8">
                          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="text-xl font-semibold mb-2">Click to upload or paste video</h4>
                          <p className="text-gray-300 mb-4">{currentScenario.video.description}</p>
                          <p className="text-sm text-gray-400">{currentScenario.video.title}</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleVideoUpload(e, currentScenario.video.src)}
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-navy-900">{currentScenario.video.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{currentScenario.video.description}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Or paste video URL..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleVideoUrl(e.target.value, currentScenario.video.src)
                              e.target.value = ''
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('video-url-input')
                            if (input.value) {
                              handleVideoUrl(input.value, currentScenario.video.src)
                              input.value = ''
                            }
                          }}
                          className="px-3 py-2 bg-electric-600 hover:bg-electric-700 text-white text-sm rounded-lg"
                        >
                          Add URL
                        </button>
                      </div>
                      <input
                        type="text"
                        id="video-url-input"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={resetScenario}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Reset Scenario
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {currentScenarioIndex > 0 && (
                <button
                  onClick={previousScenario}
                  className="px-6 py-2 bg-navy-600 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors"
                >
                  Previous Scenario
                </button>
              )}
              {currentScenarioIndex < scenarios.length - 1 && (
                <button
                  onClick={nextScenario}
                  className="px-6 py-2 bg-navy-600 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors"
                >
                  Next Scenario
                </button>
              )}
            </div>

            {/* Scenario indicator */}
            <div className="mt-4 text-sm text-gray-600">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </div>
          </div>
        </div>

        {/* Virtual Multimeter */}
        <div>
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Virtual Multimeter</h2>
            <p className="text-gray-400 text-sm mb-4">Simulation</p>

            {/* Display */}
            <div className="bg-green-900 border-4 border-gray-700 rounded-lg p-4 mb-6">
              <div className="text-green-400 font-mono text-3xl text-center">
                {multimeterReading || '---'}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => { setMultimeterMode('voltage'); setMultimeterReading(''); }}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  multimeterMode === 'voltage'
                    ? 'bg-electric-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                DC Voltage (V)
              </button>
              <button
                onClick={() => { setMultimeterMode('resistance'); setMultimeterReading(''); }}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  multimeterMode === 'resistance'
                    ? 'bg-electric-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Resistance (Ω)
              </button>
              <button
                onClick={() => { setMultimeterMode('continuity'); setMultimeterReading(''); }}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  multimeterMode === 'continuity'
                    ? 'bg-electric-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Continuity
              </button>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTest}
              disabled={!selectedTestPoint}
              className="w-full p-3 bg-accent-600 hover:bg-accent-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Test Selected Point
            </button>

            {/* Selected Point Display */}
            {selectedTestPoint && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-gray-300 text-sm">
                  Testing: <span className="text-white font-medium">
                    {currentScenario.testPoints.find(p => p.id === selectedTestPoint)?.name}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagnosticsLab
