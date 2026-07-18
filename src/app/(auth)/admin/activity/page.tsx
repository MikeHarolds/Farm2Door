"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

interface ActivityLog {
  id: number;
  adminId?: number | null;
  action: string;
  entityType?: string | null;
  entityId?: number | null;
  details?: string | null;
  createdAt: string;
  adminName?: string;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/admin/activity");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
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
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 mt-1">Platform activity and administrative actions</p>
      </div>

      {logs.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<span>📋</span>} title="No activity yet" description="Administrative actions will be logged here." />
        </Card>
      ) : (
        <Card padding="lg">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  log.entityType === "user" ? "bg-blue-100 text-blue-600" :
                  log.entityType === "company" ? "bg-purple-100 text-purple-600" :
                  log.entityType === "order" ? "bg-orange-100 text-orange-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {log.adminName?.charAt(0) || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{log.action}</p>
                  {log.details && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{log.details}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {log.adminName && (
                    <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded mb-1">
                      {log.adminName}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
