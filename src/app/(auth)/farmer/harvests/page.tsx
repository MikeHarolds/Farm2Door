"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface Harvest {
  id: number;
  cropName: string;
  quantity: string;
  unit: string;
  harvestDate: string;
  farmLocation: string;
  destinationLocation?: string | null;
  condition: string;
  notes?: string | null;
  status: string;
  createdAt: string;
}

export default function HarvestListPage() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHarvests() {
      try {
        const res = await fetch("/api/harvests");
        if (res.ok) {
          const data = await res.json();
          setHarvests(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching harvests:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHarvests();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this harvest record?")) return;

    try {
      const res = await fetch(`/api/harvests/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHarvests(harvests.filter((h) => h.id !== id));
      }
    } catch (error) {
      console.error("Error deleting harvest:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">My Harvests</h1>
          <p className="text-gray-500 mt-1">Manage your harvested crops and produce</p>
        </div>
        <Link
          href="/farmer/harvests/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Harvest
        </Link>
      </div>

      {/* Harvest List */}
      <Card padding="lg">
        {harvests.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            title="No harvest records yet"
            description="Start by adding your first harvested crop to track your production."
            actionLabel="Add Your First Harvest"
            actionHref="/farmer/harvests/new"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Crop</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Quantity</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Condition</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Harvest Date</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {harvests.map((harvest) => (
                  <tr key={harvest.id} className="hover:bg-gray-50">
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium text-gray-900">{harvest.cropName}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{harvest.farmLocation}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-700">
                        {harvest.quantity} {harvest.unit}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={harvest.condition} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        harvest.status === "available" ? "bg-green-100 text-green-700" :
                        harvest.status === "booked" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {harvest.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(harvest.harvestDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            // Navigate to edit - for simplicity we'll use a direct link pattern
                            window.location.href = `/farmer/harvests/${harvest.id}/edit`;
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(harvest.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
