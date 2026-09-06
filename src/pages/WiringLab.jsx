import { useState } from 'react'
import { incrementWiringExercises } from '../utils/progress'

function WiringLab() {
  const [selectedComponents, setSelectedComponents] = useState([])
  const [exerciseStatus, setExerciseStatus] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)

  const availableComponents = [
    { id: 'battery', name: 'Battery', icon: '🔋' },
    { id: 'fuse', name: 'Fuse', icon: '🔌' },
    { id: 'switch', name: 'Switch', icon: '🔘' },
    { id: 'relay', name: 'Relay', icon: '🔀' },
    { id: 'lamp', name: 'Lamp', icon: '💡' },
    { id: 'motor', name: 'Motor', icon: '⚙️' },
    { id: 'ground', name: 'Ground', icon: '🌍' },
    { id: 'wire', name: 'Wire', icon: '〰️' }
  ]

  const exercises = [
    {
      title: 'Basic Lighting Circuit',
      description: 'Connect the circuit so that the lamp operates when the switch is closed.',
      hint: 'Connect Battery → Fuse → Switch → Lamp → Ground',
      requiredComponents: ['battery', 'fuse', 'switch', 'lamp', 'ground']
    },
    {
      title: 'Motor Control Circuit',
      description: 'Build a circuit that controls a motor with a relay.',
      hint: 'Connect Battery → Fuse → Switch → Relay → Motor → Ground',
      requiredComponents: ['battery', 'fuse', 'switch', 'relay', 'motor', 'ground']
    },
    {
      title: 'Simple Starting Circuit',
      description: 'Create a basic starting circuit with solenoid control.',
      hint: 'Connect Battery → Fuse → Ignition Switch → Relay → Solenoid → Ground',
      requiredComponents: ['battery', 'fuse', 'switch', 'relay', 'ground']
    }
  ]

  const currentExercise = exercises[currentExerciseIndex]

  const handleComponentClick = (componentId) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId))
    } else {
      setSelectedComponents([...selectedComponents, componentId])
    }
  }

  const checkCircuit = () => {
    const hasAllRequired = currentExercise.requiredComponents.every(comp =>
      selectedComponents.includes(comp)
    )

    if (hasAllRequired) {
      setExerciseStatus('success')
      incrementWiringExercises()
    } else {
      setExerciseStatus('incorrect')
    }
  }

  const resetCircuit = () => {
    setSelectedComponents([])
    setExerciseStatus(null)
    setShowHint(false)
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      resetCircuit()
    }
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      resetCircuit()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Wiring Lab</h1>
        <p className="text-gray-600">Practice building electrical circuits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercise Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">{currentExercise.title}</h2>
            <p className="text-gray-700 mb-4">{currentExercise.description}</p>

            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800"><strong>Hint:</strong> {currentExercise.hint}</p>
              </div>
            )}

            {exerciseStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">✓ Correct! You completed the circuit.</p>
              </div>
            )}

            {exerciseStatus === 'incorrect' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">Incorrect. Check your connections and try again.</p>
              </div>
            )}

            {/* Circuit Workspace */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-64">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Circuit Workspace</h3>
              <div className="grid grid-cols-4 gap-4">
                {selectedComponents.map((compId) => {
                  const comp = availableComponents.find(c => c.id === compId)
                  return (
                    <div
                      key={compId}
                      className="bg-white border-2 border-electric-500 rounded-lg p-4 text-center"
                    >
                      <div className="text-3xl mb-2">{comp.icon}</div>
                      <div className="text-sm font-medium">{comp.name}</div>
                    </div>
                  )
                })}
              </div>
              {selectedComponents.length === 0 && (
                <p className="text-gray-500 text-center py-8">Click components from the toolbox to add them to your circuit</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={checkCircuit}
                className="px-6 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
              >
                Check Circuit
              </button>
              <button
                onClick={resetCircuit}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Reset Circuit
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {currentExerciseIndex > 0 && (
                <button
                  onClick={previousExercise}
                  className="px-6 py-2 bg-navy-600 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors"
                >
                  Previous Exercise
                </button>
              )}
              {currentExerciseIndex < exercises.length - 1 && (
                <button
                  onClick={nextExercise}
                  className="px-6 py-2 bg-navy-600 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors"
                >
                  Next Exercise
                </button>
              )}
            </div>

            {/* Exercise indicator */}
            <div className="mt-4 text-sm text-gray-600">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </div>
          </div>
        </div>

        {/* Component Toolbox */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Component Toolbox</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableComponents.map((component) => (
                <button
                  key={component.id}
                  onClick={() => handleComponentClick(component.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedComponents.includes(component.id)
                      ? 'border-electric-500 bg-electric-50'
                      : 'border-gray-200 hover:border-electric-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{component.icon}</div>
                  <div className="text-sm font-medium">{component.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WiringLab
