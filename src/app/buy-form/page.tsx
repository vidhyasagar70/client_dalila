"use client";

import BuyFormManagement from "@/components/BuyForm/BuyFormManagement";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BuyFormPage() {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["ADMIN", "SUPER_ADMIN"]} redirectTo="/">
      <div className="min-h-screen bg-gray-50 py-8 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BuyFormManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
}
