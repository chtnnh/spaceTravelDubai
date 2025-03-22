import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { Destination } from '@shared/schema';
import StarBg from './ui/star-bg';
import useAuth from '@/hooks/useAuth';

const BookingSection = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [travelers, setTravelers] = useState(1);
  
  // Fetch destinations
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  // Find the selected destination
  const selectedDestinationData = destinations?.find(d => d.id.toString() === selectedDestination);
  
  // Function to handle traveler count changes
  const handleTravelerChange = (type: 'increase' | 'decrease') => {
    if (type === 'decrease' && travelers > 1) {
      setTravelers(travelers - 1);
    } else if (type === 'increase' && travelers < 6) {
      setTravelers(travelers + 1);
    }
  };
  
  const handleContinue = () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login?redirect=/booking');
      return;
    }
    
    if (selectedDestination) {
      navigate(`/booking?destination=${selectedDestination}&travelers=${travelers}`);
    }
  };

  return (
    <StarBg className="py-20" id="booking">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">BOOK YOUR SPACE JOURNEY</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Follow our streamlined booking process to secure your place among the stars.
          </p>
        </div>
        
        <div className="bg-[#0A192F] bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-10 px-4">
            {['DESTINATION', 'TRAVEL CLASS', 'ACCOMMODATION', 'EXPERIENCES', 'PAYMENT'].map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full ${
                  index + 1 <= currentStep ? 'bg-[#00D1FF]' : 'bg-gray-700'
                } flex items-center justify-center text-white font-bold`}>
                  {index + 1}
                </div>
                <div className="absolute top-0 h-10 left-0 right-0 flex items-center justify-center">
                  <div className={`w-full h-1 ${
                    index + 1 <= currentStep ? 'bg-[#00D1FF]' : 'bg-gray-700'
                  }`}></div>
                </div>
                <span className={`mt-2 font-orbitron text-xs ${
                  index + 1 <= currentStep ? 'text-[#00D1FF]' : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          {/* Step Content */}
          <div className="mb-8">
            <h3 className="font-orbitron text-xl font-bold mb-6">SELECT YOUR DESTINATION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading state
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-[#121212] border-2 border-gray-700 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-16 bg-gray-700 rounded mb-4 w-full"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-gray-700 rounded w-20"></div>
                      <div className="h-5 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Destination options
                destinations?.map((destination) => (
                  <div 
                    key={destination.id}
                    className={`
                      bg-[#121212] 
                      border-2 
                      ${selectedDestination == destination.id.toString() 
                        ? destination.type === 'ORBITAL' 
                          ? 'border-[#00D1FF]' 
                          : destination.type === 'LUNAR' 
                            ? 'border-[#D0D0D0]' 
                            : 'border-[#E4572E]'
                        : 'border-gray-700 hover:border-gray-500'
                      } 
                      rounded-lg p-6 cursor-pointer relative transition-colors
                    `}
                    onClick={() => setSelectedDestination(destination.id.toString())}
                  >
                    <div className="absolute top-4 right-4">
                      <div className={`
                        w-6 h-6 rounded-full 
                        ${selectedDestination == destination.id.toString() 
                          ? destination.type === 'ORBITAL' 
                            ? 'border-[#00D1FF]' 
                            : destination.type === 'LUNAR' 
                              ? 'border-[#D0D0D0]' 
                              : 'border-[#E4572E]'
                          : 'border-gray-700'
                        } 
                        border-2 flex items-center justify-center
                      `}>
                        <div className={`
                          w-3 h-3 rounded-full
                          ${selectedDestination == destination.id.toString() 
                            ? destination.type === 'ORBITAL' 
                              ? 'bg-[#00D1FF]' 
                              : destination.type === 'LUNAR' 
                                ? 'bg-[#D0D0D0]' 
                                : 'bg-[#E4572E]'
                            : 'bg-transparent'
                          }
                        `}></div>
                      </div>
                    </div>
                    <h4 className="font-orbitron font-bold mb-2">{destination.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{destination.description.substring(0, 60)}...</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`
                        ${destination.type === 'ORBITAL' 
                          ? 'text-[#00D1FF]' 
                          : destination.type === 'LUNAR' 
                            ? 'text-[#D0D0D0]' 
                            : 'text-[#E4572E]'
                        } 
                        font-bold
                      `}>
                        ${destination.basePrice.toLocaleString()}+
                      </span>
                      <span className="text-gray-400">{destination.duration} days</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-orbitron text-xl font-bold mb-6">SELECT DEPARTURE DATE</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-orbitron text-gray-400 mb-2">DEPARTURE WINDOW</label>
                <div className="relative">
                  <Select disabled={!selectedDestination}>
                    <SelectTrigger className="w-full bg-[#121212] border border-gray-700 rounded-md py-3 text-white">
                      <SelectValue placeholder={
                        !selectedDestinationData 
                          ? "Select a destination first" 
                          : selectedDestinationData.type === 'ORBITAL'
                            ? "October 12, 2023 - ISS Expedition 70"
                            : selectedDestinationData.type === 'LUNAR'
                              ? "November 15, 2023 - Lunar Mission"
                              : "December 20, 2023 - Mars Expedition"
                      } />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border border-gray-700">
                      {selectedDestinationData?.type === 'ORBITAL' ? (
                        <>
                          <SelectItem value="oct12">October 12, 2023 - ISS Expedition 70</SelectItem>
                          <SelectItem value="nov15">November 15, 2023 - ISS Expedition 71</SelectItem>
                          <SelectItem value="dec20">December 20, 2023 - ISS Expedition 72</SelectItem>
                          <SelectItem value="jan18">January 18, 2024 - ISS Expedition 73</SelectItem>
                        </>
                      ) : selectedDestinationData?.type === 'LUNAR' ? (
                        <>
                          <SelectItem value="nov15">November 15, 2023 - Lunar Mission 1</SelectItem>
                          <SelectItem value="jan10">January 10, 2024 - Lunar Mission 2</SelectItem>
                          <SelectItem value="mar5">March 5, 2024 - Lunar Mission 3</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="dec20">December 20, 2023 - Mars Expedition 1</SelectItem>
                          <SelectItem value="feb15">February 15, 2024 - Mars Expedition 2</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-2 text-xs text-gray-500">Next launch: 14 days, 6 hours, 23 minutes</p>
              </div>
              
              <div>
                <label className="block text-sm font-orbitron text-gray-400 mb-2">NUMBER OF TRAVELERS</label>
                <div className="flex">
                  <Button 
                    variant="outline"
                    type="button" 
                    className="bg-[#121212] border border-gray-700 rounded-l-md w-12 flex items-center justify-center text-white hover:bg-gray-800"
                    onClick={() => handleTravelerChange('decrease')}
                    disabled={travelers <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <Input 
                    type="number" 
                    value={travelers} 
                    min={1} 
                    max={6} 
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 6) {
                        setTravelers(value);
                      }
                    }}
                    className="w-full bg-[#121212] border-y border-gray-700 py-3 px-4 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#00D1FF]"
                  />
                  <Button 
                    variant="outline"
                    type="button" 
                    className="bg-[#121212] border border-gray-700 rounded-r-md w-12 flex items-center justify-center text-white hover:bg-gray-800"
                    onClick={() => handleTravelerChange('increase')}
                    disabled={travelers >= 6}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Maximum 6 travelers per booking</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-10">
            <Button 
              className="px-8 py-3 rounded-md font-orbitron text-sm font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors flex items-center"
              onClick={handleContinue}
              disabled={!selectedDestination}
            >
              CONTINUE TO TRAVEL CLASS
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </StarBg>
  );
};

export default BookingSection;
