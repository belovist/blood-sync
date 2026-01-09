import { ArrowLeft, User, Building2, Hospital } from 'lucide-react';
import { UserRole } from '../App';

interface RoleSelectionProps {
  role: UserRole;
  onBack: () => void;
}

export function RoleSelection({ role, onBack }: RoleSelectionProps) {
  const content = {
    patient: {
      title: 'Patient Portal',
      icon: <User className="w-24 h-24" />,
      description: 'Access blood donation requests, track your medical history, and connect with nearby blood banks.',
      features: [
        'Request blood with urgency levels',
        'Track request status in real-time',
        'Location-based blood bank search',
        'Emergency SOS activation',
        'Medical history management',
        'Notification preferences'
      ]
    },
    'blood-bank': {
      title: 'Blood Bank Portal',
      icon: <Building2 className="w-24 h-24" />,
      description: 'Manage your blood inventory, respond to requests, and coordinate with hospitals efficiently.',
      features: [
        'Real-time inventory management',
        'Automated request matching',
        'Donor database management',
        'Analytics and reporting',
        'Multi-location support',
        'Integration with hospital systems'
      ]
    },
    hospital: {
      title: 'Hospital Portal',
      icon: <Hospital className="w-24 h-24" />,
      description: 'Submit blood requests, activate emergency protocols, and coordinate transfusions seamlessly.',
      features: [
        'Emergency Priority Mode',
        'Multi-request management',
        'Live donor tracking',
        'Staff access control',
        'Patient record integration',
        'Compliance reporting'
      ]
    }
  };

  const data = content[role as keyof typeof content];

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg">Back to Home</span>
        </button>

        {/* Portal Card */}
        <div className="bg-gradient-to-br from-[#6e0b0b] to-[#4a0707] rounded-3xl p-16 shadow-2xl border border-black/30">
          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="text-white mb-6">
              {data.icon}
            </div>
            <h1 className="text-6xl font-bold text-white mb-6">
              {data.title}
            </h1>
            <p className="text-[#d2c5c5] text-2xl max-w-2xl">
              {data.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {data.features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#930101] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-white text-lg leading-relaxed">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 justify-center">
            <button className="bg-[#930101] hover:bg-[#b01111] text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all hover:shadow-2xl hover:shadow-red-900/50 hover:scale-105 active:scale-95">
              Sign Up
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all border border-white/20 hover:border-white/40 hover:scale-105 active:scale-95">
              Learn More
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 text-center text-white/50 text-sm">
          <p>This is a demo portal. Sign up functionality would be implemented with backend integration.</p>
        </div>
      </div>
    </div>
  );
}
