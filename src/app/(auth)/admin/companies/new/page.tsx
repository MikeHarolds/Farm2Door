"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function OnboardCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    contactPerson: "",
    licenseNumber: "",
    fleetSize: "0",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to onboard company");
        return;
      }

      router.push("/admin/companies");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboard Delivery Company</h1>
        <p className="text-gray-500 mt-1">Register a new delivery partner on the platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
            <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="FastTrack Logistics Ltd." required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jane Smith" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Email *</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@company.com" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+234..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 8 characters" minLength={8} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Company headquarters address" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
            <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="Operations Manager" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">License Number</label>
            <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="LIC-XXXXX" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fleet Size</label>
            <input type="number" value={formData.fleetSize} onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })} min="0" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm" />
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors">
            {isLoading ? "Onboarding..." : "Onboard Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
