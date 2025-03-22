import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DestinationsSection from '@/components/DestinationsSection';
import TravelClassesSection from '@/components/TravelClassesSection';
import ExperiencesSection from '@/components/ExperiencesSection';
import AccommodationsSection from '@/components/AccommodationsSection';
import PricingSection from '@/components/PricingSection';
import BookingSection from '@/components/BookingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Home = () => {
  // Add smooth scrolling behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.href.includes(window.location.pathname)) {
        e.preventDefault();
        const targetId = anchor.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <TravelClassesSection />
      <ExperiencesSection />
      <AccommodationsSection />
      <PricingSection />
      <BookingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;
