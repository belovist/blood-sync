import { useState } from 'react';
import { Siren, MapPin, Radio } from 'lucide-react';
import imgEmergency from "figma:asset/6d58321426b7e25c50af4420437b0e6c2ad3726b.png";
import imgLocation from "figma:asset/4e13529b4e7e6bd911742d8e2b3ef79d3c37b574.png";
import imgComm from "figma:asset/21d36a9aff753f085c53d77fad5fec0910f5e136.png";

export function FeatureCards() {
  return (
    <section id="features" className="relative px-10 py-20 space-y-24">
      <FeatureCard
        title="Emergency Priority Mode"
        description="Emergency Pandemic Mode empowers hospitals to respond instantly during pandemics and Act-of-God situations, when demand for blood and critical supplies rises without warning."
        expandedContent="When activated, the system bypasses standard send-receive protocols and automatically connects with all nearby blood banks. Requests are broadcast simultaneously to ensure rapid stocking of essential blood units and supplies. Real-time visibility allows hospitals to track confirmations, incoming stock, and expected delivery timelines—helping them stay prepared when every moment matters."
        image={imgEmergency}
        icon={<Siren className="w-16 h-16" />}
        align="left"
      />
      
      <FeatureCard
        title="Location Based Search"
        description="Google Maps integration ensures you can find nearby blood banks & hospitals, so you always know where to donate blood & how."
        expandedContent="Our advanced geolocation system integrates with Google Maps to show real-time availability of blood banks and hospitals.Get turn-by-turn directions in google maps.Save your favorite locations for quick access during emergencies."
        image={imgLocation}
        icon={<MapPin className="w-16 h-16" />}
        align="right"
      />
      
      <FeatureCard
        title="Real Time Communication"
        description="Integrating real time communication methods ensures details are updated the way they should be - seamlessly & without any hassle."
        expandedContent="Our WebSocket-based communication system provides instant updates across all connected devices. Hospitals, blood banks, and donors receive synchronized information without delay. Chat functionality allows direct coordination between parties. All communications are encrypted and HIPAA-compliant for maximum security."
        image={imgComm}
        icon={<Radio className="w-16 h-16" />}
        align="left"
      />
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  expandedContent: string;
  image: string;
  icon: React.ReactNode;
  align: 'left' | 'right' | 'center';
}

function FeatureCard({ title, description, expandedContent, image, icon, align }: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`relative mx-auto max-w-5xl transition-all duration-500 ${
        isExpanded ? 'scale-102' : 'scale-100'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`bg-[#6e0b0b] backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-black/30 transition-all duration-500 ${
        isExpanded ? 'bg-opacity-100 shadow-red-900/50' : 'bg-opacity-95'
      }`}>
        <div className={`flex items-center gap-10 ${
          align === 'right' ? 'flex-row-reverse' : ''
        } ${align === 'center' ? 'flex-col' : ''}`}>
          
          {/* Image */}
          <div className="relative">
            <div className={`w-[220px] h-[200px] transition-all duration-500 ${
              isExpanded ? 'scale-105' : 'scale-100'
            }`}>
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-white opacity-80">
                {icon}
              </div>
              <h3 className="text-white text-[28px] font-semibold leading-tight">
                {title}
              </h3>
            </div>
            
            <p className="text-[#d2c5c5] text-[18px] leading-snug">
              {description}
            </p>
            
            {/* Expanded content with smooth transition */}
            <div className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="pt-4 border-t border-red-800/50 mt-4">
                <p className="text-[#f0e0e0] text-[16px] leading-relaxed">
                  {expandedContent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}