import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scissors, Star, MapPin, Clock, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState, ChangeEvent } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const services = [
  { name: 'Classic Men\'s Haircut', desc: 'Precision cutting and styling tailored to you.' },
  { name: 'Beard Trim & Styling', desc: 'Sharp edges, full grooming, and beard oil.' },
  { name: 'Hair Wash & Treatment', desc: 'Deep conditioning, scalp massage, and styling.' },
  { name: 'Coloring & Gray Blending', desc: 'Subtle coloring and gray reduction.' },
  { name: 'Facial & Skin Care', desc: 'Refreshing facials with premium products.' },
  { name: 'Kids Haircut', desc: 'Gentle, fast, and stylish cuts for boys.' },
  { name: 'Hot Towel Shave', desc: 'Classic straight razor shave with hot towel.' }
];

const defaultGallery = [
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80'
];

export default function Home() {
  const [gallery, setGallery] = useState<string[]>(defaultGallery);
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const dynamicGallery = snapshot.docs.map(doc => doc.data().url);
        setGallery(dynamicGallery);
      } else {
        setGallery(defaultGallery);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const storagePath = `gallery/${filename}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'gallery'), {
        url,
        storagePath,
        uploadedAt: Date.now()
      });
    } catch (error) {
      console.error(error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-blue-500/20 bg-slate-950">
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
            <h1 className="text-6xl md:text-[90px] leading-[0.9] font-serif tracking-tight text-slate-100 mb-6">
              Davis<br/><span className="text-blue-500">Unisex</span> Salon
            </h1>
            <p className="text-sm md:text-lg tracking-[0.3em] uppercase text-slate-400 mb-12">
              Style. Confidence. Transformation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/book" 
                className="bg-blue-500 text-white px-10 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
              >
                Book an Appointment
              </Link>
              <a 
                href="#services" 
                className="border border-blue-500/30 text-slate-100 px-10 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-slate-900 transition-colors w-full sm:w-auto text-center"
              >
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-4 border-b border-blue-500/20 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">Our Services</h2>
              <div className="h-px w-20 bg-blue-500" />
            </div>
            <p className="mt-6 md:mt-0 text-slate-400 max-w-md text-sm uppercase tracking-widest leading-loose">
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
                className="p-8 border border-slate-800 hover:border-blue-500/40 transition-colors group relative bg-slate-950"
              >
                <span className="text-[10px] text-blue-500 uppercase tracking-widest block mb-6">0{idx + 1}</span>
                <h3 className="font-serif text-xl text-slate-100 mb-2 pr-4">{service.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  {service.desc}
                </p>
                <Link to="/book" className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-500 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                  Book Now <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-4 border-b border-blue-500/20 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">Gallery</h2>
              <div className="h-px w-20 bg-blue-500" />
            </div>
            <p className="mt-6 md:mt-0 text-slate-400 max-w-md text-sm uppercase tracking-widest leading-loose">
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
            {user?.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: gallery.length * 0.1 }}
                className="relative aspect-square border border-blue-500/20 bg-slate-900 opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer group"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait z-10"
                  disabled={isUploading}
                  aria-label="Upload photo to gallery"
                />
                <div className="flex flex-col items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Plus className="w-10 h-10" />
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="py-32 px-4 border-b border-blue-500/20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center border border-blue-500/20 bg-slate-950 p-12 lg:p-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-4">
            <Scissors className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-100 mb-8">Ready for your transformation?</h2>
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-12 max-w-2xl mx-auto leading-loose">
            Book your appointment online and skip the wait. We accept walk-ins but prefer appointments to guarantee your spot.
          </p>
          <Link 
            to="/book" 
            className="inline-block bg-blue-500 text-white px-12 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-blue-700 transition-colors"
          >
            Schedule Your Visit
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 border-b border-blue-500/20 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80" 
                alt="About us" 
                className="w-full h-[600px] object-cover grayscale mix-blend-luminosity border border-blue-500/20 p-2"
              />
              <div className="absolute -bottom-8 -right-8 bg-slate-950 p-8 border border-blue-500/20 hidden md:block">
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />)}
                </div>
                <p className="text-slate-100 text-[11px] uppercase tracking-[0.2em] mb-2 font-bold">Top Rated Salon</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Over 1000+ happy clients</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-100 mb-8">The Davis Story</h2>
              <div className="h-px w-20 bg-blue-500 mb-12" />
              <div className="space-y-8 text-sm uppercase tracking-widest text-slate-400 leading-loose">
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
      <section id="contact" className="py-32 px-4 border-b border-blue-500/20 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">Visit Us</h2>
              <div className="h-px w-20 bg-blue-500" />
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-950 p-10 border border-blue-500/20 flex flex-col items-start gap-6">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-slate-100 text-[11px] mb-4">Location</h3>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest leading-loose">Jhapa<br/>Khudunabari Bazar</p>
                </div>
              </div>
              
              <div className="bg-slate-950 p-10 border border-blue-500/20 flex flex-col items-start gap-6">
                <Clock className="w-6 h-6 text-blue-500" />
                <div className="w-full">
                  <h3 className="font-bold uppercase tracking-widest text-slate-100 text-[11px] mb-4">Working Hours</h3>
                  <ul className="text-slate-400 text-[10px] uppercase tracking-widest space-y-4">
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>Sunday - Saturday</span> <span className="text-blue-500">9:00 AM - 6:00 PM</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 h-96 bg-slate-950 overflow-hidden relative border border-blue-500/20">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.8325214312904!2d87.96044787580142!3d26.72581914910499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e5b9f2554bb0ab%3A0x19e97d029329bb0e!2sDavis%20Unisex%20Salon!5e0!3m2!1sen!2snp!4v1777703030423!5m2!1sen!2snp" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
