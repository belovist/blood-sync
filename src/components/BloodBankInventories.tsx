export function BloodBankInventories() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* BLOOD INVENTORY */}
      <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white">Blood Inventory</h2>
          <p className="text-[#a3a3a3] text-sm mt-1">
            Blood group-wise availability
          </p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-[#a3a3a3]">Blood Group</th>
              <th className="px-6 py-4 text-left text-[#a3a3a3]">Units Available</th>
            </tr>
          </thead>
          <tbody>
            {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(bg => (
              <tr key={bg} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4 text-white">{bg}</td>
                <td className="px-6 py-4 text-[#a3a3a3] italic">
                  -- enter units --
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PLATELET INVENTORY */}
      <div className="bg-[#171717] border border-white/10 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white">Platelet Inventory</h2>

          <input
            placeholder="Search by type or expiry date..."
            className="mt-4 w-full bg-[#0e0e10] border border-white/10 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-[#a3a3a3]">Sr No</th>
              <th className="px-6 py-4 text-left text-[#a3a3a3]">Type</th>
              <th className="px-6 py-4 text-left text-[#a3a3a3]">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4 text-white">{i}</td>
                <td className="px-6 py-4 text-[#a3a3a3] italic">-- enter type --</td>
                <td className="px-6 py-4 text-[#a3a3a3] italic">-- select date --</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
