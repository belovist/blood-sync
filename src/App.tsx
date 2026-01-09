import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';

export type UserRole = 'donor' | 'blood-bank' | 'hospital' | null;

export default function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsLoggedIn(false);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setIsLoggedIn(false);
  };

  // Show Dashboard if logged in
  if (isLoggedIn && selectedRole) {
    return <Dashboard role={selectedRole} onLogout={handleLogout} />;
  }

  // Show Login Screen if role selected but not logged in
  if (selectedRole && !isLoggedIn) {
    return (
      <LoginScreen 
        role={selectedRole} 
        onBack={handleBack}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Show Landing Page by default
  return <LandingPage onRoleSelect={handleRoleSelect} />;
}