"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectIfAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
  requireCustomerData?: boolean;
  requireKycApproval?: boolean;
  requireApprovedStatus?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = false,
  redirectIfAuth = false,
  redirectTo = "/",
  allowedRoles,
  requireCustomerData = false,
  requireKycApproval = false,
  requireApprovedStatus = false, // NEW parameter
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      // Get auth data from localStorage
      let userStr = localStorage.getItem("user");
      let token = localStorage.getItem("authToken");

      // Fallback to cookies
      if (!userStr || !token) {
        const cookies = document.cookie.split(";");
        const tokenCookie = cookies.find((c) =>
          c.trim().startsWith("authToken="),
        );
        const userCookie = cookies.find((c) => c.trim().startsWith("user="));

        if (tokenCookie && !token) {
          token = tokenCookie.split("=")[1].trim();
        }
        if (userCookie && !userStr) {
          try {
            userStr = decodeURIComponent(userCookie.split("=")[1].trim());
          } catch (e) {
            console.error("Error decoding user cookie:", e);
          }
        }
      }

      const isLoggedIn = !!(userStr && token);
      let userRole: string | null = null;
      let hasCustomerData = false;
      let kycStatus: string | null = null;
      let userStatus: string | null = null; // NEW: Get user status

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userRole = user.role || null;
          hasCustomerData = !!(
            user.customerData && Object.keys(user.customerData).length > 0
          );
          kycStatus = user.kycStatus || null;
          userStatus = user.status || null; // NEW: Extract status
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      console.log("ProtectedRoute Check:", {
        pathname,
        isLoggedIn,
        userRole,
        hasCustomerData,
        kycStatus,
        userStatus, // NEW: Log status
        requireAuth,
        requireCustomerData,
        requireKycApproval,
        requireApprovedStatus, // NEW: Log requirement
      });

      // Case 1: Route requires authentication but user is not logged in
      if (requireAuth && !isLoggedIn) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Case 2: Route should redirect if user IS logged in (like login/register pages)
      if (redirectIfAuth && isLoggedIn) {
        setIsAuthorized(false);
        setIsChecking(false);

        // If admin or super admin, go to dashboard
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          router.push("/");
        }
        // If user hasn't completed customer data, go to customer-details
        else if (!hasCustomerData) {
          router.push("/customer-details");
        }
        // Otherwise, go to intended destination
        else {
          router.push(redirectTo);
        }
        return;
      }

      // Case 3: Route requires customer data but user hasn't submitted it
      // (Except for admin users who don't need customer data)
      if (
        requireAuth &&
        requireCustomerData &&
        userRole !== "ADMIN" &&
        userRole !== "SUPER_ADMIN" &&
        !hasCustomerData
      ) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.push("/customer-details");
        return;
      }

      // Case 4: Route requires KYC approval
      // (Except for admin users who don't need KYC)
      if (requireAuth && requireKycApproval && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        if (kycStatus !== "approved") {
          setIsAuthorized(false);
          setIsChecking(false);

          if (kycStatus === "pending") {
            router.push("/pending-approval");
          } else if (kycStatus === "rejected") {
            router.push("/kyc-rejected");
          } else {
            router.push("/customer-details");
          }
          return;
        }
      }

      // NEW Case 5: Route requires APPROVED status
      // (Except for admin users who don't need status check)
      if (requireAuth && requireApprovedStatus && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        if (userStatus !== "APPROVED") {
          setIsAuthorized(false);
          setIsChecking(false);
          // Redirect to pending approval page or show access denied
          router.push("/pending-approval");
          return;
        }
      }

      // Case 6: Check role-based access if roles are specified
      if (requireAuth && allowedRoles && allowedRoles.length > 0) {
        if (!userRole || !allowedRoles.includes(userRole)) {
          setIsAuthorized(false);
          setIsChecking(false);
          router.push(redirectTo);
          return;
        }
      }

      // All checks passed
      console.log("✅ Authorization check PASSED for:", pathname);
      setIsAuthorized(true);
      setIsChecking(false);
    };

    const timeoutId = setTimeout(checkAuth, 200);

    // Listen for auth changes
    const handleAuthChange = () => {
      setTimeout(checkAuth, 200);
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("user-logged-in", handleAuthChange);
    window.addEventListener("user-logged-out", handleAuthChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("user-logged-in", handleAuthChange);
      window.removeEventListener("user-logged-out", handleAuthChange);
    };
  }, [
    pathname,
    requireAuth,
    redirectIfAuth,
    redirectTo,
    allowedRoles,
    requireCustomerData,
    requireKycApproval,
    requireApprovedStatus,
    router,
  ]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050c3a]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#c89e3a] border-r-transparent"></div>
          <p className="mt-4 text-white">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
