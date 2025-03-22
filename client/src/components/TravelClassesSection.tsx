import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, Rocket, Star, Gem } from 'lucide-react';
import { TravelClass } from '@shared/schema';
import StarBg from './ui/star-bg';
import { Link } from 'wouter';

interface ClassCardProps {
  travelClass: TravelClass;
  isPopular?: boolean;
}

const ClassCard = ({ travelClass, isPopular = false }: ClassCardProps) => {
  const { id, name, description, priceMultiplier, features } = travelClass;
  
  let icon;
  let bgColor = 'bg-[#0A192F] bg-opacity-80';
  let iconBgColor = 'bg-gray-800';
  let iconColor = 'text-[#00D1FF]';
  let buttonBgColor = 'bg-[#00D1FF] bg-opacity-20 text-[#00D1FF] border border-[#00D1FF]';
  let buttonHoverBgColor = 'hover:bg-opacity-40';
  
  if (name === 'Cosmonaut Class') {
    icon = <Rocket className="text-[#00D1FF] text-2xl" />;
  } else if (name === 'Astronaut Class') {
    icon = <Star className="text-[#00D1FF] text-2xl" />;
    iconBgColor = 'bg-[#00D1FF] bg-opacity-20';
    buttonBgColor = 'bg-[#00D1FF] text-white';
    buttonHoverBgColor = 'hover:bg-opacity-80';
  } else if (name === 'Pioneer Class') {
    icon = <Gem className="text-[#4E1184] text-2xl" />;
    iconBgColor = 'bg-[#4E1184] bg-opacity-20';
    iconColor = 'text-[#4E1184]';
    buttonBgColor = 'bg-[#4E1184] bg-opacity-20 text-[#4E1184] border border-[#4E1184]';
  }
  
  const basePrice = name === 'Cosmonaut Class' ? 58000 : name === 'Astronaut Class' ? 125000 : 350000;
  
  return (
    <div className={`
      ${bgColor} backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden 
      ${isPopular ? 'transform scale-105 shadow-xl relative z-10 border border-[#00D1FF]' : 'transition-all duration-300 hover:scale-105'}
    `}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 py-2 bg-[#00D1FF] text-center font-orbitron text-sm">
          MOST POPULAR
        </div>
      )}
      <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
        <div className={`w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-6`}>
          {icon}
        </div>
        <h3 className="font-orbitron text-xl font-bold mb-4">{name}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <ul className="mb-8 space-y-3">
          {(features as string[]).map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <span className="block font-orbitron text-2xl mb-2">
            <span className="text-sm text-gray-400">FROM</span> ${basePrice.toLocaleString()}
          </span>
          <Link href={`/booking?class=${id}`}>
            <Button className={`mt-4 w-full px-6 py-3 rounded-md font-orbitron text-sm font-medium ${buttonBgColor} ${buttonHoverBgColor} transition-colors`}>
              SELECT CLASS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ClassCardSkeleton = ({ isPopular = false }: { isPopular?: boolean }) => (
  <div className={`
    bg-[#0A192F] bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden 
    ${isPopular ? 'transform scale-105 shadow-xl relative z-10 border border-[#00D1FF]' : ''}
  `}>
    {isPopular && (
      <div className="absolute top-0 left-0 right-0 py-2 bg-[#00D1FF] text-center">
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
    )}
    <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
      <Skeleton className="w-16 h-16 rounded-full mb-6 mx-auto" />
      <Skeleton className="h-7 w-48 mb-4" />
      <Skeleton className="h-20 w-full mb-6" />
      <div className="mb-8 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-start">
            <Skeleton className="h-4 w-4 mr-3 mt-1" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <Skeleton className="h-8 w-32 mx-auto mb-2" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    </div>
  </div>
);

const TravelClassesSection = () => {
  const { data: travelClasses, isLoading, error } = useQuery<TravelClass[]>({
    queryKey: ['/api/travel-classes'],
  });

  return (
    <StarBg className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">TRAVEL CLASSES</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Experience space travel tailored to your preferences with our range of luxurious service tiers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading state
            <>
              <ClassCardSkeleton />
              <ClassCardSkeleton isPopular={true} />
              <ClassCardSkeleton />
            </>
          ) : error ? (
            // Error state
            <div className="col-span-3 text-center p-8 bg-[#0A192F] bg-opacity-80 backdrop-blur-lg rounded-xl">
              <p className="text-red-500 mb-4">Error loading travel classes</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            // Travel class cards
            travelClasses?.map((travelClass, index) => (
              <ClassCard 
                key={travelClass.id} 
                travelClass={travelClass} 
                isPopular={travelClass.name === 'Astronaut Class'}
              />
            ))
          )}
        </div>
      </div>
    </StarBg>
  );
};

export default TravelClassesSection;
