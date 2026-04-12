export interface Service {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  bullets: string[]
  icon: string
  heroImage: string
}

export const services: Service[] = [
  {
    id: 'interior-demolition',
    name: 'Interior Demolition',
    shortDescription: 'Safe, efficient interior teardowns for residential and commercial properties.',
    fullDescription:
      'Our interior demolition service handles everything from single-room teardowns to full gut rehabs. We work carefully to protect structural elements while efficiently removing walls, flooring, ceilings, fixtures, and more. Our team follows all safety protocols and local regulations.',
    bullets: [
      'Wall and partition removal',
      'Flooring and subfloor teardown',
      'Ceiling demolition',
      'Fixture and cabinet removal',
      'Controlled demolition with structural protection',
      'Full debris hauling included',
    ],
    icon: '🔨',
    heroImage: '/placeholder.png',
  },
  {
    id: 'junk-removal',
    name: 'Junk Removal',
    shortDescription: 'Fast, eco-friendly junk removal for homes, offices, and job sites.',
    fullDescription:
      'Whether you\'re clearing out a cluttered garage, estate cleanout, or post-renovation debris, our junk removal team handles it all. We sort for recycling and donation where possible, keeping as much out of landfills as we can.',
    bullets: [
      'Furniture and appliance removal',
      'Estate and garage cleanouts',
      'Office and retail junk removal',
      'Eco-friendly sorting and recycling',
      'Same-day and next-day availability',
      'No job too big or too small',
    ],
    icon: '🚛',
    heroImage: '/placeholder.png',
  },
  {
    id: 'construction-cleanup',
    name: 'Construction Cleanup',
    shortDescription: 'Post-construction cleaning that gets your site job-ready or move-in ready.',
    fullDescription:
      'After the dust settles, A1 Property Management Solutions delivers thorough post-construction cleanup. From rough cleans during construction phases to final detail cleaning before handoff, we ensure your property is spotless and safe.',
    bullets: [
      'Rough clean during active construction',
      'Final clean before occupancy',
      'Window, glass, and surface cleaning',
      'Drywall dust and debris removal',
      'Floor sweep, scrub, and polish',
      'Trash and scrap material disposal',
    ],
    icon: '🏗️',
    heroImage: '/placeholder.png',
  },
  {
    id: 'yard-cleanup',
    name: 'Yard Cleanup',
    shortDescription: 'Complete yard and property cleanup for all seasons.',
    fullDescription:
      'From overgrown lots to seasonal cleanups, our yard cleanup crews restore outdoor spaces fast. We handle leaf removal, brush clearing, tree limb disposal, and general property maintenance to keep your exterior looking great.',
    bullets: [
      'Leaf and debris removal',
      'Brush and overgrowth clearing',
      'Tree limb and branch disposal',
      'Lot clearing and land prep',
      'Seasonal cleanup packages',
      'Mulch and waste hauling',
    ],
    icon: '🌿',
    heroImage: '/placeholder.png',
  },
  {
    id: 'debris-removal',
    name: 'Debris Removal',
    shortDescription: 'Rapid debris removal from storm damage, renovations, and more.',
    fullDescription:
      'When disaster strikes or a big project wraps up, fast debris removal is critical. A1 Property Management Solutions provides rapid-response debris hauling for storm damage, flood cleanup, renovation waste, and large-volume removal projects.',
    bullets: [
      'Storm and flood damage debris',
      'Renovation and remodel waste',
      'Concrete, drywall, and building materials',
      'Large-volume hauling capacity',
      'Emergency response availability',
      'Licensed and insured crews',
    ],
    icon: '♻️',
    heroImage: '/placeholder.png',
  },
]

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}
