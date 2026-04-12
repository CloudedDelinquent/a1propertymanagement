import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle, Phone, Star, Users, Shield, Clock } from 'lucide-react'
import { services } from '@/data/services'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'A1 Property Management Solutions | Michigan Contractor' },
      {
        name: 'description',
        content:
          'Professional interior demolition, junk removal, construction cleanup, yard cleanup, and debris removal in Michigan. Get a free quote today.',
      },
    ],
  }),
})

const testimonials = [
  {
    name: 'Mike T.',
    location: 'Flint, MI',
    text: 'A1 cleared out a full basement and garage in one day. Professional crew, fair price, zero hassle. Will definitely call again.',
    rating: 5,
  },
  {
    name: 'Sandra K.',
    location: 'Saginaw, MI',
    text: 'They handled our post-renovation cleanup perfectly. The place was spotless. Shanda was great at scheduling everything around our contractor.',
    rating: 5,
  },
  {
    name: 'Dave R.',
    location: 'Bay City, MI',
    text: 'Fast, reliable, and they showed up on time. Jay and his team knocked out our interior demo in half the time I expected.',
    rating: 5,
  },
]

const highlights = [
  { icon: Shield, label: 'Licensed & Insured', desc: 'Full coverage for your peace of mind' },
  { icon: Clock, label: 'Fast Response', desc: 'Same-day and next-day availability' },
  { icon: Users, label: 'Expert Team', desc: 'Experienced field crews led by pros' },
  { icon: CheckCircle, label: 'Job Guaranteed', desc: "We're not done until you're satisfied" },
]

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              Michigan's Trusted Property Specialists
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Your Property,{' '}
              <span className="text-orange-500">Our Priority.</span>
              <br />Clean, Clear, Done Right.
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              From interior demolition to debris removal — A1 Property Management Solutions delivers fast,
              professional service for homeowners, contractors, and property managers across Michigan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/quote"
                className="btn-primary text-lg px-8 py-4 rounded-lg inline-flex items-center gap-2 justify-center"
              >
                Request a Free Quote <ArrowRight size={20} />
              </Link>
              <a
                href="tel:18106185093"
                className="btn-secondary text-lg px-8 py-4 rounded-lg inline-flex items-center gap-2 justify-center border-gray-500 text-white hover:bg-white hover:text-gray-900"
              >
                <Phone size={20} />
                1-810-618-5093
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights bar */}
      <section className="bg-orange-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={28} className="flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">{label}</div>
                  <div className="text-orange-100 text-xs">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Whether you're clearing out a property, cleaning up after construction, or dealing with debris — we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to="/services/$serviceId"
                params={{ serviceId: service.id }}
                className="group block border-2 border-gray-100 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all no-underline"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.shortDescription}</p>
                <span className="inline-flex items-center gap-1 text-orange-500 text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
            {/* CTA card */}
            <div className="bg-gray-900 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-white mb-2">Not Sure What You Need?</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Tell us about your project and we'll recommend the right service and give you a free estimate.
                </p>
              </div>
              <Link to="/quote" className="btn-primary justify-center text-sm py-3">
                Get a Free Quote <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Meet the Owners</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Family-owned and operated. We take pride in every job we complete.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: 'Jay Warner',
                role: 'Field Operations',
                bio: 'Jay leads our field crews with years of hands-on experience in demolition, debris removal, and property services. He ensures every job is executed safely and efficiently.',
                initial: 'J',
              },
              {
                name: 'Shanda Angle',
                role: 'Logistics & Scheduling',
                bio: 'Shanda manages all client coordination, scheduling, and logistics. Her attention to detail ensures every project runs on time and communication is seamless from start to finish.',
                initial: 'S',
              },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-orange-500 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-orange-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Get Started?</h2>
          <p className="text-orange-100 text-lg mb-8">
            Contact us today for a free quote. We respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-white text-orange-600 font-bold px-8 py-4 rounded-lg inline-flex items-center gap-2 justify-center hover:bg-orange-50 transition-colors no-underline text-lg"
            >
              Request a Free Quote <ArrowRight size={20} />
            </Link>
            <a
              href="tel:18106185093"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg inline-flex items-center gap-2 justify-center hover:bg-white/10 transition-colors text-lg"
            >
              <Phone size={20} />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
