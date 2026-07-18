"use client";

import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  // Order statuses
  pending: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Pending" },
  assigned: { color: "text-blue-700", bg: "bg-blue-100", label: "Assigned" },
  accepted: { color: "text-primary-700", bg: "bg-primary-100", label: "Accepted" },
  en_route_to_pickup: { color: "text-indigo-700", bg: "bg-indigo-100", label: "En Route to Pickup" },
  picked_up: { color: "text-cyan-700", bg: "bg-cyan-100", label: "Picked Up" },
  in_transit: { color: "text-blue-600", bg: "bg-blue-100", label: "In Transit" },
  delivered: { color: "text-primary-700", bg: "bg-primary-100", label: "Delivered" },
  failed: { color: "text-red-700", bg: "bg-red-100", label: "Failed" },
  cancelled: { color: "text-gray-700", bg: "bg-gray-100", label: "Cancelled" },

  // User statuses
  active: { color: "text-primary-700", bg: "bg-primary-100", label: "Active" },
  inactive: { color: "text-gray-700", bg: "bg-gray-100", label: "Inactive" },
  pending_approval: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Pending Approval" },

  // Driver decision
  accepted_decision: { color: "text-primary-700", bg: "bg-primary-100", label: "Accepted" },
  rejected_decision: { color: "text-red-700", bg: "bg-red-100", label: "Rejected" },
  pending_decision: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Pending Decision" },

  // Availability
  available: { color: "text-primary-700", bg: "bg-primary-100", label: "Available" },
  sold_out: { color: "text-red-700", bg: "bg-red-100", label: "Sold Out" },
  limited: { color: "text-orange-700", bg: "bg-orange-100", label: "Limited" },

  // Harvest condition
  fresh: { color: "text-primary-700", bg: "bg-primary-100", label: "Fresh" },
  good: { color: "text-blue-700", bg: "bg-blue-100", label: "Good" },
  fair: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Fair" },
  needs_processing: { color: "text-orange-700", bg: "bg-orange-100", label: "Needs Processing" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    color: "text-gray-700",
    bg: "bg-gray-100",
    label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.color} ${config.bg} ${sizeClasses[size]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "active" ||
          status === "delivered" ||
          status === "available" ||
          status === "fresh"
            ? "bg-primary-500"
            : status === "pending" || status === "pending_decision"
            ? "bg-yellow-500"
            : status === "failed" || status === "cancelled" || status === "inactive" || status === "sold_out"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      />
      {config.label}
    </span>
  );
}
