import { Heart, Droplet, MapPin, Calendar, Clock, Users, Phone, AlertCircle, CheckCircle, ChevronRight, X, Bell } from 'lucide-react';
import { useState } from 'react';

export function DonorDashboard() {
  const [currentView, setCurrentView] = useState<'overview' | 'donations' | 'blood-banks' | 'drives' | 'settings'>('overview');
  const [availability, setAvailability] = useState('Available');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedBloodBank, setSelectedBloodBank] = useState<number | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const handleUpdateAvailability = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // This would be controlled by the Dashboard component's sidebar
  // For now, we'll render based on currentView
  
  if (currentView === 'donations') {
    return <DonationHistoryView onBack={() => setCurrentView('overview')} onSelectDonation={setSelectedDonation} />;
  }

  if (currentView === 'blood-banks') {
    return <BloodBankListView onBack={() => setCurrentView('overview')} onSelectBank={setSelectedBloodBank} />;
  }

  if (currentView === 'drives') {
    return <DonationDrivesView onBack={() => setCurrentView('overview')} />;
  }

  if (currentView === 'settings') {
    return <DonorSettingsView onBack={() => setCurrentView('overview')} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>Availability updated successfully!</span>
          </div>
        </div>
      )}

      {/* Donor Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Eligibility Status"
          value="Eligible"
          subtitle="Last donation: 3 months ago"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Total Donations"
          value="12"
          subtitle="You've saved 36 lives"
          icon={<Heart className="w-6 h-6" />}
          variant="neutral"
        />
        <StatCard
          title="Next Available"
          value="Now"
          subtitle="Ready to donate"
          icon={<Calendar className="w-6 h-6" />}
          variant="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Medical Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donor Profile */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <h2 className="text-white mb-6">Donor Profile</h2>
            <div className="grid grid-cols-2 gap-6">
              <ProfileField label="Blood Group" value="A+" highlight />
              <ProfileField label="Age" value="28 years" />
              <ProfileField label="Weight" value="72 kg" />
              <ProfileField label="Gender" value="Male" />
              <ProfileField label="Last Donation" value="3 months ago" />
              <ProfileField label="Location" value="Sector 21, Delhi" />
            </div>
          </div>

          {/* Medical Screening Info */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <h2 className="text-white mb-4">Medical Screening Status</h2>
            <div className="space-y-3">
              <ScreeningItem label="Age (18-65)" status="pass" />
              <ScreeningItem label="Weight (>50 kg)" status="pass" />
              <ScreeningItem label="Hemoglobin Level" status="pass" />
              <ScreeningItem label="Blood Pressure" status="pass" />
              <ScreeningItem label="No Recent Illness" status="pass" />
              <ScreeningItem label="No Risk Factors" status="pass" />
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-green-400 text-sm">✓ You are eligible to donate blood</div>
              <div className="text-[#a3a3a3] text-xs mt-1">Last screening: 3 months ago</div>
            </div>
          </div>

          {/* Live Blood Requests */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Live Blood Requests</h2>
              <span className="bg-[#dc2626] text-white text-xs px-3 py-1 rounded-full">
                8 Active
              </span>
            </div>
            <p className="text-[#a3a3a3] text-sm mb-6">
              Emergency requests from hospitals in your area
            </p>
            <div className="space-y-3">
              <BloodRequestCard
                hospital="Apollo Hospital"
                bloodGroup="A+"
                urgency="Critical"
                distance="2.3 km"
                time="5 min ago"
              />
              <BloodRequestCard
                hospital="Max Healthcare"
                bloodGroup="A+"
                urgency="High"
                distance="4.1 km"
                time="12 min ago"
              />
              <BloodRequestCard
                hospital="Fortis Hospital"
                bloodGroup="O-"
                urgency="Critical"
                distance="1.8 km"
                time="18 min ago"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Availability Status */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <h2 className="text-white mb-4">Availability</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[#a3a3a3] text-xs mb-2 block">Current Status</label>
                <select className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                  <option>Available Now</option>
                  <option>Available This Week</option>
                  <option>Not Available</option>
                </select>
              </div>
              <div>
                <label className="text-[#a3a3a3] text-xs mb-2 block">Preferred Time</label>
                <select className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                  <option>Anytime</option>
                  <option>Morning (9 AM - 12 PM)</option>
                  <option>Afternoon (12 PM - 5 PM)</option>
                  <option>Evening (5 PM - 8 PM)</option>
                </select>
              </div>
              <button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm transition-colors" onClick={handleUpdateAvailability}>
                Update Availability
              </button>
            </div>
          </div>

          {/* Nearby Blood Banks */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <h2 className="text-white mb-4">Nearby Blood Banks</h2>
            <div className="space-y-3">
              <BloodBankCard
                name="City Blood Bank"
                distance="2.3 km"
                status="Open"
              />
              <BloodBankCard
                name="Apollo Blood Services"
                distance="4.1 km"
                status="Open"
              />
              <BloodBankCard
                name="Red Cross Blood Center"
                distance="5.8 km"
                status="Closed"
              />
            </div>
            <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              View All on Map
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-white/60" />
              <h2 className="text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              <NotificationItem
                title="Urgent Request"
                message="A+ blood needed at Apollo Hospital"
                time="5 min ago"
                type="urgent"
              />
              <NotificationItem
                title="Donation Drive"
                message="Community drive this Saturday"
                time="2 hours ago"
                type="info"
              />
              <NotificationItem
                title="Eligibility Restored"
                message="You can donate again"
                time="1 day ago"
                type="success"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white">Donation History</h2>
          <p className="text-[#a3a3a3] text-sm mt-1">
            Your past donations and impact
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Date</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Blood Bank</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Type</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Units</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <DonationRow
                date="Dec 15, 2025"
                bloodBank="City Blood Bank"
                type="Whole Blood"
                units="1"
                status="Completed"
              />
              <DonationRow
                date="Sep 20, 2025"
                bloodBank="Apollo Blood Services"
                type="Whole Blood"
                units="1"
                status="Completed"
              />
              <DonationRow
                date="Jun 10, 2025"
                bloodBank="Red Cross Blood Center"
                type="Platelets"
                units="1"
                status="Completed"
              />
              <DonationRow
                date="Mar 5, 2025"
                bloodBank="City Blood Bank"
                type="Whole Blood"
                units="1"
                status="Completed"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Donation Drives */}
      <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
        <h2 className="text-white mb-6">Upcoming Donation Drives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DriveCard
            title="Community Blood Drive"
            location="Sector 21 Community Center"
            date="Jan 10, 2026"
            time="9:00 AM - 5:00 PM"
            organizer="City Blood Bank"
          />
          <DriveCard
            title="Corporate Blood Donation Camp"
            location="Tech Park, Phase 2"
            date="Jan 15, 2026"
            time="10:00 AM - 4:00 PM"
            organizer="Apollo Blood Services"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  variant: 'success' | 'neutral';
}

function StatCard({ title, value, subtitle, icon, variant }: StatCardProps) {
  const variantStyles = {
    success: 'border-green-700 bg-green-900/10',
    neutral: 'border-white/10',
  };

  const iconStyles = {
    success: 'text-green-500',
    neutral: 'text-white/60',
  };

  return (
    <div className={`bg-[#171717] border rounded-lg p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-[#a3a3a3] text-sm">{title}</div>
        <div className={iconStyles[variant]}>{icon}</div>
      </div>
      <div className="text-white text-3xl mb-1">{value}</div>
      <div className="text-[#a3a3a3] text-sm">{subtitle}</div>
    </div>
  );
}

function ProfileField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[#a3a3a3] text-xs mb-1">{label}</div>
      <div className={`text-sm ${highlight ? 'text-[#dc2626] text-xl' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function ScreeningItem({ label, status }: { label: string; status: 'pass' | 'fail' }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-white text-sm">{label}</span>
      <span className={`text-sm ${status === 'pass' ? 'text-green-400' : 'text-red-400'}`}>
        {status === 'pass' ? '✓ Pass' : '✗ Fail'}
      </span>
    </div>
  );
}

function BloodRequestCard({ hospital, bloodGroup, urgency, distance, time }: {
  hospital: string;
  bloodGroup: string;
  urgency: string;
  distance: string;
  time: string;
}) {
  const urgencyColor = urgency === 'Critical' ? 'text-[#dc2626]' : 'text-orange-400';

  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-white text-sm mb-1">{hospital}</div>
          <div className="text-[#a3a3a3] text-xs">{distance} away • {time}</div>
        </div>
        <div className="text-right">
          <div className="text-white text-lg mb-1">{bloodGroup}</div>
          <div className={`text-xs ${urgencyColor}`}>{urgency}</div>
        </div>
      </div>
    </div>
  );
}

function BloodBankCard({ name, distance, status }: { name: string; distance: string; status: string }) {
  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-white text-sm mb-1">{name}</div>
          <div className="text-[#a3a3a3] text-xs">{distance}</div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${status === 'Open' ? 'bg-green-900/30 text-green-400' : 'bg-white/5 text-[#a3a3a3]'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function NotificationItem({ title, message, time, type }: {
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'info' | 'success';
}) {
  const colors = {
    urgent: 'bg-[#dc2626]',
    info: 'bg-blue-500',
    success: 'bg-green-500',
  };

  return (
    <div className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
      <div className={`w-2 h-2 rounded-full mt-2 ${colors[type]}`} />
      <div className="flex-1">
        <div className="text-white text-sm mb-1">{title}</div>
        <div className="text-[#a3a3a3] text-xs mb-1">{message}</div>
        <div className="text-[#a3a3a3] text-xs">{time}</div>
      </div>
    </div>
  );
}

function DonationRow({ date, bloodBank, type, units, status }: {
  date: string;
  bloodBank: string;
  type: string;
  units: string;
  status: string;
}) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-6 py-4 text-white text-sm">{date}</td>
      <td className="px-6 py-4 text-white text-sm">{bloodBank}</td>
      <td className="px-6 py-4 text-[#a3a3a3] text-sm">{type}</td>
      <td className="px-6 py-4 text-white text-sm">{units}</td>
      <td className="px-6 py-4">
        <span className="text-xs px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800">
          {status}
        </span>
      </td>
    </tr>
  );
}

function DriveCard({ title, location, date, time, organizer }: {
  title: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
}) {
  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-5">
      <h3 className="text-white mb-3">{title}</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-[#a3a3a3] text-sm">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-[#a3a3a3] text-sm">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-[#a3a3a3] text-sm">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
        <div className="text-[#a3a3a3] text-xs">Organized by {organizer}</div>
      </div>
      <button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm transition-colors">
        Register for Drive
      </button>
    </div>
  );
}

function DonationHistoryView({ onBack, onSelectDonation }: { onBack: () => void; onSelectDonation: (id: number) => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <button className="text-white/60 text-sm" onClick={onBack}>
        <ChevronRight className="w-4 h-4 inline-block transform rotate-180" />
        Back to Overview
      </button>

      {/* Donation History */}
      <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white">Donation History</h2>
          <p className="text-[#a3a3a3] text-sm mt-1">
            Your past donations and impact
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Date</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Blood Bank</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Type</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Units</th>
                <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <DonationRow
                date="Dec 15, 2025"
                bloodBank="City Blood Bank"
                type="Whole Blood"
                units="1"
                status="Completed"
              />
              <DonationRow
                date="Sep 20, 2025"
                bloodBank="Apollo Blood Services"
                type="Whole Blood"
                units="1"
                status="Completed"
              />
              <DonationRow
                date="Jun 10, 2025"
                bloodBank="Red Cross Blood Center"
                type="Platelets"
                units="1"
                status="Completed"
              />
              <DonationRow
                date="Mar 5, 2025"
                bloodBank="City Blood Bank"
                type="Whole Blood"
                units="1"
                status="Completed"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BloodBankListView({ onBack, onSelectBank }: { onBack: () => void; onSelectBank: (id: number) => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <button className="text-white/60 text-sm" onClick={onBack}>
        <ChevronRight className="w-4 h-4 inline-block transform rotate-180" />
        Back to Overview
      </button>

      {/* Nearby Blood Banks */}
      <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
        <h2 className="text-white mb-4">Nearby Blood Banks</h2>
        <div className="space-y-3">
          <BloodBankCard
            name="City Blood Bank"
            distance="2.3 km"
            status="Open"
          />
          <BloodBankCard
            name="Apollo Blood Services"
            distance="4.1 km"
            status="Open"
          />
          <BloodBankCard
            name="Red Cross Blood Center"
            distance="5.8 km"
            status="Closed"
          />
        </div>
        <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          View All on Map
        </button>
      </div>
    </div>
  );
}

function DonationDrivesView({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <button className="text-white/60 text-sm" onClick={onBack}>
        <ChevronRight className="w-4 h-4 inline-block transform rotate-180" />
        Back to Overview
      </button>

      {/* Upcoming Donation Drives */}
      <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
        <h2 className="text-white mb-6">Upcoming Donation Drives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DriveCard
            title="Community Blood Drive"
            location="Sector 21 Community Center"
            date="Jan 10, 2026"
            time="9:00 AM - 5:00 PM"
            organizer="City Blood Bank"
          />
          <DriveCard
            title="Corporate Blood Donation Camp"
            location="Tech Park, Phase 2"
            date="Jan 15, 2026"
            time="10:00 AM - 4:00 PM"
            organizer="Apollo Blood Services"
          />
        </div>
      </div>
    </div>
  );
}

function DonorSettingsView({ onBack }: { onBack: () => void }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdateAvailability = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>Settings updated successfully!</span>
          </div>
        </div>
      )}
      
      <button className="text-white/60 text-sm" onClick={onBack}>
        <ChevronRight className="w-4 h-4 inline-block transform rotate-180" />
        Back to Overview
      </button>

      {/* Donor Settings */}
      <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
        <h2 className="text-white mb-4">Donor Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[#a3a3a3] text-xs mb-2 block">Current Status</label>
            <select className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
              <option>Available Now</option>
              <option>Available This Week</option>
              <option>Not Available</option>
            </select>
          </div>
          <div>
            <label className="text-[#a3a3a3] text-xs mb-2 block">Preferred Time</label>
            <select className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
              <option>Anytime</option>
              <option>Morning (9 AM - 12 PM)</option>
              <option>Afternoon (12 PM - 5 PM)</option>
              <option>Evening (5 PM - 8 PM)</option>
            </select>
          </div>
          <button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm transition-colors" onClick={handleUpdateAvailability}>
            Update Availability
          </button>
        </div>
      </div>
    </div>
  );
}