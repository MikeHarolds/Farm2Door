"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminFarmersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers((data.data || []).filter((u: User) => u.role === "farmer"));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    setActionLoadingId(userId);
    const action = currentStatus === "active" ? "deactivate" : "activate";

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        // Refresh
        const updatedRes = await fetch("/api/admin/users");
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setUsers((data.data || []).filter((u: User) => u.role === "farmer"));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoadingId(null);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farmers</h1>
        <p className="text-gray-500 mt-1">
          {users.length} farmer(s) registered on the platform
        </p>
      </div>

      {users.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<span>🌾</span>}
            title="No farmers registered"
            description="Farmers who register will appear here."
          />
        </Card>
      ) : (
        <Card padding="lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Phone</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Joined</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.phone || "—"}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={user.status as any} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={actionLoadingId === user.id}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          user.status === "active"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        } disabled:opacity-50`}
                      >
                        {actionLoadingId === user.id ? "..." :
                         user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
