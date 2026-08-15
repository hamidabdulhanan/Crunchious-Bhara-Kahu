import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <a
        href="https://wa.me/923309999005"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110 group"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} className="text-white" />
        <span className="absolute right-16 bg-[#1a1714] text-amber-50 text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us
        </span>
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-36 lg:bottom-6 left-4 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp size={22} className="text-[#1a1714]" />
        </button>
      )}
    </>
  );
}
