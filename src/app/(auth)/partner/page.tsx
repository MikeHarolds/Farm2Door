"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

interface LogisticsOrder {
  id: number;
  orderId: string;
  orderStatus: string;
  pickupLocation: string;
  deliveryLocation: string;
  quantity: string;
  unit: string;
  createdAt: string;
}

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

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, driversRes] = await Promise.all([
          fetch("/api/logistics"),
          fetch("/api/partner/drivers"),
        ]);

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.data || []);
        }

        if (driversRes.ok) {
          const data = await driversRes.json();
          setDrivers(data.data?.drivers || data.data || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Deliveries",
      value: orders.filter(o => ["accepted", "en_route_to_pickup", "picked_up", "in_transit"].includes(o.orderStatus)).length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Drivers",
      value: drivers.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Completed",
      value: orders.filter(o => o.orderStatus === "delivered").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your logistics operations and drivers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md" className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Info Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/partner/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders yet</p>
              <p className="text-sm">Orders assigned to your company will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderId}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                      {order.pickupLocation} → {order.deliveryLocation}
                    </p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Drivers */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Drivers</h2>
            <Link href="/partner/drivers" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>

          {drivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No drivers registered</p>
              <p className="text-sm">Drivers will appear once they join your company</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drivers.slice(0, 5).map((driver) => (
                <div key={driver.driver.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      driver.userInfo.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`}>
                      {driver.userInfo.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{driver.userInfo.name}</p>
                      <p className="text-xs text-gray-500">
                        {driver.driver.vehicleType || "No vehicle"} • {driver.driver.totalDeliveries} deliveries
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center w-2.5 h-2.5 rounded-full ${
                    driver.driver.isAvailable ? "bg-green-500" : "bg-yellow-500"
                  }`} title={driver.driver.isAvailable ? "Available" : "Busy"} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
