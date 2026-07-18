import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farm2Market - Agricultural Logistics Platform",
  description: "Connect farmers with delivery partners to move produce from farm to market efficiently.",
  keywords: ["agriculture", "farming", "logistics", "delivery", "farm-to-market"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
