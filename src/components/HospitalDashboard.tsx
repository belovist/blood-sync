import React from 'react';
import { AlertTriangle, Users, ClipboardCheck, Check, X, Clock, MapPin, Truck, Plus, AlertOctagon, LogOut, RefreshCw, User, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { requestsAPI, inventoryAPI, BloodRequest } from '../services/api';
import { useAuth } from './AuthProvider';

export function HospitalDashboard() {
  const { user, logout } = useAuth();
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState<string | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    units: 2,
    urgency: 'medium',
    patientName: '',
    patientAge: '',
    patientGender: 'male',
    medicalReason: '',
    hospitalAddress: user?.address || '',
    hospitalWard: '',
    notes: '',
  });

  const [stats, setStats] = useState({
    activeRequests: 0,
    pendingApproval: 0,
    fulfilledToday: 0,
  });

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsAPI.getMyRequests(1, 50);
      if (response.success && response.data.requests) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
      showError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await requestsAPI.getMyRequests(1, 100);
      if (response.success && response.data.requests) {
        const reqs = response.data.requests;
        const today = new Date().toDateString();
        
        setStats({
          activeRequests: reqs.filter((r: BloodRequest) => 
            r.status === 'pending' || r.status === 'approved'
          ).length,
          pendingApproval: reqs.filter((r: BloodRequest) => 
            r.status === 'pending'
          ).length,
          fulfilledToday: reqs.filter((r: BloodRequest) => 
            r.status === 'fulfilled' && 
            new Date(r.createdAt).toDateString() === today
          ).length,
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRequest = async () => {
    // Validate form - only check the 3 fields we're using
    if (!formData.bloodGroup || !formData.units || !formData.hospitalAddress) {
      showError('Please fill in all required fields');
      return;
    }

    if (formData.units <= 0) {
      showError('Please enter a valid number of units');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create request with proper structure matching backend expectations
      const requestPayload = {
        bloodGroup: formData.bloodGroup,
        units: Number(formData.units), // Ensure it's a number
        urgency: 'medium',
        patientName: 'Patient',
        patientAge: 25,
        patientGender: 'male',
        medicalReason: 'Blood transfusion required',
        hospitalAddress: formData.hospitalAddress.trim(),
        hospitalWard: 'General Ward',
        notes: '',
      };

      console.log('Sending blood request:', requestPayload);
      
      const response = await requestsAPI.createRequest(requestPayload);

      console.log('Full response:', response);

      if (response.success) {
        showSuccess('Blood request created successfully!');
        setShowCreateRequestModal(false);
        // Reset form
        setFormData({
          bloodGroup: 'O+',
          units: 2,
          urgency: 'medium',
          patientName: '',
          patientAge: '',
          patientGender: 'male',
          medicalReason: '',
          hospitalAddress: user?.address || '',
          hospitalWard: '',
          notes: '',
        });
        await loadRequests();
        await loadStats();
      } else {
        console.error('Request failed:', response);
        showError(response.message || 'Failed to create request');
      }
    } catch (error: any) {
      console.error('Request error details:', error);
      
      // Check if it's a network error
      if (!navigator.onLine) {
        showError('No internet connection. Please check your network.');
        return;
      }

      // Check if backend is running
      if (error.message.includes('fetch')) {
        showError('Cannot connect to server. Please ensure the backend is running on http://localhost:5001');
        return;
      }

      // Parse error message
      const errorMessage = error.message || 'Failed to create request';
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const showSuccess = (message: string) => {
    setShowSuccessMessage(message);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setShowErrorMessage(message);
    setTimeout(() => setShowErrorMessage(null), 3000);
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels: { [key: string]: string } = {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    };
    return labels[urgency] || urgency;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Pending',
      approved: 'Approved',
      declined: 'Declined',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      // App component will automatically redirect to landing page when user becomes null
    }
  };

  const handleRefresh = async () => {
    try {
      await loadRequests();
      await loadStats();
      showSuccess("Data refreshed successfully");
    } catch (error) {
      console.error("Refresh error:", error);
      showError("Failed to refresh data");
    }
  };

  const handleGoHome = () => {
    if (window.confirm("Do you want to go back to the home page? This will log you out.")) {
      logout();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e0e10' }}>
      {/* Navigation Header */}
      <nav className="bg-[#171717] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BS</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-white tracking-wide text-lg">BLOOD</span>
                  <span className="text-[#f00a0a] tracking-wide text-lg">SYNC</span>
                </div>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div>
                <div className="text-white font-medium">Hospital Dashboard</div>
                {user?.hospitalName && (
                  <div className="text-[#a3a3a3] text-sm">{user.hospitalName}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-[#a3a3a3] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <div className="h-6 w-px bg-white/10"></div>
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                  <User className="w-4 h-4 text-[#a3a3a3]" />
                  <span className="text-white text-sm">{user.email || user.hospitalName || 'Hospital'}</span>
                </div>
              )}
              <button
                onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 text-[#a3a3a3] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                title="Go to home page"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-lg hover:bg-red-900/50 transition-colors text-sm"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-20 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" />
              <span>{showSuccessMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showErrorMessage && (
          <div className="fixed top-20 right-8 bg-red-900/90 border border-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <X className="w-5 h-5" />
              <span>{showErrorMessage}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Requests"
            value={stats.activeRequests.toString()}
            icon={<AlertTriangle className="w-6 h-6" />}
            variant="critical"
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingApproval.toString()}
            icon={<ClipboardCheck className="w-6 h-6" />}
            variant="warning"
          />
          <StatCard
            title="Fulfilled Today"
            value={stats.fulfilledToday.toString()}
            icon={<Check className="w-6 h-6" />}
            variant="success"
          />
        </div>

        {/* Create Request Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateRequestModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Blood Request
          </button>
        </div>

        {/* My Blood Requests Table */}
        <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-white">My Blood Requests</h2>
            <p className="text-[#a3a3a3] text-sm mt-1">
              Track status of blood requests sent to blood banks
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-white">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-[#a3a3a3]">No requests found. Create your first blood request above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Request ID</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Blood Group</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Units</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Urgency</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Blood Bank</th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <RequestRow
                      key={request._id}
                      requestId={request.requestId}
                      bloodGroup={request.bloodGroup}
                      units={request.units.toString()}
                      urgency={getUrgencyLabel(request.urgency)}
                      bloodBank={request.assignedBloodBankName || 'Pending'}
                      status={getStatusLabel(request.status)}
                      urgencyLevel={request.urgency as 'critical' | 'high' | 'normal'}
                      statusType={request.status as 'approved' | 'transit' | 'pending'}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Nearby Blood Banks */}
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h2 className="text-white mb-6">Nearby Blood Banks</h2>
          <div className="text-[#a3a3a3] text-sm">
            Blood bank availability will be shown here when you create a request.
          </div>
        </div>

        {/* Upcoming Donation Drives */}
        <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
          <h2 className="text-white mb-6">Blood Donation Drives</h2>
          <div className="space-y-4">
            <DriveItem
              title="Community Blood Drive"
              location="Sector 21 Community Center"
              date="Jan 10, 2026"
              time="9:00 AM - 5:00 PM"
            />
            <DriveItem
              title="Corporate Donation Camp"
              location="Tech Park, Phase 2"
              date="Jan 15, 2026"
              time="10:00 AM - 4:00 PM"
            />
          </div>
        </div>

        {/* Create Request Modal */}
        {showCreateRequestModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !submitting && setShowCreateRequestModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#171717] border border-white/10 rounded-lg shadow-2xl z-50">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-white text-lg">Create Blood Request</h2>
                <button
                  onClick={() => !submitting && setShowCreateRequestModal(false)}
                  disabled={submitting}
                  className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div>
                  <label className="text-[#a3a3a3] text-xs mb-1.5 block">Blood Type *</label>
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#a3a3a3] text-xs mb-1.5 block">Units Required *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.units}
                    onChange={(e) => handleInputChange('units', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Enter units"
                  />
                </div>
                <div>
                  <label className="text-[#a3a3a3] text-xs mb-1.5 block">Hospital Address *</label>
                  <input
                    type="text"
                    value={formData.hospitalAddress}
                    onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
                    className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Enter hospital address"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowCreateRequestModal(false)}
                  disabled={submitting}
                  className="px-3 py-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant: 'critical' | 'warning' | 'success';
}

function StatCard({ title, value, icon, variant }: StatCardProps) {
  const variantStyles = {
    critical: 'border-[#dc2626] bg-[#dc2626]/5',
    warning: 'border-orange-700 bg-orange-900/10',
    success: 'border-green-700 bg-green-900/10',
  };

  const iconStyles = {
    critical: 'text-[#dc2626]',
    warning: 'text-orange-500',
    success: 'text-green-500',
  };

  return (
    <div className={`bg-[#171717] border rounded-lg p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-[#a3a3a3] text-sm">{title}</div>
        <div className={iconStyles[variant]}>{icon}</div>
      </div>
      <div className="text-white text-3xl mb-1">{value}</div>
    </div>
  );
}

interface RequestRowProps {
  requestId: string;
  bloodGroup: string;
  units: string;
  urgency: string;
  bloodBank: string;
  status: string;
  urgencyLevel: 'critical' | 'high' | 'normal';
  statusType: 'approved' | 'transit' | 'pending';
}

function RequestRow({
  requestId,
  bloodGroup,
  units,
  urgency,
  bloodBank,
  status,
  urgencyLevel,
  statusType,
}: RequestRowProps) {
  const urgencyColors = {
    critical: 'bg-[#dc2626] text-white',
    high: 'bg-orange-900/30 text-orange-400 border border-orange-800',
    normal: 'bg-white/5 text-[#a3a3a3] border border-white/10',
  };

  const statusColors = {
    approved: 'bg-green-900/30 text-green-400',
    transit: 'bg-yellow-900/30 text-yellow-400',
    pending: 'bg-gray-900/30 text-gray-400',
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-6 py-4">
        <div className="text-white text-sm">{requestId}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-white">{bloodGroup}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-white text-sm">{units} units</div>
      </td>
      <td className="px-6 py-4">
        <span className={`text-xs px-3 py-1 rounded-full ${urgencyColors[urgencyLevel]}`}>
          {urgency}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-[#a3a3a3] text-sm">{bloodBank}</div>
      </td>
      <td className="px-6 py-4">
        <div className={`text-sm ${statusColors[statusType]}`}>
          {status}
        </div>
      </td>
    </tr>
  );
}

interface DriveItemProps {
  title: string;
  location: string;
  date: string;
  time: string;
}

function DriveItem({ title, location, date, time }: DriveItemProps) {
  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
      <div className="text-white text-sm mb-2">{title}</div>
      <div className="text-[#a3a3a3] text-xs mb-1">{location}</div>
      <div className="text-[#a3a3a3] text-xs mb-1">{date}</div>
      <div className="text-[#a3a3a3] text-xs">{time}</div>
    </div>
  );
}
