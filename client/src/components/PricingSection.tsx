import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Destination, TravelClass } from '@shared/schema';
import { Link } from 'wouter';

const PricingSection = () => {
  const { data: destinations, isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  const { data: travelClasses, isLoading: classesLoading } = useQuery<TravelClass[]>({
    queryKey: ['/api/travel-classes'],
  });
  
  const isLoading = destinationsLoading || classesLoading;
  
  // Filter to get ISS, Moon, and Mars destinations
  const iss = destinations?.find(d => d.type === 'ORBITAL');
  const moon = destinations?.find(d => d.type === 'LUNAR');
  const mars = destinations?.find(d => d.type === 'PLANETARY');
  
  // Get travel classes
  const cosmonaut = travelClasses?.find(tc => tc.name === 'Cosmonaut Class');
  const astronaut = travelClasses?.find(tc => tc.name === 'Astronaut Class');
  const pioneer = travelClasses?.find(tc => tc.name === 'Pioneer Class');

  return (
    <section id="pricing" className="bg-[#0A192F] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">PRICE COMPARISON</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Find the perfect space adventure package that suits your preferences and budget.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#121212] rounded-xl overflow-hidden">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-[#0A192F] text-left font-orbitron text-sm text-gray-300 uppercase tracking-wider">Package Features</th>
                <th className="py-4 px-6 bg-[#0A192F] text-center font-orbitron text-sm text-[#00D1FF] uppercase tracking-wider">ISS Experience</th>
                <th className="py-4 px-6 bg-[#0A192F] text-center font-orbitron text-sm text-[#D0D0D0] uppercase tracking-wider">Lunar Expedition</th>
                <th className="py-4 px-6 bg-[#0A192F] text-center font-orbitron text-sm text-[#E4572E] uppercase tracking-wider">Mars Colony Tour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {/* Journey Duration */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Journey Duration</td>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <td key={i} className="py-4 px-6 text-center">
                      <Skeleton className="h-6 w-20 mx-auto" />
                    </td>
                  ))
                ) : (
                  <>
                    <td className="py-4 px-6 text-center text-[#00D1FF]">{iss?.duration} days</td>
                    <td className="py-4 px-6 text-center text-[#D0D0D0]">{moon?.duration} days</td>
                    <td className="py-4 px-6 text-center text-[#E4572E]">{mars?.duration} days</td>
                  </>
                )}
              </tr>
              
              {/* Distance from Earth */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Distance from Earth</td>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <td key={i} className="py-4 px-6 text-center">
                      <Skeleton className="h-6 w-24 mx-auto" />
                    </td>
                  ))
                ) : (
                  <>
                    <td className="py-4 px-6 text-center text-gray-400">{iss?.distance} km</td>
                    <td className="py-4 px-6 text-center text-gray-400">{moon?.distance.toLocaleString()} km</td>
                    <td className="py-4 px-6 text-center text-gray-400">{(mars?.distance / 1000000).toFixed(0)} million km</td>
                  </>
                )}
              </tr>
              
              {/* Cosmonaut Class Price */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Cosmonaut Class Price</td>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <td key={i} className="py-4 px-6 text-center">
                      <Skeleton className="h-6 w-24 mx-auto" />
                    </td>
                  ))
                ) : (
                  <>
                    <td className="py-4 px-6 text-center text-gray-400">${iss?.basePrice.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-400">${moon?.basePrice.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-400">${mars?.basePrice.toLocaleString()}</td>
                  </>
                )}
              </tr>
              
              {/* Astronaut Class Price */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Astronaut Class Price</td>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <td key={i} className="py-4 px-6 text-center">
                      <Skeleton className="h-6 w-24 mx-auto" />
                    </td>
                  ))
                ) : (
                  <>
                    <td className="py-4 px-6 text-center text-gray-400">${(iss!.basePrice * 1.5).toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-400">${(moon!.basePrice * 1.5).toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-400">${(mars!.basePrice * 1.5).toLocaleString()}</td>
                  </>
                )}
              </tr>
              
              {/* Pioneer Class Price */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Pioneer Class Price</td>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <td key={i} className="py-4 px-6 text-center">
                      <Skeleton className="h-6 w-24 mx-auto" />
                    </td>
                  ))
                ) : (
                  <>
                    <td className="py-4 px-6 text-center text-gray-400">${(iss!.basePrice * 2.5).toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-400">${(moon!.basePrice * 2.5).toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-400">${(mars!.basePrice * 2.5).toLocaleString()}</td>
                  </>
                )}
              </tr>
              
              {/* Accommodation Options */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Accommodation Options</td>
                <td className="py-4 px-6 text-center text-gray-400">Aurora Orbital Hotel</td>
                <td className="py-4 px-6 text-center text-gray-400">Tranquility Lunar Base</td>
                <td className="py-4 px-6 text-center text-gray-400">Olympus Mars Habitat</td>
              </tr>
              
              {/* Premium Experiences Included */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Premium Experiences Included</td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
              </tr>
              
              {/* Space Walk Opportunity */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Space Walk Opportunity</td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
              </tr>
              
              {/* Surface Exploration */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Surface Exploration</td>
                <td className="py-4 px-6 text-center">
                  <X className="mx-auto text-red-500 h-5 w-5" />
                  <span className="sr-only">Not Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
              </tr>
              
              {/* Scientific Participation */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Scientific Participation</td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="mx-auto text-green-500 h-5 w-5" />
                  <span className="sr-only">Included</span>
                </td>
              </tr>
              
              {/* Launch Site */}
              <tr>
                <td className="py-4 px-6 text-sm text-gray-300 font-medium">Launch Site</td>
                <td className="py-4 px-6 text-center text-gray-400">Dubai Spaceport</td>
                <td className="py-4 px-6 text-center text-gray-400">Dubai Spaceport</td>
                <td className="py-4 px-6 text-center text-gray-400">Dubai Spaceport</td>
              </tr>
              
              {/* Button Row */}
              <tr>
                <td className="py-6 px-6"></td>
                <td className="py-6 px-6 text-center">
                  <Link href={`/booking?destination=${iss?.id}`}>
                    <Button className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors">
                      SELECT PACKAGE
                    </Button>
                  </Link>
                </td>
                <td className="py-6 px-6 text-center">
                  <Link href={`/booking?destination=${moon?.id}`}>
                    <Button className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#D0D0D0] text-[#0A192F] hover:bg-opacity-80 transition-colors">
                      SELECT PACKAGE
                    </Button>
                  </Link>
                </td>
                <td className="py-6 px-6 text-center">
                  <Link href={`/booking?destination=${mars?.id}`}>
                    <Button className="w-full px-4 py-2 rounded-md font-orbitron text-sm font-medium bg-[#E4572E] text-white hover:bg-opacity-80 transition-colors">
                      SELECT PACKAGE
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
