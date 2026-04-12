import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { login, getUser, handleAuthCallback, AuthError, MissingIdentityError } from '@netlify/identity'
import toast from 'react-hot-toast'
import { Link } from '@tanstack/react-router'
import { Loader2, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  head: () => ({
    meta: [{ title: 'Login | A1 Property Management Solutions' }],
  }),
})

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Handle auth callbacks (email confirmation, password recovery, etc.)
    handleAuthCallback()
      .then(async (result) => {
        if (result) {
          if (result.type === 'confirmation') {
            toast.success('Email confirmed! You are now logged in.')
            navigate({ to: '/dashboard' })
            return
          }
          if (result.type === 'recovery') {
            navigate({ to: '/auth/reset-password' })
            return
          }
        }
        const user = await getUser()
        if (user) navigate({ to: '/dashboard' })
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await login(fd.get('email') as string, fd.get('password') as string)
      toast.success('Welcome back!')
      navigate({ to: '/dashboard' })
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        toast.error('Auth service unavailable. Please try again later.')
      } else if (err instanceof AuthError) {
        toast.error(err.status === 401 ? 'Invalid email or password.' : err.message)
      } else {
        toast.error('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 no-underline">
            <span className="text-orange-500 font-black text-2xl">A1</span>
            <span className="font-bold text-gray-700 text-sm leading-tight">Property Management<br />Solutions</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to view your quotes and bookings</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
              />
            </div>
            <div className="text-right">
              <Link to="/auth/forgot-password" className="text-sm text-orange-500 hover:underline no-underline hover:text-orange-600">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-orange-500 font-semibold hover:underline no-underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
