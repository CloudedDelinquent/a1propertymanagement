import type { Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default async (req: Request) => {
  const url = new URL(req.url)
  const bookingId = url.searchParams.get('bookingId')

  if (!bookingId) {
    return new Response('Missing bookingId parameter', { status: 400 })
  }

  const store = getStore('bookings')
  const booking = await store.get(`booking:${bookingId}`, { type: 'json' }) as {
    id: string
    name: string
    email: string
    phone: string
    service: string
    date: string
    status: string
    createdAt: string
  } | null

  if (!booking) {
    return new Response('Booking not found', { status: 404 })
  }

  // Generate PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // US Letter
  const { height } = page.getSize()

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const orange = rgb(0.976, 0.451, 0.086) // #f97316
  const dark = rgb(0.067, 0.094, 0.153)   // #111827
  const gray = rgb(0.42, 0.447, 0.502)    // #6b7280

  let y = height - 60

  // Header band
  page.drawRectangle({ x: 0, y: height - 80, width: 612, height: 80, color: dark })

  // Company name
  page.drawText('A1 Property Management Solutions', {
    x: 40,
    y: height - 40,
    size: 18,
    font: boldFont,
    color: rgb(1, 1, 1),
  })
  page.drawText('SERVICE CONTRACT', {
    x: 40,
    y: height - 62,
    size: 11,
    font: regularFont,
    color: orange,
  })

  y = height - 110

  // Contract ID
  page.drawText(`Contract #: ${booking.id}`, { x: 40, y, size: 9, font: regularFont, color: gray })
  page.drawText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
    x: 380,
    y,
    size: 9,
    font: regularFont,
    color: gray,
  })

  y -= 30

  // Section: Customer Info
  page.drawText('CUSTOMER INFORMATION', { x: 40, y, size: 10, font: boldFont, color: orange })
  y -= 4
  page.drawLine({ start: { x: 40, y }, end: { x: 572, y }, thickness: 1, color: orange, opacity: 0.4 })
  y -= 18

  const infoRows: [string, string][] = [
    ['Name:', booking.name],
    ['Email:', booking.email],
    ['Phone:', booking.phone],
  ]

  for (const [label, value] of infoRows) {
    page.drawText(label, { x: 40, y, size: 10, font: boldFont, color: dark })
    page.drawText(value, { x: 140, y, size: 10, font: regularFont, color: dark })
    y -= 20
  }

  y -= 15

  // Section: Service Details
  page.drawText('SERVICE DETAILS', { x: 40, y, size: 10, font: boldFont, color: orange })
  y -= 4
  page.drawLine({ start: { x: 40, y }, end: { x: 572, y }, thickness: 1, color: orange, opacity: 0.4 })
  y -= 18

  const serviceRows: [string, string][] = [
    ['Service:', booking.service.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())],
    ['Scheduled Date:', new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Status:', booking.status.toUpperCase()],
    ['Booking ID:', booking.id],
  ]

  for (const [label, value] of serviceRows) {
    page.drawText(label, { x: 40, y, size: 10, font: boldFont, color: dark })
    page.drawText(value, { x: 180, y, size: 10, font: regularFont, color: dark })
    y -= 20
  }

  y -= 20

  // Terms
  page.drawText('TERMS & CONDITIONS', { x: 40, y, size: 10, font: boldFont, color: orange })
  y -= 4
  page.drawLine({ start: { x: 40, y }, end: { x: 572, y }, thickness: 1, color: orange, opacity: 0.4 })
  y -= 18

  const terms = [
    '1. A1 Property Management Solutions will perform the agreed service on the scheduled date.',
    '2. Customer must provide safe access to the property on the scheduled date.',
    '3. Cancellations require a minimum of 48 hours notice. Late cancellations may incur a fee.',
    '4. Rescheduling is available subject to crew availability. Contact Shanda Angle to reschedule.',
    '5. Payment is due upon completion of services unless otherwise agreed in writing.',
    '6. A1 Property Management Solutions is not responsible for pre-existing property damage.',
    '7. All work is guaranteed. If you are not satisfied, contact us within 24 hours of completion.',
    '8. This contract is binding upon signature or written acceptance via email.',
  ]

  for (const term of terms) {
    page.drawText(term, { x: 40, y, size: 9, font: regularFont, color: dark, maxWidth: 530 })
    y -= 18
  }

  y -= 20

  // Signature lines
  page.drawLine({ start: { x: 40, y }, end: { x: 240, y }, thickness: 1, color: dark, opacity: 0.3 })
  page.drawLine({ start: { x: 330, y }, end: { x: 530, y }, thickness: 1, color: dark, opacity: 0.3 })
  y -= 15
  page.drawText('Customer Signature / Date', { x: 40, y, size: 8, font: regularFont, color: gray })
  page.drawText('A1 Property Management Solutions', { x: 330, y, size: 8, font: regularFont, color: gray })

  // Footer
  page.drawRectangle({ x: 0, y: 0, width: 612, height: 30, color: dark })
  page.drawText('A1 Property Management Solutions  |  shanda4angle@gmail.com  |  1-810-618-5093  |  Michigan, USA', {
    x: 40,
    y: 10,
    size: 7.5,
    font: regularFont,
    color: rgb(0.7, 0.7, 0.7),
  })

  const pdfBytes = await pdfDoc.save()

  // Store contract in Blobs
  const contractStore = getStore('contracts')
  await contractStore.set(`contract:${bookingId}`, pdfBytes)

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="A1-Contract-${bookingId}.pdf"`,
    },
  })
}

export const config: Config = {
  path: '/api/contract',
}
