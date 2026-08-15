import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Pizza } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Track Order', path: '/track' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#1a1714]/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pizza className="w-6 h-6 text-[#1a1714]" />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-bold text-amber-50">Crunchy Pizza</span>
              <span className="block text-[10px] text-amber-400 tracking-widest uppercase">Bhara Kahu</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative group ${
                  location.pathname === link.path ? 'text-amber-400' : 'text-amber-50/80 hover:text-amber-400'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-sm font-medium text-amber-50/50 hover:text-amber-400 transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#1a1714] px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105"
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <Link to="/cart" className="relative text-amber-50">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="text-amber-50">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-[fadeIn_0.2s_ease-in]">
            <div className="flex flex-col gap-1 bg-[#1a1714] rounded-2xl p-4 border border-amber-900/30">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-amber-50/80 hover:bg-amber-500/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                className="px-4 py-3 rounded-xl text-sm font-medium text-amber-50/50 hover:bg-amber-500/10 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
