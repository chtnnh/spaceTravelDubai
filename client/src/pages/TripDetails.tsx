import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { format, differenceInDays } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarBg from '@/components/ui/star-bg';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Trip, Destination, TravelClass, Accommodation, Experience } from '@shared/schema';
import useAuth from '@/hooks/useAuth';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Rocket, 
  Hotel, 
  ArrowLeft,
  AlertCircle,
  Star,
  Sparkles,
  Building,
  Timer,
  Mail,
  Phone
} from 'lucide-react';

const TripDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/trips/:id');
  const tripId = params?.id ? parseInt(params.id) : null;
  
  // Calculate countdown
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percent: 0
  });

  // Fetch trip data
  const { 
    data: trip,
    isLoading: tripLoading,
    error: tripError
  } = useQuery<Trip>({
    queryKey: ['/api/trips', tripId],
    enabled: !!tripId && !!user,
  });

  // Fetch related data
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    enabled: !!trip,
  });
  
  const { data: travelClasses } = useQuery<TravelClass[]>({
    queryKey: ['/api/travel-classes'],
    enabled: !!trip,
  });
  
  const { data: accommodations } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations'],
    enabled: !!trip,
  });
  
  const { data: experiences } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
    enabled: !!trip && trip.bookedExperiences !== undefined && (trip.bookedExperiences as number[]).length > 0,
  });

  // Check if user is authorized
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/trips/' + tripId);
    }
  }, [user, authLoading, navigate, tripId]);

  // Check if trip belongs to user
  useEffect(() => {
    if (trip) {
      console.log("Trip data:", trip);
      if (user && trip.userId !== user.id) {
        navigate('/profile');
      }
    }
  }, [trip, user, navigate]);

  // Update countdown
  useEffect(() => {
    if (!trip) return;

    const calculateCountdown = () => {
      try {
        const now = new Date();
        const departureDate = new Date(trip.departureDate);
        
        if (now >= departureDate) {
          // Trip already started
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            percent: 100
          };
        }
        
        const difference = departureDate.getTime() - now.getTime();
        
        // Calculate total days between booking and departure - fixed calculation
        const assumedBookingDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // Assume booking was 7 days ago
        const totalMilliseconds = departureDate.getTime() - assumedBookingDate.getTime();
        const elapsedMilliseconds = now.getTime() - assumedBookingDate.getTime();
        const percentComplete = Math.min(100, Math.max(0, (elapsedMilliseconds / totalMilliseconds) * 100));
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return {
          days,
          hours,
          minutes,
          seconds,
          percent: percentComplete
        };
      } catch (error) {
        console.error("Error calculating countdown:", error);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          percent: 0
        };
      }
    };
    
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    
    setCountdown(calculateCountdown());
    
    return () => clearInterval(timer);
  }, [trip]);

  // Format date
  const formatDate = (dateString: string | Date) => {
    try {
      if (dateString instanceof Date) {
        return format(dateString, 'MMMM d, yyyy');
      }
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get destination details
  const getDestination = () => {
    if (!trip || !destinations) return null;
    return destinations.find(d => d.id === trip.destinationId);
  };

  // Get travel class details
  const getTravelClass = () => {
    if (!trip || !travelClasses) return null;
    return travelClasses.find(tc => tc.id === trip.travelClassId);
  };

  // Get accommodation details
  const getAccommodation = () => {
    if (!trip || !accommodations) return null;
    return accommodations.find(a => a.id === trip.accommodationId);
  };

  // Get booked experiences
  const getBookedExperiences = () => {
    if (!trip || !experiences) return [];
    return experiences.filter(exp => 
      (trip.bookedExperiences as number[]).includes(exp.id)
    );
  };

  // Calculate trip duration
  const getTripDuration = () => {
    if (!trip) return 0;
    const start = new Date(trip.departureDate);
    const end = new Date(trip.returnDate);
    return differenceInDays(end, start);
  };

  // Get appropriate colors based on destination type
  const getColors = () => {
    const destination = getDestination();
    if (!destination) return { text: 'text-[#00D1FF]', bg: 'bg-[#00D1FF]' };
    
    switch (destination.type) {
      case 'ORBITAL':
        return { text: 'text-[#00D1FF]', bg: 'bg-[#00D1FF]' };
      case 'LUNAR':
        return { text: 'text-[#D0D0D0]', bg: 'bg-[#D0D0D0] text-[#0A192F]' };
      case 'PLANETARY':
        return { text: 'text-[#E4572E]', bg: 'bg-[#E4572E]' };
      default:
        return { text: 'text-[#00D1FF]', bg: 'bg-[#00D1FF]' };
    }
  };

  // Loading and error states
  const isLoading = authLoading || tripLoading;
  const colors = getColors();
  const destination = getDestination();
  const travelClass = getTravelClass();
  const accommodation = getAccommodation();
  const bookedExperiences = getBookedExperiences();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F]">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-12 w-3/4 max-w-2xl mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full mb-8" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle errors
  if (tripError || !trip) {
    return (
      <div className="min-h-screen bg-[#0A192F]">
        <Navbar />
        <StarBg className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4">
            <Card className="bg-[#121212] border-gray-800">
              <CardContent className="p-8 flex flex-col items-center">
                <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
                <h2 className="font-orbitron text-2xl font-bold mb-2">Trip Not Found</h2>
                <p className="text-gray-400 mb-6 text-center">
                  We couldn't find the space journey you're looking for. 
                  It may have been cancelled or you might not have permission to view it.
                </p>
                <Button 
                  className="bg-[#00D1FF]"
                  onClick={() => navigate('/profile')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </StarBg>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <Navbar />
      
      <StarBg className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="border-gray-700"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>
          
          {/* Trip title */}
          <div className="mb-8">
            <h1 className={`font-orbitron text-3xl md:text-4xl font-bold mb-2 ${colors.text}`}>
              {destination?.name} Journey
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{formatDate(trip.departureDate)} - {formatDate(trip.returnDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{getTripDuration()} days</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Launch from Dubai Spaceport</span>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trip details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-[#121212] mb-6">
                  <TabsTrigger value="overview" className="font-orbitron">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary" className="font-orbitron">Itinerary</TabsTrigger>
                  <TabsTrigger value="accommodation" className="font-orbitron">Accommodation</TabsTrigger>
                  <TabsTrigger value="experiences" className="font-orbitron">Experiences</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                    <CardContent className="p-6">
                      <h2 className="font-orbitron text-xl font-bold mb-4">Journey Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h3 className={`font-orbitron font-bold mb-2 ${colors.text}`}>
                            Destination
                          </h3>
                          <p className="text-gray-300 mb-3">{destination?.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                            <div className="flex items-center">
                              <MapPin className={`${colors.text} mr-2 h-4 w-4`} />
                              {destination?.distance && destination.distance < 1000 
                                ? `${destination.distance} km altitude` 
                                : destination?.distance && destination.distance < 1000000 
                                  ? `${(destination.distance / 1000).toFixed(0)}k km distance` 
                                  : destination?.distance
                                    ? `${(destination.distance / 1000000).toFixed(0)}M km distance`
                                    : "Distance information unavailable"
                              }
                            </div>
                            <div className="flex items-center">
                              <Clock className={`${colors.text} mr-2 h-4 w-4`} />
                              {destination?.duration} days journey
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h3 className={`font-orbitron font-bold mb-2 ${colors.text}`}>
                            Travel Class
                          </h3>
                          <p className="text-gray-300 mb-3">{travelClass?.description}</p>
                          <div className="text-sm text-gray-400">
                            <ul className="space-y-1">
                              {(travelClass?.features as string[])?.slice(0, 2).map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <Star className={`${colors.text} mr-2 h-3 w-3 flex-shrink-0`} />
                                  {feature}
                                </li>
                              ))}
                              {(travelClass?.features as string[])?.length > 2 && (
                                <li className={`${colors.text} text-xs`}>
                                  +{(travelClass?.features as string[])?.length - 2} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-orbitron text-lg font-bold mb-4">Pre-Journey Preparation</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">Health & Fitness Requirements</h4>
                          <p className="text-gray-400 text-sm">
                            All travelers must complete a medical examination 30 days before departure. 
                            You'll receive details about required tests and examinations via email.
                          </p>
                        </div>
                        
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">Training Program</h4>
                          <p className="text-gray-400 text-sm">
                            A 3-day training program in Dubai is required 2 weeks before launch. 
                            This includes zero-G adaptation, emergency procedures, and equipment training.
                          </p>
                        </div>
                        
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">What to Pack</h4>
                          <p className="text-gray-400 text-sm">
                            Space is limited! You'll be allowed to bring 5kg of personal items. Specialized
                            clothing and equipment will be provided. A detailed packing list will be sent to you.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-[#0A192F] p-4 rounded-lg">
                        <h3 className="font-orbitron text-lg font-bold mb-2">Important Dates</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CalendarDays className={`${colors.text} mr-3 h-4 w-4`} />
                              <div>
                                <p className="font-medium">Medical Examination Deadline</p>
                                <p className="text-sm text-gray-400">
                                  {formatDate(
                                    new Date(
                                      new Date(trip.departureDate).getTime() - (30 * 24 * 60 * 60 * 1000)
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CalendarDays className={`${colors.text} mr-3 h-4 w-4`} />
                              <div>
                                <p className="font-medium">Training Program</p>
                                <p className="text-sm text-gray-400">
                                  {formatDate(
                                    new Date(
                                      new Date(trip.departureDate).getTime() - (14 * 24 * 60 * 60 * 1000)
                                    )
                                  )}
                                  {' '} - {' '}
                                  {formatDate(
                                    new Date(
                                      new Date(trip.departureDate).getTime() - (11 * 24 * 60 * 60 * 1000)
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CalendarDays className={`${colors.text} mr-3 h-4 w-4`} />
                              <div>
                                <p className="font-medium">Departure Date</p>
                                <p className="text-sm text-gray-400">{formatDate(trip.departureDate)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CalendarDays className={`${colors.text} mr-3 h-4 w-4`} />
                              <div>
                                <p className="font-medium">Return Date</p>
                                <p className="text-sm text-gray-400">{formatDate(trip.returnDate)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Itinerary Tab */}
                <TabsContent value="itinerary">
                  <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                    <CardContent className="p-6">
                      <h2 className="font-orbitron text-xl font-bold mb-6">Journey Itinerary</h2>
                      
                      <div className="space-y-8">
                        {/* Day 1 */}
                        <div className="relative pl-8 pb-8 border-l border-gray-800">
                          <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center -translate-x-3`}>
                            <span className="text-xs font-bold">1</span>
                          </div>
                          <div>
                            <h3 className="font-orbitron font-bold mb-1">Day 1: Launch Day</h3>
                            <div className="text-sm text-gray-400 mb-3">{formatDate(trip.departureDate)}</div>
                            <div className="bg-[#0A192F] p-4 rounded-lg space-y-3">
                              <div>
                                <p className="text-sm"><span className="text-gray-500">06:00 AM</span> - Arrival at Dubai Spaceport</p>
                                <p className="text-xs text-gray-500">Final pre-flight checks and suit-up procedures</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">09:00 AM</span> - Launch Briefing</p>
                                <p className="text-xs text-gray-500">Safety briefing and final preparations</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">11:00 AM</span> - Boarding</p>
                                <p className="text-xs text-gray-500">Board spacecraft and prepare for launch</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">12:00 PM</span> - Launch</p>
                                <p className="text-xs text-gray-500">Liftoff from Dubai Spaceport</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">12:30 PM</span> - Acceleration Phase</p>
                                <p className="text-xs text-gray-500">Experience up to 3G during ascent</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">01:00 PM</span> - Zero-G Adaptation</p>
                                <p className="text-xs text-gray-500">First experience of weightlessness</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">07:00 PM</span> - Dinner in Space</p>
                                <p className="text-xs text-gray-500">First meal in zero gravity</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Day 2 */}
                        <div className="relative pl-8 pb-8 border-l border-gray-800">
                          <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center -translate-x-3`}>
                            <span className="text-xs font-bold">2</span>
                          </div>
                          <div>
                            <h3 className="font-orbitron font-bold mb-1">Day 2: Transfer Journey</h3>
                            <div className="text-sm text-gray-400 mb-3">
                              {formatDate(
                                new Date(
                                  new Date(trip.departureDate).getTime() + (1 * 24 * 60 * 60 * 1000)
                                )
                              )}
                            </div>
                            <div className="bg-[#0A192F] p-4 rounded-lg space-y-3">
                              <div>
                                <p className="text-sm"><span className="text-gray-500">08:00 AM</span> - Morning Briefing</p>
                                <p className="text-xs text-gray-500">Daily schedule and health check</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">09:30 AM</span> - Space Photography Session</p>
                                <p className="text-xs text-gray-500">Learn to capture stunning images of Earth from space</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">12:00 PM</span> - Space Lunch</p>
                                <p className="text-xs text-gray-500">Experience molecular gastronomy in zero-G</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">02:00 PM</span> - Scientific Experiments</p>
                                <p className="text-xs text-gray-500">Participate in ongoing research projects</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">04:00 PM</span> - Spacecraft Navigation Tutorial</p>
                                <p className="text-xs text-gray-500">Learn about the navigation systems</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrival Day */}
                        <div className="relative pl-8 pb-8 border-l border-gray-800">
                          <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center -translate-x-3`}>
                            <span className="text-xs font-bold">3</span>
                          </div>
                          <div>
                            <h3 className="font-orbitron font-bold mb-1">Day 3: Arrival at Destination</h3>
                            <div className="text-sm text-gray-400 mb-3">
                              {formatDate(
                                new Date(
                                  new Date(trip.departureDate).getTime() + (2 * 24 * 60 * 60 * 1000)
                                )
                              )}
                            </div>
                            <div className="bg-[#0A192F] p-4 rounded-lg space-y-3">
                              <div>
                                <p className="text-sm"><span className="text-gray-500">07:00 AM</span> - Approach Procedures</p>
                                <p className="text-xs text-gray-500">Prepare for docking/landing at destination</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">09:00 AM</span> - Arrival at {destination?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {destination?.type === 'ORBITAL' 
                                    ? 'Docking procedures with the space station' 
                                    : destination?.type === 'LUNAR' 
                                      ? 'Lunar landing and touchdown' 
                                      : 'Mars landing and habitat entry'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">11:00 AM</span> - Orientation & Welcome</p>
                                <p className="text-xs text-gray-500">Introduction to {accommodation?.name}</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">01:00 PM</span> - Accommodation Check-in</p>
                                <p className="text-xs text-gray-500">Room assignment and settling in</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">03:00 PM</span> - Tour of Facilities</p>
                                <p className="text-xs text-gray-500">Explore your home for the next days</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">07:00 PM</span> - Welcome Dinner</p>
                                <p className="text-xs text-gray-500">Celebratory first meal at destination</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Final day */}
                        <div className="relative pl-8">
                          <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center -translate-x-3`}>
                            <span className="text-xs font-bold">{getTripDuration()}</span>
                          </div>
                          <div>
                            <h3 className="font-orbitron font-bold mb-1">Day {getTripDuration()}: Return to Earth</h3>
                            <div className="text-sm text-gray-400 mb-3">{formatDate(trip.returnDate)}</div>
                            <div className="bg-[#0A192F] p-4 rounded-lg space-y-3">
                              <div>
                                <p className="text-sm"><span className="text-gray-500">06:00 AM</span> - Departure Preparations</p>
                                <p className="text-xs text-gray-500">Final packing and preparation for return journey</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">08:00 AM</span> - Departure Briefing</p>
                                <p className="text-xs text-gray-500">Safety procedures for return journey</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">10:00 AM</span> - Launch from {destination?.name}</p>
                                <p className="text-xs text-gray-500">Begin return journey to Earth</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">05:00 PM</span> - Re-entry Preparations</p>
                                <p className="text-xs text-gray-500">Prepare for atmospheric re-entry</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">06:00 PM</span> - Earth Re-entry</p>
                                <p className="text-xs text-gray-500">Experience re-entry G-forces</p>
                              </div>
                              <div>
                                <p className="text-sm"><span className="text-gray-500">07:00 PM</span> - Landing at Dubai Spaceport</p>
                                <p className="text-xs text-gray-500">Welcome back to Earth ceremony</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-[#0A192F]/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">
                          <strong>Note:</strong> This is a simplified itinerary. A detailed day-by-day schedule 
                          will be provided 30 days before departure. Activities may be adjusted based on 
                          cosmic conditions and operational requirements.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Accommodation Tab */}
                <TabsContent value="accommodation">
                  <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <div className="rounded-lg overflow-hidden h-48 md:h-full">
                            {accommodation && (
                              <img 
                                src={accommodation.imageUrl} 
                                alt={accommodation.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <h2 className="font-orbitron text-xl font-bold mb-2">{accommodation?.name}</h2>
                          <div className="flex mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`${colors.text} h-4 w-4`} 
                                fill="currentColor"
                              />
                            ))}
                          </div>
                          
                          <p className="text-gray-300 mb-6">{accommodation?.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center">
                              <Users className={`${colors.text} mr-2 h-4 w-4`} />
                              <span className="text-sm text-gray-300">Capacity: {accommodation?.capacity} guests</span>
                            </div>
                            <div className="flex items-center">
                              <Building className={`${colors.text} mr-2 h-4 w-4`} />
                              <span className="text-sm text-gray-300">{accommodation?.size} sq meters</span>
                            </div>
                            
                            {(accommodation?.amenities as string[])?.map((amenity, index) => (
                              <div key={index} className="flex items-center">
                                <Star className={`${colors.text} mr-2 h-4 w-4`} />
                                <span className="text-sm text-gray-300">{amenity}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-[#0A192F] p-4 rounded-lg mb-4">
                            <h3 className="font-orbitron font-bold mb-2">Accommodation Features</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <Star className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>
                                  {destination?.type === 'ORBITAL'
                                    ? 'Panoramic Earth observation windows with spectacular views of our home planet'
                                    : destination?.type === 'LUNAR'
                                      ? 'Lunar surface views with Earth-rise observation lounge'
                                      : 'Pressurized habitat with radiation shielding and Martian landscape views'
                                  }
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Star className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>Advanced life support systems with 24/7 monitoring and safety features</span>
                              </li>
                              <li className="flex items-start">
                                <Star className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>
                                  {travelClass?.name === 'Cosmonaut Class'
                                    ? 'Comfortable shared quarters with privacy partitions'
                                    : travelClass?.name === 'Astronaut Class'
                                      ? 'Premium private cabin with adjustable lighting and climate control'
                                      : 'Luxury suite with separate sleeping and living areas'
                                  }
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Star className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>
                                  {travelClass?.name === 'Pioneer Class'
                                    ? 'Personal entertainment system with immersive space education content'
                                    : 'Shared leisure and entertainment facilities'
                                  }
                                </span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#0A192F] p-4 rounded-lg">
                            <h3 className="font-orbitron font-bold mb-2">Important Information</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <AlertCircle className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>Daily housekeeping services are provided with specialized space cleaning protocols</span>
                              </li>
                              <li className="flex items-start">
                                <AlertCircle className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>All rooms are equipped with emergency oxygen supply and communication systems</span>
                              </li>
                              <li className="flex items-start">
                                <AlertCircle className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0 mt-0.5`} />
                                <span>Water is recycled in a closed-loop system; please use resources mindfully</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Experiences Tab */}
                <TabsContent value="experiences">
                  <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                    <CardContent className="p-6">
                      <h2 className="font-orbitron text-xl font-bold mb-6">Booked Experiences</h2>
                      
                      {bookedExperiences.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {bookedExperiences.map(experience => (
                            <div key={experience.id} className="bg-[#0A192F] rounded-lg overflow-hidden">
                              <div className="h-40 relative">
                                <img 
                                  src={experience.imageUrl} 
                                  alt={experience.name} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent"></div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-orbitron font-bold mb-2">{experience.name}</h3>
                                <p className="text-gray-400 text-sm mb-3">{experience.description}</p>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <Timer className="text-[#00D1FF] mr-2 h-4 w-4" />
                                    <span className="text-sm text-gray-300">
                                      {experience.duration < 60 
                                        ? `${experience.duration} minutes` 
                                        : experience.duration === 60 
                                          ? '1 hour' 
                                          : experience.duration < 480 
                                            ? `${experience.duration / 60} hours` 
                                            : 'Full day'}
                                    </span>
                                  </div>
                                  <span className="text-[#00D1FF] font-mono">${experience.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-[#0A192F] p-6 rounded-lg text-center mb-6">
                          <Sparkles className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                          <h3 className="font-orbitron text-lg font-bold mb-2">No Experiences Booked</h3>
                          <p className="text-gray-400 mb-4">
                            You haven't booked any extra experiences for this journey.
                          </p>
                          <Button 
                            variant="outline" 
                            className="border-[#00D1FF] text-[#00D1FF]"
                            onClick={() => navigate('/booking?destination=' + trip.destinationId)}
                          >
                            Browse Available Experiences
                          </Button>
                        </div>
                      )}
                      
                      <h3 className="font-orbitron text-lg font-bold mb-4">Included Activities</h3>
                      
                      <div className="bg-[#0A192F] p-4 rounded-lg">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Sparkles className="text-[#00D1FF] mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">
                                {destination?.type === 'ORBITAL' 
                                  ? 'Earth Observation Session' 
                                  : destination?.type === 'LUNAR' 
                                    ? 'Lunar Surface Walk' 
                                    : 'Mars Surface Exploration'}
                              </p>
                              <p className="text-sm text-gray-400">
                                {destination?.type === 'ORBITAL' 
                                  ? 'Guided viewing of Earth from the cupola with expert commentary' 
                                  : destination?.type === 'LUNAR' 
                                    ? 'Walk on the lunar surface with experienced guides' 
                                    : 'Explore the Martian landscape with scientific guides'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Sparkles className="text-[#00D1FF] mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Scientific Mission Participation</p>
                              <p className="text-sm text-gray-400">
                                Assist researchers with ongoing experiments relevant to your destination
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Sparkles className="text-[#00D1FF] mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">
                                {travelClass?.name === 'Astronaut Class' || travelClass?.name === 'Pioneer Class' 
                                  ? 'Private Photography Session' 
                                  : 'Group Photography Session'}
                              </p>
                              <p className="text-sm text-gray-400">
                                {travelClass?.name === 'Astronaut Class' || travelClass?.name === 'Pioneer Class' 
                                  ? 'Personalized session with professional space photographer' 
                                  : 'Guided photography opportunities with shared equipment'}
                              </p>
                            </div>
                          </div>
                          
                          {(travelClass?.name === 'Astronaut Class' || travelClass?.name === 'Pioneer Class') && (
                            <div className="flex items-start">
                              <Sparkles className="text-[#00D1FF] mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium">Exclusive EVA Experience</p>
                                <p className="text-sm text-gray-400">
                                  Guided spacewalk outside the spacecraft or habitat
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {travelClass?.name === 'Pioneer Class' && (
                            <div className="flex items-start">
                              <Sparkles className="text-[#00D1FF] mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium">Private Exploration Mission</p>
                                <p className="text-sm text-gray-400">
                                  Personalized mission with dedicated guide and custom itinerary
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Countdown and summary */}
            <div>
              {/* Countdown card */}
              <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="font-orbitron text-xl text-center">Countdown to Launch</CardTitle>
                  <CardDescription className="text-center">
                    Your journey begins soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#0A192F] rounded-lg p-4 text-center">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div>
                        <div className="font-orbitron text-2xl font-bold">{countdown.days}</div>
                        <div className="text-xs text-gray-500">DAYS</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-2xl font-bold">{countdown.hours.toString().padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500">HOURS</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-2xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500">MINS</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-2xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500">SECS</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <Progress value={countdown.percent} className="h-2 bg-[#0A192F]" />
                    </div>
                    <div className="text-xs text-gray-500">
                      Launching from Dubai
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <Rocket className="text-[#00D1FF] mr-3 h-5 w-5" />
                      <div>
                        <p className="font-medium">Launch Date</p>
                        <p className="text-sm text-gray-400">{formatDate(trip.departureDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Hotel className="text-[#00D1FF] mr-3 h-5 w-5" />
                      <div>
                        <p className="font-medium">Accommodation</p>
                        <p className="text-sm text-gray-400">{accommodation?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="text-[#00D1FF] mr-3 h-5 w-5" />
                      <div>
                        <p className="font-medium">Travel Class</p>
                        <p className="text-sm text-gray-400">{travelClass?.name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Trip summary card */}
              <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                <CardHeader>
                  <CardTitle className="font-orbitron text-xl">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Base Journey Price</span>
                      <span>
                        ${((destination?.basePrice || 0) * 
                          (travelClass?.priceMultiplier || 100) / 100).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accommodation</span>
                      <span>
                        ${((accommodation?.pricePerNight || 0) * 
                          Math.max((getTripDuration() - 2), 1)).toLocaleString()}
                      </span>
                    </div>
                    
                    {bookedExperiences.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Experiences ({bookedExperiences.length})</span>
                        <span>
                          ${bookedExperiences.reduce((sum, exp) => sum + exp.price, 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <Separator className="my-2 bg-gray-800" />
                    
                    <div className="flex justify-between font-orbitron font-bold">
                      <span>TOTAL</span>
                      <span className="text-[#00D1FF]">${trip.totalPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4">
                      <Button className={`w-full ${colors.bg}`}>
                        Download Journey Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Need help? */}
              <Card className="bg-[#121212] border-gray-800 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-orbitron font-bold mb-3">Need Help?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Our space concierge team is available 24/7 to assist with any questions about your journey.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="text-[#00D1FF] mr-2 h-4 w-4" />
                      <span className="text-sm">support@celestialvoyages.ae</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="text-[#00D1FF] mr-2 h-4 w-4" />
                      <span className="text-sm">+971 4 123 4567</span>
                    </div>
                  </div>
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

export default TripDetails;
