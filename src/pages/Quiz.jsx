import { useState } from 'react'
import { saveQuizScore } from '../utils/progress'

function Quiz() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'basic', name: 'Basic Electricity' },
    { id: 'battery', name: 'Battery' },
    { id: 'starting', name: 'Starting System' },
    { id: 'charging', name: 'Charging System' },
    { id: 'sensors', name: 'Sensors' },
    { id: 'diagnostics', name: 'Diagnostics' }
  ]

  const questions = [
    {
      id: 1,
      category: 'basic',
      question: 'What is the unit of measurement for electrical pressure?',
      options: ['Amperes', 'Volts', 'Ohms', 'Watts'],
      correct: 1,
      explanation: 'Voltage is measured in volts and represents electrical pressure or potential difference.'
    },
    {
      id: 2,
      category: 'basic',
      question: 'In a series circuit, what happens to the total resistance?',
      options: ['It decreases', 'It stays the same', 'It increases', 'It becomes zero'],
      correct: 2,
      explanation: 'In a series circuit, total resistance is the sum of all individual resistances, so it increases.'
    },
    {
      id: 3,
      category: 'battery',
      question: 'What is the typical voltage of a fully charged automotive battery?',
      options: ['10.5V', '12.6V', '14.4V', '18.0V'],
      correct: 1,
      explanation: 'A fully charged automotive battery typically reads about 12.6 volts when resting.'
    },
    {
      id: 4,
      category: 'starting',
      question: 'What component engages the starter motor with the flywheel?',
      options: ['Starter relay', 'Starter solenoid', 'Ignition switch', 'Battery'],
      correct: 1,
      explanation: 'The starter solenoid both connects the high current to the starter motor and mechanically engages the drive gear with the flywheel.'
    },
    {
      id: 5,
      category: 'charging',
      question: 'What component converts mechanical energy to electrical energy in the charging system?',
      options: ['Battery', 'Voltage regulator', 'Alternator', 'Starter motor'],
      correct: 2,
      explanation: 'The alternator converts mechanical energy from the engine into electrical energy to charge the battery and power the vehicle\'s electrical system.'
    },
    {
      id: 6,
      category: 'sensors',
      question: 'What does the crankshaft position sensor (CKP) measure?',
      options: ['Engine temperature', 'Crankshaft position and speed', 'Air flow', 'Fuel pressure'],
      correct: 1,
      explanation: 'The CKP sensor monitors the position and rotational speed of the crankshaft, which is essential for ignition timing and fuel injection.'
    },
    {
      id: 7,
      category: 'diagnostics',
      question: 'What does "OL" typically indicate on a multimeter?',
      options: ['Overload/Open Loop', 'Optimal Load', 'On Line', 'Ohms Low'],
      correct: 0,
      explanation: 'OL stands for Overload or Open Loop, indicating the resistance is too high to measure or there is an open circuit.'
    }
  ]

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory)

  const currentQuestionData = filteredQuestions[currentQuestion]

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    if (answerIndex === currentQuestionData.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
      // Save quiz score to progress
      const percentage = Math.round((score / filteredQuestions.length) * 100)
      if (selectedCategory !== 'all') {
        saveQuizScore(selectedCategory, percentage)
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizComplete(false)
    setScore(0)
  }

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent! You have a strong understanding of automotive electrical systems.'
    if (percentage >= 60) return 'Good job! Consider reviewing the modules where you missed questions.'
    return 'Keep learning! Review the relevant modules and try again.'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Quiz</h1>
        <p className="text-gray-600">Test your knowledge of automotive electrical systems</p>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Quiz Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            resetQuiz()
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {!quizComplete ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {filteredQuestions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-electric-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-semibold text-navy-900 mb-6">{currentQuestionData?.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestionData?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  showResult
                    ? index === currentQuestionData.correct
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === index && index !== currentQuestionData.correct
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                    : 'border-gray-200 hover:border-electric-500 hover:bg-electric-50'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              selectedAnswer === currentQuestionData.correct
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-semibold mb-2 ${
                selectedAnswer === currentQuestionData.correct ? 'text-green-800' : 'text-red-800'
              }`}>
                {selectedAnswer === currentQuestionData.correct ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-gray-700">{currentQuestionData.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
            >
              {currentQuestion < filteredQuestions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          )}
        </div>
      ) : (
        /* Results */
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Quiz Results</h2>

          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-electric-600 mb-2">
              {Math.round((score / filteredQuestions.length) * 100)}%
            </div>
            <p className="text-gray-600">
              You got {score} out of {filteredQuestions.length} questions correct
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700">{getScoreMessage(Math.round((score / filteredQuestions.length) * 100))}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-medium rounded-lg transition-colors"
            >
              All Questions
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz
