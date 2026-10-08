"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Application Error</h2>
          <p className="text-sm text-slate-500">
            {error?.message || "An unexpected error occurred while loading this page."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
