import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  threshold?: number;
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    threshold = 0.2,
    y = 40,
    duration = 0.7,
    delay = 0,
    ease = 'cubic-bezier(0.16, 1, 0.3, 1)',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');
    const targets = children.length > 0 ? children : [el];

    gsap.set(targets, { opacity: 0, y });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: 'play none none none',
      },
    });

    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      stagger: options.stagger || 0,
    });

    return () => {
      tl.kill();
    };
  }, [threshold, y, duration, delay, ease, options.stagger]);

  return ref;
}
