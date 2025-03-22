import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarBg from '@/components/ui/star-bg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trip, Destination, TravelClass, Accommodation } from '@shared/schema';
import useAuth from '@/hooks/useAuth';
import { Calendar, Clock, Rocket, Bookmark, User, Settings, LogOut, ChevronRight, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/profile');
    }
  }, [user, authLoading, navigate]);

  // Fetch user trips
  const { 
    data: trips,
    isLoading: tripsLoading,
    error: tripsError
  } = useQuery<Trip[]>({
    queryKey: ['/api/trips'],
    enabled: !!user,
  });

  // Fetch destinations for displaying trip details
  const { 
    data: destinations,
    isLoading: destinationsLoading
  } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    enabled: !!user,
  });

  // Fetch travel classes
  const { 
    data: travelClasses,
    isLoading: classesLoading
  } = useQuery<TravelClass[]>({
    queryKey: ['/api/travel-classes'],
    enabled: !!user,
  });

  // Fetch accommodations
  const { 
    data: accommodations,
    isLoading: accommodationsLoading
  } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations'],
    enabled: !!user,
  });

  const isLoading = authLoading || tripsLoading || destinationsLoading || classesLoading || accommodationsLoading;

  // Helper to get destination name from ID
  const getDestinationName = (id: number) => {
    const destination = destinations?.find(d => d.id === id);
    return destination?.name || 'Unknown Destination';
  };

  // Helper to get travel class name from ID
  const getTravelClassName = (id: number) => {
    const travelClass = travelClasses?.find(tc => tc.id === id);
    return travelClass?.name || 'Unknown Class';
  };

  // Helper to get accommodation name from ID
  const getAccommodationName = (id: number) => {
    const accommodation = accommodations?.find(a => a.id === id);
    return accommodation?.name || 'Unknown Accommodation';
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user || !user.fullName) return 'U';
    return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Calculate days until departure
  const getDaysUntilDeparture = (departureDate: string) => {
    try {
      const departure = new Date(departureDate);
      const today = new Date();
      const diffTime = departure.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F]">
        <Navbar />
        <div className="py-24 flex justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <Navbar />
      
      <StarBg className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* User Profile Card */}
            <Card className="bg-[#121212] border-gray-800 shadow-xl w-full md:w-80">
              <CardHeader className="text-center pb-2">
                <Avatar className="w-24 h-24 mx-auto mb-4 bg-[#4E1184] text-white">
                  <AvatarFallback className="text-2xl font-bold">{getInitials()}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-orbitron text-xl">{user.fullName}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 pb-4 border-b border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-gray-300">{user.email}</p>
                </div>
                
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Saved Journeys</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Preferences</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content Area */}
            <div className="flex-1">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="bg-[#121212] mb-6">
                  <TabsTrigger value="upcoming" className="font-orbitron">Upcoming Trips</TabsTrigger>
                  <TabsTrigger value="past" className="font-orbitron">Past Journeys</TabsTrigger>
                  <TabsTrigger value="recommendations" className="font-orbitron">Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  <h2 className="font-orbitron text-2xl font-bold mb-6">Your Upcoming Space Journeys</h2>
                  
                  {isLoading ? (
                    // Loading state for trips
                    Array(2).fill(0).map((_, index) => (
                      <Card key={index} className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                        <CardContent className="p-6 animate-pulse">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <Skeleton className="h-8 w-3/4 mb-3" />
                              <Skeleton className="h-4 w-1/2 mb-6" />
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                            </div>
                            <div className="sm:w-1/3">
                              <Skeleton className="h-24 w-full rounded-lg mb-4" />
                              <Skeleton className="h-8 w-full rounded-md" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : trips && trips.length > 0 ? (
                    // Render trips
                    trips
                      .filter(trip => new Date(trip.departureDate) > new Date())
                      .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
                      .map(trip => {
                        // Find destination to get the color
                        const destination = destinations?.find(d => d.id === trip.destinationId);
                        let typeColor = '';
                        let bgColor = '';
                        
                        if (destination?.type === 'ORBITAL') {
                          typeColor = 'text-[#00D1FF]';
                          bgColor = 'from-[#00D1FF]/20 to-transparent';
                        } else if (destination?.type === 'LUNAR') {
                          typeColor = 'text-[#D0D0D0]';
                          bgColor = 'from-[#D0D0D0]/20 to-transparent';
                        } else if (destination?.type === 'PLANETARY') {
                          typeColor = 'text-[#E4572E]';
                          bgColor = 'from-[#E4572E]/20 to-transparent';
                        }
                        
                        // Calculate days until departure for countdown
                        const daysUntil = getDaysUntilDeparture(trip.departureDate);
                        
                        return (
                          <Card key={trip.id} className="bg-[#121212] border-gray-800 shadow-xl mb-6 overflow-hidden">
                            <div className={`h-1 bg-gradient-to-r ${bgColor}`}></div>
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row justify-between gap-6">
                                <div className="flex-1">
                                  <h3 className={`font-orbitron text-xl font-bold mb-1 ${typeColor}`}>
                                    {getDestinationName(trip.destinationId)}
                                  </h3>
                                  <p className="text-gray-400 mb-4">
                                    {getTravelClassName(trip.travelClassId)} • {getAccommodationName(trip.accommodationId)}
                                  </p>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center">
                                      <Calendar className={`${typeColor} mr-2 h-4 w-4`} />
                                      <span className="text-sm text-gray-300">Departure: {formatDate(trip.departureDate)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className={`${typeColor} mr-2 h-4 w-4`} />
                                      <span className="text-sm text-gray-300">Return: {formatDate(trip.returnDate)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className={`${typeColor} mr-2 h-4 w-4`} />
                                      <span className="text-sm text-gray-300">
                                        Duration: {Math.ceil((new Date(trip.returnDate).getTime() - new Date(trip.departureDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className={`${typeColor} mr-2 h-4 w-4`} />
                                      <span className="text-sm text-gray-300">Launch: Dubai Spaceport</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="sm:w-1/3 flex flex-col">
                                  <div className="bg-[#0A192F] rounded-lg p-4 mb-4 text-center">
                                    <p className="text-gray-400 text-sm mb-1">Countdown to Launch</p>
                                    <div className="font-orbitron text-2xl font-bold mb-1">
                                      {daysUntil} {daysUntil === 1 ? 'Day' : 'Days'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Launching from Dubai
                                    </div>
                                  </div>
                                  
                                  <Link href={`/trips/${trip.id}`}>
                                    <Button className="w-full flex items-center justify-center bg-[#00D1FF]/10 text-[#00D1FF] hover:bg-[#00D1FF]/20 border border-[#00D1FF]">
                                      <span>View Details</span>
                                      <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                  ) : (
                    // No trips message
                    <Card className="bg-[#121212] border-gray-800 shadow-xl">
                      <CardContent className="p-8 text-center">
                        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-[#0A192F] flex items-center justify-center">
                          <Rocket className="text-[#00D1FF] h-8 w-8" />
                        </div>
                        <h3 className="font-orbitron text-xl font-bold mb-2">No Upcoming Trips</h3>
                        <p className="text-gray-400 mb-6">You haven't booked any space journeys yet.</p>
                        <Button 
                          className="bg-[#00D1FF] hover:bg-[#00D1FF]/80"
                          onClick={() => navigate('/booking')}
                        >
                          Book Your First Journey
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  <h2 className="font-orbitron text-2xl font-bold mb-6">Your Past Space Journeys</h2>
                  
                  {isLoading ? (
                    // Loading state for past trips
                    <Skeleton className="h-64 w-full" />
                  ) : trips && trips.filter(trip => new Date(trip.returnDate) < new Date()).length > 0 ? (
                    // Past trips list
                    trips
                      .filter(trip => new Date(trip.returnDate) < new Date())
                      .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime())
                      .map(trip => (
                        <Card key={trip.id} className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-orbitron text-xl font-bold mb-1">
                                  {getDestinationName(trip.destinationId)}
                                </h3>
                                <p className="text-gray-400 mb-4">
                                  {getTravelClassName(trip.travelClassId)} • {formatDate(trip.departureDate)} to {formatDate(trip.returnDate)}
                                </p>
                                <p className="text-gray-300 mb-2">
                                  You stayed at {getAccommodationName(trip.accommodationId)}
                                </p>
                                {trip.bookedExperiences && (trip.bookedExperiences as any[]).length > 0 && (
                                  <p className="text-gray-400 text-sm">
                                    Experiences: {(trip.bookedExperiences as any[]).length} activities
                                  </p>
                                )}
                              </div>
                              <div>
                                <Button className="text-gray-300 bg-[#0A192F] hover:bg-[#0A192F]/80">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    // No past trips message
                    <Card className="bg-[#121212] border-gray-800 shadow-xl">
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-400 py-8">You don't have any past journeys yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <h2 className="font-orbitron text-2xl font-bold mb-6">Personalized Recommendations</h2>
                  
                  <Card className="bg-[#121212] border-gray-800 shadow-xl mb-6">
                    <CardContent className="p-6">
                      <h3 className="font-orbitron text-xl font-bold mb-4 text-[#00D1FF]">Based on your preferences</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">Extended ISS Mission</h4>
                          <p className="text-gray-400 text-sm mb-3">
                            A 14-day mission with exclusive access to research modules and extended space walks.
                          </p>
                          <Button variant="outline" className="w-full border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF]/10">
                            View Details
                          </Button>
                        </div>
                        
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">Lunar South Pole Expedition</h4>
                          <p className="text-gray-400 text-sm mb-3">
                            Explore water ice deposits in the permanently shadowed craters of the lunar south pole.
                          </p>
                          <Button variant="outline" className="w-full border-[#D0D0D0] text-[#D0D0D0] hover:bg-[#D0D0D0]/10">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#121212] border-gray-800 shadow-xl">
                    <CardContent className="p-6">
                      <h3 className="font-orbitron text-xl font-bold mb-4 text-[#E4572E]">Popular with space enthusiasts</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">Mars Habitat Construction Tour</h4>
                          <p className="text-gray-400 text-sm mb-3">
                            Join the engineering team working on expanding the Mars colony habitats.
                          </p>
                          <Button variant="outline" className="w-full border-[#E4572E] text-[#E4572E] hover:bg-[#E4572E]/10">
                            View Details
                          </Button>
                        </div>
                        
                        <div className="bg-[#0A192F] p-4 rounded-lg">
                          <h4 className="font-orbitron font-bold mb-2">Zero-G Culinary Experience</h4>
                          <p className="text-gray-400 text-sm mb-3">
                            Learn molecular gastronomy techniques designed for zero gravity environments.
                          </p>
                          <Button variant="outline" className="w-full border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF]/10">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </StarBg>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
