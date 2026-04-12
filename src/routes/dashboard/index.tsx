import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getUser, logout } from '@netlify/identity'
import toast from 'react-hot-toast'
import { Loader2, LogOut, FileText, Calendar, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: 'My Dashboard | A1 Property Management Solutions' }],
  }),
})

interface QuoteRecord {
  id: string
  service: string
  description: string
  projectSize: string
  requestedDate: string
  status: string
  createdAt: string
}

interface BookingRecord {
  id: string
  date: string
  service: string
  status: string
  createdAt: string
}

function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [quotes, setQuotes] = useState<QuoteRecord[]>([])
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser().then((u) => {
      if (!u) {
        navigate({ to: '/auth/login' })
        return
      }
      setUser(u)
      // Fetch user data
      Promise.all([
        fetch(`/api/submit-quote?userId=${encodeURIComponent(u.id)}`).then(r => r.json()),
        fetch(`/api/availability?userId=${encodeURIComponent(u.id)}`).then(r => r.json()),
      ]).then(([qData, bData]) => {
        setQuotes(qData.quotes ?? [])
        setBookings(bData.bookings ?? [])
      }).catch(() => {}).finally(() => setLoading(false))
    })
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out.')
      navigate({ to: '/' })
    } catch {
      toast.error('Logout failed.')
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return `px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">My Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.user_metadata?.full_name ?? user?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link to="/quote" className="bg-orange-500 text-white rounded-xl p-5 flex items-center gap-4 hover:bg-orange-600 transition-colors no-underline">
            <FileText size={28} />
            <div>
              <div className="font-bold">Request a Quote</div>
              <div className="text-orange-100 text-sm">Get a free estimate for your project</div>
            </div>
            <ArrowRight size={18} className="ml-auto" />
          </Link>
          <Link to="/booking" className="bg-gray-900 text-white rounded-xl p-5 flex items-center gap-4 hover:bg-gray-800 transition-colors no-underline">
            <Calendar size={28} />
            <div>
              <div className="font-bold">Book a Date</div>
              <div className="text-gray-400 text-sm">Schedule your service appointment</div>
            </div>
            <ArrowRight size={18} className="ml-auto" />
          </Link>
        </div>

        {/* Quotes */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-orange-500" /> My Quote Requests
          </h2>
          {quotes.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
              <FileText size={32} className="mx-auto mb-3 opacity-40" />
              <p>No quote requests yet.</p>
              <Link to="/quote" className="text-orange-500 text-sm hover:underline mt-2 inline-block no-underline">Request your first quote →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Service</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Requested Date</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium capitalize">{q.service.replace(/-/g, ' ')}</td>
                      <td className="py-3 px-4 text-gray-500">{q.projectSize}</td>
                      <td className="py-3 px-4 text-gray-500">{q.requestedDate || '—'}</td>
                      <td className="py-3 px-4"><span className={statusBadge(q.status)}>{q.status}</span></td>
                      <td className="py-3 px-4 text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bookings */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-orange-500" /> My Bookings
          </h2>
          {bookings.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
              <Calendar size={32} className="mx-auto mb-3 opacity-40" />
              <p>No bookings yet.</p>
              <Link to="/booking" className="text-orange-500 text-sm hover:underline mt-2 inline-block no-underline">Book your first appointment →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Service</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="py-3 px-4 text-gray-500 capitalize">{b.service.replace(/-/g, ' ')}</td>
                      <td className="py-3 px-4"><span className={statusBadge(b.status)}>{b.status}</span></td>
                      <td className="py-3 px-4">
                        <a
                          href={`/api/contract?bookingId=${b.id}`}
                          className="text-orange-500 hover:underline text-xs font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Contract
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
