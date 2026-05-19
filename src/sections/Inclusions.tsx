import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Plane, Car, Bed } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const inclusions = [
  {
    icon: Compass,
    title: 'GUIDES',
    body: '2 awesome guides who know everything about Japan!',
  },
  {
    icon: Plane,
    title: 'FLIGHTS',
    body: 'Routes: Moscow \u2014 Osaka, Tokyo \u2014 Moscow',
  },
  {
    icon: Car,
    title: 'TRANSFERS',
    body: 'From the airport to the hotels',
  },
  {
    icon: Bed,
    title: 'HOTELS',
    body: 'Comfortable accommodation, 2 people per room (breakfasts included)',
  },
];

export default function Inclusions() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      const anim = gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="included"
      ref={sectionRef}
      className="relative bg-mist py-20 md:py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-[clamp(24px,5vw,80px)]">
        {/* Heading */}
        <div className="flex items-center mb-12 md:mb-16">
          <h2 className="text-section-heading text-kimono text-[clamp(40px,6vw,72px)] mr-6 whitespace-nowrap">
            WHAT&apos;S INCLUDED
          </h2>
          <div className="flex-1 h-px bg-kimono/15" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inclusions.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative glass-panel rounded-2xl p-6 md:p-8 hover:-translate-y-1 hover:border-lime/30 hover:shadow-glass transition-all duration-300"
              >
                {/* Warm glow behind */}
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(212,248,122,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <Icon
                    className="w-6 h-6 text-lime mb-4 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-small-caps text-kimono text-[13px] tracking-[0.12em] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-mouse text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
