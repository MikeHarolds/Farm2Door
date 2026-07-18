"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface Driver {
  driver: {
    id: number;
    vehicleType?: string | null;
    vehicleNumber?: string | null;
    isAvailable: boolean;
    totalDeliveries: number;
  };
  userInfo: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    status: string;
  };
}

export default function PartnerDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await fetch("/api/partner/drivers");
        if (res.ok) {
          const data = await res.json();
          setDrivers(data.data?.drivers || data.data || []);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  const availableCount = drivers.filter(d => d.driver.isAvailable).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Drivers</h1>
          <p className="text-gray-500 mt-1">
            {drivers.length} total drivers • {availableCount} available now
          </p>
        </div>
      </div>

      {/* Driver Cards */}
      {drivers.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="No drivers yet"
            description="Drivers who join your company will appear here."
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <Card key={driver.driver.id} padding="lg">
              {/* Driver Avatar & Status */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 ${
                  driver.userInfo.status === "active" ? "bg-primary-500" : "bg-gray-400"
                }`}>
                  {driver.userInfo.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{driver.userInfo.name}</h3>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      driver.driver.isAvailable ? "bg-green-500" : "bg-yellow-500"
                    }`} title={driver.driver.isAvailable ? "Available" : "Busy"} />
                  </div>
                  <StatusBadge status={driver.userInfo.status as any} size="sm" />
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle Type</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {driver.driver.vehicleType || "Not specified"}
                  </span>
                </div>
                {driver.driver.vehicleNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vehicle No.</span>
                    <span className="font-medium text-gray-900">{driver.driver.vehicleNumber}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary-600">{driver.driver.totalDeliveries}</p>
                  <p className="text-xs text-gray-500">Deliveries</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold ${driver.driver.isAvailable ? "text-green-600" : "text-yellow-600"}`}>
                    {driver.driver.isAvailable ? "Online" : "Offline"}
                  </p>
                  <p className="text-xs text-gray-500">Status</p>
                </div>
              </div>

              {/* Contact */}
              {(driver.userInfo.phone || driver.userInfo.email) && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm text-gray-500">
                  {driver.userInfo.email && (
                    <p className="truncate" title={driver.userInfo.email}>
                      📧 {driver.userInfo.email}
                    </p>
                  )}
                  {driver.userInfo.phone && (
                    <p>📱 {driver.userInfo.phone}</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
