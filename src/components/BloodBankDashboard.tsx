import { Package, AlertCircle, CheckCircle, Clock, Building2, Check, X, Users, Send, Calendar, Bell } from 'lucide-react';
import { useState } from 'react';

export function BloodBankDashboard() {
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
  const [deniedRequests, setDeniedRequests] = useState<string[]>([]);
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);

  const handleAcceptRequest = (requestId: string) => {
    setAcceptedRequests([...acceptedRequests, requestId]);
  };

  const handleDenyRequest = (requestId: string) => {
    setDeniedRequests([...deniedRequests, requestId]);
  };

  const handleSendNotification = () => {
    setShowNotificationSuccess(true);
    setTimeout(() => setShowNotificationSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Success Message */}
      {showNotificationSuccess && (
        <div className="fixed top-24 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span>Notifications sent successfully to donors!</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Available Blood Units"
          value="482"
          subtitle="Across all blood groups"
          icon={<Package className="w-6 h-6" />}
          variant="neutral"
        />
        <StatCard
          title="Hospital Requests Pending"
          value="8"
          subtitle="Awaiting response"
          icon={<AlertCircle className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          title="Requests Granted Today"
          value="23"
          subtitle="+6 from yesterday"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Active Donors"
          value="342"
          subtitle="Available this week"
          icon={<Users className="w-6 h-6" />}
          variant="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Inventory & Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Blood Inventory Table */}
          <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white">Blood Inventory Management</h2>
              <p className="text-[#a3a3a3] text-sm mt-1">
                Current stock levels across all blood groups
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Blood Group</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Units Available</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Reserved</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Status</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <InventoryRow
                    bloodGroup="O+"
                    unitsAvailable="94"
                    reserved="8"
                    status="Good"
                    statusLevel="good"
                    lastUpdated="2 hours ago"
                  />
                  <InventoryRow
                    bloodGroup="O-"
                    unitsAvailable="18"
                    reserved="3"
                    status="Low"
                    statusLevel="low"
                    lastUpdated="1 hour ago"
                  />
                  <InventoryRow
                    bloodGroup="A+"
                    unitsAvailable="76"
                    reserved="5"
                    status="Good"
                    statusLevel="good"
                    lastUpdated="3 hours ago"
                  />
                  <InventoryRow
                    bloodGroup="A-"
                    unitsAvailable="32"
                    reserved="2"
                    status="Adequate"
                    statusLevel="adequate"
                    lastUpdated="4 hours ago"
                  />
                  <InventoryRow
                    bloodGroup="B+"
                    unitsAvailable="58"
                    reserved="4"
                    status="Good"
                    statusLevel="good"
                    lastUpdated="2 hours ago"
                  />
                  <InventoryRow
                    bloodGroup="B-"
                    unitsAvailable="12"
                    reserved="1"
                    status="Critical"
                    statusLevel="critical"
                    lastUpdated="30 min ago"
                  />
                  <InventoryRow
                    bloodGroup="AB+"
                    unitsAvailable="45"
                    reserved="3"
                    status="Adequate"
                    statusLevel="adequate"
                    lastUpdated="5 hours ago"
                  />
                  <InventoryRow
                    bloodGroup="AB-"
                    unitsAvailable="9"
                    reserved="0"
                    status="Critical"
                    statusLevel="critical"
                    lastUpdated="1 hour ago"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Incoming Requests from Hospitals */}
          <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white">Incoming Requests from Hospitals</h2>
                  <p className="text-[#a3a3a3] text-sm mt-1">
                    Grant or deny blood requests from hospitals
                  </p>
                </div>
                <div className="bg-[#dc2626] text-white text-xs px-3 py-1 rounded-full">
                  8 Pending
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <HospitalRequestCard
                hospital="Apollo Hospital"
                location="Sector 21, 2.3 km away"
                bloodGroup="O-"
                unitsNeeded="3"
                urgency="Critical"
                urgencyLevel="critical"
                timeReceived="5 min ago"
                requestId="REQ-2847"
                patientCase="Emergency surgery - severe trauma"
                onAccept={handleAcceptRequest}
                onDeny={handleDenyRequest}
              />
              <HospitalRequestCard
                hospital="Max Healthcare"
                location="Downtown, 4.1 km away"
                bloodGroup="B-"
                unitsNeeded="2"
                urgency="Critical"
                urgencyLevel="critical"
                timeReceived="12 min ago"
                requestId="REQ-2846"
                patientCase="ICU patient - blood loss"
                onAccept={handleAcceptRequest}
                onDeny={handleDenyRequest}
              />
              <HospitalRequestCard
                hospital="Fortis Hospital"
                location="North Campus, 1.8 km away"
                bloodGroup="AB-"
                unitsNeeded="1"
                urgency="High"
                urgencyLevel="high"
                timeReceived="18 min ago"
                requestId="REQ-2845"
                patientCase="Scheduled surgery"
                onAccept={handleAcceptRequest}
                onDeny={handleDenyRequest}
              />
              <HospitalRequestCard
                hospital="City General Hospital"
                location="Central District, 3.2 km away"
                bloodGroup="A+"
                unitsNeeded="4"
                urgency="High"
                urgencyLevel="high"
                timeReceived="22 min ago"
                requestId="REQ-2844"
                patientCase="Post-operative care"
                onAccept={handleAcceptRequest}
                onDeny={handleDenyRequest}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Donor Management */}
        <div className="space-y-6">
          {/* Available Donors */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Available Donors</h2>
              <span className="bg-green-900/30 text-green-400 text-xs px-3 py-1 rounded-full border border-green-800">
                342 Active
              </span>
            </div>
            <p className="text-[#a3a3a3] text-sm mb-4">
              Donors ready to donate this week
            </p>
            <div className="space-y-3">
              <DonorAvailabilityCard bloodGroup="O+" count="68" eligible="62" />
              <DonorAvailabilityCard bloodGroup="O-" count="24" eligible="20" />
              <DonorAvailabilityCard bloodGroup="A+" count="78" eligible="71" />
              <DonorAvailabilityCard bloodGroup="A-" count="32" eligible="28" />
              <DonorAvailabilityCard bloodGroup="B+" count="54" eligible="48" />
              <DonorAvailabilityCard bloodGroup="B-" count="18" eligible="15" />
              <DonorAvailabilityCard bloodGroup="AB+" count="42" eligible="38" />
              <DonorAvailabilityCard bloodGroup="AB-" count="26" eligible="23" />
            </div>
            <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              View All Donors
            </button>
          </div>

          {/* Notification Center */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-white/60" />
              <h2 className="text-white">Send Notifications</h2>
            </div>
            <p className="text-[#a3a3a3] text-sm mb-4">
              Notify donors about urgent requests
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[#a3a3a3] text-xs mb-2 block">Blood Group</label>
                <select className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                  <option>All Groups</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
              <div>
                <label className="text-[#a3a3a3] text-xs mb-2 block">Message Type</label>
                <select className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                  <option>Urgent Request</option>
                  <option>Donation Drive</option>
                  <option>Low Stock Alert</option>
                  <option>General Announcement</option>
                </select>
              </div>
              <button
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                onClick={handleSendNotification}
              >
                <Send className="w-4 h-4" />
                Send SMS/Notification
              </button>
            </div>
          </div>

          {/* Donation Drive Management */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-white/60" />
              <h2 className="text-white">Donation Drives</h2>
            </div>
            <p className="text-[#a3a3a3] text-sm mb-4">
              Schedule and manage donation camps
            </p>
            <div className="space-y-3 mb-4">
              <DriveItem
                title="Community Blood Drive"
                date="Jan 10, 2026"
                registrations="42"
              />
              <DriveItem
                title="Corporate Camp - Tech Park"
                date="Jan 15, 2026"
                registrations="28"
              />
            </div>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Schedule New Drive
            </button>
          </div>

          {/* Request Tracking */}
          <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
            <h2 className="text-white mb-4">Request Status Tracking</h2>
            <div className="space-y-3">
              <StatusItem status="Granted" count="18" color="green" />
              <StatusItem status="Pending" count="8" color="yellow" />
              <StatusItem status="In Transit" count="5" color="blue" />
              <StatusItem status="Denied" count="2" color="red" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickStat label="Total Donations Today" value="42" trend="+8%" />
        <QuickStat label="Hospitals Served" value="24" />
        <QuickStat label="Avg Response Time" value="4.2 min" trend="-12%" />
        <QuickStat label="Coverage Radius" value="15 km" />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  variant: 'success' | 'warning' | 'neutral';
}

function StatCard({ title, value, subtitle, icon, variant }: StatCardProps) {
  const variantStyles = {
    success: 'border-green-700 bg-green-900/10',
    warning: 'border-orange-700 bg-orange-900/10',
    neutral: 'border-white/10',
  };

  const iconStyles = {
    success: 'text-green-500',
    warning: 'text-orange-500',
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

interface InventoryRowProps {
  bloodGroup: string;
  unitsAvailable: string;
  reserved: string;
  status: string;
  statusLevel: 'critical' | 'low' | 'adequate' | 'good';
  lastUpdated: string;
}

function InventoryRow({
  bloodGroup,
  unitsAvailable,
  reserved,
  status,
  statusLevel,
  lastUpdated,
}: InventoryRowProps) {
  const statusColors = {
    critical: 'bg-[#dc2626] text-white',
    low: 'bg-orange-900/30 text-orange-400 border border-orange-800',
    adequate: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800',
    good: 'bg-green-900/30 text-green-400 border border-green-800',
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-6 py-4">
        <div className="text-white text-lg">{bloodGroup}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-white">{unitsAvailable}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-[#a3a3a3] text-sm">{reserved}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`text-xs px-3 py-1 rounded-full ${statusColors[statusLevel]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-[#a3a3a3] text-sm">{lastUpdated}</div>
      </td>
    </tr>
  );
}

interface HospitalRequestCardProps {
  hospital: string;
  location: string;
  bloodGroup: string;
  unitsNeeded: string;
  urgency: string;
  urgencyLevel: 'critical' | 'high' | 'normal';
  timeReceived: string;
  requestId: string;
  patientCase: string;
  onAccept: (requestId: string) => void;
  onDeny: (requestId: string) => void;
}

function HospitalRequestCard({
  hospital,
  location,
  bloodGroup,
  unitsNeeded,
  urgency,
  urgencyLevel,
  timeReceived,
  requestId,
  patientCase,
  onAccept,
  onDeny,
}: HospitalRequestCardProps) {
  const urgencyColors = {
    critical: 'bg-[#dc2626] text-white',
    high: 'bg-orange-900/30 text-orange-400 border border-orange-800',
    normal: 'bg-white/5 text-[#a3a3a3] border border-white/10',
  };

  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        {/* Hospital Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-white/60" />
            <div>
              <div className="text-white">{hospital}</div>
              <div className="text-[#a3a3a3] text-xs mt-0.5">{location}</div>
            </div>
          </div>
        </div>

        {/* Urgency Badge */}
        <span className={`text-xs px-3 py-1 rounded-full ${urgencyColors[urgencyLevel]}`}>
          {urgency}
        </span>
      </div>

      {/* Request Details */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[#a3a3a3] text-xs mb-1">Blood Group</div>
          <div className="text-white text-lg">{bloodGroup}</div>
        </div>
        <div>
          <div className="text-[#a3a3a3] text-xs mb-1">Units Needed</div>
          <div className="text-white">{unitsNeeded}</div>
        </div>
        <div>
          <div className="text-[#a3a3a3] text-xs mb-1">Request ID</div>
          <div className="text-white text-sm">{requestId}</div>
        </div>
      </div>

      {/* Patient Case */}
      <div className="text-[#a3a3a3] text-sm mb-4">
        <strong>Patient Case:</strong> {patientCase}
      </div>

      {/* Time and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#a3a3a3] text-xs">
          <Clock className="w-4 h-4" />
          <span>Received {timeReceived}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            onClick={() => onAccept(requestId)}
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            onClick={() => onDeny(requestId)}
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

interface DonorAvailabilityCardProps {
  bloodGroup: string;
  count: string;
  eligible: string;
}

function DonorAvailabilityCard({ bloodGroup, count, eligible }: DonorAvailabilityCardProps) {
  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-[#a3a3a3] text-sm">Blood Group: {bloodGroup}</div>
        <div className="text-white text-sm">Total: {count}</div>
      </div>
      <div className="text-[#a3a3a3] text-sm mt-1">Eligible: {eligible}</div>
    </div>
  );
}

interface DriveItemProps {
  title: string;
  date: string;
  registrations: string;
}

function DriveItem({ title, date, registrations }: DriveItemProps) {
  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-[#a3a3a3] text-sm">Title: {title}</div>
        <div className="text-white text-sm">Date: {date}</div>
      </div>
      <div className="text-[#a3a3a3] text-sm mt-1">Registrations: {registrations}</div>
    </div>
  );
}

interface StatusItemProps {
  status: string;
  count: string;
  color: 'green' | 'yellow' | 'blue' | 'red';
}

function StatusItem({ status, count, color }: StatusItemProps) {
  const colorClasses = {
    green: 'bg-green-900/30 text-green-400 border border-green-800',
    yellow: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800',
    blue: 'bg-blue-900/30 text-blue-400 border border-blue-800',
    red: 'bg-red-900/30 text-red-400 border border-red-800',
  };

  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-[#a3a3a3] text-sm">Status: {status}</div>
        <div className={`text-xs px-3 py-1 rounded-full ${colorClasses[color]}`}>
          {count}
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="bg-[#171717] border border-white/10 rounded-lg p-4">
      <div className="text-[#a3a3a3] text-xs mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-white text-2xl">{value}</div>
        {trend && (
          <div className={`text-xs ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}