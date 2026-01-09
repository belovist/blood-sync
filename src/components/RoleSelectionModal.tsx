import { X, User, Building2, Hospital, ArrowRight } from 'lucide-react';
import { UserRole } from '../App';

interface RoleSelectionModalProps {
  onSelectRole: (role: UserRole) => void;
  onClose: () => void;
}

export function RoleSelectionModal({ onSelectRole, onClose }: RoleSelectionModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="ml-auto mb-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Role Cards */}
        <div className="space-y-4">
          <RoleCard
            icon={<User className="w-8 h-8" />}
            title="Continue as Donor"
            subtitle="Register as a donor and help save lives!"
            onClick={() => onSelectRole('donor')}
          />
          
          <RoleCard
            icon={<Building2 className="w-8 h-8" />}
            title="Continue as Blood Bank"
            subtitle="Manage inventory and coordinate with hospitals"
            onClick={() => onSelectRole('blood-bank')}
          />
          
          <RoleCard
            icon={<Hospital className="w-8 h-8" />}
            title="Continue as Hospital"
            subtitle="Connect directly with donors to get the blood your patients need."
            onClick={() => onSelectRole('hospital')}
          />
        </div>
      </div>
    </div>
  );
}

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function RoleCard({ icon, title, subtitle, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full bg-[#171717] hover:bg-[#1f1f1f] border border-white/10 hover:border-white/20 rounded-lg p-6 flex items-center gap-5 transition-all duration-300 text-left"
    >
      {/* Icon */}
      <div className="bg-[#6e0b0b] rounded-lg p-4 flex-shrink-0">
        <div className="text-white">
          {icon}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-white text-lg mb-1">
          {title}
        </h3>
        <p className="text-[#a3a3a3] text-sm">
          {subtitle}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-white/40 group-hover:text-white/60 group-hover:translate-x-1 transition-all">
        <ArrowRight className="w-6 h-6" />
      </div>
    </button>
  );
}