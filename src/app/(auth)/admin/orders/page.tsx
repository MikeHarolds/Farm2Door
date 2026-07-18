"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

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
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/logistics");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.orderStatus === filterStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  const statusOptions = ["all", "pending", "assigned", "accepted", "in_transit", "delivered", "cancelled"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Logistics Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders across all users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filterStatus === s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {s === "all" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<span>📦</span>} title={`No ${filterStatus !== 'all' ? filterStatus + ' ' : ''}orders`} />
        </Card>
      ) : (
        <Card padding="lg">
          <table className="w-full overflow-x-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Order ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Produce</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Route</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm font-medium text-primary-700">{order.orderId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{order.produceDetails || `${order.quantity} ${order.unit}`}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-[300px] truncate">{order.pickupLocation} → {order.deliveryLocation}</td>
                  <td className="py-3 px-4"><StatusBadge status={order.orderStatus} /></td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
