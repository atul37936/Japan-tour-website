import { useEffect, useRef } from 'react';
import { Globe, Instagram, Facebook, Send } from 'lucide-react';
import { getLenis } from '@/hooks/useLenis';

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const gridSize = isMobile ? 96 : 128;
    const dotBaseRadius = isMobile ? 2.5 : 3.5;
    const pointerSize = 12;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current.x = e.clientX - rect.left;
      targetMouseRef.current.y = e.clientY - rect.top;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', onMouseMove);
    }

    const draw = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Lerp mouse
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

      const cols = Math.ceil(w / gridSize);
      const rows = Math.ceil(h / gridSize);

      timeRef.current += 0.016;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * gridSize + gridSize / 2;
          const cy = row * gridSize + gridSize / 2;

          const dx = cx - mouseRef.current.x;
          const dy = cy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Ripple effect
          const rippleDist = dist / gridSize;
          const smoothD = Math.max(0, 1 - rippleDist / pointerSize);
          const rippleSize = 1 + (pointerSize * 0.25) * smoothD;
          const dotRadius = (dotBaseRadius / rippleSize);

          // Scale modulation
          const scale = 0.3 + smoothD * 0.7;

          // Neon color mixing
          const mixValue = ((-cx / w) + (cy / h) + 1) * 0.5;
          const r = Math.round(255 * (1 - mixValue) + 5 * mixValue);
          const g = Math.round(42 * (1 - mixValue) + 217 * mixValue);
          const b = Math.round(109 * (1 - mixValue) + 232 * mixValue);

          ctx.beginPath();
          ctx.arc(cx, cy, dotRadius * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${isMobile ? 0.08 : 0.2})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const scrollTo = (id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -80, duration: 1.2 });
    }
  };

  return (
    <footer className="relative bg-mist overflow-hidden">
      {/* Halftone canvas overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            mixBlendMode: 'screen',
            opacity: 0.35,
          }}
        />
      </div>

      {/* Hairline rule */}
      <div className="h-px bg-kimono/10" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[clamp(24px,5vw,80px)] py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Wordmark */}
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 text-small-caps text-mouse/80 tracking-[0.2em] hover:text-kimono transition-colors duration-300"
          >
            <Globe className="w-4 h-4" strokeWidth={1} />
            <span>JAPAN TOURS</span>
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {[
              { label: 'Home', target: '#hero' },
              { label: 'About', target: '#about' },
              { label: 'Included', target: '#included' },
              { label: 'Contacts', target: '#contact' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="text-small-caps text-mouse hover:text-kimono transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[Instagram, Facebook, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-mouse hover:text-kimono transition-colors duration-300"
              >
                <Icon className="w-5 h-5" strokeWidth={1} />
              </a>
            ))}
          </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-mouse/60 tracking-wider font-light">
          Created by Atul Mishra
        </div>
      </div>
    </footer>
  );
}
