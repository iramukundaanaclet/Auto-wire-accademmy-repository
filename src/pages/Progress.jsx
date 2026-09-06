import { useState, useEffect } from 'react'
import { loadProgress, clearProgress as clearLocalStorageProgress } from '../utils/progress'

function Progress() {
  const [progressData, setProgressData] = useState({
    modules: {},
    quizzes: {},
    wiringExercises: 0,
    diagnosticsCompleted: 0
  })

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = loadProgress()
    setProgressData(savedProgress)
  }, [])

  const modules = [
    { id: 1, name: 'Basic Automotive Electricity' },
    { id: 2, name: 'Battery System' },
    { id: 3, name: 'Starting System' },
    { id: 4, name: 'Charging System' },
    { id: 5, name: 'Ignition System' },
    { id: 6, name: 'Lighting System' },
    { id: 7, name: 'Sensors' },
    { id: 8, name: 'Actuators' },
    { id: 9, name: 'ECU / PCM Basics' },
    { id: 10, name: 'Automotive Electrical Diagnosis' }
  ]

  const calculateOverallProgress = () => {
    const moduleProgress = Object.values(progressData.modules).reduce((sum, val) => sum + val, 0)
    const totalModules = modules.length
    return Math.round((moduleProgress / (totalModules * 100)) * 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleClearProgress = () => {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      clearLocalStorageProgress()
      setProgressData({
        modules: {},
        quizzes: {},
        wiringExercises: 0,
        diagnosticsCompleted: 0
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your learning journey</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-yellow-800 text-sm">
          <strong>Note:</strong> Progress is saved locally in your browser. Clearing your browser data will reset your progress.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-navy-900 mb-4">Overall Progress</h2>
        <div className="flex items-center mb-4">
          <div className="text-5xl font-bold text-electric-600 mr-4">
            {calculateOverallProgress()}%
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${getProgressColor(calculateOverallProgress())}`}
                style={{ width: `${calculateOverallProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-navy-900 mb-4">Module Progress</h2>
        <div className="space-y-4">
          {modules.map((module) => {
            const progress = progressData.modules[module.id] || 0
            return (
              <div key={module.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-navy-900">{module.name}</span>
                  <span className="text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-electric-600 mb-2">
            {Object.keys(progressData.quizzes).length}
          </div>
          <div className="text-gray-600">Quizzes Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-electric-600 mb-2">
            {progressData.wiringExercises}
          </div>
          <div className="text-gray-600">Wiring Exercises</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-electric-600 mb-2">
            {progressData.diagnosticsCompleted}
          </div>
          <div className="text-gray-600">Diagnostics Completed</div>
        </div>
      </div>

      {/* Quiz Scores */}
      {Object.keys(progressData.quizzes).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Recent Quiz Scores</h2>
          <div className="space-y-2">
            {Object.entries(progressData.quizzes).map(([category, score]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-navy-900 capitalize">{category}</span>
                <span className="text-electric-600 font-semibold">{score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Progress Button */}
      <div className="text-center">
        <button
          onClick={handleClearProgress}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Clear All Progress
        </button>
      </div>
    </div>
  )
}

export default Progress
