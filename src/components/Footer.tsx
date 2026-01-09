import imgLogo from "figma:asset/6c97523942fe730fbd4ae098955eb28b9f9eefad.png";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#270402] px-10 py-16 mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* BloodSync Logo & Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 relative">
                <img alt="BloodSync Logo" className="w-full h-full object-contain" src={imgLogo} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white text-lg tracking-wide">BLOOD</span>
                <span className="text-[#f00a0a] text-lg tracking-wide">SYNC</span>
              </div>
            </div>
          </div>

          {/* Blood Sync Section */}
          <div className="space-y-4">
            <h4 className="text-white text-lg mb-4">Blood Sync</h4>
            <div className="space-y-3">
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                About
              </p>
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                Our team
              </p>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h4 className="text-white text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <p className="text-[#888888] text-sm">email@gmail.com</p>
              <p className="text-[#888888] text-sm">Emergency contact</p>
            </div>
          </div>

          {/* Learn More Section */}
          <div className="space-y-4">
            <h4 className="text-white text-lg mb-4">Learn More</h4>
            <div className="space-y-3">
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                Support
              </p>
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                Contact
              </p>
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                FAQ
              </p>
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                Help Center
              </p>
              <p className="text-[#888888] hover:text-white cursor-pointer transition-colors text-sm">
                Community
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Copyright */}
        <div className="text-center text-[#888888] text-sm">
          © 2025 BloodSync | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
