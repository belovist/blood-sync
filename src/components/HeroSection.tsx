import { UserRole } from '../App';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import imgDNA from "figma:asset/1602eaed3cc656a525c9fe839d09ef39bbf834cc.png";

interface HeroSectionProps {
  onRoleSelect: (role: UserRole) => void;
}

export function HeroSection({ onRoleSelect }: HeroSectionProps) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-10 py-32 overflow-hidden">
      {/* DNA Helix Background */}
      <div className="absolute left-0 top-0 w-[515px] h-[945px] opacity-40 pointer-events-none">
        <img
          alt="DNA Helix"
          className="w-full h-full object-cover"
          src={imgDNA}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl">
        <h1 className="text-[100px] leading-none mb-4">
          <span className="text-[#c90000] font-light">WELCOME to </span>
        </h1>
        <h1 className="text-[130px] leading-none font-bold tracking-wide mb-6">
          <span className="text-white">BLOOD</span>
          <span className="text-[#7c0a0a]"> SYNC</span>
        </h1>
        <p className="text-[#cfa9a9] text-[35px] mb-16 tracking-wide">
          It starts with a single drop
        </p>

        {/* CTA Buttons - Only show on scroll */}
        <div className={`flex gap-8 justify-center items-center transition-all duration-500 ${
          showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
        </div>
      </div>
    </section>
  );
}

interface RoleButtonProps {
  label: string;
  onClick: () => void;
}

function RoleButton({ label, onClick }: RoleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-[#6e0b0b] hover:bg-[#930101] text-white px-6 py-6 rounded flex items-center gap-4 min-w-[240px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/50 hover:scale-105 active:scale-95"
    >
      <span className="text-2xl font-['ADLaM_Display'] flex-1 text-center">
        {label}
      </span>
      <div className="rotate-90 transition-transform group-hover:translate-x-1">
        <ChevronRight className="w-5 h-5" />
      </div>
    </button>
  );
}