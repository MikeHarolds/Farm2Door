"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface ProduceListing {
  id: number;
  farmerId: number;
  produceName: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  location: string;
  availabilityStatus: string;
  isOrganic: boolean;
  category?: string | null;
  createdAt: string;
}

export default function AdminProducePage() {
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/produce");
        if (res.ok) {
          const data = await res.json();
          setListings(data.data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Produce Listings</h1>
        <p className="text-gray-500 mt-1">{listings.length} listings across all farm stores</p>
      </div>

      {listings.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<span>🛒</span>} title="No produce listings yet" description="Farmers' produce will appear here once they create listings." />
        </Card>
      ) : (
        <Card padding="lg">
          <table className="w-full overflow-x-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Produce</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Category</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Quantity</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Price</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Location</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Availability</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 text-sm">{listing.produceName}</p>
                    {listing.isOrganic && <span className="text-xs text-green-600 ml-1">🌱 Organic</span>}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{listing.category || "—"}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{listing.quantity} {listing.unit}</td>
                  <td className="py-3 px-4 text-sm font-medium text-primary-700">${listing.pricePerUnit}/{listing.unit}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-[200px] truncate">{listing.location}</td>
                  <td className="py-3 px-4"><StatusBadge status={listing.availabilityStatus} /></td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(listing.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
