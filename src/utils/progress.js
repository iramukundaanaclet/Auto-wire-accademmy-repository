// Progress management utilities using localStorage

const PROGRESS_KEY = 'autowireProgress'

export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY)
    return saved ? JSON.parse(saved) : {
      modules: {},
      quizzes: {},
      wiringExercises: 0,
      diagnosticsCompleted: 0
    }
  } catch (error) {
    console.error('Error loading progress:', error)
    return {
      modules: {},
      quizzes: {},
      wiringExercises: 0,
      diagnosticsCompleted: 0
    }
  }
}

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving progress:', error)
  }
}

export const updateModuleProgress = (moduleId, percentage) => {
  const progress = loadProgress()
  progress.modules[moduleId] = percentage
  saveProgress(progress)
}

export const saveQuizScore = (category, score) => {
  const progress = loadProgress()
  progress.quizzes[category] = score
  saveProgress(progress)
}

export const incrementWiringExercises = () => {
  const progress = loadProgress()
  progress.wiringExercises = (progress.wiringExercises || 0) + 1
  saveProgress(progress)
}

export const incrementDiagnosticsCompleted = () => {
  const progress = loadProgress()
  progress.diagnosticsCompleted = (progress.diagnosticsCompleted || 0) + 1
  saveProgress(progress)
}

export const clearProgress = () => {
  try {
    localStorage.removeItem(PROGRESS_KEY)
  } catch (error) {
    console.error('Error clearing progress:', error)
  }
}
