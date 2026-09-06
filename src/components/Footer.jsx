import { Link } from 'react-router-dom'

function Footer() {
  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Wiring Lab', path: '/wiring-lab' },
    { name: 'Diagnostics', path: '/diagnostics' },
    { name: 'Diagrams', path: '/diagrams' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Progress', path: '/progress' },
    { name: 'About', path: '/about' },
  ]

  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-electric-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">AutoWire Academy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Interactive learning for automotive electrical systems and vehicle wiring.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-electric-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:iramukundaanaclet@gmail.com" className="text-gray-400 hover:text-electric-400 transition-colors text-sm">
                  iramukundaanaclet@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                </svg>
                <a href="tel:+250789076826" className="text-gray-400 hover:text-electric-400 transition-colors text-sm">
                  +250 789 076 826
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.009-.173-.247-.014-.378.15-.544.16-.16.331-.36.36-.544.544-.181.152-.376.275-.595.275-.22 0-.446-.083-.672-.247-.297-.196-.586-.485-.636-.545-.05-.06-.014-.128.09-.248.28-.347.407-.82.964-.887 1.028-.067.064-.157.064-.25.04-.088-.028-.322-.068-.503-.086-.236-.023-.538.04-.596.077-.058.038-.237.178-.297.237-.06.06-.075.083-.044.154.03.07.108.227.236.227.127 0 .247-.062.274-.137.027-.075.006-.12-.045-.206-.05-.086-.127-.22-.255-.425-.127-.206-.285-.456-.336-.566-.05-.11-.058-.165-.022-.23.036-.066.132-.145.382-.294.504-.15.123-.227.185-.297.185-.07 0-.152-.047-.232-.142-.08-.095-.224-.312-.433-.627-.21-.315-.464-.657-.595-.84-.131-.183-.09-.266-.09-.39.013-.122.104-.203.294-.203.294 0 .053.028.155.083.308.055.153.116.308.18.462.063.153.12.236.18.338.06.101.108.203.108.338 0 .136-.048.296-.142.48-.094.185-.227.418-.396.684-.169.266-.298.503-.396.706-.098.203-.157.375-.157.543 0 .168.053.338.157.508.104.17.255.336.45.498.195.162.422.348.678.555.256.207.533.428.826.666.293.238.616.448.966.629.35.181.728.368 1.109.557.381.189.775.354 1.174.496.399.142.806.262 1.22.356.414.094.832.166 1.254.216.422.05.846.075 1.272.093.426.018.854.027 1.282.027.428 0 .856-.009 1.282-.027.426-.018.85-.043 1.272-.093.414-.094.822-.214 1.22-.356.399-.142.793-.314 1.174-.557.381-.243.714-.516.998-.829.284-.313.525-.657.722-1.027.197-.37.352-.747.463-1.127.111-.38.183-.758.237-1.157.18-.399-.057-.816-.166-1.25-.357-.434-.191-.86-.43-1.262-.711-.402-.281-.79-.588-1.162-.921-.372-.333-.688-.685-.948-1.054-.26-.369-.462-.753-.607-1.151-.145-.398-.19-.808-.13-1.237.06-.429.228-.844.583-1.243.355-.399.743-.753 1.167-1.063.424-.31.87-.565 1.329-.766.459-.201.924-.366 1.395-.496.471-.13.945-.24 1.422-.33.477-.09.957-.164 1.438-.217.481-.053.964-.082 1.448-.088.484-.006.969.035 1.448.088.48.053.964.127 1.438.217.474.09.947.196 1.422.33.475.134.95.299 1.395.496.445.197.87.428 1.29.766.42.338.817.715 1.162 1.127.345.412.645.862.9 1.347.255.485.452 1.017.59 1.582.138.565.185 1.17.14 1.819-.046.649-.185 1.27-.5 1.835-.315.565-.738 1.07-1.268 1.509-.53.439-1.121.807-1.764 1.103-.643.296-1.331.513-2.055.648-.724.135-1.47.197-2.233.185-.763-.012-1.519-.063-2.255-.152-.736-.089-1.454-.216-2.153-.38-.699-.164-1.379-.374-2.039-.629-.66-.255-1.304-.556-1.918-.903-.614-.347-1.194-.738-1.739-1.172-.545-.434-1.053-.912-1.523-1.433-.47-.521-.899-1.086-1.281-1.694-.382-.608-.723-1.261-1.022-1.965-.299-.704-.553-1.449-.762-2.233-.209-.784-.371-1.612-.486-2.485-.115-.873-.182-1.79-.201-2.735-.019-.945.034-1.919.159-2.915.469-.996.31-2.033.778-3.102 1.404-1.069.626-2.215 1.44-3.438 2.433-1.223.993-2.537 2.158-3.941 3.494-1.404 1.336-2.748 2.668-4.032 3.994-1.284 1.326-2.538 2.653-3.762 3.981-1.224 1.328-2.418 2.657-3.582 3.987-1.164 1.33-2.298 2.661-3.402 3.993-1.104 1.332-2.178 2.664-3.221 3.996-1.043 1.332-2.056 2.664-3.039 3.996-.983 1.332-1.936 2.664-2.859 3.996-.923 1.332-1.816 2.664-2.679 3.996-.863 1.332-1.696 2.664-2.499 3.996-.803 1.332-1.576 2.664-2.319 3.996-.743 1.332-1.456 2.664-2.139 3.996-.683 1.332-1.336 2.664-1.959 3.996-.623 1.332-1.216 2.664-1.779 3.996-.563 1.332-1.096 2.664-1.599 3.996-.503 1.332-.973 2.664-1.413 3.996-.44 1.332-.85 2.664-1.23 3.996-.38 1.332-.727 2.664-1.054 3.996-.327 1.332-.634 2.664-.921 3.996-.287 1.332-.554 2.664-.801 3.996-.247 1.332-.484 2.664-.701 3.996-.217 1.332-.424 2.664-.611 3.996-.187 1.332-.364 2.664-.521 3.996-.134 1.332-.251 2.664-.348 3.996-.097 1.332-.184 2.664-.251 3.996-.054 1.332-.101 2.664-.138 3.996z" />
                </svg>
                <a
                  href="YOUR_WHATSAPP_GROUP_INVITE_LINK_HERE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                >
                  Join WhatsApp Group
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Educational Disclaimer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AutoWire Academy provides simplified educational simulations. Always follow the vehicle manufacturer's service information and appropriate safety procedures when working on a real vehicle.
            </p>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AutoWire Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
