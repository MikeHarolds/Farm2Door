"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Role = "farmer" | "delivery_partner" | "driver";

const roleConfig: Record<Role, {
  label: string;
  icon: string;
  description: string;
  color: string;
}> = {
  farmer: {
    label: "Farmer",
    icon: "🌾",
    description: "Manage harvests and book logistics",
    color: "border-primary-500 bg-primary-50",
  },
  delivery_partner: {
    label: "Delivery Partner",
    icon: "🚛",
    description: "Manage orders and drivers",
    color: "border-blue-500 bg-blue-50",
  },
  driver: {
    label: "Driver",
    icon: "📦",
    description: "Accept and deliver orders",
    color: "border-orange-500 bg-orange-50",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<Role>("farmer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Common fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Farmer specific
    farmName: "",
    farmLocation: "",
    farmSize: "",
    farmType: "",
    // Partner specific
    companyName: "",
    contactPerson: "",
    companyAddress: "",
    licenseNumber: "",
    // Driver specific
    vehicleType: "",
    vehicleNumber: "",
    driverLicenseNumber: "",
  });

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        role: selectedRole,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        ...selectedRole === "farmer" && {
          farmName: formData.farmName,
          farmLocation: formData.farmLocation,
          farmSize: formData.farmSize || undefined,
          farmType: formData.farmType || undefined,
        },
        ...selectedRole === "delivery_partner" && {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson || undefined,
          address: formData.companyAddress || undefined,
          licenseNumber: formData.licenseNumber || undefined,
        },
        ...selectedRole === "driver" && {
          vehicleType: formData.vehicleType || undefined,
          vehicleNumber: formData.vehicleNumber || undefined,
          licenseNumber: formData.driverLicenseNumber || undefined,
        },
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50/30 px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
              <span className="text-white text-xl font-bold">F2M</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join Farm2Market today</p>
        </div>

        {/* Step 1: Role Selection */}
        {step === "role" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">I am a...</h2>
            <div className="grid gap-4">
              {(Object.keys(roleConfig) as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`flex items-start gap-4 p-5 rounded-xl border-2 border-dashed transition-all hover:border-solid hover:shadow-md ${
                    roleConfig[role].color
                  }`}
                >
                  <span className="text-3xl">{roleConfig[role].icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{roleConfig[role].label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{roleConfig[role].description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in">
            {/* Back button & Role indicator */}
            <button
              onClick={() => setStep("role")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Choose different role
            </button>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-2xl">{roleConfig[selectedRole].icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Register as {roleConfig[selectedRole].label}
                </h2>
                <p className="text-sm text-gray-500">{roleConfig[selectedRole].description}</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Information Section */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Account Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      minLength={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min 8 characters"
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific section */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  {selectedRole === "farmer" ? "Farm Details" : 
                   selectedRole === "delivery_partner" ? "Company Details" : 
                   "Vehicle Details"}
                </h3>

                {selectedRole === "farmer" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name *</label>
                      <input
                        type="text"
                        value={formData.farmName}
                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                        placeholder="Green Valley Farms"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location *</label>
                      <input
                        type="text"
                        value={formData.farmLocation}
                        onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                        placeholder="Kano State, Nigeria"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size</label>
                        <input
                          type="text"
                          value={formData.farmSize}
                          onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                          placeholder="50 hectares"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Type</label>
                        <select
                          value={formData.farmType}
                          onChange={(e) => setFormData({ ...formData, farmType: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        >
                          <option value="">Select...</option>
                          <option value="vegetable">Vegetable</option>
                          <option value="grain">Grain</option>
                          <option value="fruit">Fruit</option>
                          <option value="livestock">Livestock</option>
                          <option value="mixed">Mixed Crop</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === "delivery_partner" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="FastTrack Logistics Ltd."
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="Jane Smith (Manager)"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.companyAddress}
                        onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                        placeholder="123 Logistics Ave, Lagos"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        placeholder="LIC-2024-XXXXX"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === "driver" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="truck">Truck</option>
                        <option value="van">Van</option>
                        <option value="pickup">Pickup Truck</option>
                        <option value="motorcycle">Motorcycle/Trike</option>
                        <option value="tricycle">Tricycle</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                      <input
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        placeholder="ABC-123-XYZ"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver&apos;s License Number</label>
                      <input
                        type="text"
                        value={formData.driverLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, driverLicenseNumber: e.target.value })}
                        placeholder="DL-XXXX-XXXXX"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-200 mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  `Create ${roleConfig[selectedRole].label} Account`
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
