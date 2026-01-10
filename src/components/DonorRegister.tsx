import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import imgLogo from "figma:asset/6c97523942fe730fbd4ae098955eb28b9f9eefad.png";

interface DonorRegisterProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export function DonorRegister({ onBack, onRegisterSuccess }: DonorRegisterProps) {
  const [formData, setFormData] = useState({
    phone: '',
    pincode: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select blood group';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess();
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center p-6">

      {/* Back */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/60 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex justify-center gap-3 mb-10">
          <img src={imgLogo} className="w-12 h-12" />
          <div>
            <div className="text-white">BLOOD</div>
            <div className="text-[#dc2626]">SYNC</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#171717] border border-white/10 rounded-lg p-10">
          <h1 className="text-white text-2xl mb-6">Create Donor Account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Phone */}
            <input
              placeholder="Phone Number"
              maxLength={10}
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full bg-[#0e0e10] border border-white/10 px-4 py-3 rounded text-white"
            />
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}

            {/* Pincode */}
            <input
              placeholder="Pincode"
              maxLength={6}
              value={formData.pincode}
              onChange={e => handleChange('pincode', e.target.value)}
              className="w-full bg-[#0e0e10] border border-white/10 px-4 py-3 rounded text-white"
            />
            {errors.pincode && <p className="text-red-400 text-xs">{errors.pincode}</p>}

            {/* ✅ Blood Group Dropdown (FIXED) */}
            <select
              value={formData.bloodGroup}
              onChange={e => handleChange('bloodGroup', e.target.value)}
              className="w-full bg-[#0e0e10] border border-white/10 px-4 py-3 rounded text-white appearance-none"
            >
              <option value="" className="text-black">Select Blood Group</option>
              <option className="text-black">A+</option>
              <option className="text-black">A-</option>
              <option className="text-black">B+</option>
              <option className="text-black">B-</option>
              <option className="text-black">AB+</option>
              <option className="text-black">AB-</option>
              <option className="text-black">O+</option>
              <option className="text-black">O-</option>
            </select>
            {errors.bloodGroup && <p className="text-red-400 text-xs">{errors.bloodGroup}</p>}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                className="w-full bg-[#0e0e10] border border-white/10 px-4 py-3 rounded text-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                className="w-full bg-[#0e0e10] border border-white/10 px-4 py-3 rounded text-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {formData.password &&
              formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <div className="flex items-center gap-1 text-green-500 text-xs">
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </div>
              )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 rounded"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
