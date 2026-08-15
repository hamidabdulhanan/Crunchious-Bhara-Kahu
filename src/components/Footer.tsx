import { Link } from 'react-router-dom';
import { Pizza, Phone, Clock, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1714] border-t border-amber-900/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Pizza className="w-6 h-6 text-[#1a1714]" />
              </div>
              <div>
                <span className="block text-lg font-bold text-amber-50">Crunchy Pizza</span>
                <span className="block text-[10px] text-amber-400 tracking-widest uppercase">Bhara Kahu</span>
              </div>
            </div>
            <p className="text-sm text-amber-50/60 leading-relaxed mb-4">
              Serving the best pizzas, crunchy chicken, and fast food in Bhara Kahu, Islamabad. Fresh ingredients, fast delivery, and unforgettable taste.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-[#1a1714] flex items-center justify-center transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-amber-50 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Full Menu', path: '/menu' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Track Order', path: '/track' },
                { label: 'Cart', path: '/cart' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-amber-50/60 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-amber-50 font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {['Classic Pizzas', 'Crown Crust', 'Crunchy Chicken', 'Burger Zone', 'Deal Station', 'Beverages'].map(cat => (
                <li key={cat}>
                  <Link to="/menu" className="text-sm text-amber-50/60 hover:text-amber-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-amber-50 font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-amber-50/60">Bhara Kahu, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400 shrink-0" />
                <a href="tel:03309999005" className="text-sm text-amber-50/60 hover:text-amber-400 transition-colors">
                  0330-9999005
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-amber-50/60">Daily 11:00 AM – 03:00 AM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-900/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-amber-50/40">
            © {new Date().getFullYear()} Crunchy Pizza Bhara Kahu. All rights reserved.
          </p>
          <p className="text-xs text-amber-50/40">Crafted with passion for great food.</p>
        </div>
      </div>
    </footer>
  );
}
