// app/limitedEdition/page.tsx
"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import DiamondStockTableWithFilter from "@/components/LimitedEdition/DiamondStockTableWithFilterlimited";

export default function LimitedEditionPage() {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["ADMIN", "SUPER_ADMIN"]} redirectTo="/">
      <DiamondStockTableWithFilter />
    </ProtectedRoute>
  );
}
