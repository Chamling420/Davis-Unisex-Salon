import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  { category: 'Hair', items: [
    { name: 'Classic Men\'s Haircut', desc: 'Precision cutting and styling tailored to you.' },
    { name: 'Hair Wash & Treatment', desc: 'Deep conditioning, scalp massage, and styling.' },
    { name: 'Coloring & Gray Blending', desc: 'Subtle coloring and gray reduction.' },
    { name: 'Kids Haircut', desc: 'Gentle, fast, and stylish cuts for boys.' }
  ]},
  { category: 'Beard & Face', items: [
    { name: 'Beard Trim & Styling', desc: 'Sharp edges, full grooming, and beard oil.' },
    { name: 'Facial & Skin Care', desc: 'Refreshing facials with premium products.' },
    { name: 'Hot Towel Shave', desc: 'Classic straight razor shave with hot towel.' }
  ]}
];

export default function Services() {
  return (
    <div className="py-24 bg-slate-950 border-b border-blue-500/20 text-slate-100 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-slate-100">Our Services</h1>
          <div className="h-px w-20 bg-blue-500 mx-auto" />
          <p className="mt-8 text-slate-400 max-w-2xl mx-auto text-[11px] uppercase tracking-[0.2em] leading-loose">
            Experience premium grooming with our range of professional styling services.
          </p>
        </div>
        
        <div className="space-y-24">
          {services.map((section, sIdx) => (
            <motion.div 
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sIdx * 0.1 }}
            >
              <h2 className="text-xl md:text-2xl font-serif text-slate-100 border-b border-blue-500/20 pb-4 mb-10 w-fit pr-10">
                {section.category}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {section.items.map((service, idx) => (
                  <div key={idx} className="bg-slate-900 p-8 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-4">
                        <h3 className="text-lg font-serif text-slate-100 pr-4">{service.name}</h3>
                      </div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest leading-loose mb-8">{service.desc}</p>
                    </div>
                    <Link to="/book" className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-500 hover:text-blue-400 flex items-center gap-2 w-fit transition-colors">
                      Book Now <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-32 text-center bg-slate-950 p-16 border border-blue-500/20 text-slate-100 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-4">
            <Scissors className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-serif mb-6 text-slate-100">Ready to transform your look?</h2>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-10 max-w-lg mx-auto leading-loose">Walk-ins are welcome, but appointments are highly recommended to avoid wait times.</p>
          <Link to="/book" className="bg-blue-500 text-white px-10 py-4 font-bold uppercase tracking-[0.1em] text-[11px] transition-colors hover:bg-blue-700 inline-block">
            Schedule Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
