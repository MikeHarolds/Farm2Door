"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { SessionUser } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: SessionUser;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={user.role} userName={user.name || "User"} />
      
      {/* Main content */}
      <main className="ml-64 min-h-screen p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
