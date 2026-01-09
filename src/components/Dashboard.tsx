import { useState, ReactNode } from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Map, 
  Activity, 
  Settings, 
  Search, 
  Bell,
  User,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { UserRole } from '../App';
import imgLogo from "figma:asset/6c97523942fe730fbd4ae098955eb28b9f9eefad.png";
import { DonorDashboard } from './DonorDashboard';
import { HospitalDashboard } from './HospitalDashboard';
import { BloodBankDashboard } from './BloodBankDashboard';

interface DashboardProps {
  role: UserRole;
  onLogout: () => void;
  children?: ReactNode;
}

type NavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string;
};

const roleConfig = {
  donor: {
    title: 'Donor Portal',
    navItems: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'donations', label: 'My Donations', icon: <Activity className="w-5 h-5" /> },
      { id: 'blood-banks', label: 'Find Blood Banks', icon: <Map className="w-5 h-5" /> },
      { id: 'drives', label: 'Donation Drives', icon: <AlertCircle className="w-5 h-5" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ] as NavItem[],
  },
  'blood-bank': {
    title: 'Blood Bank Portal',
    navItems: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'emergency', label: 'Emergency Requests', icon: <AlertCircle className="w-5 h-5" />, badge: '3' },
      { id: 'map', label: 'Coverage Map', icon: <Map className="w-5 h-5" /> },
      { id: 'activity', label: 'Recent Activity', icon: <Activity className="w-5 h-5" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ] as NavItem[],
  },
  hospital: {
    title: 'Hospital Portal',
    navItems: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'emergency', label: 'Emergency Requests', icon: <AlertCircle className="w-5 h-5" />, badge: '2' },
      { id: 'map', label: 'Blood Bank Map', icon: <Map className="w-5 h-5" /> },
      { id: 'activity', label: 'Activity Log', icon: <Activity className="w-5 h-5" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ] as NavItem[],
  },
};

export function Dashboard({ role, onLogout, children }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle null role
  if (!role) {
    return null;
  }

  const config = roleConfig[role as keyof typeof roleConfig];

  const handleNavClick = (navId: string) => {
    // For donor role, "Find Blood Banks" navigates back to landing page
    if (role === 'donor' && navId === 'blood-banks') {
      onLogout();
      return;
    }
    
    // For other nav items, just set active state
    setActiveNav(navId);
  };

  // Render different content based on active navigation and role
  const renderContent = () => {
    if (children) {
      return children;
    }

    // Route to different dashboard views based on role and activeNav
    if (role === 'donor') {
      return <DonorDashboardContent activeNav={activeNav} />;
    } else if (role === 'blood-bank') {
      return <BloodBankDashboardContent activeNav={activeNav} />;
    } else if (role === 'hospital') {
      return <HospitalDashboardContent activeNav={activeNav} />;
    }

    return <DashboardContent role={role} />;
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#171717] border-r border-white/10 flex flex-col">
        {/* Logo */}
        <button 
          onClick={onLogout}
          className="p-6 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <img alt="BloodSync" src={imgLogo} className="w-10 h-10" />
            <div className="flex flex-col leading-none">
              <span className="text-white tracking-wide">BLOOD</span>
              <span className="text-[#dc2626] tracking-wide">SYNC</span>
            </div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {config.navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left
                  ${
                    activeNav === item.id
                      ? 'bg-[#dc2626] text-white'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#dc2626] text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#a3a3a3] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <header className="bg-[#171717] border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <div>
              <h1 className="text-white text-xl">{config.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-[#a3a3a3] text-sm">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">Overview</span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blood group, hospital, location..."
                  className="bg-[#0e0e10] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder:text-white/30 focus:border-[#dc2626] focus:outline-none transition-colors w-80"
                />
              </div>

              {/* Notifications */}
              <button
                className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#dc2626] rounded-full"></span>
              </button>

              {/* User Profile */}
              <button
                className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-9 h-9 bg-[#dc2626] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Notification Panel Overlay */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-20 right-8 w-96 bg-[#171717] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[600px] overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white">Notifications</h3>
            </div>
            <div className="overflow-y-auto max-h-[540px]">
              <NotificationItem
                title="Urgent Blood Request"
                message="A+ blood needed at Apollo Hospital"
                time="5 min ago"
                type="urgent"
              />
              <NotificationItem
                title="Request Approved"
                message="Your blood request has been approved"
                time="1 hour ago"
                type="success"
              />
              <NotificationItem
                title="Donation Drive"
                message="Community blood drive this Saturday"
                time="2 hours ago"
                type="info"
              />
              <NotificationItem
                title="Low Stock Alert"
                message="O- blood group running low"
                time="3 hours ago"
                type="warning"
              />
            </div>
          </div>
        </>
      )}

      {/* Profile Menu Overlay */}
      {showProfileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowProfileMenu(false)}
          />
          <div className="fixed top-20 right-8 w-64 bg-[#171717] border border-white/10 rounded-lg shadow-2xl z-50">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#dc2626] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm">John Doe</div>
                  <div className="text-[#a3a3a3] text-xs capitalize">{role?.replace('-', ' ')}</div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <ProfileMenuItem label="My Profile" />
              <ProfileMenuItem label="Settings" />
              <ProfileMenuItem label="Help & Support" />
              <div className="border-t border-white/10 my-2" />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-[#dc2626] hover:bg-white/5 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({ title, message, time, type }: {
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'success' | 'info' | 'warning';
}) {
  const colors = {
    urgent: 'bg-[#dc2626]',
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-orange-500',
  };

  return (
    <button className="w-full p-4 hover:bg-white/5 transition-colors border-b border-white/5 text-left">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${colors[type]}`} />
        <div className="flex-1">
          <div className="text-white text-sm mb-1">{title}</div>
          <div className="text-[#a3a3a3] text-xs mb-1">{message}</div>
          <div className="text-[#a3a3a3] text-xs">{time}</div>
        </div>
      </div>
    </button>
  );
}

function ProfileMenuItem({ label }: { label: string }) {
  return (
    <button className="w-full px-3 py-2 text-white hover:bg-white/5 rounded-lg transition-colors text-left text-sm">
      {label}
    </button>
  );
}

// Default Dashboard Content
function DashboardContent({ role }: { role: UserRole }) {
  // Show patient-specific dashboard for patients
  if (role === 'donor') {
    return <DonorDashboard />;
  }

  // Show hospital-specific dashboard for hospitals
  if (role === 'hospital') {
    return <HospitalDashboard />;
  }

  // Show blood bank-specific dashboard for blood banks
  if (role === 'blood-bank') {
    return <BloodBankDashboard />;
  }

  // Generic dashboard for blood banks and hospitals
  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Requests"
          value="127"
          change="+12%"
          isPositive={true}
        />
        <StatCard
          title="Active Emergencies"
          value="3"
          change=""
          isEmergency={true}
        />
        <StatCard
          title="Completed"
          value="98"
          change="+5%"
          isPositive={true}
        />
        <StatCard
          title="Response Time"
          value="4.2 min"
          change="-8%"
          isPositive={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#171717] border border-white/10 rounded-lg p-6">
          <h2 className="text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <ActivityItem key={i} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h2 className="text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionButton label="New Request" />
            <QuickActionButton label="View Map" />
            <QuickActionButton label="Generate Report" />
            <QuickActionButton label="Contact Support" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  isEmergency 
}: { 
  title: string; 
  value: string; 
  change: string; 
  isPositive?: boolean;
  isEmergency?: boolean;
}) {
  return (
    <div className={`bg-[#171717] border rounded-lg p-6 ${isEmergency ? 'border-[#dc2626]' : 'border-white/10'}`}>
      <div className="text-[#a3a3a3] text-sm mb-2">{title}</div>
      <div className="text-white text-3xl mb-2">{value}</div>
      {change && (
        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change} from last month
        </div>
      )}
    </div>
  );
}

function ActivityItem() {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0">
      <div className="w-2 h-2 bg-[#dc2626] rounded-full mt-2"></div>
      <div className="flex-1">
        <div className="text-white text-sm mb-1">Blood request approved</div>
        <div className="text-[#a3a3a3] text-xs">Apollo Hospital • A+ • 2 units • 15 min ago</div>
      </div>
    </div>
  );
}

function QuickActionButton({ label }: { label: string }) {
  return (
    <button className="w-full bg-[#0e0e10] hover:bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm text-left transition-colors">
      {label}
    </button>
  );
}

// Donor Dashboard Content
function DonorDashboardContent({ activeNav }: { activeNav: string }) {
  // Show different content based on active navigation
  if (activeNav === 'dashboard') {
    return <DonorDashboard />;
  } else if (activeNav === 'donations') {
    return <DonorDonations />;
  } else if (activeNav === 'drives') {
    return <DonorDrives />;
  }

  return <DonorDashboard />;
}

// Blood Bank Dashboard Content
function BloodBankDashboardContent({ activeNav }: { activeNav: string }) {
  // Show different content based on active navigation
  if (activeNav === 'dashboard') {
    return <BloodBankDashboard />;
  } else if (activeNav === 'emergency') {
    return <BloodBankEmergencies />;
  } else if (activeNav === 'map') {
    return <BloodBankMap />;
  } else if (activeNav === 'activity') {
    return <BloodBankActivity />;
  }

  return <BloodBankDashboard />;
}

// Hospital Dashboard Content
function HospitalDashboardContent({ activeNav }: { activeNav: string }) {
  // Show different content based on active navigation
  if (activeNav === 'dashboard') {
    return <HospitalDashboard />;
  } else if (activeNav === 'emergency') {
    return <HospitalEmergencies />;
  } else if (activeNav === 'map') {
    return <HospitalMap />;
  } else if (activeNav === 'activity') {
    return <HospitalActivity />;
  }

  return <HospitalDashboard />;
}

// Donor Donations
function DonorDonations() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">My Donations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Donation Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-10-01</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: A+</div>
            <div className="text-[#a3a3a3] text-sm">Units: 2</div>
            <div className="text-[#a3a3a3] text-sm">Location: Apollo Hospital</div>
          </div>
        </div>
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Donation Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-09-15</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: O-</div>
            <div className="text-[#a3a3a3] text-sm">Units: 1</div>
            <div className="text-[#a3a3a3] text-sm">Location: City Hospital</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Donor Drives
function DonorDrives() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Donation Drives</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Drive Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-10-15</div>
            <div className="text-[#a3a3a3] text-sm">Location: Community Center</div>
            <div className="text-[#a3a3a3] text-sm">Time: 10:00 AM - 2:00 PM</div>
          </div>
        </div>
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Drive Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-11-05</div>
            <div className="text-[#a3a3a3] text-sm">Location: School Grounds</div>
            <div className="text-[#a3a3a3] text-sm">Time: 11:00 AM - 3:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blood Bank Emergencies
function BloodBankEmergencies() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Emergency Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Request Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-10-01</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: A+</div>
            <div className="text-[#a3a3a3] text-sm">Units: 2</div>
            <div className="text-[#a3a3a3] text-sm">Location: Apollo Hospital</div>
          </div>
        </div>
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Request Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-09-15</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: O-</div>
            <div className="text-[#a3a3a3] text-sm">Units: 1</div>
            <div className="text-[#a3a3a3] text-sm">Location: City Hospital</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blood Bank Map
function BloodBankMap() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Coverage Map</h2>
      <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
        <div className="text-[#a3a3a3] text-sm">Map Placeholder</div>
      </div>
    </div>
  );
}

// Blood Bank Activity
function BloodBankActivity() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Recent Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Activity Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-10-01</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: A+</div>
            <div className="text-[#a3a3a3] text-sm">Units: 2</div>
            <div className="text-[#a3a3a3] text-sm">Location: Apollo Hospital</div>
          </div>
        </div>
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Activity Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-09-15</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: O-</div>
            <div className="text-[#a3a3a3] text-sm">Units: 1</div>
            <div className="text-[#a3a3a3] text-sm">Location: City Hospital</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hospital Emergencies
function HospitalEmergencies() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Emergency Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Request Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-10-01</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: A+</div>
            <div className="text-[#a3a3a3] text-sm">Units: 2</div>
            <div className="text-[#a3a3a3] text-sm">Location: Apollo Hospital</div>
          </div>
        </div>
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Request Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-09-15</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: O-</div>
            <div className="text-[#a3a3a3] text-sm">Units: 1</div>
            <div className="text-[#a3a3a3] text-sm">Location: City Hospital</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hospital Map
function HospitalMap() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Blood Bank Map</h2>
      <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
        <div className="text-[#a3a3a3] text-sm">Map Placeholder</div>
      </div>
    </div>
  );
}

// Hospital Activity
function HospitalActivity() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-white text-xl mb-4">Activity Log</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Activity Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-10-01</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: A+</div>
            <div className="text-[#a3a3a3] text-sm">Units: 2</div>
            <div className="text-[#a3a3a3] text-sm">Location: Apollo Hospital</div>
          </div>
        </div>
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg mb-4">Activity Details</h3>
          <div className="space-y-2">
            <div className="text-[#a3a3a3] text-sm">Date: 2023-09-15</div>
            <div className="text-[#a3a3a3] text-sm">Blood Group: O-</div>
            <div className="text-[#a3a3a3] text-sm">Units: 1</div>
            <div className="text-[#a3a3a3] text-sm">Location: City Hospital</div>
          </div>
        </div>
      </div>
    </div>
  );
}