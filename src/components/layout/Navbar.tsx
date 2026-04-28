import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Scissors, Menu, X, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'About Us', path: '/#about' },
    ...(user?.role === 'admin' && !isLoginPage ? [{ name: 'Admin Portal', path: '/admin', isSpecial: true }] : []),
    ...(user && user?.role !== 'admin' && !isLoginPage ? [{ name: 'My Bookings', path: '/dashboard', isSpecial: false }] : []),
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-blue-50 border-b border-gold-500/20 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="font-serif text-gold-500 text-3xl font-bold tracking-widest group-hover:opacity-80 transition-opacity">D | S</div>
              <span className="font-serif text-lg tracking-widest ml-4 border-l border-gold-500/20 pl-4 text-neutral-900 uppercase opacity-90">Davis<br/><span className="text-gold-500 text-sm">Unisex Salon</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8 items-center">
              {navLinks.map((link) => (
                link.isSpecial ? (
                  <Link key={link.name} to={link.path} className="flex items-center gap-1.5 text-[10px] font-bold text-gold-500 bg-gold-500/10 px-3 py-1.5 border border-gold-500/20 hover:bg-gold-500/20 transition-all uppercase tracking-[0.15em] rounded">
                    <Shield className="w-3 h-3" />
                    {link.name}
                  </Link>
                ) : link.path.startsWith('/#') ? (
                  <a key={link.name} href={link.path} className="text-[11px] font-medium text-neutral-900 opacity-70 hover:opacity-100 hover:text-gold-500 transition-colors uppercase tracking-[0.15em]">
                    {link.name}
                  </a>
                ) : (
                  <Link key={link.name} to={link.path} className="text-[11px] font-medium text-neutral-900 opacity-70 hover:opacity-100 hover:text-gold-500 transition-colors uppercase tracking-[0.15em]">
                    {link.name}
                  </Link>
                )
              ))}
            </div>
            
            <div className="flex items-center gap-6 border-l border-gold-500/20 pl-8">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] opacity-70 hover:opacity-100 hover:text-gold-500 transition-colors">
                    <User className="h-4 w-4" />
                    <span>{user.displayName || 'Login'}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-4 bg-blue-50 border border-gold-500/20 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {!(user.role === 'admin' && isLoginPage) && (
                      <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block px-6 py-2 text-[11px] text-neutral-900 opacity-70 hover:bg-blue-100 hover:opacity-100 hover:text-gold-500 uppercase tracking-[0.15em]">
                        {user.role === 'admin' ? 'Admin Portal' : 'My Bookings'}
                      </Link>
                    )}
                    <button onClick={logout} className="block w-full text-left px-6 py-2 text-[11px] text-neutral-900 opacity-70 hover:bg-blue-100 hover:opacity-100 hover:text-red-400 uppercase tracking-[0.15em] mt-2 border-t border-gold-500/10 pt-4">Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-[11px] font-medium text-neutral-900 opacity-70 hover:opacity-100 hover:text-gold-500 transition-colors uppercase tracking-[0.15em]">Sign In</Link>
              )}
              <Link to="/book" className="bg-gold-500 text-black px-8 py-3 text-[12px] font-bold hover:bg-gold-400 transition-colors uppercase tracking-[0.1em]">
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
             {!user && (
               <Link to="/book" className="bg-gold-500 text-neutral-900 px-4 py-2 rounded text-sm font-bold shadow hover:bg-gold-400 transition-colors uppercase tracking-wider">
                 Book
               </Link>
             )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-500 hover:text-neutral-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gold-500/20 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 bg-blue-50">
              {navLinks.map((link) => (
                link.isSpecial ? (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-base font-bold text-gold-500 uppercase tracking-widest"
                  >
                    <Shield className="w-4 h-4" />
                    {link.name}
                  </Link>
                ) : link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-medium text-neutral-700 hover:text-gold-500 uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-medium text-neutral-700 hover:text-gold-500 uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <hr className="border-gold-500/20" />
              {user ? (
                <>
                  {!(user.role === 'admin' && isLoginPage) && (
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsOpen(false)} className="block text-base font-medium text-gold-500 uppercase tracking-widest">
                      {user.role === 'admin' ? 'Admin Portal' : 'My Bookings'}
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left text-base font-medium text-red-400 uppercase tracking-widest">Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-base font-medium text-neutral-700 hover:text-gold-500 uppercase tracking-widest">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
