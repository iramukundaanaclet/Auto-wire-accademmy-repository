import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import VideoManagement from './pages/VideoManagement'
import CategoryManagement from './pages/CategoryManagement'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
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
            <Route path="/admin/videos" element={<VideoManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
