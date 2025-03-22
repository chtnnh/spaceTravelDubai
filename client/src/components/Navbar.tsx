import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Rocket } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0A192F] bg-opacity-90 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Rocket className="text-[#00D1FF] mr-2 h-5 w-5" />
              <span className="font-orbitron text-xl font-bold tracking-wider">
                CELESTIAL<span className="text-[#00D1FF]">VOYAGES</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#destinations" className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors">
              DESTINATIONS
            </Link>
            <Link href="/#experiences" className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors">
              EXPERIENCES
            </Link>
            <Link href="/#accommodations" className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors">
              ACCOMMODATIONS
            </Link>
            <Link href="/#pricing" className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors">
              PRICING
            </Link>
            <Link href="/booking" className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors">
              BOOKING
            </Link>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="outline" className="px-4 py-2 rounded-md font-orbitron text-sm font-medium border border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF] hover:text-white transition-colors">
                    PROFILE
                  </Button>
                </Link>
                <Button 
                  className="px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors"
                  onClick={logout}
                >
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="px-4 py-2 rounded-md font-orbitron text-sm font-medium border border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF] hover:text-white transition-colors">
                    LOGIN
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors">
                    SIGN UP
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="text-white hover:text-[#00D1FF]"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A192F] py-2 px-4">
          <div className="flex flex-col space-y-4 py-4">
            <Link 
              href="/#destinations"
              className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              DESTINATIONS
            </Link>
            <Link 
              href="/#experiences"
              className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              EXPERIENCES
            </Link>
            <Link 
              href="/#accommodations"
              className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ACCOMMODATIONS
            </Link>
            <Link 
              href="/#pricing"
              className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              PRICING
            </Link>
            <Link 
              href="/booking"
              className="font-orbitron text-sm font-medium hover:text-[#00D1FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              BOOKING
            </Link>

            <div className="pt-4 border-t border-gray-700 flex flex-col space-y-4">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium border border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF] hover:text-white transition-colors">
                      PROFILE
                    </Button>
                  </Link>
                  <Button 
                    className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    LOGOUT
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium border border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF] hover:text-white transition-colors">
                      LOGIN
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors">
                      SIGN UP
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
