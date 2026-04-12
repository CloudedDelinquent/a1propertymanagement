import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ArrowRight, Loader2, CalendarDays } from 'lucide-react'
import { services } from '@/data/services'

export const Route = createFileRoute('/booking')({
  component: BookingPage,
  head: () => ({
    meta: [
      { title: 'Book a Date | A1 Property Management Solutions' },
      { name: 'description', content: 'Schedule your service appointment with A1 Property Management Solutions.' },
    ],
  }),
})

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function BookingPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [checkingDates, setCheckingDates] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setCheckingDates(true)
    fetch(`/api/availability?year=${year}&month=${month + 1}`)
      .then((r) => r.json())
      .then((d) => {
        setBookedDates(d.bookedDates ?? [])
      })
      .catch(() => {})
      .finally(() => setCheckingDates(false))
  }, [year, month])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isPast = new Date(dateStr) < new Date(today.toDateString())
    if (isPast || bookedDates.includes(dateStr)) return
    setSelected(dateStr)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selected) { toast.error('Please select a date.'); return }
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      date: selected,
    }
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Booking failed')
      setSubmitted(true)
      toast.success('Booking confirmed! Check your email for details.')
    } catch (err: any) {
      toast.error(err.message ?? 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Your appointment on <strong>{selected}</strong> has been booked. You'll receive a confirmation email shortly.
          </p>
          <a href="/dashboard" className="btn-primary inline-flex">View My Bookings</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Book a Service Date</h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            Select an available date and complete your booking details below.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Calendar */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between bg-gray-900 text-white px-5 py-4">
                <button onClick={prevMonth} className="p-1 hover:text-orange-400 transition-colors">&larr;</button>
                <span className="font-bold">{MONTH_NAMES[month]} {year}</span>
                <button onClick={nextMonth} className="p-1 hover:text-orange-400 transition-colors">&rarr;</button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isPast = new Date(dateStr) < new Date(today.toDateString())
                    const isBooked = bookedDates.includes(dateStr)
                    const isSelected = selected === dateStr
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        disabled={isPast || isBooked || checkingDates}
                        className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : isBooked
                            ? 'bg-red-100 text-red-400 cursor-not-allowed line-through'
                            : 'hover:bg-orange-100 hover:text-orange-700 text-gray-800'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500 inline-block" /> Selected</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Unavailable</span>
              </div>
            </div>
            {selected && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
                <CalendarDays size={20} className="text-orange-500" />
                <div>
                  <div className="text-xs text-gray-500">Selected Date</div>
                  <div className="font-bold text-gray-900">{new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                <input type="tel" name="phone" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="(810) 555-0100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service *</label>
                <select name="service" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  <option value="">Select a service...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                {selected ? `📅 Booking for: ${selected}` : '👆 Please select a date on the calendar first.'}
              </div>
              <button
                type="submit"
                disabled={loading || !selected}
                className="btn-primary w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Confirming...</> : <>Confirm Booking <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
