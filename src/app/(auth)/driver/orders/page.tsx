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
  deliveryInstructions?: string | null;
  createdAt: string;
}

export default function DriverOrdersPage() {
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/driver/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data?.assignedOrders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleAccept = async (orderId: number) => {
    setSelectedOrderId(orderId);
    try {
      const res = await fetch(`/api/logistics/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "accept" }),
      });

      if (res.ok) {
        // Refresh orders
        const updatedRes = await fetch("/api/driver/orders");
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setOrders(data.data?.assignedOrders || []);
        }
      }
    } catch (error) {
      console.error("Error accepting order:", error);
    } finally {
      setSelectedOrderId(null);
    }
  };

  const handleReject = async (orderId: number) => {
    if (!confirm("Are you sure you want to reject this order?")) return;
    
    setSelectedOrderId(orderId);
    try {
      const res = await fetch(`/api/logistics/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "reject" }),
      });

      if (res.ok) {
        // Refresh
        const updatedRes = await fetch("/api/driver/orders");
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setOrders(data.data?.assignedOrders || []);
        }
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
    } finally {
      setSelectedOrderId(null);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setSelectedOrderId(orderId);
    try {
      const res = await fetch(`/api/logistics/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedRes = await fetch("/api/driver/orders");
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setOrders(data.data?.assignedOrders || []);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setSelectedOrderId(null);
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
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Manage your delivery assignments and update status</p>
      </div>

      {orders.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            }
            title="No orders assigned"
            description="Orders will be assigned to you by your delivery company."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} padding="lg">
              {/* Order Header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex items-start gap-4 min-w-0">
                  <StatusBadge status={order.orderStatus} size="md" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{order.orderId}</h3>
                    <p className="text-sm text-gray-600 mt-1">{order.produceDetails || `${order.quantity} ${order.unit}`}</p>
                  </div>
                </div>

                {/* Action buttons based on status */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {(order.orderStatus === "assigned" || order.orderStatus === "pending") && (
                    <>
                      <button
                        onClick={() => handleAccept(order.id)}
                        disabled={selectedOrderId === order.id}
                        className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm"
                      >
                        {selectedOrderId === order.id ? "Processing..." : "✓ Accept"}
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        disabled={selectedOrderId === order.id}
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors text-sm"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}

                  {order.orderStatus === "accepted" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "en_route_to_pickup")}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🚗 En Route to Pickup
                    </button>
                  )}

                  {order.orderStatus === "en_route_to_pickup" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "picked_up")}
                      className="px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                    >
                      📦 Mark as Picked Up
                    </button>
                  )}

                  {order.orderStatus === "picked_up" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "in_transit")}
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      🛣️ Start Transit
                    </button>
                  )}

                  {order.orderStatus === "in_transit" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "delivered")}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      ✅ Mark Delivered
                    </button>
                  )}

                  {["delivered", "cancelled", "failed"].includes(order.orderStatus) && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                      order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                      order.orderStatus === "cancelled" ? "bg-gray-100 text-gray-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      Order {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                {/* Pickup Location */}
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Pickup Location</p>
                  <p className="text-sm font-medium text-gray-900 flex items-start gap-1.5">
                    <span>📍</span> 
                    <span>{order.pickupLocation}</span>
                  </p>
                </div>

                {/* Delivery Destination */}
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Delivery Destination</p>
                  <p className="text-sm font-medium text-gray-900 flex items-start gap-1.5">
                    <span>🎯</span> 
                    <span>{order.deliveryLocation}</span>
                  </p>
                </div>

                {/* Quantity */}
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Quantity</p>
                  <p className="text-sm font-medium text-gray-900">{order.quantity} {order.unit}</p>
                </div>

                {/* Farmer Contact */}
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Farmer Contact</p>
                  <p className="text-sm font-medium text-gray-900">{order.farmerContact || "N/A"}</p>
                </div>

                {/* Created Date */}
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Delivery Instructions */}
              {order.deliveryInstructions && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">📋 Delivery Instructions</p>
                  <p className="text-sm text-yellow-700">{order.deliveryInstructions}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
