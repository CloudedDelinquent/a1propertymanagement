import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { services } from '@/data/services'

export const Route = createFileRoute('/services/')({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: 'Our Services | A1 Property Management Solutions' },
      {
        name: 'description',
        content:
          'Interior demolition, junk removal, construction cleanup, yard cleanup, and debris removal in Michigan.',
      },
    ],
  }),
})

function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Our Services</h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            A1 Property Management Solutions offers a full range of property services to keep your spaces clean, clear, and ready.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2">
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={service.heroImage}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">{service.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{service.fullDescription}</p>
                <ul className="space-y-2 mb-6">
                  {service.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services/$serviceId"
                  params={{ serviceId: service.id }}
                  className="btn-primary inline-flex items-center gap-2 no-underline"
                >
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to Get a Quote?</h2>
          <p className="text-orange-100 mb-6">Tell us about your project — we'll get back to you fast.</p>
          <Link
            to="/quote"
            className="bg-white text-orange-600 font-bold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-orange-50 transition-colors no-underline"
          >
            Request a Free Quote <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
