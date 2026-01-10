import {
  Package,
  AlertCircle,
  Calendar,
  Check,
  Edit2,
  Save,
  X,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw,
  User,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import { inventoryAPI, requestsAPI, BloodInventory, BloodRequest } from "../services/api";
import { useAuth } from "./AuthProvider";

export function BloodBankDashboard() {
  const { user, logout } = useAuth();
  const [inventory, setInventory] = useState<BloodInventory | null>(null);
  const [pendingRequests, setPendingRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUnits: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    loadInventory();
    loadPendingRequests();
    loadStats();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getInventory();
      if (response.success && response.data.inventory) {
        setInventory(response.data.inventory);
        console.log("Inventory loaded successfully:", response.data.inventory.totalUnits, "total units");
      } else {
        console.warn("Failed to load inventory:", response.message);
        showError(response.message || "Failed to load inventory");
      }
    } catch (error: any) {
      console.error("Failed to load inventory:", error);
      if (error.message?.includes('token') || error.message?.includes('Authentication') || error.message?.includes('401')) {
        showError("Authentication required. Please refresh and login again.");
      } else {
        showError(error.message || "Failed to load inventory");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await requestsAPI.getActiveRequests(1, 50);
      if (response.success && response.data.requests) {
        setPendingRequests(response.data.requests);
        console.log(`Loaded ${response.data.requests.length} pending requests for blood bank`);
      } else {
        console.warn("Failed to load requests:", response.message);
        setPendingRequests([]);
      }
    } catch (error: any) {
      console.error("Failed to load pending requests:", error);
      if (error.message?.includes('token') || error.message?.includes('Authentication') || error.message?.includes('401')) {
        showError("Authentication required. Please refresh and login again.");
      }
      setPendingRequests([]);
    }
  };

  const loadStats = async () => {
    try {
      const invResponse = await inventoryAPI.getInventory();
      const reqResponse = await requestsAPI.getActiveRequests(1, 50);
      
      if (invResponse.success && invResponse.data.inventory) {
        setStats(prev => ({
          ...prev,
          totalUnits: invResponse.data.inventory.totalUnits || 0,
        }));
      }
      
      if (reqResponse.success && reqResponse.data.requests) {
        setStats(prev => ({
          ...prev,
          pendingRequests: reqResponse.data.requests.filter((r: BloodRequest) => r.status === 'pending').length,
        }));
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleEditInventory = (bloodGroup: string) => {
    // Allow editing even if inventory doesn't exist yet (for initial setup)
    if (inventory && inventory.bloodGroups && inventory.bloodGroups[bloodGroup]) {
      setEditingGroup(bloodGroup);
      setEditValue(inventory.bloodGroups[bloodGroup].units.toString());
    } else {
      // If no inventory exists, allow setting initial value (start with 0)
      setEditingGroup(bloodGroup);
      setEditValue("0");
    }
  };

  const handleSaveInventory = async (bloodGroup: string) => {
    try {
      const units = parseInt(editValue);
      if (isNaN(units) || units < 0) {
        showError("Please enter a valid number");
        return;
      }

      // Show loading state
      setEditingGroup(bloodGroup); // Keep editing state while saving
      
      const response = await inventoryAPI.updateInventory(bloodGroup, units, "set");
      if (response.success) {
        // Successfully saved - refresh inventory and stats
        await loadInventory();
        await loadStats();
        setEditingGroup(null);
        setEditValue("");
        showSuccess(`Inventory updated successfully: ${bloodGroup} = ${units} units`);
      } else {
        showError(response.message || "Failed to update inventory");
        setEditingGroup(bloodGroup); // Keep in edit mode on error
      }
    } catch (error: any) {
      console.error("Save inventory error:", error);
      const errorMessage = error.message || "Failed to update inventory. Please check your connection and try again.";
      showError(errorMessage);
      // Check if it's an authentication error
      if (errorMessage.includes('token') || errorMessage.includes('Authentication') || errorMessage.includes('401')) {
        showError("Authentication required. Please refresh the page and login again.");
      }
      setEditingGroup(bloodGroup); // Keep in edit mode on error
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditValue("");
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Find the request to get details for feedback
      const request = pendingRequests.find(r => r._id === requestId);
      if (!request) {
        showError("Request not found");
        return;
      }

      const previousUnits = inventory 
        ? (inventory.bloodGroups[request.bloodGroup]?.units || 0) 
        : 0;

      // Check if we have enough inventory
      if (!inventory || previousUnits < request.units) {
        showError(`Insufficient inventory. Available: ${previousUnits} units, Required: ${request.units} units`);
        return;
      }

      const response = await requestsAPI.acceptRequest(requestId);
      if (response.success) {
        // Calculate expected new units
        const expectedNewUnits = previousUnits - request.units;
        
        // Reload inventory to get updated values from server (should show the deducted amount)
        await loadInventory();
        
        // Get updated inventory to verify the change
        const updatedInvResponse = await inventoryAPI.getInventory();
        const actualNewUnits = updatedInvResponse.success && updatedInvResponse.data.inventory
          ? (updatedInvResponse.data.inventory.bloodGroups[request.bloodGroup]?.units || 0)
          : expectedNewUnits;
        
        // Reload requests and stats
        await loadPendingRequests();
        await loadStats();
        
        // Verify the inventory was updated correctly
        if (actualNewUnits === expectedNewUnits) {
          // Show detailed success message with inventory update info
          showSuccess(
            `✓ Request accepted! ${request.bloodGroup} inventory automatically updated: ${previousUnits} → ${actualNewUnits} units (${request.units} units deducted)`
          );
        } else {
          console.warn(`Inventory mismatch: Expected ${expectedNewUnits}, got ${actualNewUnits}`);
          showSuccess(
            `✓ Request accepted! Inventory updated to ${actualNewUnits} units for ${request.bloodGroup}`
          );
        }
      } else {
        showError(response.data?.message || response.message || "Failed to accept request");
      }
    } catch (error: any) {
      console.error("Accept request error:", error);
      if (error.message?.includes('token') || error.message?.includes('Authentication') || error.message?.includes('401')) {
        showError("Authentication required. Please refresh and login again.");
      } else {
        showError(error.message || "Failed to accept request. Please try again.");
      }
    }
  };

  const handleDeclineRequest = async (requestId: string, reason?: string) => {
    try {
      const response = await requestsAPI.declineRequest(requestId, reason || "Request declined");
      if (response.success) {
        showSuccess("Request declined");
        await loadPendingRequests();
        await loadStats();
      } else {
        showError(response.data?.message || "Failed to decline request");
      }
    } catch (error: any) {
      showError(error.message || "Failed to decline request");
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

  const handleScheduleDrive = () => {
    setShowScheduleSuccess(true);
    setTimeout(() => setShowScheduleSuccess(false), 3000);
  };

  const canFulfillRequest = (request: BloodRequest): boolean => {
    if (!inventory || !inventory.bloodGroups[request.bloodGroup]) {
      return false;
    }
    return inventory.bloodGroups[request.bloodGroup].units >= request.units;
  };

  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#0e0e10' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      // App component will automatically redirect to landing page when user becomes null
    }
  };

  const handleRefresh = async () => {
    try {
      await loadInventory();
      await loadPendingRequests();
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
                <div className="text-white font-medium">Blood Bank Dashboard</div>
                {user?.bloodBankName && (
                  <div className="text-[#a3a3a3] text-sm">{user.bloodBankName}</div>
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
                  <span className="text-white text-sm">{user.email || user.bloodBankName || 'Blood Bank'}</span>
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
          <div className="fixed top-20 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" />
              <div>
                <div className="font-medium">{showSuccessMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showErrorMessage && (
          <div className="fixed top-20 right-8 bg-red-900/90 border border-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50">
            <div className="flex items-center gap-3">
              <X className="w-5 h-5" />
              <div>
                <div className="font-medium">{showErrorMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Success */}
        {showScheduleSuccess && (
          <div className="fixed top-20 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" />
              <div>
                <div className="font-medium">Scheduled Successfully</div>
                <div className="text-sm text-white/80">
                  Donation drive created
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Available Blood Units"
            value={stats.totalUnits.toString()}
            subtitle="Across all blood groups"
            icon={<Package className="w-6 h-6" />}
            variant="neutral"
          />
          <StatCard
            title="Hospital Requests Pending"
            value={stats.pendingRequests.toString()}
            subtitle="Awaiting response"
            icon={<AlertCircle className="w-6 h-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* BLOOD INVENTORY */}
            <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white">Blood Inventory</h2>
                    <p className="text-[#a3a3a3] text-sm mt-1">
                      Blood group-wise availability - Click <span className="text-[#dc2626] font-medium">Edit</span> to set or update units
                    </p>
                  </div>
                  {(!inventory || (inventory.totalUnits === 0)) && (
                    <div className="bg-orange-900/20 border border-orange-800/50 rounded-lg px-4 py-2">
                      <p className="text-orange-400 text-xs font-medium">
                        Set Initial Inventory
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">
                      Blood Group
                    </th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">
                      Units Available
                    </th>
                    <th className="text-left text-[#a3a3a3] text-sm px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bloodGroups.map((group) => {
                    const isEditing = editingGroup === group;
                    const currentUnits = inventory?.bloodGroups[group]?.units || 0;
                    
                    return (
                      <tr
                        key={group}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="px-6 py-4 text-white">{group}</td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-24 bg-[#0e0e10] border border-white/10 rounded px-2 py-1 text-white text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveInventory(group);
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                            />
                          ) : (
                            <span className={`text-sm ${currentUnits > 0 ? 'text-white' : 'text-[#a3a3a3] italic'}`}>
                              {currentUnits > 0 ? `${currentUnits} units` : '0 units'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveInventory(group)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 text-green-400 border border-green-800 rounded text-sm hover:bg-green-900/50 transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 text-red-400 border border-red-800 rounded text-sm hover:bg-red-900/50 transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditInventory(group)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/50 rounded text-sm hover:bg-[#dc2626]/30 transition-colors"
                              title={currentUnits > 0 ? "Edit inventory" : "Set initial inventory"}
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>{currentUnits > 0 ? 'Edit' : 'Set'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PLATELET INVENTORY (TEXT ONLY) */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <h2 className="text-white mb-2">Platelet Inventory</h2>
              <p className="text-[#a3a3a3] text-sm">Units Available:</p>
              <p className="text-white italic mt-1">-- enter units --</p>
            </div>

            {/* PENDING REQUESTS */}
            {pendingRequests.length > 0 && (
              <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-white">Pending Blood Requests</h2>
                  <p className="text-[#a3a3a3] text-sm mt-1">
                    Hospital requests awaiting your response
                  </p>
                </div>
                <div className="divide-y divide-white/5">
                  {pendingRequests.slice(0, 5).map((request) => {
                    const canFulfill = canFulfillRequest(request);
                    return (
                      <div key={request._id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-white font-medium mb-1">
                              {request.requestId} - {request.bloodGroup}
                            </div>
                            <div className="text-[#a3a3a3] text-sm">
                              {request.units} units requested • Urgency: {request.urgency}
                            </div>
                            {inventory && inventory.bloodGroups[request.bloodGroup] && (
                              <div className={`text-sm mt-1 ${canFulfill ? 'text-green-400' : 'text-red-400'}`}>
                                Your {request.bloodGroup} inventory: <span className="font-medium">{inventory.bloodGroups[request.bloodGroup].units} units</span>
                                {!canFulfill && (
                                  <span className="ml-2 text-xs">(Short by {request.units - inventory.bloodGroups[request.bloodGroup].units} units)</span>
                                )}
                              </div>
                            )}
                            {request.patientName && (
                              <div className="text-[#a3a3a3] text-sm mt-1">
                                Patient: {request.patientName} ({request.patientAge} years)
                              </div>
                            )}
                            {request.hospitalAddress && (
                              <div className="text-[#a3a3a3] text-sm mt-1">
                                Location: {request.hospitalAddress}
                              </div>
                            )}
                          </div>
                          <div className={`text-xs px-3 py-1 rounded-full ${
                            request.urgency === 'critical' 
                              ? 'bg-red-900/30 text-red-400 border border-red-800'
                              : request.urgency === 'high'
                              ? 'bg-orange-900/30 text-orange-400 border border-orange-800'
                              : 'bg-white/5 text-white/60 border border-white/10'
                          }`}>
                            {request.urgency}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={!canFulfill}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                              canFulfill
                                ? 'bg-green-900/30 text-green-400 border border-green-800 hover:bg-green-900/50'
                                : 'bg-gray-900/30 text-gray-500 border border-gray-800 cursor-not-allowed'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept {canFulfill ? '' : '(Insufficient inventory)'}
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-lg text-sm hover:bg-red-900/50 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {pendingRequests.length > 5 && (
                  <div className="p-4 text-center text-[#a3a3a3] text-sm border-t border-white/10">
                    Showing 5 of {pendingRequests.length} requests
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* SCHEDULE DRIVE */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-white/60" />
                <h2 className="text-white">Schedule Donation Drive</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[#a3a3a3] text-xs mb-2 block">
                    Drive Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter drive name"
                    className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-[#a3a3a3] text-xs mb-2 block">
                    Drive Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                  />
                </div>

                <button
                  onClick={handleScheduleDrive}
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Schedule Drive
                </button>
              </div>
            </div>

            {/* SCHEDULED DRIVES */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <h2 className="text-white mb-4">Scheduled Donation Drives</h2>

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
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, subtitle, icon, variant }: any) {
  const styles: any = {
    warning: "border-orange-700 bg-orange-900/10",
    neutral: "border-white/10",
  };

  return (
    <div className={`bg-[#171717] border rounded-lg p-6 ${styles[variant]}`}>
      <div className="flex justify-between mb-4 text-white">
        {title}
        {icon}
      </div>
      <div className="text-3xl text-white">{value}</div>
      <div className="text-sm text-[#a3a3a3]">{subtitle}</div>
    </div>
  );
}

function DriveItem({ title, date, registrations }: any) {
  return (
    <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4 mb-3">
      <div className="text-white">{title}</div>
      <div className="text-[#a3a3a3] text-sm">{date}</div>
      <div className="text-[#a3a3a3] text-sm">
        Registrations: {registrations}
      </div>
    </div>
  );
}
