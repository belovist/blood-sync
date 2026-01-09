import { useState } from 'react';
import { X, User, Building2, Hospital, ArrowRight } from 'lucide-react';

type StepType = 'patient' | 'blood-bank' | 'hospital' | null;

export function HowItWorks() {
  const [selectedStep, setSelectedStep] = useState<StepType>(null);

  return (
    <section id="how-it-works" className="relative px-10 py-32">
      <h2 className="text-white text-[60px] text-center mb-20 tracking-tight">
        How It Works
      </h2>

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4">
        <StepCard
          type="patient"
          icon={<User className="w-12 h-12" />}
          title="PATIENT"
          description="Find nearby blood instantly using location-based search or raise an emergency SOS to get help when time is critical."
          onClick={() => setSelectedStep('patient')}
        />
        
        <ArrowDivider />
        
        <StepCard
          type="blood-bank"
          icon={<Building2 className="w-12 h-12" />}
          title="BLOOD BANK"
          description="Manage blood inventory, update availability live, and respond faster to hospital and patient requests."
          onClick={() => setSelectedStep('blood-bank')}
        />
        
        <ArrowDivider />
        
        <StepCard
          type="hospital"
          icon={<Hospital className="w-12 h-12" />}
          title="HOSPITAL"
          description="Request blood in real time, activate Emergency Priority Mode, and track donor responses on a live dashboard."
          onClick={() => setSelectedStep('hospital')}
        />
      </div>

      {/* Modal */}
      {selectedStep && (
        <StepModal
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </section>
  );
}

interface StepCardProps {
  type: StepType;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function StepCard({ icon, title, description, onClick }: StepCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-[#6e0b0b] rounded-lg p-6 w-[280px] h-[280px] flex flex-col items-start transition-all duration-300 hover:bg-[#930101] hover:shadow-2xl hover:shadow-red-900/50 hover:scale-105 active:scale-95 text-left"
    >
      <div className="text-white mb-4 transition-transform group-hover:scale-110">
        {icon}
      </div>
      
      <h3 className="text-white text-[24px] font-semibold mb-4 leading-tight">
        {title}
      </h3>
      
      <p className="text-[#d2c5c5] text-[16px] leading-tight flex-1">
        {description}
      </p>

      <div className="mt-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Click to learn more →
      </div>
    </button>
  );
}

function ArrowDivider() {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <ArrowRight className="w-6 h-6 text-[#606060]" />
    </div>
  );
}

interface StepModalProps {
  step: StepType;
  onClose: () => void;
}

function StepModal({ step, onClose }: StepModalProps) {
  const content = {
    patient: {
      title: 'Patient Workflow',
      icon: <User className="w-16 h-16" />,
      steps: [
        'Sign up and create your profile with blood type and medical history',
        'Use location-based search to find nearby blood banks and donors',
        'Submit a blood request with urgency level (Normal, Urgent, Critical)',
        'Activate Emergency Priority Mode for life-threatening situations',
        'Track request status in real-time on your dashboard',
        'Receive instant notifications when blood is located',
        'Coordinate pickup or delivery with hospital',
        'Confirm receipt and provide feedback'
      ]
    },
    'blood-bank': {
      title: 'Blood Bank Workflow',
      icon: <Building2 className="w-16 h-16" />,
      steps: [
        'Register your blood bank and verify credentials',
        'Set up inventory management system with all blood types',
        'Update blood availability in real-time as stock changes',
        'Receive incoming requests from hospitals and patients',
        'Verify blood type matching and availability',
        'Respond to requests with confirmation or alternatives',
        'Track outgoing blood units and maintain records',
        'Generate reports and analytics on donation patterns'
      ]
    },
    hospital: {
      title: 'Hospital Workflow',
      icon: <Hospital className="w-16 h-16" />,
      steps: [
        'Register hospital and create institutional account',
        'Add authorized staff members to the platform',
        'Create blood request with patient details and urgency',
        'Activate Emergency Priority Mode for critical cases',
        'Review available blood banks and donors in vicinity',
        'Send requests to multiple sources simultaneously',
        'Track all responses on centralized dashboard',
        'Confirm transfusion and close request with outcome'
      ]
    }
  };

  const data = content[step as keyof typeof content];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a0505] border border-[#6e0b0b] rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#6e0b0b] p-8 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="text-white">
              {data.icon}
            </div>
            <h3 className="text-white text-4xl font-semibold">
              {data.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors p-2 hover:bg-black/20 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {data.steps.map((stepText, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="bg-[#6e0b0b] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-xl font-bold">
                {index + 1}
              </div>
              <p className="text-[#d2c5c5] text-xl leading-relaxed pt-2">
                {stepText}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-[#6e0b0b]">
          <button
            onClick={onClose}
            className="w-full bg-[#6e0b0b] hover:bg-[#930101] text-white py-4 rounded-lg text-xl font-semibold transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}