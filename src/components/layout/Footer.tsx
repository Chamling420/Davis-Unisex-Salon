import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-50 border-t border-gold-500/20 text-neutral-500 py-16 text-[11px] uppercase tracking-[0.15em] leading-loose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 pr-8">
            <Link to="/" className="flex items-center group mb-8">
              <div className="font-serif text-gold-500 text-3xl font-bold tracking-widest group-hover:opacity-80 transition-opacity">D | S</div>
              <span className="font-serif text-lg tracking-widest ml-4 border-l border-gold-500/20 pl-4 text-neutral-900 uppercase opacity-90">Davis<br/><span className="text-gold-500 text-sm">Unisex Salon</span></span>
            </Link>
            <p className="mb-8 max-w-sm">
              Style. Confidence. Transformation. We provide premium grooming experiences for men.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-neutral-400 hover:text-gold-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-gold-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-gold-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-gold-500 transition-colors">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w0.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-neutral-900 font-bold tracking-widest mb-8 border-b border-neutral-200 pb-4 inline-block">Directory</h3>
            <ul className="space-y-4">
              <li><a href="/#services" className="hover:text-gold-500 transition-colors hover:pl-2 relative duration-300">Services</a></li>
              <li><a href="/#gallery" className="hover:text-gold-500 transition-colors hover:pl-2 relative duration-300">Gallery</a></li>
              <li><a href="/#about" className="hover:text-gold-500 transition-colors hover:pl-2 relative duration-300">About Us</a></li>
              <li><Link to="/book" className="hover:text-gold-500 transition-colors text-gold-500/80">Book Appointment</Link></li>
              <li><Link to="/login" className="hover:text-gold-500 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-neutral-900 font-bold tracking-widest mb-8 border-b border-neutral-200 pb-4 inline-block">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="h-4 w-4 text-gold-500 shrink-0 mt-1" />
                <span>Jhapa<br/>Khudunabari Bazar</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-4 w-4 text-gold-500 shrink-0" />
                <span>+9779822196987</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                <span>info@davissalon.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] text-neutral-400 tracking-[0.2em]">
          <div className="mt-4 md:mt-0 space-x-6">
            <a href="#" className="hover:text-neutral-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
