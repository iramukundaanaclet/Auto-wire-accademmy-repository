import { useState } from 'react'

function WiringDiagram({ circuit, onComponentClick, currentFlow = false }) {
  const [hoveredComponent, setHoveredComponent] = useState(null)
  const [animatingPath, setAnimatingPath] = useState(false)

  const handleComponentClick = (component) => {
    if (onComponentClick) {
      onComponentClick(component)
    }
  }

  const startCurrentFlow = () => {
    setAnimatingPath(true)
    setTimeout(() => setAnimatingPath(false), 3000)
  }

  // Simple SVG circuit renderer
  const renderCircuit = () => {
    const components = circuit.components || []
    const connections = circuit.connections || []

    return (
      <svg viewBox="0 0 800 400" className="w-full h-auto" role="img" aria-label={`Wiring diagram for ${circuit.name}`}>
        {/* Connections */}
        {connections.map((conn, index) => (
          <g key={index}>
            <line
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke={conn.type === 'power' ? '#ef4444' : conn.type === 'ground' ? '#22c55e' : '#3b82f6'}
              strokeWidth="3"
              className={`${animatingPath && conn.type === 'power' ? 'animate-pulse' : ''}`}
              aria-hidden="true"
            />
            {/* Current flow animation */}
            {currentFlow && animatingPath && conn.type === 'power' && (
              <circle r="4" fill="#fbbf24" aria-hidden="true">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M${conn.x1},${conn.y1} L${conn.x2},${conn.y2}`}
                />
              </circle>
            )}
          </g>
        ))}

        {/* Components */}
        {components.map((comp, index) => (
          <g
            key={index}
            onClick={() => handleComponentClick(comp)}
            onMouseEnter={() => setHoveredComponent(comp.id)}
            onMouseLeave={() => setHoveredComponent(null)}
            onFocus={() => setHoveredComponent(comp.id)}
            onBlur={() => setHoveredComponent(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleComponentClick(comp)
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${comp.name} - ${comp.function}`}
            style={{ cursor: 'pointer' }}
            transform={`translate(${comp.x}, ${comp.y})`}
          >
            {/* Component background */}
            <rect
              x="-40"
              y="-25"
              width="80"
              height="50"
              rx="8"
              fill={hoveredComponent === comp.id ? '#dbeafe' : '#f3f4f6'}
              stroke={hoveredComponent === comp.id ? '#3b82f6' : '#9ca3af'}
              strokeWidth="2"
            />
            {/* Component icon/text */}
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#1f2937"
              style={{ fontSize: '12px', fontWeight: '500' }}
            >
              {comp.name}
            </text>
          </g>
        ))}
      </svg>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-navy-900">{circuit.name}</h3>
        {currentFlow && (
          <button
            onClick={startCurrentFlow}
            className="px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Trace Current
          </button>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        {renderCircuit()}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span className="text-gray-600">Power</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span className="text-gray-600">Control</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500"></div>
          <span className="text-gray-600">Ground</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">Simplified educational circuit</p>
    </div>
  )
}

export default WiringDiagram
