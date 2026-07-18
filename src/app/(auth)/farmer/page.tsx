"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

interface Harvest {
  id: number;
  cropName: string;
  quantity: string;
  unit: string;
  harvestDate: string;
  condition: string;
  status: string;
}

interface LogisticsOrder {
  id: number;
  orderId: string;
  orderStatus: string;
  quantity: string;
  unit: string;
  createdAt: string;
}

interface Stats {
  totalHarvests: number;
  activeOrders: number;
  totalListings: number;
}

export default function FarmerDashboard() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [listingsCount, setListingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [harvestsRes, ordersRes, listingsRes] = await Promise.all([
          fetch("/api/harvests"),
          fetch("/api/logistics"),
          fetch("/api/produce"),
        ]);

        if (harvestsRes.ok) {
          const data = await harvestsRes.json();
          setHarvests(data.data || []);
        }

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.data || []);
        }

        if (listingsRes.ok) {
          const data = await listingsRes.json();
          setListingsCount((data.data || []).length);
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
      label: "Total Harvests",
      value: harvests.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-primary-50 text-primary-600",
      href: "/farmer/harvests",
    },
    {
      label: "Active Orders",
      value: orders.filter(o => !["delivered", "cancelled", "failed"].includes(o.orderStatus)).length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
      href: "/farmer/orders",
    },
    {
      label: "Farm Store Listings",
      value: listingsCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "bg-orange-50 text-orange-600",
      href: "/farmer/store",
    },
    {
      label: "Delivered Shipments",
      value: orders.filter(o => o.orderStatus === "delivered").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      href: "/farmer/orders",
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
        <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your farm operations.</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/farmer/harvests/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Harvest
        </Link>
        <Link
          href="/farmer/logistics/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          Book Logistics
        </Link>
        <Link
          href="/farmer/store"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Manage Store
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card padding="md" className="hover:shadow-md transition-shadow">
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
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Harvests */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Harvests</h2>
            <Link href="/farmer/harvests" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>

          {harvests.length === 0 ? (
            <EmptyState
              title="No harvests yet"
              description="Start by adding your first harvested crop to track your production."
              actionLabel="Add Harvest"
              actionHref="/farmer/harvests/new"
            />
          ) : (
            <div className="space-y-3">
              {harvests.slice(0, 5).map((harvest) => (
                <div key={harvest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{harvest.cropName}</p>
                    <p className="text-sm text-gray-500">
                      {harvest.quantity} {harvest.unit} • {harvest.condition}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(harvest.harvestDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/farmer/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Book logistics to start moving your produce."
              actionLabel="Book Logistics"
              actionHref="/farmer/logistics/new"
            />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      {order.quantity} {order.unit}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                    order.orderStatus === "in_transit" ? "bg-blue-100 text-blue-700" :
                    order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
