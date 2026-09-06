function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">About AutoWire Academy</h1>
        <p className="text-gray-600">Interactive learning for automotive electrical systems</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-navy-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          AutoWire Academy is dedicated to making automotive electrical education accessible, interactive, and engaging. We believe that understanding vehicle electrical systems shouldn't require years of experience or complex technical manuals.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our platform uses visual learning, interactive simulations, and practical exercises to help students, beginner mechanics, and automotive technicians master the fundamentals of vehicle electrical systems and wiring diagnosis.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-navy-900 mb-4">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-navy-900 mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Visual lessons, clickable components, and animated current flow make complex concepts easy to understand.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-navy-900 mb-2">Practical Simulations</h3>
            <p className="text-gray-600">
              Practice building circuits and diagnosing faults in a safe, virtual environment before working on real vehicles.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-navy-900 mb-2">Comprehensive Content</h3>
            <p className="text-gray-600">
              From basic electricity to advanced diagnostics, our modules cover everything you need to know.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-navy-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Track your learning progress and identify areas where you need more practice.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-navy-900 mb-4">Who Can Benefit</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Automotive technology students</li>
          <li>Mechanical engineering students</li>
          <li>Automotive electrical students</li>
          <li>Beginner mechanics</li>
          <li>Automotive technicians</li>
          <li>Teachers and instructors</li>
          <li>DIY enthusiasts</li>
          <li>Anyone interested in learning vehicle electrical systems</li>
        </ul>
      </div>

      <div className="bg-navy-50 border border-navy-200 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-navy-900 mb-4">Educational Disclaimer</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          AutoWire Academy provides simplified educational simulations and general automotive electrical knowledge. The diagrams, values, and procedures presented are for educational purposes only and may not apply to all vehicles.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Always follow the vehicle manufacturer's service information, wiring diagrams, and appropriate safety procedures when working on a real vehicle. The creators of AutoWire Academy are not responsible for any damage or injury resulting from the application of information from this platform.
        </p>
      </div>
    </div>
  )
}

export default About
