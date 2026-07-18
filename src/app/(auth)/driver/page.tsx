"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

interface DriverData {
  id: number;
  vehicleType?: string | null;
  isAvailable: boolean;
  totalDeliveries: number;
}

interface LogisticsOrder {
  id: number;
  orderId: string;
  orderStatus: string;
  pickupLocation: string;
  deliveryLocation: string;
  quantity: string;
  unit: string;
  produceDetails?: string | null;
  farmerContact?: string | null;
  deliveryInstructions?: string | null;
  createdAt: string;
}

export default function DriverDashboard() {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/driver/orders");
        if (res.ok) {
          const data = await res.json();
          setDriverData(data.data?.driver || null);
          setOrders(data.data?.assignedOrders || []);
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const pendingCount = orders.filter(o => o.orderStatus === "assigned" || o.orderStatus === "pending").length;
  const activeDeliveries = orders.filter(o => ["accepted", "en_route_to_pickup", "picked_up", "in_transit"].includes(o.orderStatus)).length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {driverData ? `${driverData.vehicleType || "Vehicle"} Driver` : "Loading..."} • 
            {` ${orders.length} orders assigned`}
          </p>
        </div>
        
        {driverData && (
          <button
            onClick={() => {/* Toggle availability */}}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              driverData.isAvailable 
                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${
              driverData.isAvailable ? "bg-green-500" : "bg-yellow-500"
            }`} />
            {driverData.isAvailable ? "Available" : "Unavailable"}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Action</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Deliveries</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{activeDeliveries}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Action - Pending Orders */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">You have {pendingCount} order(s) awaiting your response</h3>
              <p className="text-sm text-orange-700 mt-0.5">Accept or reject to let the farmer know</p>
            </div>

            <Link
              href="/driver/orders"
              className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shrink-0"
            >
              View Orders
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Orders</h2>
          <Link href="/driver/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <p className="font-medium text-gray-900">No orders assigned yet</p>
            <p className="text-sm mt-1">Orders assigned by your delivery company will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <StatusBadge status={order.orderStatus} size="md" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{order.orderId}</p>
                  <p className="text-sm text-gray-500 truncate">{order.produceDetails || `${order.quantity} ${order.unit}`}</p>
                </div>

                <div className="hidden md:block text-right text-sm text-gray-500 min-w-[150px]">
                  <p>📍 {order.pickupLocation.split(",")[0]}</p>
                  <p className="truncate">→ {order.deliveryLocation.split(",")[0]}</p>
                </div>

                <Link
                  href={`/driver/orders/${order.id}`}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Total Deliveries Stat */}
      {driverData && (
        <Card padding="md" className="bg-primary-50 border-primary-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              🏆
            </div>
            <div>
              <p className="text-sm font-medium text-primary-800">Career Statistics</p>
              <p className="text-lg font-bold text-primary-900">{driverData.totalDeliveries} total deliveries completed</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
