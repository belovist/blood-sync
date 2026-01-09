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
          icon={<User className="w-12 h-12" />}
          title="DONOR"
          description="Find nearby blood banks instantly using location based search & take preliminary evaluation for donation criteria."
          onClick={() => setSelectedStep('patient')}
        />

        <ArrowDivider />

        <StepCard
          icon={<Building2 className="w-12 h-12" />}
          title="BLOOD BANK"
          description="Manage blood inventory, update hospital requests live and carry out emergency coordination."
          onClick={() => setSelectedStep('blood-bank')}
        />

        <ArrowDivider />

        <StepCard
          icon={<Hospital className="w-12 h-12" />}
          title="HOSPITAL"
          description="Request blood in real time & activate Emergency Mode for Act of God & pandemic situations."
          onClick={() => setSelectedStep('hospital')}
        />
      </div>

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
      title: "DONOR",
      icon: <User className="w-10 h-10" />,
      description:
        "Donors can discover nearby blood banks using location-based search, check eligibility, and coordinate donations quickly during emergencies.",
    },
    "blood-bank": {
      title: "BLOOD BANK",
      icon: <Building2 className="w-10 h-10" />,
      description:
        "Blood banks manage inventory in real time, respond to hospital requests instantly, and coordinate emergency blood supply efficiently.",
    },
    hospital: {
      title: "HOSPITAL",
      icon: <Hospital className="w-10 h-10" />,
      description:
        "Hospitals can request blood in real time, activate Emergency Priority Mode, and track donor responses without delays.",
    },
  };

  const data = content[step as keyof typeof content];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div
        className="bg-[#1a0505] border border-[#6e0b0b] rounded-3xl max-w-3xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#6e0b0b] p-8 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="text-white">{data.icon}</div>
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
        <div className="p-8">
          <p className="text-[#d2c5c5] text-xl leading-relaxed">
            {data.description}
          </p>
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
