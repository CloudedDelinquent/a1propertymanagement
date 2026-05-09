import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { z } from 'zod'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const QuoteSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  service: z.string().min(1),
  projectSize: z.string().min(1),
  description: z.string().min(20).max(2000),
  requestedDate: z.string().optional(),
})

async function checkRateLimit(ip: string): Promise<boolean> {
  const store = getStore({ name: 'rate-limits', consistency: 'strong' })
  const key = `quote:${ip}`
  const existing = await store.get(key, { type: 'json' }) as { count: number; resetAt: number } | null
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  if (existing && now < existing.resetAt) {
    if (existing.count >= 5) return false
    await store.setJSON(key, { count: existing.count + 1, resetAt: existing.resetAt })
  } else {
    await store.setJSON(key, { count: 1, resetAt: now + windowMs })
  }
  return true
}

export default async (req: Request, context: Context) => {
  // GET: fetch user quotes
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    if (!userId) return Response.json({ quotes: [] })
    const store = getStore('quotes')
    const { blobs } = await store.list({ prefix: `user:${userId}:` })
    const quotes = await Promise.all(
      blobs.map(async (blob) => {
        const data = await store.get(blob.key, { type: 'json' })
        return data
      })
    )
    return Response.json({ quotes: quotes.filter(Boolean) })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Rate limiting
  const ip = context.ip ?? 'unknown'
  const allowed = await checkRateLimit(ip)
  if (!allowed) {
    return Response.json({ error: 'Too many requests. Please wait before submitting again.' }, { status: 429 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return Response.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    service: formData.get('service') as string,
    projectSize: formData.get('projectSize') as string,
    description: formData.get('description') as string,
    requestedDate: (formData.get('requestedDate') as string) || undefined,
  }

  const parsed = QuoteSchema.safeParse(rawData)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json({ error: `Validation error: ${msg}` }, { status: 422 })
  }

  const data = parsed.data

  // Handle file upload
  let fileUrl: string | undefined
  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    if (!ALLOWED_MIME.includes(photo.type)) {
      return Response.json({ error: 'Only image files are allowed.' }, { status: 422 })
    }
    if (photo.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'File must be under 5MB.' }, { status: 422 })
    }
    const ext = photo.name.split('.').pop() ?? 'jpg'
    const fileKey = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const uploadStore = getStore('uploads')
    const arrayBuffer = await photo.arrayBuffer()
    await uploadStore.set(fileKey, arrayBuffer)
    fileUrl = fileKey
  }

  // Store quote
  const quoteId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const quote = {
    id: quoteId,
    ...data,
    fileUrl,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  const quotesStore = getStore('quotes')
  await quotesStore.setJSON(`quote:${quoteId}`, quote)

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
          subject: `New Quote Request: ${data.service} from ${data.name}`,
          html: `
            <h2>New Quote Request</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
              <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
              <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
              <tr><td><strong>Service:</strong></td><td>${data.service}</td></tr>
              <tr><td><strong>Project Size:</strong></td><td>${data.projectSize}</td></tr>
              <tr><td><strong>Requested Date:</strong></td><td>${data.requestedDate ?? 'Not specified'}</td></tr>
              <tr><td><strong>Description:</strong></td><td>${data.description}</td></tr>
              ${fileUrl ? `<tr><td><strong>Photo:</strong></td><td>File attached (key: ${fileUrl})</td></tr>` : ''}
            </table>
          `,
        }),
      })
    } catch {
      // Email failure is non-fatal
    }
  }

  return Response.json({ success: true, quoteId }, { status: 201 })
}

export const config: Config = {
  path: '/api/submit-quote',
}
