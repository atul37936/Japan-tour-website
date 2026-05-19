import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Inclusions from '@/sections/Inclusions';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

export default function Home() {
  useLenis();

  return (
    <>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Inclusions />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
