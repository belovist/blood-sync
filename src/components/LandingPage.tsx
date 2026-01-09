import { useState } from 'react';
import { UserRole } from '../App';
import { HeroSection } from './HeroSection';
import { FeatureCards } from './FeatureCards';
import { HowItWorks } from './HowItWorks';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

interface LandingPageProps {
  onRoleSelect: (role: UserRole) => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  return (
    <div className="bg-[#0e0e10] min-h-screen relative">
      <Navigation onRoleSelect={onRoleSelect} />
      <HeroSection onRoleSelect={onRoleSelect} />
      <FeatureCards />
      <HowItWorks />
      <Footer />
    </div>
  );
}