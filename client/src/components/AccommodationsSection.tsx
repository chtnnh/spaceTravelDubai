import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star, Users, Square, Wifi, Utensils, Globe, Car, Sprout, Mountain, GlassWater, Route } from 'lucide-react';
import { Accommodation } from '@shared/schema';
import StarBg from './ui/star-bg';
import { Link } from 'wouter';

const AccommodationCard = ({ accommodation }: { accommodation: Accommodation }) => {
  const { id, name, description, destinationId, imageUrl, capacity, size, pricePerNight, amenities } = accommodation;
  
  // Determine colors based on destinationId
  let starColor;
  let buttonColor;
  let textColor = 'text-white';
  
  if (destinationId === 1) { // ISS
    starColor = 'text-[#00D1FF]';
    buttonColor = 'bg-[#00D1FF]';
  } else if (destinationId === 2) { // Moon
    starColor = 'text-[#D0D0D0]';
    buttonColor = 'bg-[#D0D0D0]';
    textColor = 'text-[#0A192F]';
  } else if (destinationId === 3) { // Mars
    starColor = 'text-[#E4572E]';
    buttonColor = 'bg-[#E4572E]';
  } else {
    starColor = 'text-[#4E1184]';
    buttonColor = 'bg-[#4E1184]';
  }
  
  // Function to get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Quantum Wi-Fi':
        return <Wifi className={`${starColor} mr-2 h-4 w-4`} />;
      case 'Gourmet dining':
        return <Utensils className={`${starColor} mr-2 h-4 w-4`} />;
      case '1/6 Earth gravity':
        return <Globe className={`${starColor} mr-2 h-4 w-4`} />;
      case 'Rover access':
        return <Car className={`${starColor} mr-2 h-4 w-4`} />;
      case 'Terraformed garden':
        return <Sprout className={`${starColor} mr-2 h-4 w-4`} />;
      case 'Volcano views':
        return <Mountain className={`${starColor} mr-2 h-4 w-4`} />;
      case 'Premium bar':
        return <GlassWater className={`${starColor} mr-2 h-4 w-4`} />;
      case 'Custom itinerary':
        return <Route className={`${starColor} mr-2 h-4 w-4`} />;
      default:
        return <Star className={`${starColor} mr-2 h-4 w-4`} />;
    }
  };
  
  return (
    <div className="bg-[#0A192F] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
      <div className="md:w-2/5 relative">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A192F] md:block hidden"></div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A192F] to-transparent h-20 md:hidden"></div>
      </div>
      <div className="md:w-3/5 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-xl font-bold">{name}</h3>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`${starColor} h-4 w-4`} 
                fill={star <= 4.5 ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Users className={`${starColor} mr-2 h-4 w-4`} />
            <span className="text-sm text-gray-300">Capacity: {capacity} guests</span>
          </div>
          <div className="flex items-center">
            <Square className={`${starColor} mr-2 h-4 w-4`} />
            <span className="text-sm text-gray-300">{size} sq meters</span>
          </div>
          {(amenities as string[]).map((amenity, index) => (
            <div key={index} className="flex items-center">
              {getAmenityIcon(amenity)}
              <span className="text-sm text-gray-300">{amenity}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div>
            <span className="block text-sm text-gray-400">Per night</span>
            <span className="font-orbitron text-xl font-bold">${pricePerNight.toLocaleString()}</span>
          </div>
          <Link href={`/booking?accommodation=${id}`}>
            <Button className={`px-6 py-2 rounded-md font-orbitron text-sm font-medium ${buttonColor} ${textColor} hover:bg-opacity-80 transition-colors`}>
              BOOK STAY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AccommodationCardSkeleton = () => (
  <div className="bg-[#0A192F] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
    <div className="md:w-2/5 relative">
      <Skeleton className="h-full min-h-[16rem] w-full" />
    </div>
    <div className="md:w-3/5 p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
      </div>
      <Skeleton className="h-20 w-full mb-6" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <div className="mt-auto flex justify-between items-center">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  </div>
);

const AccommodationsSection = () => {
  const { data: accommodations, isLoading, error } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations'],
  });

  return (
    <StarBg className="py-20">
      <div id="accommodations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">LUXURY SPACE ACCOMMODATIONS</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Choose from our selection of premium space stations and planetary habitats for your cosmic stay.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-12">
          {isLoading ? (
            // Skeleton loading state
            Array(4).fill(0).map((_, index) => (
              <AccommodationCardSkeleton key={index} />
            ))
          ) : error ? (
            // Error state
            <div className="text-center p-8 bg-[#0A192F] bg-opacity-80 backdrop-blur-lg rounded-xl">
              <p className="text-red-500 mb-4">Error loading accommodations</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            // Accommodation cards
            accommodations?.map(accommodation => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))
          )}
        </div>
      </div>
    </StarBg>
  );
};

export default AccommodationsSection;
