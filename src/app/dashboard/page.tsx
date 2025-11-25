// app/dashboard/page.tsx
"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import Dashboard from "../../components/Dashboard/page";
export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["USER"]} redirectTo="/login">
      <main className="relative">
        <Dashboard />
      </main>
    </ProtectedRoute>
  );
}
