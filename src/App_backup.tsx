import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { DonorRegister } from './components/DonorRegister';
import { HospitalRegister } from './components/HospitalRegister';
import { BloodBankRegister } from './components/BloodBankRegister';
import { AuthProvider, useAuth } from './components/AuthProvider';

export type UserRole = 'donor' | 'blood-bank' | 'hospital' | null;

function AppContent() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, isLoading } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsRegistering(false);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setIsRegistering(false);
  };

  const handleShowRegister = () => {
    setIsRegistering(true);
  };

  const handleRegisterBack = () => {
    setIsRegistering(false);
  };

  // Show Dashboard if user is logged in
  if (user && !isLoading) {
    return <Dashboard role={user.role} onLogout={() => {}} />;
  }

  // Show Register Screen if registering
  if (selectedRole && isRegistering) {
    const commonProps = {
      onBack: handleRegisterBack,
      onRegisterSuccess: handleRegisterBack,
    };

    if (selectedRole === 'donor') {
      return <DonorRegister {...commonProps} />;
    }
    if (selectedRole === 'hospital') {
      return <HospitalRegister {...commonProps} />;
    }
    if (selectedRole === 'blood-bank') {
      return <BloodBankRegister {...commonProps} />;
    }
  }

  // Show Login Screen if role selected but not logged in
  if (selectedRole && !user) {
    return (
      <LoginScreen 
        role={selectedRole} 
        onBack={handleBack}
        onLoginSuccess={() => {
          // Login successful - clear selected role to show dashboard
          setSelectedRole(null);
        }}
        onShowRegister={handleShowRegister}
      />
    );
  }

  // Show Landing Page by default
  return <LandingPage onRoleSelect={handleRoleSelect} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}