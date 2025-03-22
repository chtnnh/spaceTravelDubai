import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Destination } from '@shared/schema';

const DestinationCard = ({ destination }: { destination: Destination }) => {
  const { id, name, description, type, imageUrl, distance, duration, basePrice } = destination;
  
  let typeColor = '';
  let badgeColor = '';
  let glowClass = '';
  
  if (type === 'ORBITAL') {
    typeColor = 'text-[#00D1FF]';
    badgeColor = 'bg-[#00D1FF]';
    glowClass = 'glow';
  } else if (type === 'LUNAR') {
    typeColor = 'text-[#D0D0D0]';
    badgeColor = 'bg-[#D0D0D0] text-[#0A192F]';
    glowClass = 'glow-moon';
  } else if (type === 'PLANETARY') {
    typeColor = 'text-[#E4572E]';
    badgeColor = 'bg-[#E4572E]';
    glowClass = 'glow-mars';
  }
  
  let distanceText = '';
  if (distance < 1000) {
    distanceText = `${distance} km altitude`;
  } else if (distance < 1000000) {
    distanceText = `${(distance / 1000).toFixed(0)}k km distance`;
  } else {
    distanceText = `${(distance / 1000000).toFixed(0)}M km distance`;
  }
  
  return (
    <Card className={`bg-[#121212] rounded-2xl overflow-hidden shadow-xl card-hover ${glowClass} border-0`}>
      <div className="relative h-60">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-2 py-1 text-xs font-orbitron ${badgeColor} rounded-md`}>
            {type}
          </span>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-2">{name}</h3>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`${star <= 4 ? typeColor : 'text-gray-600'} h-4 w-4 ${star === 5 && type === 'LUNAR' ? typeColor : ''}`}
              fill={star <= 4 ? 'currentColor' : 'none'}
            />
          ))}
          <span className="ml-2 text-sm text-gray-400">
            {type === 'ORBITAL' ? '(128 reviews)' : type === 'LUNAR' ? '(86 reviews)' : '(42 reviews)'}
          </span>
        </div>
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className={`${typeColor} font-mono`}>FROM</p>
            <p className="font-orbitron text-xl font-bold">${basePrice.toLocaleString()}</p>
          </div>
          <Link href={`/booking?destination=${id}`}>
            <Button className={`px-4 py-2 rounded-md font-orbitron text-sm font-medium ${
              type === 'ORBITAL' ? 'bg-[#00D1FF]' : 
              type === 'LUNAR' ? 'bg-[#D0D0D0] text-[#0A192F]' : 
              'bg-[#E4572E]'
            } text-white hover:bg-opacity-80 transition-colors`}>
              BOOK NOW
            </Button>
          </Link>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <Clock className={`mr-2 ${typeColor} h-4 w-4`} />
            <span>{duration} days</span>
          </div>
          <div className="flex items-center">
            <MapPin className={`mr-2 ${typeColor} h-4 w-4`} />
            <span>{distanceText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DestinationCardSkeleton = () => (
  <Card className="bg-[#121212] rounded-2xl overflow-hidden shadow-xl border-0">
    <div className="h-60 bg-gray-800">
      <Skeleton className="h-full w-full" />
    </div>
    <CardContent className="p-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <div className="flex mb-4">
        <Skeleton className="h-4 w-24 mr-2" />
      </div>
      <Skeleton className="h-20 w-full mb-6" />
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-7 w-24" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </CardContent>
  </Card>
);

const DestinationsSection = () => {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  return (
    <section id="destinations" className="bg-[#0A192F] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">CHOOSE YOUR DESTINATION</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Select from our premium range of cosmic destinations, each offering unique experiences and breathtaking views.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading state
            <>
              <DestinationCardSkeleton />
              <DestinationCardSkeleton />
              <DestinationCardSkeleton />
            </>
          ) : error ? (
            // Error state
            <div className="col-span-3 text-center p-8">
              <p className="text-red-500 mb-4">Error loading destinations</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            // Destination cards
            destinations?.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/booking">
            <a className="inline-flex items-center font-orbitron text-[#00D1FF] hover:underline">
              VIEW ALL DESTINATIONS
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
