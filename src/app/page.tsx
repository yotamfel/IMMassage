import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import Services from '@/components/sections/Services';
import About from '@/components/sections/About';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <About />
      <Services />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
      <WhatsAppFAB />
    </main>
  );
}
