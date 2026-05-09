import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
})

async function checkRateLimit(ip: string): Promise<boolean> {
  const store = getStore({ name: 'rate-limits', consistency: 'strong' })
  const key = `contact:${ip}`
  const existing = await store.get(key, { type: 'json' }) as { count: number; resetAt: number } | null
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  if (existing && now < existing.resetAt) {
    if (existing.count >= 10) return false
    await store.setJSON(key, { count: existing.count + 1, resetAt: existing.resetAt })
  } else {
    await store.setJSON(key, { count: 1, resetAt: now + windowMs })
  }
  return true
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const ip = context.ip ?? 'unknown'
  const allowed = await checkRateLimit(ip)
  if (!allowed) {
    return Response.json({ error: 'Too many requests. Please wait before trying again.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json({ error: `Validation error: ${msg}` }, { status: 422 })
  }

  const data = parsed.data

  // Store in Blobs
  const msgId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const store = getStore('contact-messages')
  await store.setJSON(`msg:${msgId}`, {
    id: msgId,
    ...data,
    createdAt: new Date().toISOString(),
  })

  // Send email via Resend
  const resendKey = Netlify.env.get('RESEND_API_KEY')
  const businessEmail = Netlify.env.get('CONTACT_EMAIL')
  if (resendKey && businessEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'A1 Property Management <onboarding@resend.dev>',
          to: [businessEmail],
          subject: `New Contact Message from ${data.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
              <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
              <tr><td><strong>Phone:</strong></td><td>${data.phone ?? 'Not provided'}</td></tr>
              <tr><td><strong>Message:</strong></td><td style="white-space:pre-wrap">${data.message}</td></tr>
            </table>
          `,
        }),
      })
    } catch {
      // Email failure is non-fatal
    }
  }

  return Response.json({ success: true }, { status: 201 })
}

export const config: Config = {
  path: '/api/contact',
}
