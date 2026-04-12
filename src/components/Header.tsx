import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/quote', label: 'Get a Quote' },
  { to: '/booking', label: 'Book Now' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const state = useRouterState()
  const pathname = state.location.pathname

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-orange-500 font-black text-xl tracking-tight">A1</span>
            <span className="font-bold text-sm leading-tight hidden sm:block">
              Property Management<br />Solutions
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors no-underline ${
                  pathname === link.to
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Phone */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:18106185093"
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              <Phone size={14} />
              1-810-618-5093
            </a>
            <Link
              to="/auth/login"
              className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded border border-gray-600 hover:border-gray-400 transition-colors no-underline"
            >
              Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium no-underline ${
                pathname === link.to
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:18106185093"
            className="flex items-center gap-1 px-3 py-2 text-orange-400 text-sm font-medium"
          >
            <Phone size={14} />
            1-810-618-5093
          </a>
          <Link
            to="/auth/login"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-gray-300 hover:text-white text-sm no-underline"
          >
            Login / Sign Up
          </Link>
        </div>
      )}
    </header>
  )
}
