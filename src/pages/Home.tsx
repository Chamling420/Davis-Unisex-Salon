import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scissors, Star, MapPin, Clock } from 'lucide-react';

const services = [
  { name: 'Classic Men\'s Haircut', desc: 'Precision cutting and styling tailored to you.' },
  { name: 'Beard Trim & Styling', desc: 'Sharp edges, full grooming, and beard oil.' },
  { name: 'Hair Wash & Treatment', desc: 'Deep conditioning, scalp massage, and styling.' },
  { name: 'Coloring & Gray Blending', desc: 'Subtle coloring and gray reduction.' },
  { name: 'Facial & Skin Care', desc: 'Refreshing facials with premium products.' },
  { name: 'Kids Haircut', desc: 'Gentle, fast, and stylish cuts for boys.' },
  { name: 'Hot Towel Shave', desc: 'Classic straight razor shave with hot towel.' }
];

const gallery = [
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80', // Face wash / skincare
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80', // Facial
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80', // Hair coloring
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80'
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-gold-500/20 bg-blue-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80" 
            alt="Barber Shop Interior" 
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-[90px] leading-[0.9] font-serif tracking-tight text-neutral-900 mb-6">
              Davis<br/><span className="text-gold-500">Unisex</span> Salon
            </h1>
            <p className="text-sm md:text-lg tracking-[0.3em] uppercase text-neutral-600 mb-12">
              Style. Confidence. Transformation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/book" 
                className="bg-gold-500 text-black px-10 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-gold-400 transition-colors w-full sm:w-auto text-center"
              >
                Book an Appointment
              </Link>
              <a 
                href="#services" 
                className="border border-gold-500/30 text-neutral-900 px-10 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-blue-100 transition-colors w-full sm:w-auto text-center"
              >
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-4 border-b border-gold-500/20 bg-blue-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">Our Services</h2>
              <div className="h-px w-20 bg-gold-500" />
            </div>
            <p className="mt-6 md:mt-0 text-neutral-500 max-w-md text-sm uppercase tracking-widest leading-loose">
              From fresh fades to perfect blowouts, our skilled stylists deliver top-tier grooming services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 border border-neutral-200 hover:border-gold-500/40 transition-colors group relative bg-blue-50"
              >
                <span className="text-[10px] text-gold-500 uppercase tracking-widest block mb-6">0{idx + 1}</span>
                <h3 className="font-serif text-xl text-neutral-900 mb-2 pr-4">{service.name}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                  {service.desc}
                </p>
                <Link to="/book" className="text-[10px] font-bold uppercase tracking-[0.1em] text-gold-500 flex items-center gap-2 group-hover:text-gold-400 transition-colors">
                  Book Now <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-4 border-b border-gold-500/20 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">Gallery</h2>
              <div className="h-px w-20 bg-gold-500" />
            </div>
            <p className="mt-6 md:mt-0 text-neutral-500 max-w-md text-sm uppercase tracking-widest leading-loose">
              A look inside our space and the work we do.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square overflow-hidden group mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              >
                <img 
                  src={img} 
                  alt="Gallery image" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="py-32 px-4 border-b border-gold-500/20 bg-blue-100">
        <div className="max-w-4xl mx-auto text-center border border-gold-500/20 bg-blue-50 p-12 lg:p-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 px-4">
            <Scissors className="w-8 h-8 text-gold-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-8">Ready for your transformation?</h2>
          <p className="text-sm uppercase tracking-widest text-neutral-500 mb-12 max-w-2xl mx-auto leading-loose">
            Book your appointment online and skip the wait. We accept walk-ins but prefer appointments to guarantee your spot.
          </p>
          <Link 
            to="/book" 
            className="inline-block bg-gold-500 text-black px-12 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-gold-400 transition-colors"
          >
            Schedule Your Visit
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 border-b border-gold-500/20 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80" 
                alt="About us" 
                className="w-full h-[600px] object-cover grayscale mix-blend-luminosity border border-gold-500/20 p-2"
              />
              <div className="absolute -bottom-8 -right-8 bg-blue-50 p-8 border border-gold-500/20 hidden md:block">
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />)}
                </div>
                <p className="text-neutral-900 text-[11px] uppercase tracking-[0.2em] mb-2 font-bold">Top Rated Salon</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Over 1000+ happy clients</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-8">The Davis Story</h2>
              <div className="h-px w-20 bg-gold-500 mb-12" />
              <div className="space-y-8 text-sm uppercase tracking-widest text-neutral-600 leading-loose">
                <p>
                  Established in 2026, Davis Unisex Salon was founded on a simple principle: every man deserves to look and feel his absolute best. 
                </p>
                <p>
                  We are more than just a barber shop. We are a sanctuary of style, where modern trends meet classic grooming techniques. Our team of master stylists and barbers are passionate about the details.
                </p>
                <p>
                  Professionalism, absolute hygiene, and unparalleled customer satisfaction are the cornerstones of our business. When you sit in our chair, you are the priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 border-b border-gold-500/20 bg-blue-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">Visit Us</h2>
              <div className="h-px w-20 bg-gold-500" />
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-blue-50 p-10 border border-gold-500/20 flex flex-col items-start gap-6">
                <MapPin className="w-6 h-6 text-gold-500" />
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-neutral-900 text-[11px] mb-4">Location</h3>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest leading-loose">Jhapa<br/>Khudunabari Bazar</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-10 border border-gold-500/20 flex flex-col items-start gap-6">
                <Clock className="w-6 h-6 text-gold-500" />
                <div className="w-full">
                  <h3 className="font-bold uppercase tracking-widest text-neutral-900 text-[11px] mb-4">Working Hours</h3>
                  <ul className="text-neutral-500 text-[10px] uppercase tracking-widest space-y-4">
                    <li className="flex justify-between border-b border-neutral-100 pb-2"><span>Sunday - Saturday</span> <span className="text-gold-500">9:00 AM - 6:00 PM</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 h-96 bg-blue-50 overflow-hidden relative border border-gold-500/20">
              <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gold-500/50 mx-auto mb-4" />
                  <p className="uppercase tracking-[0.2em] text-[10px] text-neutral-400">Google Maps Integration Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
