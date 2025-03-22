import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Experience } from '@shared/schema';

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const { name, description, imageUrl, duration, price } = experience;
  
  // Format duration display
  let durationText;
  if (duration < 60) {
    durationText = `${duration} minutes`;
  } else if (duration === 60) {
    durationText = '1 hour';
  } else if (duration < 480) {
    durationText = `${duration / 60} hours`;
  } else {
    durationText = 'Full day';
  }
  
  return (
    <div className="group bg-[#121212] rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-56">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-3">{name}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#00D1FF] font-orbitron">${price.toLocaleString()}</span>
          <span className="text-sm text-gray-500">{durationText}</span>
        </div>
      </CardContent>
    </div>
  );
};

const ExperienceCardSkeleton = () => (
  <div className="bg-[#121212] rounded-xl overflow-hidden shadow-lg">
    <div className="h-56">
      <Skeleton className="h-full w-full" />
    </div>
    <CardContent className="p-6">
      <Skeleton className="h-8 w-3/4 mb-3" />
      <Skeleton className="h-16 w-full mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardContent>
  </div>
);

const ExperiencesSection = () => {
  const { data: experiences, isLoading, error } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
  });

  return (
    <section id="experiences" className="bg-[#0A192F] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">UNIQUE SPACE EXPERIENCES</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Enhance your journey with our curated collection of once-in-a-lifetime space activities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array(6).fill(0).map((_, index) => (
              <ExperienceCardSkeleton key={index} />
            ))
          ) : error ? (
            // Error state
            <div className="col-span-3 text-center p-8">
              <p className="text-red-500 mb-4">Error loading experiences</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            // Experience cards
            experiences?.map(experience => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/booking">
            <a className="inline-flex items-center font-orbitron text-[#00D1FF] hover:underline">
              EXPLORE ALL EXPERIENCES
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
