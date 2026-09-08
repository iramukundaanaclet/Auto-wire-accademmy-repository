import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-4">AutoWire Academy</h1>
          <p className="text-gray-600">Website is loading...</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
