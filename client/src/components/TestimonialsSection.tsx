import { Card, CardContent } from '@/components/ui/card';
import { QuoteIcon, User } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    quote: "The view of Earth from the ISS was absolutely life-changing. Seeing our blue planet from orbit puts everything into perspective. The service was impeccable and the zero-G training made the experience seamless.",
    name: "Sarah L.",
    trip: "ISS Experience, May 2023",
    imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    type: "ISS" // ORBITAL
  },
  {
    quote: "Walking on the lunar surface and seeing Earth rise over the horizon was beyond words. The Tranquility Lunar Base exceeded all expectations with its comfort and views. Worth every penny and more.",
    name: "James T.",
    trip: "Lunar Expedition, March 2023",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "MOON" // LUNAR
  },
  {
    quote: "Being among the first to stay at the Mars colony was truly pioneering. The red landscapes are otherworldly and the science activities made me feel like I was contributing to humanity's future.",
    name: "Elena R.",
    trip: "Mars Colony Tour, January 2023",
    imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    type: "MARS" // PLANETARY
  }
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[#0A192F] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">VOYAGER EXPERIENCES</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Hear from our previous travelers who have journeyed to the final frontier.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            let iconBgColor;
            let quoteIconColor;
            
            if (testimonial.type === 'ISS') {
              iconBgColor = 'bg-[#00D1FF]';
              quoteIconColor = 'text-white';
            } else if (testimonial.type === 'MOON') {
              iconBgColor = 'bg-[#D0D0D0]';
              quoteIconColor = 'text-[#0A192F]';
            } else { // MARS
              iconBgColor = 'bg-[#E4572E]';
              quoteIconColor = 'text-white';
            }
            
            return (
              <Card key={index} className="bg-[#121212] rounded-xl p-6 shadow-lg relative border-0">
                <div className="absolute -top-5 left-6">
                  <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
                    <QuoteIcon className={`${quoteIconColor} h-4 w-4`} />
                  </div>
                </div>
                <CardContent className="pt-6 px-0">
                  <p className="text-gray-300 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-700">
                      <User className="w-full h-full p-2 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.trip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
