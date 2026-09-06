import { Link } from 'react-router-dom'

function Learn() {
  const modules = [
    {
      id: 1,
      title: 'Basic Automotive Electricity',
      description: 'Learn the fundamentals of voltage, current, resistance, and electrical circuits.',
      difficulty: 'Beginner',
      time: '30 min',
      progress: 0
    },
    {
      id: 2,
      title: 'Battery System',
      description: 'Understand how automotive batteries work and their role in vehicle electrical systems.',
      difficulty: 'Beginner',
      time: '45 min',
      progress: 0
    },
    {
      id: 3,
      title: 'Starting System',
      description: 'Learn about starter motors, solenoids, and the starting circuit.',
      difficulty: 'Beginner',
      time: '60 min',
      progress: 0
    },
    {
      id: 4,
      title: 'Charging System',
      description: 'Explore alternators, voltage regulators, and battery charging.',
      difficulty: 'Intermediate',
      time: '60 min',
      progress: 0
    },
    {
      id: 5,
      title: 'Ignition System',
      description: 'Study ignition coils, spark plugs, and ignition timing.',
      difficulty: 'Intermediate',
      time: '45 min',
      progress: 0
    },
    {
      id: 6,
      title: 'Lighting System',
      description: 'Learn about headlights, taillights, and lighting circuits.',
      difficulty: 'Beginner',
      time: '30 min',
      progress: 0
    },
    {
      id: 7,
      title: 'Sensors',
      description: 'Understand various automotive sensors and their functions.',
      difficulty: 'Intermediate',
      time: '90 min',
      progress: 0
    },
    {
      id: 8,
      title: 'Actuators',
      description: 'Learn about fuel injectors, solenoids, and other actuators.',
      difficulty: 'Intermediate',
      time: '60 min',
      progress: 0
    },
    {
      id: 9,
      title: 'ECU / PCM Basics',
      description: 'Introduction to engine control units and powertrain control modules.',
      difficulty: 'Advanced',
      time: '90 min',
      progress: 0
    },
    {
      id: 10,
      title: 'Automotive Electrical Diagnosis',
      description: 'Learn systematic approaches to diagnosing electrical problems.',
      difficulty: 'Advanced',
      time: '120 min',
      progress: 0
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Learning Modules</h1>
        <p className="text-gray-600">Choose a module to start learning automotive electrical systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-navy-900">{module.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>⏱ {module.time}</span>
              <span>Progress: {module.progress}%</span>
            </div>
            <Link
              to={`/learn/${module.id}`}
              className="block w-full text-center px-4 py-2 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Learning
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Learn
