import { Link } from 'wouter';
import { Rocket, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import StarBg from './ui/star-bg';

const Footer = () => {
  return (
    <StarBg className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-20">
          {/* Logo and Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6 cursor-pointer" onClick={() => window.location.href = '/'}>
              <Rocket className="text-[#00D1FF] mr-2 h-6 w-6" />
              <span className="font-orbitron text-2xl font-bold tracking-wider">
                CELESTIAL<span className="text-[#00D1FF]">VOYAGES</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Pioneering luxury space tourism from Dubai to the cosmos. Offering unprecedented journeys to the ISS, Moon, and Mars with unmatched service and safety.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-gray-400 hover:text-[#00D1FF] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-gray-400 hover:text-[#00D1FF] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-gray-400 hover:text-[#00D1FF] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-gray-400 hover:text-[#00D1FF] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Navigation Links - Destinations */}
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-6">DESTINATIONS</h3>
            <ul className="space-y-3">
              <li><button onClick={() => window.location.href = '/#destinations'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">International Space Station</button></li>
              <li><button onClick={() => window.location.href = '/#destinations'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Lunar Surface</button></li>
              <li><button onClick={() => window.location.href = '/#destinations'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Mars Colony</button></li>
              <li><button onClick={() => window.location.href = '/#destinations'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Orbital Tours</button></li>
              <li><button onClick={() => window.location.href = '/#destinations'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Future Destinations</button></li>
            </ul>
          </div>
          
          {/* Navigation Links - Information */}
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-6">INFORMATION</h3>
            <ul className="space-y-3">
              <li><button onClick={() => window.location.href = '/about'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">About Us</button></li>
              <li><button onClick={() => window.location.href = '/safety'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Safety Protocols</button></li>
              <li><button onClick={() => window.location.href = '/training'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Training Requirements</button></li>
              <li><button onClick={() => window.location.href = '/faq'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">FAQ</button></li>
              <li><button onClick={() => window.location.href = '/careers'} className="text-gray-400 hover:text-[#00D1FF] transition-colors">Careers</button></li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-6">CONTACT</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-[#00D1FF] mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-400">Dubai Spaceport, Sheikh Zayed Road, Dubai, UAE</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-[#00D1FF] mr-3 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-400">+971 4 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-[#00D1FF] mr-3 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-400">info@celestialvoyages.ae</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Celestial Voyages. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button onClick={() => window.location.href = '/terms'} className="text-gray-500 hover:text-[#00D1FF] text-sm transition-colors">Terms of Service</button>
            <button onClick={() => window.location.href = '/privacy'} className="text-gray-500 hover:text-[#00D1FF] text-sm transition-colors">Privacy Policy</button>
            <button onClick={() => window.location.href = '/cookies'} className="text-gray-500 hover:text-[#00D1FF] text-sm transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </StarBg>
  );
};

export default Footer;
