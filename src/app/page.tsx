import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import Services from '@/components/sections/Services';
import About from '@/components/sections/About';
import Articles from '@/components/sections/Articles';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import Booking from '@/components/sections/Booking';
import Contact from '@/components/sections/Contact';
import ReviewForm from '@/components/sections/ReviewForm';
import Footer from '@/components/sections/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <TrustBar />
      <Services />
      <Articles />
      <Testimonials />
      <Pricing />
      <Booking />
      <Contact />
      <ReviewForm />
      <Footer />
      <WhatsAppFAB />
    </main>
  );
}
