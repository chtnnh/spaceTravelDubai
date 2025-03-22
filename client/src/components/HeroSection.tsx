import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import StarBg from './ui/star-bg';

const calculateTimeLeft = () => {
  // Set launch date to 14 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 14);
  launchDate.setHours(launchDate.getHours() + 6);
  launchDate.setMinutes(launchDate.getMinutes() + 23);
  launchDate.setSeconds(launchDate.getSeconds() + 41);
  
  const difference = launchDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: '00', minutes: '00', seconds: '00' };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
  const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
  
  return { days, hours, minutes, seconds };
};

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <StarBg className="min-h-screen flex items-center justify-center">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
          SPACE TOURISM FROM <span className="text-[#00D1FF]">DUBAI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Experience the final frontier with luxury space journeys to the ISS, Moon, and Mars
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button 
            onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 rounded-md font-orbitron text-lg font-medium bg-[#00D1FF] text-white hover:bg-opacity-80 transition-colors"
          >
            EXPLORE DESTINATIONS
          </button>
          <Link href="/booking">
            <button className="px-8 py-3 rounded-md font-orbitron text-lg font-medium border border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF] hover:text-white transition-colors">
              BOOK YOUR JOURNEY
            </button>
          </Link>
        </div>
        
        <div className="mt-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-black bg-opacity-50 border border-[#00D1FF]">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <p className="font-mono text-[#00D1FF]">
              Next launch in <span className="font-bold">{timeLeft.days} days {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
            </p>
          </div>
        </div>
      </div>
    </StarBg>
  );
};

export default HeroSection;
