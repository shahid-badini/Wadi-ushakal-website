/**
 * Single source of truth for company information and page content.
 * Update contact details here and they propagate to every section.
 */

export const company = {
  name: 'Wadi Nushakal',
  industry: 'Transport & Logistics',
  country: 'United Arab Emirates',
  // Corrected to the company's real address (was a typo: innfo@….comm).
  email: 'info@wadinushakal.com',
  phoneDisplay: '+971 2 557 2890',
  phoneHref: 'tel:+97125572890',
  address: {
    full: 'Abu Dhabi, Al Dhafra, Beda Zayed Industrial Area, Near Big Mart, No. A11',
    mapsHref:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Beda Zayed Industrial Area, Al Dhafra, Abu Dhabi, UAE'),
  },
  brand: {
    main: 'Your Cargo, Our Commitment.',
    tagline: 'Transporting Trust Across Every Mile.',
    supporting: 'Safe hands for your load. Seamless logistics. Guaranteed.',
  },
};

// "/#section" = a section of the home page, "/contact" = the separate contact page
export const nav = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Fleet', href: '/#fleet' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Contact', href: '/contact' },
];

export const aboutFocus = [
  { label: 'Reliable transportation', icon: 'truck' },
  { label: 'Cargo safety', icon: 'shield' },
  { label: 'Professional service', icon: 'badge' },
  { label: 'Seamless logistics', icon: 'network' },
  { label: 'Customer trust', icon: 'handshake' },
  { label: 'Timely delivery', icon: 'clock' },
];

export const services = [
  {
    id: 'cargo',
    title: 'Cargo Transportation',
    text: 'Road transport for cargo of different types, planned around safe handling from pickup to drop-off.',
    image: 'service-cargo',
    alt: 'Cargo trucks on a desert highway under a hazy sky',
  },
  {
    id: 'heavy',
    title: 'Heavy Transport',
    text: 'Transport for larger and heavier loads, arranged with care for the vehicle, the cargo and the road.',
    image: 'service-heavy',
    alt: 'Heavy articulated dump truck working beneath a highway flyover',
  },
  {
    id: 'general',
    title: 'General Transportation',
    text: 'Everyday transportation needs handled with the same attention, consistency and professionalism.',
    image: 'service-general',
    alt: 'Red truck driving on a desert road through rocky mountains',
  },
  {
    id: 'commercial',
    title: 'Commercial Transportation',
    text: 'Dependable transport for businesses that need their goods moved on time and handled right.',
    image: 'service-commercial',
    alt: 'Red truck carrying a shipping container through a city street',
  },
  {
    id: 'local',
    title: 'Local UAE Transport',
    text: 'Road transport within the UAE, operated from our base in Al Dhafra, Abu Dhabi.',
    image: 'service-local',
    alt: 'Highway lined with UAE flags leading towards the mountains',
  },
  {
    id: 'logistics',
    title: 'Logistics Support',
    text: 'Coordination that keeps your shipment moving smoothly between each stage of its journey.',
    image: 'service-logistics',
    alt: 'Container truck being loaded at a port terminal at sunset',
  },
];

export const fleet = [
  {
    id: 'cargo-trucks',
    title: 'Cargo Trucks',
    text: 'Well-maintained trucks for moving cargo securely by road.',
    image: 'fleet-cargo',
    alt: 'Articulated truck and trailer on an open road at first light',
    focus: '58% 62%', // where the vehicle sits in the photo, so the narrow desktop cards keep it in view
  },
  {
    id: 'heavy-vehicles',
    title: 'Heavy Transport Vehicles',
    text: 'Heavy-duty vehicles suited to larger and more demanding loads.',
    image: 'fleet-heavy',
    alt: 'Heavy truck hauling two loaded trailers on a desert road',
    focus: '48% 52%',
  },
  {
    id: 'commercial-vehicles',
    title: 'Commercial Vehicles',
    text: 'Commercial vehicles ready for business transport requirements.',
    image: 'fleet-commercial',
    alt: 'Aerial view of a yard full of parked trucks and trailers',
    focus: '50% 50%',
  },
  {
    id: 'logistics-vehicles',
    title: 'Logistics Vehicles',
    text: 'Vehicles that keep containerised and palletised cargo moving.',
    image: 'fleet-logistics',
    alt: 'Truck parked beside stacked shipping containers at a port',
    focus: '30% 70%',
  },
];

export const whyUs = [
  { title: 'Reliable Transportation', text: 'Consistent, dependable service on every job.', icon: 'truck' },
  { title: 'Cargo Safety', text: 'Your load is secured and handled with care.', icon: 'shield' },
  { title: 'Professional Service', text: 'Clear communication from first call to delivery.', icon: 'badge' },
  { title: 'Seamless Logistics', text: 'Every stage coordinated so cargo keeps moving.', icon: 'network' },
  { title: 'UAE-Based Operations', text: 'Based in Al Dhafra, Abu Dhabi — local to the UAE.', icon: 'pin' },
  { title: 'Customer Commitment', text: 'Your cargo, our commitment — on every mile.', icon: 'handshake' },
];

export const journey = [
  { step: '01', title: 'Pickup', text: 'Cargo collected, checked and secured for the road.' },
  { step: '02', title: 'Transit', text: 'Moving safely and efficiently towards its destination.' },
  { step: '03', title: 'Destination', text: 'Delivered with care — commitment kept.' },
];
