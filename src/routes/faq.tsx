import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/faq')({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: 'FAQ | A1 Property Management Solutions' },
      { name: 'description', content: 'Frequently asked questions about our property management and contractor services.' },
    ],
  }),
})

const faqs = [
  {
    q: 'What areas do you serve?',
    a: 'We primarily serve the greater Michigan area including Flint, Saginaw, Bay City, and surrounding communities. Contact us to confirm service in your area.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Fill out our online quote request form or call us at 1-810-618-5093. We\'ll review your project details and respond within 24 hours with a custom estimate.',
  },
  {
    q: 'Are you licensed and insured?',
    a: 'Yes. A1 Property Management Solutions is fully licensed and insured for all services we provide, including interior demolition, junk removal, and cleanup work.',
  },
  {
    q: 'How long does a typical job take?',
    a: 'It depends on the scope. A standard junk removal or yard cleanup can be completed in a few hours. Larger demolition or construction cleanup projects may take one to several days. We\'ll give you a timeline estimate with your quote.',
  },
  {
    q: 'Do you offer same-day or emergency services?',
    a: 'We offer same-day and next-day availability for many services, subject to crew availability. Call us at 1-810-618-5093 to check availability for urgent requests.',
  },
  {
    q: 'What happens to the junk or debris you remove?',
    a: 'We sort for recycling and donation where possible. Materials that can be recycled or reused are diverted from the landfill. Remaining waste is disposed of at licensed facilities.',
  },
  {
    q: 'Do I need to be on-site during the job?',
    a: 'For the initial walkthrough and final inspection, your presence is preferred. However, many jobs can be completed without you on-site once access is arranged. We\'ll coordinate the details with you.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash, check, and major credit/debit cards. Payment terms will be outlined in your service contract prior to the job start.',
  },
  {
    q: 'Can you handle both residential and commercial projects?',
    a: 'Absolutely. We work with homeowners, landlords, real estate investors, property managers, and general contractors on both residential and commercial properties.',
  },
  {
    q: 'Do you handle hazardous materials like asbestos or lead paint?',
    a: 'We do not handle hazardous materials removal (asbestos, lead paint, biohazards). These require specialized licensed contractors. We can help coordinate your project around those remediation steps.',
  },
  {
    q: 'How do I book a date after getting my quote?',
    a: 'Once your quote is approved, use our online booking calendar to select your preferred date. You\'ll receive a confirmation and contract by email.',
  },
  {
    q: 'What if I need to reschedule or cancel?',
    a: 'We ask for at least 48 hours notice for rescheduling or cancellations. Contact Michael Wilson directly or call 1-810-618-5093.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-orange-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

function FAQPage() {
  return (
    <div>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            Everything you need to know about our services, process, and policies.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still Have Questions?</h2>
          <p className="text-gray-500 text-sm mb-4">
            Our team is happy to help. Reach out and we'll get you sorted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-primary no-underline">Contact Us</Link>
            <a href="tel:18106185093" className="btn-secondary">1-810-618-5093</a>
          </div>
        </div>
      </section>
    </div>
  )
}
