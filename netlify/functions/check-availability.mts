import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { z } from 'zod'

const BookingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  service: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export default async (req: Request, context: Context) => {
  const url = new URL(req.url)

  if (req.method === 'GET') {
    const userId = url.searchParams.get('userId')
    if (userId) {
      // Return user bookings
      const store = getStore('bookings')
      const { blobs } = await store.list({ prefix: `user:${userId}:` })
      const bookings = await Promise.all(
        blobs.map((b) => store.get(b.key, { type: 'json' }))
      )
      return Response.json({ bookings: bookings.filter(Boolean) })
    }

    // Return booked dates for a month
    const year = url.searchParams.get('year')
    const month = url.searchParams.get('month')
    if (!year || !month) {
      return Response.json({ bookedDates: [] })
    }
    const prefix = `date:${year}-${String(month).padStart(2, '0')}`
    const store = getStore('bookings')
    const { blobs } = await store.list({ prefix })
    const bookedDates = blobs.map((b) => {
      // key format: date:YYYY-MM-DD
      return b.key.replace('date:', '')
    })
    return Response.json({ bookedDates })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = BookingSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json({ error: `Validation error: ${msg}` }, { status: 422 })
  }

  const data = parsed.data
  const store = getStore({ name: 'bookings', consistency: 'strong' })

  // Check if date is already booked
  const dateKey = `date:${data.date}`
  const existing = await store.get(dateKey, { type: 'json' })
  if (existing) {
    return Response.json({ error: 'This date is no longer available. Please choose another date.' }, { status: 409 })
  }

  const bookingId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const booking = {
    id: bookingId,
    ...data,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  // Store booking under date key (for availability checks) and user key
  await store.setJSON(dateKey, booking)
  await store.setJSON(`booking:${bookingId}`, booking)

  // Send confirmation email
  const resendKey = Netlify.env.get('RESEND_API_KEY')
  const businessEmail = Netlify.env.get('CONTACT_EMAIL')
  if (resendKey && businessEmail) {
    try {
      // Email to business
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'A1 Property Management <onboarding@resend.dev>',
          to: [businessEmail],
          subject: `New Booking: ${data.service} on ${data.date} — ${data.name}`,
          html: `
            <h2>New Booking Confirmed</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td><strong>Booking ID:</strong></td><td>${bookingId}</td></tr>
              <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
              <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
              <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
              <tr><td><strong>Service:</strong></td><td>${data.service}</td></tr>
              <tr><td><strong>Date:</strong></td><td>${data.date}</td></tr>
            </table>
          `,
        }),
      })
      // Confirmation to customer
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'A1 Property Management <onboarding@resend.dev>',
          to: [data.email],
          subject: `Booking Confirmation — A1 Property Management Solutions`,
          html: `
            <h2>Your Booking is Confirmed!</h2>
            <p>Hi ${data.name}, thank you for booking with A1 Property Management Solutions.</p>
            <table style="border-collapse:collapse;width:100%">
              <tr><td><strong>Service:</strong></td><td>${data.service}</td></tr>
              <tr><td><strong>Date:</strong></td><td>${data.date}</td></tr>
              <tr><td><strong>Booking ID:</strong></td><td>${bookingId}</td></tr>
            </table>
            <p>If you need to reschedule or have questions, call 1-810-618-5093.</p>
            <p>— Jay & Michael, A1 Property Management Solutions</p>
          `,
        }),
      })
    } catch {
      // Email failure is non-fatal
    }
  }

  return Response.json({ success: true, bookingId }, { status: 201 })
}

export const config: Config = {
  path: '/api/availability',
}
