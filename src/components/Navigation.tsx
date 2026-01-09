import { Moon, Languages } from 'lucide-react';
import { useState } from 'react';
import imgLogo from "figma:asset/6c97523942fe730fbd4ae098955eb28b9f9eefad.png";
import { RoleSelectionModal } from './RoleSelectionModal';
import { UserRole } from '../App';

interface NavigationProps {
  onRoleSelect?: (role: UserRole) => void;
}

export function Navigation({ onRoleSelect }: NavigationProps) {
  const [showRoleModal, setShowRoleModal] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setShowRoleModal(false);
    if (onRoleSelect) {
      onRoleSelect(role);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#6e0b0b] px-10 py-6 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative">
            <img alt="BloodSync Logo" className="w-full h-full object-contain" src={imgLogo} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-base tracking-wide">BLOOD</span>
            <span className="text-[#f00a0a] font-medium text-sm tracking-wide">SYNC</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white text-xs font-medium hover:text-[#f00a0a] transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-white text-xs font-medium hover:text-[#f00a0a] transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-white text-xs font-medium hover:text-[#f00a0a] transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-white text-xs font-medium hover:text-[#f00a0a] transition-colors"
          >
            Contact Us
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#930101] rounded-full transition-colors">
            <Moon className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 hover:bg-[#930101] rounded-full transition-colors">
            <Languages className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => setShowRoleModal(true)}
            className="bg-[#930101] text-white text-xs font-medium px-6 py-2 rounded-full hover:bg-[#b01111] transition-all hover:shadow-lg"
          >
            LOGIN
          </button>
        </div>
      </nav>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <RoleSelectionModal
          onSelectRole={handleRoleSelect}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </>
  );
}