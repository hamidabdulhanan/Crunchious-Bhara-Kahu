import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, UtensilsCrossed, ClipboardList, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileOrderBar() {
  const { totalItems } = useCart();
  const location = useLocation();

  const items = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/menu' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: totalItems },
    { icon: ClipboardList, label: 'Track', path: '/track' },
    { icon: Phone, label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1714]/95 backdrop-blur-md border-t border-amber-900/30 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                active ? 'text-amber-400' : 'text-amber-50/50'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge ? (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
