"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface ProduceListing {
  id: number;
  produceName: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  location: string;
  availabilityStatus: string;
  description?: string | null;
  category?: string | null;
  isOrganic: boolean;
}

export default function FarmStorePage() {
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    produceName: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    location: "",
    availabilityStatus: "available" as const,
    description: "",
    category: "",
    isOrganic: false,
  });

  const categories = [
    "Vegetables", "Fruits", "Grains", "Root Crops", 
    "Legumes", "Herbs & Spices", "Dairy", "Meat", "Other"
  ];

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/produce");
        if (res.ok) {
          const data = await res.json();
          setListings(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          pricePerUnit: parseFloat(formData.pricePerUnit),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create listing");
        return;
      }

      // Reset form and refresh list
      setShowForm(false);
      setFormData({
        produceName: "", quantity: "", unit: "kg", pricePerUnit: "",
        location: "", availabilityStatus: "available", description: "",
        category: "", isOrganic: false,
      });
      
      const updatedRes = await fetch("/api/produce");
      if (updatedRes.ok) {
        const data = await updatedRes.json();
        setListings(data.data || []);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`/api/produce/${id}`, { method: "DELETE" });
      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Store</h1>
          <p className="text-gray-500 mt-1">Manage your produce listings for sale</p>
        </div>
        
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Listing
          </button>
        ) : (
          <button
            onClick={() => { setShowForm(false); setError(""); }}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Add Listing Form */}
      {showForm && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Produce Listing</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Produce Name *</label>
                <input
                  type="text"
                  value={formData.produceName}
                  onChange={(e) => setFormData({ ...formData, produceName: e.target.value })}
                  placeholder="e.g., Fresh Tomatoes"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">&nbsp;</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                  >
                    <option>kg</option><option>tons</option><option>bags</option>
                    <option>crates</option><option>baskets</option><option>pieces</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per Unit ($)*</label>
                <input
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Farm location or pickup point"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Availability</label>
                <select
                  value={formData.availabilityStatus}
                  onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited Stock</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your produce..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 outline-none text-sm resize-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOrganic}
                onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">This is organic produce</span>
            </label>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-primary-400 transition-colors"
              >
                {isSubmitting ? "Adding..." : "Add Listing"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Listings Grid */}
      {listings.length === 0 && !showForm ? (
        <Card padding="lg">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="No products in your store yet"
            description="Add your first produce listing to start selling."
            actionLabel="Add Your First Listing"
            onAction={() => setShowForm(true)}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} padding="md" className="hover:shadow-md transition-shadow">
              <div className="relative mb-4">
                <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">
                    {listing.category?.includes("Vegetable") || listing.produceName.toLowerCase().includes("tomato") ? "🍅" :
                     listing.category?.includes("Fruit") || listing.produceName.toLowerCase().includes("banana") ? "🍌" :
                     listing.category?.includes("Grain") ? "🌾" :
                     listing.category?.includes("Root") || listing.produceName.toLowerCase().includes("cassava") ? "🥔" :
                     listing.category?.includes("Meat") ? "🥩" :
                     listing.category?.includes("Dairy") ? "🧈" :
                     "🌿"}
                  </span>
                </div>
                <span className="absolute top-2 right-2">
                  <StatusBadge status={listing.availabilityStatus === "sold_out" ? "sold_out" : 
                                                     listing.availabilityStatus === "limited" ? "limited" : "available"} />
                </span>
                {listing.isOrganic && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    🌱 Organic
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">{listing.produceName}</h3>
                {listing.category && (
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mt-1">
                    {listing.category}
                  </span>
                )}
                
                <div className="mt-3 space-y-1.5 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <span>📦</span> {listing.quantity} {listing.unit} available
                  </p>
                  <p className="flex items-center gap-2">
                    <span>💰</span> ${listing.pricePerUnit} per {listing.unit}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <span>📍</span> {listing.location}
                  </p>
                </div>

                {listing.description && (
                  <p className="mt-3 text-xs text-gray-500 line-clamp-2">{listing.description}</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
