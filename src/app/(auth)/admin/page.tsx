"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Company {
  id: number;
  companyName: string;
  isActive: boolean;
  fleetSize?: number;
}

interface Order {
  id: number;
  orderStatus: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, companiesRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/companies"),
          fetch("/api/logistics"),
        ]);

        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data.data || []);
        }

        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(data.data || []);
        }

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.data || []);
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
      label: "Total Users",
      value: users.length,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      href: "/admin/farmers",
    },
    {
      label: "Farmers",
      value: users.filter(u => u.role === "farmer").length,
      icon: "🌾",
      color: "from-primary-500 to-green-600",
      href: "/admin/farmers",
    },
    {
      label: "Delivery Companies",
      value: companies.length,
      icon: "🏢",
      color: "from-purple-500 to-purple-600",
      href: "/admin/companies",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "📦",
      color: "from-orange-500 to-red-500",
      href: "/admin/orders",
    },
    {
      label: "Drivers",
      value: users.filter(u => u.role === "driver").length,
      icon: "🚛",
      color: "from-cyan-500 to-blue-500",
      href: "/admin/drivers",
    },
    {
      label: "Active Deliveries",
      value: orders.filter(o => ["accepted", "in_transit", "picked_up"].includes(o.orderStatus)).length,
      icon: "🚀",
      color: "from-yellow-500 to-orange-500",
      href: "/admin/orders",
    },
    {
      label: "Completed Orders",
      value: orders.filter(o => o.orderStatus === "delivered").length,
      icon: "✅",
      color: "from-green-500 to-emerald-500",
      href: "/admin/orders",
    },
    {
      label: "Pending Users",
      value: users.filter(u => u.status === "pending").length,
      icon: "⏳",
      color: "from-gray-400 to-gray-500",
      href: "/admin/farmers",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and system management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card padding="md" className={`bg-gradient-to-br ${stat.color} text-white hover:scale-[1.02] transition-transform cursor-pointer`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-sm opacity-80">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <Link href="/admin/farmers" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    user.role === "farmer" ? "bg-primary-500" :
                    user.role === "delivery_partner" ? "bg-blue-500" :
                    user.role === "driver" ? "bg-orange-500" :
                    "bg-purple-500"
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  user.status === "active" ? "bg-green-100 text-green-700" :
                  user.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "View Farmers", href: "/admin/farmers", icon: "🌾", bg: "bg-primary-50 hover:bg-primary-100" },
              { label: "Manage Drivers", href: "/admin/drivers", icon: "🚛", bg: "bg-blue-50 hover:bg-blue-100" },
              { label: "Onboard Partner", href: "/admin/companies/new", icon: "🏢", bg: "bg-purple-50 hover:bg-purple-100" },
              { label: "All Orders", href: "/admin/orders", icon: "📦", bg: "bg-orange-50 hover:bg-orange-100" },
              { label: "Produce Listings", href: "/admin/produce", icon: "🛒", bg: "bg-green-50 hover:bg-green-100" },
              { label: "Activity Log", href: "/admin/activity", icon: "📋", bg: "bg-gray-50 hover:bg-gray-100" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 transition-colors ${action.bg}`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
