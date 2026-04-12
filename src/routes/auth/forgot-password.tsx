import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { requestPasswordRecovery, AuthError } from '@netlify/identity'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [{ title: 'Reset Password | A1 Property Management Solutions' }],
  }),
})

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const email = (new FormData(e.currentTarget)).get('email') as string
    try {
      await requestPasswordRecovery(email)
      setSent(true)
    } catch (err) {
      if (err instanceof AuthError) toast.error(err.message)
      else toast.error('Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send a reset link</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-4">We sent a password reset link to your email.</p>
              <Link to="/auth/login" className="btn-primary inline-flex no-underline">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
              </button>
              <Link to="/auth/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 justify-center mt-2 no-underline">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
