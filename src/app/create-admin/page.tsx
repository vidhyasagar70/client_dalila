"use client";

import React, { useState, useEffect } from "react";
import { userApi, User } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2, Trash2, Plus, Eye, EyeOff } from "lucide-react";

interface AdminUser extends User {
  _id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function CreateAdminPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch admin list
  const fetchAdminList = async (page: number = 1) => {
    try {
      setIsLoadingList(true);
      const response = await userApi.getAdminList({ page, limit: 10 });

      console.log("Admin list response:", response);

      if (response?.success) {
        // Response structure: { success, message, data: [], pagination: {} }
        setAdminList((response.data || []) as AdminUser[]);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching admin list:", error);
      setMessage({
        type: "error",
        text: "Failed to load admin list",
      });
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdminList(currentPage);
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await userApi.createAdmin({
        username,
        email,
        password,
      });

      if (response?.success) {
        setMessage({
          type: "success",
          text: "Admin created successfully!",
        });
        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
        // Refresh admin list
        fetchAdminList(currentPage);
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to create admin",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create admin",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to delete admin: ${adminEmail}?`)) {
      return;
    }

    try {
      console.log("Attempting to delete admin:", adminId);
      const response = await userApi.deleteAdmin(adminId);

      console.log("Delete response:", response);

      if (response?.success) {
        setMessage({
          type: "success",
          text: response?.message || "Admin deleted successfully!",
        });
        // Refresh admin list
        fetchAdminList(currentPage);
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to delete admin",
        });
      }
    } catch (error) {
      console.error("Delete admin error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete admin",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EB] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#060c3c] mb-2">
            Create Admin
          </h1>
          <p className="text-gray-600">
            Create new admin users and manage existing admins
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Create Admin Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#060c3c] mb-6 flex items-center gap-2">
            <Plus size={24} className="text-[#c89e3a]" />
            Create New Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c89e3a] focus:border-transparent outline-none transition-all bg-white text-gray-900"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c89e3a] focus:border-transparent outline-none transition-all bg-white text-gray-900"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c89e3a] focus:border-transparent outline-none transition-all pr-12 bg-white text-gray-900"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#c89e3a] cursor-pointer text-white rounded-lg hover:bg-[#b08830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#060c3c]">
              Admin Users List
            </h2>
            {pagination && (
              <p className="text-sm text-gray-600 mt-1">
                Total: {pagination.totalRecords} admin{pagination.totalRecords !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {isLoadingList ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-[#c89e3a]" size={40} />
            </div>
          ) : adminList.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No admin users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0B1B35] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Created At
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminList.map((admin) => (
                      <tr
                        key={admin._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {admin.username}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#c89e3a] text-white">
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              admin.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(admin.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(admin._id, admin.email)}
                            className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Admin"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(pagination.totalPages, prev + 1)
                        )
                      }
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateAdmin() {
  return (
    <ProtectedRoute requireAuth allowedRoles={["SUPER_ADMIN"]}>
      <CreateAdminPage />
    </ProtectedRoute>
  );
}
