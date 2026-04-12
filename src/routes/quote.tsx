import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Upload, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { services } from '@/data/services'

export const Route = createFileRoute('/quote')({
  component: QuotePage,
  head: () => ({
    meta: [
      { title: 'Request a Free Quote | A1 Property Management Solutions' },
      { name: 'description', content: 'Get a free, no-obligation quote for your property project.' },
    ],
  }),
})

const projectSizes = [
  'Small (under 500 sq ft)',
  'Medium (500–1,500 sq ft)',
  'Large (1,500–5,000 sq ft)',
  'Extra Large (5,000+ sq ft)',
]

function QuotePage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      toast.error('Only image files (JPG, PNG, WEBP, GIF) are allowed.')
      e.target.value = ''
      setFileName('')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB.')
      e.target.value = ''
      setFileName('')
      return
    }
    setFileName(file.name)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/submit-quote', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setSubmitted(true)
      toast.success('Quote request submitted! We\'ll be in touch within 24 hours.')
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Quote Request Received!</h1>
          <p className="text-gray-500 mb-6">
            Thank you! Shanda or Jay will review your project and get back to you within 24 hours at the email or phone you provided.
          </p>
          <a href="/" className="btn-primary inline-flex">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Request a Free Quote</h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            Fill out the form below and we'll get back to you within 24 hours with a custom estimate.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="John Smith"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="(810) 555-0100"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Type *</label>
              <select
                name="service"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Project Size *</label>
            <select
              name="projectSize"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="">Select project size...</option>
              {projectSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Project Description *</label>
            <textarea
              name="description"
              required
              minLength={20}
              maxLength={2000}
              rows={5}
              placeholder="Describe your project in detail — location, what needs to be done, access instructions, etc."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Requested Date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="requestedDate"
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Photo (optional)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              {fileName ? (
                <p className="text-sm text-orange-600 font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">Click to upload a photo of your project</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP or GIF — max 5MB</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                name="photo"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Submitting...</>
            ) : (
              <>Submit Quote Request <ArrowRight size={20} /></>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By submitting this form, you agree to be contacted by A1 Property Management Solutions regarding your project.
          </p>
        </form>
      </section>
    </div>
  )
}
