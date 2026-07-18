"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: "farmer" | "delivery_partner" | "driver" | "admin";
  userName: string;
}

const farmerNav: NavItem[] = [
  { label: "Dashboard", href: "/farmer", icon: <DashboardIcon /> },
  { label: "My Harvests", href: "/farmer/harvests", icon: <HarvestIcon /> },
  { label: "Add Harvest", href: "/farmer/harvests/new", icon: <AddIcon /> },
  { label: "Book Logistics", href: "/farmer/logistics/new", icon: <TruckIcon /> },
  { label: "My Orders", href: "/farmer/orders", icon: <OrderIcon /> },
  { label: "Farm Store", href: "/farmer/store", icon: <StoreIcon /> },
];

const partnerNav: NavItem[] = [
  { label: "Dashboard", href: "/partner", icon: <DashboardIcon /> },
  { label: "Orders", href: "/partner/orders", icon: <OrderIcon /> },
  { label: "Drivers", href: "/partner/drivers", icon: <DriverIcon /> },
  { label: "Profile", href: "/partner/profile", icon: <ProfileIcon /> },
];

const driverNav: NavItem[] = [
  { label: "Dashboard", href: "/driver", icon: <DashboardIcon /> },
  { label: "My Orders", href: "/driver/orders", icon: <OrderIcon /> },
  { label: "My Profile", href: "/driver/profile", icon: <ProfileIcon /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
  { label: "Farmers", href: "/admin/farmers", icon: <FarmerIcon /> },
  { label: "Drivers", href: "/admin/drivers", icon: <DriverIcon /> },
  { label: "Delivery Companies", href: "/admin/companies", icon: <CompanyIcon /> },
  { label: "All Orders", href: "/admin/orders", icon: <OrderIcon /> },
  { label: "Produce Listings", href: "/admin/produce", icon: <StoreIcon /> },
  { label: "Activity Log", href: "/admin/activity", icon: <ActivityIcon /> },
];

function getNavItems(role: SidebarProps["role"]): NavItem[] {
  switch (role) {
    case "farmer": return farmerNav;
    case "delivery_partner": return partnerNav;
    case "driver": return driverNav;
    case "admin": return adminNav;
  }
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  const getRoleLabel = () => {
    switch (role) {
      case "farmer": return "Farmer";
      case "delivery_partner": return "Delivery Partner";
      case "driver": return "Driver";
      case "admin": return "Administrator";
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "farmer": return "bg-primary-600";
      case "delivery_partner": return "bg-blue-600";
      case "driver": return "bg-orange-600";
      case "admin": return "bg-purple-600";
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-200">
        <div className={`w-10 h-10 rounded-lg ${getRoleColor()} flex items-center justify-center`}>
          <span className="text-white text-xl font-bold">F2M</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Farm2Market</h1>
          <p className="text-xs text-gray-500">{getRoleLabel()}</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{userName}</p>
        <p className="text-xs text-gray-500 capitalize">{getRoleLabel()}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== `//${role}` && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={isActive ? "text-primary-600" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogoutIcon />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}

// Icons
function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function HarvestIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function DriverIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function FarmerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
