"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface LogisticsOrder {
  id: number;
  orderId: string;
  pickupLocation: string;
  deliveryLocation: string;
  quantity: string;
  unit: string;
  orderStatus: string;
  driverDecisionStatus: string;
  driverId?: number | null;
  produceDetails?: string | null;
  createdAt: string;
}

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(o => o.orderStatus === filterStatus);

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
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-500 mt-1">View and manage all logistics orders assigned to your company</p>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "assigned", "accepted", "in_transit", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All Orders" : status.replace(/_/g, " ")}
              {status !== "all" && orders.filter(o => o.orderStatus === status).length > 0 && (
                <span className="ml-1.5 text-xs opacity-75">
                  ({orders.filter(o => o.orderStatus === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            title={filterStatus === "all" ? "No orders yet" : `No ${filterStatus.replace(/_/g, " ")} orders`}
            description={filterStatus === "all" 
              ? "Orders assigned by farmers will appear here." 
              : `Try selecting a different filter.`}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} padding="lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${
                    order.orderStatus === "delivered" ? "bg-green-50" :
                    order.orderStatus === "in_transit" || order.orderStatus === "accepted" ? "bg-blue-50" :
                    order.orderStatus === "cancelled" ? "bg-red-50" :
                    order.orderStatus === "assigned" ? "bg-orange-50" :
                    "bg-gray-50"
                  }`}>
                    <svg className={`w-6 h-6 ${
                      order.orderStatus === "delivered" ? "text-green-500" :
                      order.orderStatus === "in_transit" || order.orderStatus === "accepted" ? "text-blue-500" :
                      order.orderStatus === "cancelled" ? "text-red-500" :
                      order.orderStatus === "assigned" ? "text-orange-500" :
                      "text-gray-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900">{order.orderId}</p>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{order.produceDetails || `${order.quantity} ${order.unit}`}</p>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        {order.pickupLocation}
                      </span>
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>{order.deliveryLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:text-right shrink-0">
                  <div className="text-sm text-gray-500">
                    {order.driverId ? (
                      <span className="inline-flex items-center text-blue-600 font-medium">
                        ✓ Driver Assigned
                      </span>
                    ) : (
                      <span className="text-orange-600 font-medium">Awaiting Assignment</span>
                    )}
                  </div>
                  <StatusBadge 
                    status={
                      order.driverDecisionStatus === "accepted" ? "accepted_decision" :
                      order.driverDecisionStatus === "rejected" ? "rejected_decision" :
                      "pending_decision"
                    } 
                  />
                </div>
              </div>

              <p className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
