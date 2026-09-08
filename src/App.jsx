import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Learn from './pages/Learn'
import ModuleDetail from './pages/ModuleDetail'
import WiringLab from './pages/WiringLab'
import DiagnosticsLab from './pages/DiagnosticsLab'
import WiringDiagrams from './pages/WiringDiagrams'
import Quiz from './pages/Quiz'
import Progress from './pages/Progress'
import About from './pages/About'
import Vehicles from './pages/Vehicles'
import Videos from './pages/Videos'
import AdminVideoManager from './components/AdminVideoManager'
import NotFound from './pages/NotFound'

function App() {
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    // Simulate app initialization
    setAppLoaded(true)
  }, [])

  if (!appLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-electric-600 mb-4"></div>
          <p className="text-gray-600">Loading AutoWire Academy...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-electric-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:moduleId" element={<ModuleDetail />} />
              <Route path="/wiring-lab" element={<WiringLab />} />
              <Route path="/diagnostics" element={<DiagnosticsLab />} />
              <Route path="/diagrams" element={<WiringDiagrams />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/about" element={<About />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/admin/videos" element={<AdminVideoManager />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
