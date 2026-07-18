"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface Company {
  id: number;
  userId: number;
  companyName: string;
  contactPerson?: string | null;
  address?: string | null;
  fleetSize?: number;
  isActive: boolean;
  capacityAvailable: boolean;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    status: string;
  } | null;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/admin/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Companies</h1>
          <p className="text-gray-500 mt-1">
            {companies.length} delivery partner(s) on the platform
          </p>
        </div>
        <Link
          href="/admin/companies/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Onboard New Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<span>🏢</span>}
            title="No delivery companies yet"
            description="Onboard delivery partners to start handling logistics."
            actionLabel="Onboard First Company"
            actionHref="/admin/companies/new"
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  company.isActive ? "bg-purple-100" : "bg-gray-100"
                }`}>
                  <span className="text-2xl">🏢</span>
                </div>
                <StatusBadge status={company.isActive ? "active" : "inactive"} />
              </div>

              <h3 className="font-semibold text-lg text-gray-900">{company.companyName}</h3>

              {company.contactPerson && (
                <p className="text-sm text-gray-600 mt-1">Contact: {company.contactPerson}</p>
              )}

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                {company.address && (
                  <p>📍 {company.address}</p>
                )}
                <p>📧 {company.user?.email || company.userId}</p>
                <p>🚛 Fleet Size: {company.fleetSize || 0}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Joined {new Date(company.createdAt).toLocaleDateString()}
                </span>
                <span className={`inline-flex items-center w-2 h-2 rounded-full ${company.capacityAvailable ? "bg-green-500" : "bg-red-500"}`} 
                      title={company.capacityAvailable ? "Accepting orders" : "At capacity"} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
