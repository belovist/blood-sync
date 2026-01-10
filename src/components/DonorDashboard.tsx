import { MapPin, Calendar, Clock, CheckCircle, Bell } from 'lucide-react';
import { useState } from 'react';

export function DonorDashboard() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0e0e10' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {showSuccess && (
          <div className="fixed top-24 right-8 bg-green-900/90 border border-green-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Availability updated successfully!</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donor Profile */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <h2 className="text-white mb-6">Donor Profile</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-1">Blood Group</div>
                  <div className="text-xl font-semibold text-red-500">A+</div>
                </div>
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-1">Age</div>
                  <div className="text-xl">28 years</div>
                </div>
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-1">Weight</div>
                  <div className="text-xl">72 kg</div>
                </div>
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-1">Gender</div>
                  <div className="text-xl">Male</div>
                </div>
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-1">Last Donation</div>
                  <div className="text-xl">3 months ago</div>
                </div>
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-1">Location</div>
                  <div className="text-xl">Sector 21, Delhi</div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <h2 className="text-white mb-6">Availability Status</h2>
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="text-[#a3a3a3] text-sm mb-2">Current Status</div>
                  <div className="text-xl font-semibold text-green-500">Available</div>
                </div>
                <button
                  onClick={() => setShowSuccess(true)}
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Donation History */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <h2 className="text-white mb-6">Donation History</h2>
              <div className="space-y-4">
                <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold">Blood Donation Camp</div>
                    <div className="text-[#a3a3a3] text-sm">3 months ago</div>
                  </div>
                  <div className="flex items-center gap-4 text-[#a3a3a3] text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>AIIMS, Delhi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Oct 15, 2023</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold">Emergency Donation</div>
                    <div className="text-[#a3a3a3] text-sm">6 months ago</div>
                  </div>
                  <div className="flex items-center gap-4 text-[#a3a3a3] text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Safdarjung Hospital</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Jul 20, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Upcoming Drives */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <h2 className="text-white mb-6">Upcoming Drives</h2>
              <div className="space-y-4">
                <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
                  <div className="text-white font-semibold mb-2">Blood Donation Camp</div>
                  <div className="space-y-2 text-[#a3a3a3] text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dec 25, 2023</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Connaught Place, Delhi</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
                  <div className="text-white font-semibold mb-2">Emergency Drive</div>
                  <div className="space-y-2 text-[#a3a3a3] text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Jan 5, 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>RML Hospital, Delhi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#171717] border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white">Notifications</h2>
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-3">
                <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
                  <div className="text-white text-sm">You are eligible to donate blood again!</div>
                  <div className="text-[#a3a3a3] text-xs mt-1">2 days ago</div>
                </div>
                <div className="bg-[#0e0e10] border border-white/10 rounded-lg p-4">
                  <div className="text-white text-sm">Blood donation camp near your location</div>
                  <div className="text-[#a3a3a3] text-xs mt-1">1 week ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
