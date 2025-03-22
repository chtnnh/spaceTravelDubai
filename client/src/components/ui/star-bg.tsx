import React from 'react';

interface StarBgProps {
  children: React.ReactNode;
  className?: string;
}

const StarBg = ({ children, className = "" }: StarBgProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{
      background: '#0A192F',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(78, 17, 132, 0.15) 0%, transparent 25%),
        radial-gradient(circle at 80% 60%, rgba(0, 209, 255, 0.1) 0%, transparent 20%)
      `,
    }}>
      {/* Stars background - pseudo element created with CSS */}
      <div className="absolute inset-0 opacity-30" style={{
        transform: 'scale(2)',
        backgroundImage: `
          radial-gradient(2px 2px at 40px 60px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 100px 150px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1.5px 1.5px at 170px 80px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 250px 230px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1.5px 1.5px at 300px 100px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 400px 200px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 500px 150px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 50px 250px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1.5px 1.5px at 600px 220px, #ffffff, rgba(0,0,0,0))
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px 650px',
        animation: 'starsAnimation 200s linear infinite',
      }} />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A192F] to-transparent"></div>

      {/* CSS Animation for stars */}
      <style>{`
        @keyframes starsAnimation {
          0% {transform: rotate(0deg);}
          100% {transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default StarBg;
