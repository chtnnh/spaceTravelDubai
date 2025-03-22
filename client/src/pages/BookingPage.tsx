import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useSearch, Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarBg from '@/components/ui/star-bg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Destination, TravelClass, Accommodation, Experience, Trip } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { ChevronRight, Check, Calendar, User, Building, Rocket, Sparkles, CreditCard, ArrowRight, ArrowLeft, Clock, MapPin, Star, Gem, Loader2 } from 'lucide-react';

const BookingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchParams = useSearch();
  
  // Extract query parameters
  const params = new URLSearchParams(searchParams);
  const initialDestinationId = params.get('destination');
  const initialTravelClassId = params.get('class');
  const initialAccommodationId = params.get('accommodation');
  const initialTravelers = params.get('travelers') ? parseInt(params.get('travelers')!) : 1;
  
  // Booking state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(initialDestinationId);
  const [selectedTravelClass, setSelectedTravelClass] = useState<string | null>(initialTravelClassId);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(initialAccommodationId);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [departureDate, setDepartureDate] = useState<string>('');
  const [travelers, setTravelers] = useState(initialTravelers);
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  
  // Fetch data
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  const { data: travelClasses } = useQuery<TravelClass[]>({
    queryKey: ['/api/travel-classes'],
  });
  
  const { data: accommodations } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations'],
    enabled: !!selectedDestination,
  });
  
  const { data: experiences } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
    enabled: !!selectedDestination,
  });
  
  // Filter accommodations based on selected destination
  const filteredAccommodations = accommodations?.filter(
    acc => !selectedDestination || acc.destinationId === parseInt(selectedDestination)
  );
  
  // Filter experiences based on selected destination
  const filteredExperiences = experiences?.filter(
    exp => !selectedDestination || exp.destinationId === parseInt(selectedDestination || exp.destinationId === 1) // Include general experiences
  );
  
  // Get the selected destination object
  const destinationObj = destinations?.find(d => d.id.toString() === selectedDestination);
  
  // Get the selected travel class object
  const travelClassObj = travelClasses?.find(tc => tc.id.toString() === selectedTravelClass);
  
  // Get the selected accommodation object
  const accommodationObj = accommodations?.find(acc => acc.id.toString() === selectedAccommodation);
  
  // Calculate the stay duration based on the destination
  const getDuration = () => {
    return destinationObj?.duration || 0;
  };
  
  // Calculate accommodation cost
  const getAccommodationCost = () => {
    if (!accommodationObj || !destinationObj) return 0;
    // Accommodation cost = price per night * (duration - 1) [subtract 1 as first/last day is transit]
    const stayDuration = Math.max(destinationObj.duration - 2, 1);
    return accommodationObj.pricePerNight * stayDuration;
  };
  
  // Calculate experiences cost
  const getExperiencesCost = () => {
    if (!experiences || selectedExperiences.length === 0) return 0;
    return selectedExperiences.reduce((total, expId) => {
      const experience = experiences.find(exp => exp.id.toString() === expId);
      return total + (experience?.price || 0);
    }, 0);
  };
  
  // Calculate the total cost
  const calculateTotal = () => {
    if (!destinationObj || !travelClassObj) return 0;
    
    // Base cost = destination base price * travel class multiplier
    const baseCost = destinationObj.basePrice * (travelClassObj.priceMultiplier / 100);
    
    // Add accommodation cost
    const accommodationCost = getAccommodationCost();
    
    // Add experiences cost
    const experiencesCost = getExperiencesCost();
    
    // Multiply by number of travelers
    return (baseCost + accommodationCost + experiencesCost) * travelers;
  };
  
  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (tripData: any) => {
      const res = await apiRequest('POST', '/api/trips', tripData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: 'Booking Successful!',
        description: 'Your space journey has been booked.',
      });
      navigate(`/trips/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'There was a problem booking your trip.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle next step
  const handleNextStep = () => {
    // Validation for each step
    if (currentStep === 1 && !selectedDestination) {
      toast({
        title: 'Please select a destination',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentStep === 2 && !selectedTravelClass) {
      toast({
        title: 'Please select a travel class',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentStep === 3 && !selectedAccommodation) {
      toast({
        title: 'Please select accommodation',
        variant: 'destructive',
      });
      return;
    }
    
    // If on the final step, submit the booking
    if (currentStep === 5) {
      if (!user) {
        toast({
          title: 'Please log in to complete your booking',
          variant: 'destructive',
        });
        navigate('/login?redirect=/booking');
        return;
      }
      
      if (!contactName || !contactEmail || !departureDate) {
        toast({
          title: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }
      
      // Calculate return date based on departure and duration
      const departure = new Date(departureDate);
      const returnDate = new Date(departure);
      returnDate.setDate(returnDate.getDate() + getDuration());
      
      // Create booking
      const tripData = {
        userId: user.id,
        destinationId: parseInt(selectedDestination!),
        travelClassId: parseInt(selectedTravelClass!),
        accommodationId: parseInt(selectedAccommodation!),
        departureDate: departure,
        returnDate: returnDate,
        totalPrice: calculateTotal(),
        status: 'booked',
        bookedExperiences: selectedExperiences.map(id => parseInt(id)),
      };
      
      bookingMutation.mutate(tripData);
      return;
    }
    
    // Move to next step
    setCurrentStep(currentStep + 1);
    
    // Update URL with current selections
    const newParams = new URLSearchParams();
    if (selectedDestination) newParams.set('destination', selectedDestination);
    if (selectedTravelClass) newParams.set('class', selectedTravelClass);
    if (selectedAccommodation) newParams.set('accommodation', selectedAccommodation);
    if (travelers > 1) newParams.set('travelers', travelers.toString());
    
    navigate(`/booking?${newParams.toString()}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Get color coding for destination
  const getDestinationColor = (type: string) => {
    if (type === 'ORBITAL') return 'text-[#00D1FF]';
    if (type === 'LUNAR') return 'text-[#D0D0D0]';
    if (type === 'PLANETARY') return 'text-[#E4572E]';
    return 'text-white';
  };
  
  // Get button background color based on destination
  const getButtonBgColor = (type: string) => {
    if (type === 'ORBITAL') return 'bg-[#00D1FF]';
    if (type === 'LUNAR') return 'bg-[#D0D0D0] text-[#0A192F]';
    if (type === 'PLANETARY') return 'bg-[#E4572E]';
    return 'bg-[#00D1FF]';
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Redirect to login if trying to book without being logged in on final step
  useEffect(() => {
    if (currentStep === 5 && !authLoading && !user) {
      toast({
        title: 'Please log in to complete your booking',
        description: 'You need to be logged in to book a space journey.',
        variant: 'destructive',
      });
      navigate('/login?redirect=/booking');
    }
  }, [currentStep, user, authLoading, navigate, toast]);
  
  // Set contact details from user data if available
  useEffect(() => {
    if (user && !contactName && !contactEmail) {
      setContactName(user.fullName);
      setContactEmail(user.email);
    }
  }, [user, contactName, contactEmail]);
  
  // Generate departure date options (start with dates 2 weeks from now)
  const getDepartureDateOptions = () => {
    if (!destinationObj) return [];
    
    const dates = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 14); // Start 2 weeks from today
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i * 14)); // Add more dates every 2 weeks
      
      let missionName = "";
      if (destinationObj.type === 'ORBITAL') {
        missionName = `ISS Expedition ${70 + i}`;
      } else if (destinationObj.type === 'LUNAR') {
        missionName = `Lunar Mission ${i + 1}`;
      } else {
        missionName = `Mars Expedition ${i + 1}`;
      }
      
      dates.push({
        date: date.toISOString().split('T')[0],
        label: `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - ${missionName}`,
      });
    }
    
    return dates;
  };

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <Navbar />
      
      <StarBg className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              BOOK YOUR SPACE JOURNEY
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow our streamlined booking process to secure your place among the stars.
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto mb-12 px-8">
            {[
              { step: 1, label: 'DESTINATION' },
              { step: 2, label: 'TRAVEL CLASS' },
              { step: 3, label: 'ACCOMMODATION' },
              { step: 4, label: 'EXPERIENCES' },
              { step: 5, label: 'PAYMENT' },
            ].map(({ step, label }) => (
              <div key={step} className="flex flex-col items-center relative">
                <div className={`
                  w-10 h-10 rounded-full 
                  ${step <= currentStep ? 'bg-[#00D1FF]' : 'bg-gray-700'} 
                  flex items-center justify-center text-white font-bold z-10
                `}>
                  {step < currentStep ? <Check className="h-5 w-5" /> : step}
                </div>
                <span className={`
                  mt-2 font-orbitron text-xs 
                  ${step <= currentStep ? 'text-[#00D1FF]' : 'text-gray-400'}
                `}>
                  {label}
                </span>
                
                {/* Connection line */}
                {step < 5 && (
                  <div className="absolute top-5 left-10 right-0 w-full h-[1px] flex items-center">
                    <div className={`w-full h-1 ${step < currentStep ? 'bg-[#00D1FF]' : 'bg-gray-700'}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Current step indicator (mobile) */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <div>
              <span className="text-gray-400 text-sm">Step {currentStep} of 5</span>
              <h2 className="font-orbitron text-xl font-bold">
                {currentStep === 1 && 'Choose Destination'}
                {currentStep === 2 && 'Select Travel Class'}
                {currentStep === 3 && 'Select Accommodation'}
                {currentStep === 4 && 'Add Experiences'}
                {currentStep === 5 && 'Complete Booking'}
              </h2>
            </div>
            <div className="bg-[#121212] rounded-full h-10 w-10 flex items-center justify-center">
              <span className="text-[#00D1FF] font-bold">{currentStep}/5</span>
            </div>
          </div>
          
          {/* Step Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="bg-[#121212] border-gray-800 shadow-xl overflow-hidden">
                {/* Step 1: Choose Destination */}
                {currentStep === 1 && (
                  <CardContent className="p-6">
                    <h2 className="font-orbitron text-xl font-bold mb-6">SELECT YOUR DESTINATION</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {destinations?.map((destination) => (
                        <div 
                          key={destination.id}
                          className={`
                            bg-[#0A192F] rounded-lg overflow-hidden cursor-pointer transition-all
                            border-2 ${selectedDestination === destination.id.toString() 
                              ? destination.type === 'ORBITAL' 
                                ? 'border-[#00D1FF]' 
                                : destination.type === 'LUNAR' 
                                  ? 'border-[#D0D0D0]' 
                                  : 'border-[#E4572E]'
                              : 'border-gray-700 hover:border-gray-500'
                            }
                          `}
                          onClick={() => setSelectedDestination(destination.id.toString())}
                        >
                          <div className="h-40 relative">
                            <img 
                              src={destination.imageUrl} 
                              alt={destination.name} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent"></div>
                            <div className="absolute bottom-2 left-2">
                              <span className={`
                                px-2 py-1 text-xs font-orbitron rounded-md
                                ${destination.type === 'ORBITAL' 
                                  ? 'bg-[#00D1FF]' 
                                  : destination.type === 'LUNAR' 
                                    ? 'bg-[#D0D0D0] text-[#0A192F]' 
                                    : 'bg-[#E4572E]'
                                }
                              `}>
                                {destination.type}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-orbitron font-bold mb-1">{destination.name}</h3>
                            <div className="flex justify-between items-center">
                              <span className={getDestinationColor(destination.type)}>
                                ${destination.basePrice.toLocaleString()}
                              </span>
                              <span className="text-gray-400 text-sm">{destination.duration} days</span>
                            </div>
                          </div>
                          
                          {/* Selection indicator */}
                          {selectedDestination === destination.id.toString() && (
                            <div className="bg-gradient-to-r from-[#00D1FF]/30 to-transparent h-1"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="font-orbitron text-lg font-bold mb-4">JOURNEY DETAILS</h3>
                    
                    <div className="bg-[#0A192F] p-4 rounded-lg mb-6">
                      {selectedDestination ? (
                        <>
                          <h4 className="font-orbitron font-bold mb-2">
                            {destinationObj?.name}
                          </h4>
                          <p className="text-gray-400 mb-4">{destinationObj?.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Clock className="text-[#00D1FF] mr-2 h-4 w-4" />
                              <span className="text-sm">{destinationObj?.duration} days</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="text-[#00D1FF] mr-2 h-4 w-4" />
                              <span className="text-sm">
                                {destinationObj?.distance < 1000 
                                  ? `${destinationObj?.distance} km` 
                                  : destinationObj?.distance < 1000000 
                                    ? `${(destinationObj?.distance / 1000).toFixed(0)}k km` 
                                    : `${(destinationObj?.distance / 1000000).toFixed(0)}M km`
                                }
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-gray-400 py-4">
                          Please select a destination to see details
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label className="block text-sm font-orbitron text-gray-400 mb-2">
                          DEPARTURE WINDOW
                        </Label>
                        <Select 
                          value={departureDate}
                          onValueChange={setDepartureDate}
                          disabled={!selectedDestination}
                        >
                          <SelectTrigger className="w-full bg-[#0A192F] border-gray-700">
                            <SelectValue placeholder="Select departure date" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A192F] border-gray-700">
                            {getDepartureDateOptions().map((option) => (
                              <SelectItem key={option.date} value={option.date}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-orbitron text-gray-400 mb-2">
                          NUMBER OF TRAVELERS
                        </Label>
                        <div className="flex">
                          <Button 
                            variant="outline"
                            className="bg-[#0A192F] border-gray-700 rounded-l-md"
                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                            disabled={travelers <= 1}
                          >
                            -
                          </Button>
                          <Input 
                            type="number" 
                            value={travelers} 
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 1 && value <= 6) {
                                setTravelers(value);
                              }
                            }}
                            className="bg-[#0A192F] border-gray-700 rounded-none text-center"
                            min={1}
                            max={6}
                          />
                          <Button 
                            variant="outline"
                            className="bg-[#0A192F] border-gray-700 rounded-r-md"
                            onClick={() => setTravelers(Math.min(6, travelers + 1))}
                            disabled={travelers >= 6}
                          >
                            +
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Maximum 6 travelers per booking</p>
                      </div>
                    </div>
                  </CardContent>
                )}
                
                {/* Step 2: Travel Class */}
                {currentStep === 2 && (
                  <CardContent className="p-6">
                    <h2 className="font-orbitron text-xl font-bold mb-6">SELECT YOUR TRAVEL CLASS</h2>
                    
                    <div className="grid grid-cols-1 gap-6 mb-8">
                      {travelClasses?.map((travelClass) => {
                        // Determine styling based on class
                        let iconBg, iconColor, borderColor, buttonStyle;
                        
                        if (travelClass.name === 'Cosmonaut Class') {
                          iconBg = 'bg-gray-800';
                          iconColor = 'text-[#00D1FF]';
                          borderColor = selectedTravelClass === travelClass.id.toString() ? 'border-[#00D1FF]' : 'border-gray-700';
                          buttonStyle = 'bg-[#00D1FF]/10 border-[#00D1FF] text-[#00D1FF]';
                        } else if (travelClass.name === 'Astronaut Class') {
                          iconBg = 'bg-[#00D1FF]/20';
                          iconColor = 'text-[#00D1FF]';
                          borderColor = selectedTravelClass === travelClass.id.toString() ? 'border-[#00D1FF]' : 'border-gray-700';
                          buttonStyle = 'bg-[#00D1FF] text-white';
                        } else {
                          iconBg = 'bg-[#4E1184]/20';
                          iconColor = 'text-[#4E1184]';
                          borderColor = selectedTravelClass === travelClass.id.toString() ? 'border-[#4E1184]' : 'border-gray-700';
                          buttonStyle = 'bg-[#4E1184]/10 border-[#4E1184] text-[#4E1184]';
                        }
                        
                        // Calculate price based on destination and class
                        const price = destinationObj ? 
                          (destinationObj.basePrice * (travelClass.priceMultiplier / 100)) : 
                          travelClass.priceMultiplier;
                        
                        return (
                          <div 
                            key={travelClass.id}
                            className={`
                              bg-[#0A192F] rounded-lg p-6 border-2 ${borderColor}
                              ${selectedTravelClass === travelClass.id.toString() ? 'ring-1 ring-[#00D1FF]/50' : ''}
                              ${travelClass.name === 'Astronaut Class' ? 'relative' : ''}
                            `}
                          >
                            {travelClass.name === 'Astronaut Class' && (
                              <div className="absolute top-0 left-0 right-0 py-1 bg-[#00D1FF] text-center font-orbitron text-xs text-white">
                                MOST POPULAR
                              </div>
                            )}
                            
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="md:w-2/3">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                                    {travelClass.name === 'Cosmonaut Class' && <Rocket className={`${iconColor} h-6 w-6`} />}
                                    {travelClass.name === 'Astronaut Class' && <Star className={`${iconColor} h-6 w-6`} />}
                                    {travelClass.name === 'Pioneer Class' && <Gem className={`${iconColor} h-6 w-6`} />}
                                  </div>
                                  <h3 className="font-orbitron text-lg font-bold">{travelClass.name}</h3>
                                </div>
                                
                                <p className="text-gray-400 mb-4">{travelClass.description}</p>
                                
                                <ul className="mb-4 space-y-2">
                                  {(travelClass.features as string[]).map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                      <Check className="text-green-500 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                                      <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                  )).slice(0, 3)}
                                  
                                  {(travelClass.features as string[]).length > 3 && (
                                    <li className="text-[#00D1FF] text-sm ml-7">
                                      +{(travelClass.features as string[]).length - 3} more features
                                    </li>
                                  )}
                                </ul>
                              </div>
                              
                              <div className="md:w-1/3 flex flex-col justify-between">
                                <div className="text-center mb-4">
                                  <span className="block text-sm text-gray-400">Price per traveler</span>
                                  <span className="font-orbitron text-2xl font-bold">
                                    {formatPrice(price)}
                                  </span>
                                </div>
                                
                                <Button 
                                  className={`w-full ${buttonStyle}`}
                                  onClick={() => setSelectedTravelClass(travelClass.id.toString())}
                                  variant={selectedTravelClass === travelClass.id.toString() ? 'default' : 'outline'}
                                >
                                  {selectedTravelClass === travelClass.id.toString() ? 'SELECTED' : 'SELECT CLASS'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
                
                {/* Step 3: Accommodation */}
                {currentStep === 3 && (
                  <CardContent className="p-6">
                    <h2 className="font-orbitron text-xl font-bold mb-6">SELECT YOUR ACCOMMODATION</h2>
                    
                    <div className="grid grid-cols-1 gap-6 mb-8">
                      {filteredAccommodations?.map((accommodation) => {
                        // Determine color scheme based on destination
                        const destination = destinations?.find(d => d.id === accommodation.destinationId);
                        let typeColor = 'text-[#00D1FF]';
                        let buttonColor = 'bg-[#00D1FF] text-white';
                        
                        if (destination?.type === 'LUNAR') {
                          typeColor = 'text-[#D0D0D0]';
                          buttonColor = 'bg-[#D0D0D0] text-[#0A192F]';
                        } else if (destination?.type === 'PLANETARY') {
                          typeColor = 'text-[#E4572E]';
                          buttonColor = 'bg-[#E4572E] text-white';
                        }
                        
                        // Calculate accommodation cost for the stay duration
                        const stayDuration = Math.max(getDuration() - 2, 1); // Subtract transit days
                        const totalCost = accommodation.pricePerNight * stayDuration;
                        
                        return (
                          <div 
                            key={accommodation.id}
                            className={`
                              bg-[#0A192F] rounded-lg overflow-hidden border-2
                              ${selectedAccommodation === accommodation.id.toString() 
                                ? destination?.type === 'ORBITAL' 
                                  ? 'border-[#00D1FF]' 
                                  : destination?.type === 'LUNAR' 
                                    ? 'border-[#D0D0D0]' 
                                    : 'border-[#E4572E]'
                                : 'border-gray-700'
                              }
                            `}
                          >
                            <div className="p-0 md:p-0 flex flex-col md:flex-row">
                              <div className="md:w-1/3 h-48 md:h-auto relative">
                                <img 
                                  src={accommodation.imageUrl} 
                                  alt={accommodation.name} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A192F] md:block hidden"></div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A192F] to-transparent h-20 md:hidden"></div>
                              </div>
                              
                              <div className="md:w-2/3 p-6">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className={`font-orbitron text-lg font-bold ${typeColor}`}>
                                    {accommodation.name}
                                  </h3>
                                  <div className="flex">
                                    {Array(5).fill(0).map((_, i) => (
                                      <Star key={i} className={`${typeColor} h-4 w-4`} fill="currentColor" />
                                    ))}
                                  </div>
                                </div>
                                
                                <p className="text-gray-400 mb-4">{accommodation.description}</p>
                                
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div className="flex items-center">
                                    <User className={`${typeColor} mr-2 h-4 w-4`} />
                                    <span className="text-sm text-gray-300">Capacity: {accommodation.capacity} guests</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Building className={`${typeColor} mr-2 h-4 w-4`} />
                                    <span className="text-sm text-gray-300">{accommodation.size} sq meters</span>
                                  </div>
                                  
                                  {(accommodation.amenities as string[]).slice(0, 2).map((amenity, index) => (
                                    <div key={index} className="flex items-center">
                                      <Check className={`${typeColor} mr-2 h-4 w-4`} />
                                      <span className="text-sm text-gray-300">{amenity}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                  <div className="text-left">
                                    <p className="text-sm text-gray-400">
                                      {stayDuration} {stayDuration === 1 ? 'night' : 'nights'} • ${accommodation.pricePerNight.toLocaleString()}/night
                                    </p>
                                    <p className="font-orbitron text-lg font-bold">
                                      Total: {formatPrice(totalCost)}
                                    </p>
                                  </div>
                                  
                                  <Button 
                                    className={buttonColor}
                                    onClick={() => setSelectedAccommodation(accommodation.id.toString())}
                                  >
                                    {selectedAccommodation === accommodation.id.toString() ? 'SELECTED' : 'SELECT'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
                
                {/* Step 4: Experiences */}
                {currentStep === 4 && (
                  <CardContent className="p-6">
                    <h2 className="font-orbitron text-xl font-bold mb-6">ENHANCE YOUR JOURNEY</h2>
                    <p className="text-gray-400 mb-6">
                      Select from our unique space experiences to make your journey even more memorable.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {filteredExperiences?.map((experience) => {
                        // Format duration display
                        let durationText;
                        if (experience.duration < 60) {
                          durationText = `${experience.duration} minutes`;
                        } else if (experience.duration === 60) {
                          durationText = '1 hour';
                        } else if (experience.duration < 480) {
                          durationText = `${experience.duration / 60} hours`;
                        } else {
                          durationText = 'Full day';
                        }
                        
                        const isSelected = selectedExperiences.includes(experience.id.toString());
                        
                        return (
                          <div 
                            key={experience.id}
                            className={`
                              group bg-[#0A192F] rounded-lg overflow-hidden cursor-pointer
                              border-2 ${isSelected ? 'border-[#00D1FF]' : 'border-gray-700'}
                            `}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedExperiences(selectedExperiences.filter(id => id !== experience.id.toString()));
                              } else {
                                setSelectedExperiences([...selectedExperiences, experience.id.toString()]);
                              }
                            }}
                          >
                            <div className="relative h-40">
                              <img 
                                src={experience.imageUrl} 
                                alt={experience.name} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A192F]"></div>
                              
                              {/* Selection indicator */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#00D1FF] flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-orbitron font-bold mb-2">{experience.name}</h3>
                              <p className="text-gray-400 text-sm mb-4">{experience.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-[#00D1FF] font-mono font-bold">${experience.price.toLocaleString()}</span>
                                <span className="text-sm text-gray-500">{durationText}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-[#0A192F] p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-orbitron font-bold">Selected Experiences</h3>
                        <span className="text-[#00D1FF] font-bold">
                          {selectedExperiences.length} selected
                        </span>
                      </div>
                      
                      {selectedExperiences.length > 0 ? (
                        <div className="space-y-2">
                          {selectedExperiences.map(expId => {
                            const exp = experiences?.find(e => e.id.toString() === expId);
                            return exp ? (
                              <div key={exp.id} className="flex justify-between items-center">
                                <span className="text-gray-300">{exp.name}</span>
                                <span className="text-gray-400">${exp.price.toLocaleString()}</span>
                              </div>
                            ) : null;
                          })}
                          <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between items-center">
                            <span className="font-orbitron">Total for experiences</span>
                            <span className="font-orbitron text-[#00D1FF]">
                              {formatPrice(getExperiencesCost())}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No experiences selected</p>
                      )}
                    </div>
                  </CardContent>
                )}
                
                {/* Step 5: Payment */}
                {currentStep === 5 && (
                  <CardContent className="p-6">
                    <h2 className="font-orbitron text-xl font-bold mb-6">COMPLETE YOUR BOOKING</h2>
                    
                    <div className="mb-8">
                      <h3 className="font-orbitron text-lg mb-4">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <Label htmlFor="contactName">Full Name</Label>
                          <Input 
                            id="contactName"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="bg-[#0A192F] border-gray-700 mt-1"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">Email</Label>
                          <Input 
                            id="contactEmail"
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="bg-[#0A192F] border-gray-700 mt-1"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="font-orbitron text-lg mb-4">Payment Method</h3>
                      
                      <RadioGroup 
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 bg-[#0A192F] p-4 rounded-lg border border-gray-700">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card">Credit / Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-[#0A192F] p-4 rounded-lg border border-gray-700">
                          <RadioGroupItem value="crypto" id="crypto" />
                          <Label htmlFor="crypto">Cryptocurrency</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-[#0A192F] p-4 rounded-lg border border-gray-700">
                          <RadioGroupItem value="wire" id="wire" />
                          <Label htmlFor="wire">Wire Transfer</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="font-orbitron text-lg mb-4">Terms & Conditions</h3>
                      
                      <div className="bg-[#0A192F] p-4 rounded-lg border border-gray-700 mb-4">
                        <div className="flex items-start space-x-2 mb-4">
                          <Checkbox id="terms" className="mt-1" />
                          <Label htmlFor="terms" className="text-sm">
                            I have read and agree to the terms and conditions, including the cancellation policy and space travel waiver.
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="communications" className="mt-1" />
                          <Label htmlFor="communications" className="text-sm">
                            I would like to receive updates about my upcoming journey and future space travel opportunities.
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
                
                {/* Navigation Buttons */}
                <div className="px-6 pb-6 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    disabled={currentStep === 1 || bookingMutation.isPending}
                    className="border-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentStep > 1 ? 'PREVIOUS STEP' : 'CANCEL'}
                  </Button>
                  
                  <Button 
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 && (!selectedDestination || !departureDate)) ||
                      (currentStep === 2 && !selectedTravelClass) ||
                      (currentStep === 3 && !selectedAccommodation) ||
                      bookingMutation.isPending
                    }
                    className={`
                      ${currentStep === 5 ? 'bg-green-600 hover:bg-green-700' : 'bg-[#00D1FF] hover:bg-[#00D1FF]/80'}
                    `}
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        PROCESSING
                      </>
                    ) : (
                      <>
                        {currentStep < 5 ? 'NEXT STEP' : 'COMPLETE BOOKING'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-[#121212] border-gray-800 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-orbitron text-xl font-bold mb-6">BOOKING SUMMARY</h2>
                  
                  {selectedDestination ? (
                    <div className="space-y-6">
                      {/* Destination */}
                      <div className="pb-4 border-b border-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-gray-400 text-sm">Destination</span>
                            <h3 className="font-orbitron font-bold">
                              {destinationObj?.name || 'Selected Destination'}
                            </h3>
                          </div>
                          {currentStep > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[#00D1FF] h-auto py-1"
                              onClick={() => setCurrentStep(1)}
                            >
                              Change
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="text-[#00D1FF] mr-2 h-3 w-3" />
                            <span className="text-gray-400">
                              {departureDate ? new Date(departureDate).toLocaleDateString() : 'Select date'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <User className="text-[#00D1FF] mr-2 h-3 w-3" />
                            <span className="text-gray-400">{travelers} traveler{travelers !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Travel Class */}
                      {(selectedTravelClass || currentStep >= 2) && (
                        <div className="pb-4 border-b border-gray-800">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-gray-400 text-sm">Travel Class</span>
                              <h3 className="font-orbitron font-bold">
                                {travelClassObj?.name || 'Select Travel Class'}
                              </h3>
                            </div>
                            {currentStep > 2 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#00D1FF] h-auto py-1"
                                onClick={() => setCurrentStep(2)}
                              >
                                Change
                              </Button>
                            )}
                          </div>
                          
                          {travelClassObj && destinationObj && (
                            <div className="text-sm text-gray-400">
                              ${((destinationObj.basePrice * travelClassObj.priceMultiplier) / 100).toLocaleString()} per traveler
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Accommodation */}
                      {(selectedAccommodation || currentStep >= 3) && (
                        <div className="pb-4 border-b border-gray-800">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-gray-400 text-sm">Accommodation</span>
                              <h3 className="font-orbitron font-bold">
                                {accommodationObj?.name || 'Select Accommodation'}
                              </h3>
                            </div>
                            {currentStep > 3 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#00D1FF] h-auto py-1"
                                onClick={() => setCurrentStep(3)}
                              >
                                Change
                              </Button>
                            )}
                          </div>
                          
                          {accommodationObj && (
                            <div className="text-sm text-gray-400">
                              ${accommodationObj.pricePerNight.toLocaleString()} × {Math.max(getDuration() - 2, 1)} nights
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Experiences */}
                      {(currentStep >= 4) && (
                        <div className="pb-4 border-b border-gray-800">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-gray-400 text-sm">Experiences</span>
                              <h3 className="font-orbitron font-bold">
                                {selectedExperiences.length} {selectedExperiences.length === 1 ? 'Experience' : 'Experiences'} Selected
                              </h3>
                            </div>
                            {currentStep > 4 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#00D1FF] h-auto py-1"
                                onClick={() => setCurrentStep(4)}
                              >
                                Change
                              </Button>
                            )}
                          </div>
                          
                          {selectedExperiences.length > 0 ? (
                            <ul className="text-sm text-gray-400 space-y-1">
                              {selectedExperiences.map(expId => {
                                const exp = experiences?.find(e => e.id.toString() === expId);
                                return exp ? (
                                  <li key={exp.id} className="flex justify-between">
                                    <span>{exp.name}</span>
                                    <span>${exp.price.toLocaleString()}</span>
                                  </li>
                                ) : null;
                              })}
                            </ul>
                          ) : (
                            <div className="text-sm text-gray-500 italic">No experiences added</div>
                          )}
                        </div>
                      )}
                      
                      {/* Price Summary */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Base Price</span>
                          <span>
                            {destinationObj && travelClassObj ? 
                              formatPrice((destinationObj.basePrice * travelClassObj.priceMultiplier / 100) * travelers) : 
                              '-'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Accommodation</span>
                          <span>{formatPrice(getAccommodationCost() * travelers)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Experiences</span>
                          <span>{formatPrice(getExperiencesCost() * travelers)}</span>
                        </div>
                        <Separator className="my-2 bg-gray-800" />
                        <div className="flex justify-between font-orbitron text-lg font-bold">
                          <span>TOTAL</span>
                          <span className="text-[#00D1FF]">{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          For {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Select a destination to see your booking summary
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </StarBg>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
