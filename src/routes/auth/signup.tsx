import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { signup, AuthError, MissingIdentityError } from '@netlify/identity'
import toast from 'react-hot-toast'
import { Loader2, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
  head: () => ({
    meta: [{ title: 'Create Account | A1 Property Management Solutions' }],
  }),
})

function SignupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const email = fd.get('email') as string
    const password = fd.get('password') as string
    const confirm = fd.get('confirmPassword') as string
    const name = fd.get('name') as string

    if (password !== confirm) {
      toast.error('Passwords do not match.')
      setLoading(false)
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    try {
      const user = await signup(email, password, { full_name: name })
      if (user.confirmedAt) {
        toast.success('Account created! You are now logged in.')
        navigate({ to: '/dashboard' })
      } else {
        setSuccess(true)
      }
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        toast.error('Auth service unavailable.')
      } else if (err instanceof AuthError) {
        toast.error(err.status === 403 ? 'Signups are currently disabled.' : err.message)
      } else {
        toast.error('Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Check Your Email</h1>
          <p className="text-gray-500 mb-6">
            We've sent a confirmation link to your email address. Click it to activate your account.
          </p>
          <Link to="/auth/login" className="btn-primary inline-flex no-underline">Back to Login</Link>
        </div>
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
          <h1 className="text-2xl font-black text-gray-900">Create an Account</h1>
          <p className="text-gray-500 text-sm mt-1">Track your quotes and bookings</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" required maxLength={100} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" name="password" required minLength={8} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" required minLength={8} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Re-enter password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-orange-500 font-semibold no-underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
