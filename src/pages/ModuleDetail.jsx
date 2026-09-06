import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import WiringDiagram from '../components/WiringDiagram'
import { circuits } from '../data/circuits'

function ModuleDetail() {
  const { moduleId } = useParams()
  const [selectedComponent, setSelectedComponent] = useState(null)

  // Map modules to circuits
  const moduleCircuitMap = {
    3: 'starting', // Starting System
    6: 'lighting', // Lighting System
    4: 'charging'  // Charging System
  }

  // Placeholder module data - in a real app this would come from a data file
  const moduleData = {
    1: {
      title: 'Basic Automotive Electricity',
      objectives: ['Understand voltage, current, and resistance', 'Learn Ohm\'s Law', 'Understand series and parallel circuits'],
      theory: 'Electricity is the flow of electrons. In automotive systems, we deal with DC (direct current) electricity. Voltage is the electrical pressure, current is the flow of electrons, and resistance opposes the flow.',
      components: [
        { name: 'Battery', function: 'Stores electrical energy and provides voltage', terminals: 'Positive (+) and Negative (-)' },
        { name: 'Wire', function: 'Conducts electricity between components', terminals: 'Two connection points' },
        { name: 'Switch', function: 'Controls the flow of electricity', terminals: 'Input and output' }
      ],
      diagram: 'Simple circuit with battery, switch, and load',
      faults: ['Open circuit', 'Short circuit', 'High resistance'],
      testing: 'Use a multimeter to measure voltage, resistance, and continuity'
    },
    2: {
      title: 'Battery System',
      objectives: ['Understand battery construction', 'Learn about battery capacity and ratings', 'Understand charging and discharging'],
      theory: 'Automotive batteries are lead-acid batteries that store chemical energy and convert it to electrical energy. They provide the power needed to start the engine and run electrical systems.',
      components: [
        { name: 'Battery', function: 'Stores and provides electrical energy', terminals: 'Positive (+) and Negative (-)' },
        { name: 'Battery Cables', function: 'Connect battery to vehicle electrical system', terminals: 'Heavy gauge cables' },
        { name: 'Battery Hold Down', function: 'Secures battery in place', terminals: 'Mechanical mounting' }
      ],
      diagram: 'Battery connected to starter and charging system',
      faults: ['Dead cell', 'Low charge', 'Corroded terminals', 'Internal short'],
      testing: 'Test voltage, load test, specific gravity test'
    },
    3: {
      title: 'Starting System',
      objectives: ['Understand starter motor operation', 'Learn about starter solenoid', 'Understand starting circuit'],
      theory: 'The starting system uses battery power to crank the engine. When you turn the key, current flows through the ignition switch to the starter relay, then to the starter solenoid, which engages the starter motor.',
      components: [
        { name: 'Battery', function: 'Provides electrical power', terminals: 'Positive (+) and Negative (-)' },
        { name: 'Ignition Switch', function: 'Controls starting circuit', terminals: 'Multiple terminals for different circuits' },
        { name: 'Starter Relay', function: 'Controls high current to starter', terminals: 'Control circuit and power circuit' },
        { name: 'Starter Solenoid', function: 'Engages starter motor', terminals: 'Control, battery, and motor terminals' },
        { name: 'Starter Motor', function: 'Crank the engine', terminals: 'Main power and ground' }
      ],
      diagram: 'Battery → Fuse → Ignition Switch → Relay → Solenoid → Starter Motor → Ground',
      faults: ['Dead battery', 'Faulty starter motor', 'Bad connection', 'Faulty relay'],
      testing: 'Voltage drop test, current draw test, visual inspection'
    }
  }

  const currentModule = moduleData[moduleId] || moduleData[1]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/learn" className="text-electric-600 hover:text-electric-700 font-medium mb-6 inline-block">
        ← Back to Modules
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">{currentModule.title}</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Learning Objectives</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {currentModule.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Theory</h2>
          <p className="text-gray-700 leading-relaxed">{currentModule.theory}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Key Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentModule.components.map((component, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-electric-500 hover:bg-electric-50 transition-colors"
                onClick={() => setSelectedComponent(component)}
              >
                <h3 className="font-semibold text-navy-900">{component.name}</h3>
                <p className="text-sm text-gray-600">{component.function}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedComponent && (
          <div className="mb-8 bg-electric-50 border border-electric-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">{selectedComponent.name}</h3>
            <p className="text-gray-700 mb-2"><strong>Function:</strong> {selectedComponent.function}</p>
            <p className="text-gray-700"><strong>Terminals:</strong> {selectedComponent.terminals}</p>
            <button
              onClick={() => setSelectedComponent(null)}
              className="mt-4 text-electric-600 hover:text-electric-700 font-medium"
            >
              Close
            </button>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Interactive Circuit Diagram</h2>
          {moduleCircuitMap[moduleId] ? (
            <WiringDiagram
              circuit={circuits[moduleCircuitMap[moduleId]]}
              onComponentClick={(comp) => setSelectedComponent(comp)}
              currentFlow={true}
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 font-mono">{currentModule.diagram}</p>
              <p className="text-sm text-gray-500 mt-2 italic">Simplified educational circuit</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Common Faults</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {currentModule.faults.map((fault, index) => (
              <li key={index}>{fault}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Testing Procedure</h2>
          <p className="text-gray-700">{currentModule.testing}</p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/quiz"
            className="px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
          >
            Take Quiz
          </Link>
          <Link
            to="/wiring-lab"
            className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-medium rounded-lg transition-colors"
          >
            Practice in Wiring Lab
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ModuleDetail
