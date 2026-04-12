import { Link } from '@tanstack/react-router'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-500 font-black text-2xl">A1</span>
              <span className="font-bold text-white text-sm leading-tight">
                Property Management<br />Solutions
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your property, our priority. Professional demolition, junk removal,
              and cleanup services across Michigan.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Interior Demolition', '/services/interior-demolition'],
                ['Junk Removal', '/services/junk-removal'],
                ['Construction Cleanup', '/services/construction-cleanup'],
                ['Yard Cleanup', '/services/yard-cleanup'],
                ['Debris Removal', '/services/debris-removal'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href as any} className="hover:text-orange-400 transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Get a Free Quote', '/quote'],
                ['Book a Date', '/booking'],
                ['FAQ', '/faq'],
                ['Contact Us', '/contact'],
                ['My Account', '/dashboard'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href as any} className="hover:text-orange-400 transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:18106185093"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <Phone size={14} className="text-orange-500 flex-shrink-0" />
                  1-810-618-5093
                </a>
              </li>
              <li>
                <a
                  href="mailto:shanda4angle@gmail.com"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <Mail size={14} className="text-orange-500 flex-shrink-0" />
                  shanda4angle@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Michigan, USA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} A1 Property Management Solutions. All rights reserved.</p>
          <p>
            Owned by{' '}
            <span className="text-gray-400">Jay Warner</span> &amp;{' '}
            <span className="text-gray-400">Shanda Angle</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
