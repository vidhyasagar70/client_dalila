"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
// import { Search, CheckCircle,ChevronLeft, ChevronRight, X } from "lucide-react";
import { userApi } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

// Extended User interface matching API response
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface BusinessInfo {
  companyName: string;
  businessType: string;
  vatNumber: string;
  websiteUrl?: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  address: Address;
  businessInfo: BusinessInfo;
  submittedAt?: string;
}

interface ExtendedUser {
  _id: string;
  id?: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  kycStatus?: string;
  status?: string;
  role?: string;
  customerData?: CustomerData;
}

export default function MembersManagement() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter states
  const [activeTab, setActiveTab] = useState<"authorized" | "waiting">(
    "waiting",
  );
  const [searchQuery] = useState("");
  // const [selectedFilter, setSelectedFilter] = useState("");
  // const [selectedPerson, setSelectedPerson] = useState("");
  // const [selectedStockLimit, setSelectedStockLimit] = useState("");
  // const [byExApp, setByExApp] = useState(false);
  // const [onlyInStock, setOnlyInStock] = useState(false);
  // const [memoParty, setMemoParty] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch pending customer data
  const fetchPendingUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getPendingCustomerData();

      if (!response) {
        setError("Failed to fetch pending users");
        setLoading(false);
        return;
      }

      console.log("Pending users response:", response);

      if (response.success && response.data) {
        // The response.data is directly an array of users
        const pendingUsers = Array.isArray(response.data) ? response.data : [];

        const transformedUsers: ExtendedUser[] = pendingUsers.map((user) => ({
          ...user,
          id: user._id || user.id,
          firstName: user.customerData?.firstName || user.firstName,
          lastName: user.customerData?.lastName || user.lastName,
        }));

        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load pending users",
      );
      setLoading(false);
    }
  }, []);

  // Fetch authorized users
  const fetchAuthorizedUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getAllUsers();

      if (!response) {
        setError("Failed to fetch authorized users");
        setLoading(false);
        return;
      }

      console.log("Authorized users response:", response);

      if (response.success && response.data) {
        // Access the users array from response.data
        const usersArray = Array.isArray(response.data) ? response.data : [];

        // Filter only users with status "APPROVED" and transform to ExtendedUser type
        const authorizedUsers: ExtendedUser[] = usersArray
          .filter((user) => user.status === "APPROVED")
          .map((user) => ({
            _id: user._id || user.id || "",
            id: user.id || user._id,
            email: user.email,
            username: user.username,
            firstName: user.firstName || user.customerData?.firstName,
            lastName: user.lastName || user.customerData?.lastName,
            kycStatus: user.kycStatus,
            status: user.status,
            role: user.role,
            customerData: user.customerData,
          }));

        console.log("Filtered authorized users:", authorizedUsers);
        setUsers(authorizedUsers);
        setFilteredUsers(authorizedUsers);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching authorized users:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load authorized users",
      );
      setLoading(false);
    }
  }, []);

  // Fetch users based on active tab
  useEffect(() => {
    if (activeTab === "waiting") {
      fetchPendingUsers();
    } else {
      fetchAuthorizedUsers();
    }
  }, [activeTab, fetchPendingUsers, fetchAuthorizedUsers]);

  // Handle search
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.customerData?.businessInfo?.companyName
            ?.toLowerCase()
            .includes(query) ||
          user.customerData?.phoneNumber?.includes(query),
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  // Approve user
  const handleApprove = useCallback(
    async (userId: string) => {
      try {
        setActionLoading(userId);

        const response = await userApi.approveCustomerData(userId);

        console.log("Approve response:", response);

        if (response && response.success) {
          // Refresh the user list
          await fetchPendingUsers();
          setError(null);
        } else {
          setError(response?.message || "Failed to approve user");
        }
      } catch (error) {
        console.error("Error approving user:", error);
        setError(
          error instanceof Error ? error.message : "Failed to approve user",
        );
      } finally {
        setActionLoading(null);
      }
    },
    [fetchPendingUsers],
  );

  // Reject user
  const handleReject = useCallback(
    async (userId: string) => {
      const reason = prompt("Please enter rejection reason:");

      if (!reason || reason.trim() === "") {
        return;
      }

      try {
        setActionLoading(userId);

        const response = await userApi.rejectCustomerData(
          userId,
          reason.trim(),
        );

        console.log("Reject response:", response);

        if (response && response.success) {
          // Refresh the user list
          await fetchPendingUsers();
          setError(null);
        } else {
          setError(response?.message || "Failed to reject user");
        }
      } catch (error) {
        console.error("Error rejecting user:", error);
        setError(
          error instanceof Error ? error.message : "Failed to reject user",
        );
      } finally {
        setActionLoading(null);
      }
    },
    [fetchPendingUsers],
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <ProtectedRoute
      requireAuth={true}
      redirectTo="/login"
      allowedRoles={["ADMIN", "SUPER_ADMIN"]}
    >
      <div className="min-h-screen bg-white p-8 mt-35">
        {/* Header Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("authorized")}
            className={`px-6 py-2.5 rounded-none font-medium transition ${
              activeTab === "authorized"
                ? "text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={
              activeTab === "authorized"
                ? { backgroundColor: "#050c3a" }
                : { border: "1px solid #e5e7eb" }
            }
          >
            Authorized Members
          </button>
          <button
            onClick={() => setActiveTab("waiting")}
            className={`px-6 py-2.5 rounded-none font-medium transition ${
              activeTab === "waiting"
                ? "text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={
              activeTab === "waiting"
                ? { backgroundColor: "#050c3a" }
                : { border: "1px solid #e5e7eb" }
            }
          >
            Waiting Authorization
          </button>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <span className="text-red-800 text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
              style={{ border: '1px solid #f9ead4' }}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div> */}

          {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">M. Person</label>
          <div className="relative">
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg appearance-none bg-white focus:outline-none"
              style={{ border: '1px solid #f9ead4' }}
            >
              <option value="">Select</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock Limit</label>
          <div className="relative">
            <select
              value={selectedStockLimit}
              onChange={(e) => setSelectedStockLimit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg appearance-none bg-white focus:outline-none"
              style={{ border: '1px solid #f9ead4' }}
            >
              <option value="">Select</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div> */}
        </div>

        {/* Checkboxes */}
        {/* <div className="mb-6 flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={byExApp}
            onChange={(e) => setByExApp(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded focus:ring-slate-900"
          />
          <span className="text-sm text-gray-700">By Ex. App.</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded focus:ring-slate-900"
          />
          <span className="text-sm text-gray-700">Only in Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={memoParty}
            onChange={(e) => setMemoParty(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded focus:ring-slate-900"
          />
          <span className="text-sm text-gray-700">Memo Party</span>
        </label>
      </div> */}

        {/* Table */}
        <div
          className="bg-white overflow-hidden"
          style={{ border: "1px solid #f9ead4" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead style={{ backgroundColor: "#050c3a" }}>
                <tr
                  style={{
                    borderBottom: "1px solid #f9ead4",
                  }}
                >
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "40px" }}
                  >
                    Sr
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "120px" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "80px" }}
                  >
                    Username
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "120px" }}
                  >
                    Email
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "100px" }}
                  >
                    Phone
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "120px" }}
                  >
                    Company
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "80px" }}
                  >
                    Business Type
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "100px" }}
                  >
                    VAT Number
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "120px" }}
                  >
                    Address
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-xs font-semibold text-white"
                    style={{ width: "80px" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-8 text-center text-gray-500 text-xs"
                    >
                      Loading members...
                    </td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => {
                    const userData = user.customerData;
                    const fullName =
                      `${userData?.firstName || user.firstName || ""} ${userData?.lastName || user.lastName || ""}`.trim();
                    const phone =
                      userData?.countryCode && userData?.phoneNumber
                        ? `${userData.countryCode} ${userData.phoneNumber}`
                        : "N/A";
                    const address = userData?.address
                      ? `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.postalCode}`
                      : "N/A";
                    const userId = user._id || user.id || "";

                    return (
                      <tr
                        key={userId}
                        style={{
                          borderBottom: "1px solid #f9ead4",
                        }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {fullName || "N/A"}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {user.username || "N/A"}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {phone}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {userData?.businessInfo?.companyName || "N/A"}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {userData?.businessInfo?.businessType || "N/A"}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900">
                          {userData?.businessInfo?.vatNumber || "N/A"}
                        </td>
                        <td
                          className="px-2 py-2 text-xs text-gray-900 max-w-[120px] truncate"
                          title={address}
                        >
                          {address}
                        </td>
                        <td className="px-2 py-2 text-xs">
                          {activeTab === "waiting" ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleApprove(userId)}
                                disabled={actionLoading === userId}
                                className="text-emerald-600 cursor-pointer hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Approve"
                              >
                                {actionLoading === userId ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(userId)}
                                disabled={actionLoading === userId}
                                className="text-red-600  cursor-pointer hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center">
                      <p className="text-gray-500 font-medium text-xs">
                        {activeTab === "waiting"
                          ? "No pending members found"
                          : "No authorized members found"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="px-4 py-3 flex justify-between items-center"
              style={{
                borderTop: "1px solid #f9ead4",
                backgroundColor: "#faf6eb",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && setCurrentPage(page)
                    }
                    disabled={page === "..."}
                    className={`min-w-[32px] h-8 px-2.5 rounded text-xs font-medium transition ${
                      page === currentPage
                        ? "bg-slate-900 text-white"
                        : page === "..."
                          ? "text-gray-400 cursor-default bg-transparent"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                    style={
                      page !== "..." && page !== currentPage
                        ? {
                            border: "1px solid #f9ead4",
                          }
                        : {}
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
