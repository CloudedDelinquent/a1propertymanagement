import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { services, getServiceById } from '@/data/services'

export const Route = createFileRoute('/services/$serviceId')({
  component: ServiceDetailPage,
  head: ({ params }) => {
    const service = getServiceById(params.serviceId)
    return {
      meta: [
        { title: service ? `${service.name} | A1 Property Management Solutions` : 'Service Not Found' },
        { name: 'description', content: service?.shortDescription ?? '' },
      ],
    }
  },
  loader: ({ params }) => {
    const service = getServiceById(params.serviceId)
    if (!service) throw notFound()
    return service
  },
})

function ServiceDetailPage() {
  const service = Route.useLoaderData()
  const otherServices = services.filter((s) => s.id !== service.id).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 no-underline"
          >
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <div className="text-5xl mb-4">{service.icon}</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{service.name}</h1>
          <p className="text-gray-300 text-xl max-w-2xl">{service.shortDescription}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-8">
              <img
                src={service.heroImage}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">About This Service</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">{service.fullDescription}</p>

            <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {service.bullets.map((bullet: string) => (
                <li key={bullet} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <CheckCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 text-white rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">Get a Free Quote</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Ready to get started? Request a free, no-obligation quote for your {service.name.toLowerCase()} project.
                </p>
                <Link
                  to="/quote"
                  className="btn-primary w-full justify-center no-underline block text-center"
                >
                  Request a Quote <ArrowRight size={16} />
                </Link>
              </div>

              <div className="border-2 border-gray-100 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Other Services</h3>
                <ul className="space-y-2">
                  {otherServices.map((s) => (
                    <li key={s.id}>
                      <Link
                        to="/services/$serviceId"
                        params={{ serviceId: s.id }}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 no-underline"
                      >
                        <span>{s.icon}</span>
                        <span>{s.name}</span>
                        <ArrowRight size={12} className="ml-auto" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
