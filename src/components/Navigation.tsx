import { useEffect, useRef, useState } from 'react';
import { getLenis } from '@/hooks/useLenis';
import { Globe, Instagram, Facebook, Send } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -80, duration: 1.2 });
    } else {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-mist/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        {/* Wordmark */}
        <button
          onClick={() => scrollTo('#hero')}
          className="flex items-center gap-2 text-small-caps text-kimono tracking-[0.2em]"
        >
          <Globe className="w-4 h-4" strokeWidth={1} />
          <span>JAPAN TOURS</span>
        </button>

        {/* Center nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'About', target: '#about' },
            { label: 'Included', target: '#included' },
            { label: 'Contacts', target: '#contact' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.target)}
              className="nav-link text-small-caps text-kimono/80 hover:text-kimono transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side: Book button + social icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo('#contact')}
            className="text-small-caps border border-kimono/40 rounded-full px-5 py-2 text-kimono/90 hover:border-lime hover:bg-gradient-to-t hover:from-lime hover:to-lime/20 hover:text-mist transition-all duration-400"
          >
            Book
          </button>
        </div>
      </div>
    </nav>
  );
}

export function SocialIcons({ vertical = false, className = '' }: { vertical?: boolean; className?: string }) {
  const icons = [
    { Icon: Instagram, label: 'Instagram' },
    { Icon: Facebook, label: 'Facebook' },
    { Icon: Send, label: 'Telegram' },
  ];

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} gap-4 ${className}`}>
      {icons.map(({ Icon, label }) => (
        <a
          key={label}
          href="#"
          aria-label={label}
          className="text-kimono/30 hover:text-kimono transition-colors duration-300"
        >
          <Icon className="w-5 h-5" strokeWidth={1} />
        </a>
      ))}
    </div>
  );
}
