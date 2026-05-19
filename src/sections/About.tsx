import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    days: 'Days 1\u20133',
    city: 'Osaka',
    photos: ['/images/osaka-castle.jpg', '/images/osaka-skyline.jpg'],
  },
  {
    days: 'Days 4\u20136',
    city: 'Kyoto',
    photos: ['/images/kyoto-pagoda.jpg', '/images/kyoto-shrine.jpg'],
  },
  {
    days: 'Days 7\u201310',
    city: 'Tokyo',
    photos: ['/images/tokyo-shibuya.jpg', '/images/tokyo-street.jpg'],
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const clusterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    // Animate highlighted text phrases
    textRefs.current.forEach((el) => {
      if (!el) return;
      const anim = gsap.fromTo(
        el,
        { opacity: 0.3 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    // Animate timeline clusters — each triggered individually by its own viewport intersection
    // Staggered: Osaka 0ms, Kyoto 200ms, Tokyo 400ms
    clusterRefs.current.forEach((el, i) => {
      if (!el) return;
      const anim = gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          delay: i * 0.2,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',   // ~30% of element visible
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
      id="about"
      ref={sectionRef}
      className="relative bg-mist py-20 md:py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-[clamp(24px,5vw,80px)]">
        {/* Heading with hairline rules */}
        <div className="flex items-center justify-center mb-16 md:mb-24">
          <div className="flex-1 h-px bg-kimono/15" />
          <h2 className="text-section-heading text-kimono text-[clamp(40px,6vw,72px)] px-6 md:px-8 whitespace-nowrap">
            ABOUT THE TOUR
          </h2>
          <div className="flex-1 h-px bg-kimono/15" />
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24">
          {/* Left column - Text */}
          <div className="flex-1 max-w-xl">
            <p className="text-body-serif text-kimono text-lg md:text-xl mb-8">
              We&apos;ve planned a simple and convenient 10-day itinerary for your trip
              to Japan. You&apos;ll visit three cities:{" "}
              <span
                ref={(el) => { textRefs.current[0] = el; }}
                className="text-lime transition-opacity duration-600"
              >
                Osaka, Kyoto, and Tokyo
              </span>
              .
            </p>
            <p className="text-body-serif text-kimono text-lg md:text-xl">
              No need to worry about routes, schedules, or finding places —
              everything is already organized. We&apos;ll show you where to go, what to
              see, and where to eat, so you can simply{" "}
              <span
                ref={(el) => { textRefs.current[1] = el; }}
                className="text-lime transition-opacity duration-600"
              >
                enjoy the journey
              </span>
              .
            </p>
          </div>

          {/* Right column - Timeline */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="relative flex gap-6 md:gap-8">
              {/* Vertical hairline */}
              <div className="relative w-px bg-kimono/20 flex-shrink-0">
                {/* Nodes */}
                {timelineData.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-lime"
                    style={{ top: `${i * 33.33}%` }}
                  />
                ))}
              </div>

              {/* Timeline items — each cluster animates individually on viewport entry */}
              <div className="flex flex-col gap-10 md:gap-14 pb-4">
                {timelineData.map((item, i) => (
                  <div
                    key={item.city}
                    ref={(el) => { clusterRefs.current[i] = el; }}
                    className="relative"
                    style={{ opacity: 0 }}
                  >
                    <div className="mb-2">
                      <p className="text-small-caps text-kimono/60 mb-1">
                        {item.days}
                      </p>
                      <h3 className="text-small-caps text-kimono text-sm tracking-[0.08em]">
                        {item.city}
                      </h3>
                    </div>

                    {/* Photo cluster */}
                    <div className="flex gap-2 group">
                      {item.photos.map((photo, j) => (
                        <div
                          key={j}
                          className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] border-2 border-kimono rounded-sm shadow-lg overflow-hidden transition-transform duration-400"
                          style={{
                            transform: `rotate(${(j === 0 ? -1 : 1) * 3}deg)`,
                          }}
                        >
                          <div className="w-full h-full transition-transform duration-400 group-hover:scale-105">
                            <img
                              src={photo}
                              alt={`${item.city} photo ${j + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
