"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  produceDetails?: string | null;
  createdAt: string;
}

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCancelOrder = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/logistics/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Refresh the list
        const updatedRes = await fetch("/api/logistics");
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setOrders(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track your logistics bookings and delivery status</p>
        </div>
        <Link
          href="/farmer/logistics/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Order
        </Link>
      </div>

      {/* Order Cards/List */}
      {orders.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            title="No orders yet"
            description="Book logistics to start moving your produce from farm to market."
            actionLabel="Book Your First Delivery"
            actionHref="/farmer/logistics/new"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} padding="md">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    order.orderStatus === "delivered" ? "bg-green-100" :
                    order.orderStatus === "in_transit" ? "bg-blue-100" :
                    order.orderStatus === "cancelled" ? "bg-red-100" :
                    "bg-yellow-100"
                  }`}>
                    <svg className={`w-6 h-6 ${
                      order.orderStatus === "delivered" ? "text-green-600" :
                      order.orderStatus === "in_transit" ? "text-blue-600" :
                      order.orderStatus === "cancelled" ? "text-red-600" :
                      "text-yellow-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{order.orderId}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{order.produceDetails || `${order.quantity} ${order.unit}`}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {order.pickupLocation}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>{order.deliveryLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-16 lg:pl-0">
                  <StatusBadge status={order.orderStatus} />
                  
                  {!["delivered", "cancelled", "failed"].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Order Timeline - Visual status indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { key: "pending", label: "Placed" },
                    { key: "assigned", label: "Assigned" },
                    { key: "accepted", label: "Accepted" },
                    { key: "picked_up", label: "Picked Up" },
                    { key: "in_transit", label: "In Transit" },
                    { key: "delivered", label: "Delivered" },
                  ].map((step, index) => {
                    const statusSteps = ["pending", "assigned", "accepted", "en_route_to_pickup", "picked_up", "in_transit", "delivered"];
                    const currentStepIndex = statusSteps.indexOf(order.orderStatus);
                    const stepIndex = statusSteps.indexOf(step.key);
                    // Handle approximate step matching
                    let isComplete = currentStepIndex >= stepIndex || 
                      (order.orderStatus === "en_route_to_pickup" && stepIndex <= 2) ||
                      (order.orderStatus !== "pending" && step.key === "accepted");
                    let isCurrent = step.key === order.orderStatus || 
                      (step.key === "accepted" && order.orderStatus === "en_route_to_pickup");
                    
                    return (
                      <div key={step.key} className="flex items-center shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          isComplete && !isCurrent ? "bg-primary-100 text-primary-700 border-2 border-primary-300" :
                          isCurrent ? "bg-primary-600 text-white border-2 border-primary-600 ring-2 ring-primary-200" :
                          "bg-gray-100 text-gray-400 border-2 border-gray-200"
                        }`}>
                          {isComplete && !isCurrent ? "✓" : index + 1}
                        </div>
                        {index < 5 && (
                          <div className={`w-6 h-0.5 ${
                            currentStepIndex > stepIndex ? "bg-primary-300" : "bg-gray-200"
                          }`} />
                        )}
                        <span className="ml-1 text-xs whitespace-nowrap hidden sm:inline">
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <p className="mt-3 text-xs text-gray-400">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
