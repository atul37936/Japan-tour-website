import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Send } from 'lucide-react';
import { getLenis } from '@/hooks/useLenis';
import HeroParticles from '@/components/HeroParticles';

gsap.registerPlugin(ScrollTrigger);

const polaroids = [
  { img: '/images/polaroid-1.jpg', caption: '3 cities in Japan', rotation: -2 },
  { img: '/images/polaroid-2.jpg', caption: '10 days', rotation: 2 },
  { img: '/images/polaroid-3.jpg', caption: 'gigabytes of photos', rotation: -1.5 },
  { img: '/images/polaroid-4.jpg', caption: 'eat ramen', rotation: 2.5 },
  { img: '/images/polaroid-5.jpg', caption: 'enjoy the vibe', rotation: -2 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mountainMaskRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const sky = skyRef.current;
    const text = textRef.current;
    const mountainMask = mountainMaskRef.current;
    const strip = stripRef.current;
    if (!section || !sky || !text || !mountainMask || !strip) return;

    // Sky background parallax — slowest layer (0.3x)
    gsap.to(sky, {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Mountain mask parallax — same speed as sky to stay aligned (0.3x)
    gsap.to(mountainMask, {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Typography parallax — mid-depth (0.5x, faster)
    gsap.to(text, {
      y: -250,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Polaroid strip drifts left at 0.4x
    gsap.to(strip, {
      x: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '80% top',
        scrub: true,
      },
    });

    // Entrance animations
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      sky,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
    );
    tl.fromTo(
      mountainMask,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
      '<'
    );
    tl.fromTo(
      text,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      '-=1'
    );
    tl.fromTo(
      strip.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
      '-=0.6'
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, []);

  const scrollTo = (id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -80, duration: 1.2 });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* ─── LAYER 0: Sky / Background Image (lowest z) ─── */}
      <div
        ref={skyRef}
        className="absolute inset-0 z-0"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/images/hero-mountains.jpg"
          alt="Misty Japanese mountains at dawn"
          className="w-full h-[120%] object-cover object-[center_40%]"
          style={{ position: 'absolute', top: '-10%' }}
        />
        <div className="absolute inset-0 bg-cream/[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-mist/60" />
      </div>

      {/* ─── LAYER 1: Three.js Particles ─── */}
      <HeroParticles />

      {/* ─── LAYER 2: "JAPAN" Typography — sandwiched between sky and mountain mask ─── */}
      <div
        ref={textRef}
        className="absolute z-[2] w-full text-center"
        style={{ top: '18%', willChange: 'transform' }}
      >
        <h1
          className="text-display text-[clamp(100px,18vw,280px)] select-none"
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          JAPAN
        </h1>
      </div>

      {/* ─── LAYER 3: Mountain Mask — same image, masked to show only the mountain terrain ─── 
           This sits ABOVE the JAPAN text, creating the "text behind mountains" illusion.
           A CSS mask-image gradient makes the sky portion transparent while the mountain
           silhouettes remain opaque, so the text peeks through above the mountain line. */}
      <div
        ref={mountainMaskRef}
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          willChange: 'transform',
          maskImage: 'linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.3) 35%, black 45%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.3) 35%, black 45%)',
        }}
      >
        <img
          src="/images/hero-mountains.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-[120%] object-cover object-[center_40%]"
          style={{ position: 'absolute', top: '-10%' }}
        />
        <div className="absolute inset-0 bg-cream/[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-mist/60" />
      </div>

      {/* ─── LAYER 4: Foreground Elements (highest z) ─── */}

      {/* Kimono Figure — fixed anchor, no parallax */}
      <div className="absolute z-[5] right-[4vw] md:right-[8vw] bottom-0 w-[35vw] md:w-[25vw] max-w-[400px] pointer-events-none">
        <img
          src="/images/hero-kimono.png"
          alt="Woman in floral kimono"
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </div>

      {/* Cherry Blossom Branches - right edge */}
      <div className="absolute z-[5] right-0 top-[10%] w-[20vw] max-w-[250px] pointer-events-none hidden md:block">
        <img
          src="/images/cherry-branches.png"
          alt="Cherry blossom branches"
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </div>

      {/* Social Icons - right edge vertical */}
      <div
        ref={socialsRef}
        className="absolute z-[5] right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4"
      >
        {[Instagram, Facebook, Send].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="text-kimono/30 hover:text-kimono transition-colors duration-300"
          >
            <Icon className="w-5 h-5" strokeWidth={1} />
          </a>
        ))}
      </div>

      {/* Polaroid Card Strip — with hover states */}
      <div
        ref={stripRef}
        className="absolute z-[5] left-[5vw] bottom-[8vh] flex gap-3 md:gap-4"
        style={{ willChange: 'transform' }}
      >
        {polaroids.map((card, i) => (
          <div
            key={i}
            data-cursor-expand
            className="group relative w-[90px] md:w-[120px] h-[110px] md:h-[150px] bg-kimono rounded-sm p-1.5 md:p-2 transition-all duration-400 cursor-pointer"
            style={{
              transform: `rotate(${card.rotation}deg)`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = `rotate(${card.rotation}deg) translateY(-8px) scale(1.02)`;
              el.style.boxShadow = '0 20px 40px rgba(255, 184, 197, 0.2)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = `rotate(${card.rotation}deg)`;
              el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            }}
          >
            <div className="w-full h-[75%] overflow-hidden rounded-sm">
              <img
                src={card.img}
                alt={card.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p className="absolute bottom-1.5 left-2 text-[9px] md:text-[10px] text-mouse font-sans">
              {card.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Book Button - hero position */}
      <button
        onClick={() => scrollTo('#contact')}
        className="absolute z-[5] right-[12vw] bottom-[15vh] hidden md:block px-10 py-4 rounded-full text-small-caps text-cream tracking-[0.12em] border border-cream/30 bg-cream/[0.15] backdrop-blur-xl hover:bg-gradient-to-t hover:from-lime hover:to-lime/20 hover:text-mist hover:border-lime/50 transition-all duration-400"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        Book
      </button>
    </section>
  );
}
