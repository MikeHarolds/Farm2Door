import React from "react";

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingState({ message = "Loading...", fullPage = false }: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullPage ? "min-h-[400px]" : "py-12"
      }`}
    >
      <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      {message && <p className="mt-4 text-gray-500 text-sm">{message}</p>}
    </div>
  );
}
