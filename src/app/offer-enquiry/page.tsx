"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, X, RefreshCw, FileText } from "lucide-react";

// Define types inline
interface ExtendedQuotation {
  id: string;
  stoneNumbers: string[];
  quotedPrice: number;
  status: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  submittedAt?: string;
}

interface QuotationAPI {
  getAll?: () => Promise<{
    success: boolean;
    data: { quotations: ExtendedQuotation[] };
  }>;
  approve?: (
    id: string,
    data: { quotedPrice: number; validUntil: string; notes: string },
  ) => Promise<{ success: boolean }>;
  reject?: (id: string, reason: string) => Promise<{ success: boolean }>;
}

interface WindowWithAPI extends Window {
  quotationApi?: QuotationAPI;
}

export default function QuotationsManagement() {
  const [filteredQuotations, setFilteredQuotations] = useState<
    ExtendedQuotation[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Single mock quotation used for all rows
  const singleMockQuotation: ExtendedQuotation = {
    id: "Q001",
    stoneNumbers: ["ST-1001", "ST-1002", "ST-1003"],
    quotedPrice: 5000,
    status: "pending",
    user: { firstName: "John", lastName: "Doe", email: "john@example.com" },
  };

  // Generate mock data array using the single mock
  const generateMockData = (): ExtendedQuotation[] => {
    return Array.from({ length: 15 }, (_, i) => ({
      ...singleMockQuotation,
      id: `Q${String(i + 1).padStart(3, "0")}`,
      status: i % 3 === 0 ? "approved" : i % 3 === 1 ? "rejected" : "pending",
      quotedPrice: i % 3 === 2 ? 0 : 5000 + i * 100,
    }));
  };

  // Fetch quotations from API
  useEffect(() => {
    fetchQuotations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      try {
        const quotationApi = (window as WindowWithAPI).quotationApi;
        if (quotationApi && quotationApi.getAll) {
          const response = await quotationApi.getAll();

          if (
            response &&
            response.success &&
            response.data &&
            response.data.quotations?.length > 0
          ) {
            setFilteredQuotations(response.data.quotations);
            setLoading(false);
            return;
          }
        }
      } catch {
        console.log("API not available, using mock data");
      }

      // Use mock data if API fails or returns no data
      const mockData = generateMockData();
      setFilteredQuotations(mockData);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      // Use mock data on error
      const mockData = generateMockData();
      setFilteredQuotations(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Approve quotation
  const handleApprove = async (quotationId: string) => {
    try {
      // Try API call
      try {
        const quotationApi = (window as WindowWithAPI).quotationApi;
        if (quotationApi && quotationApi.approve) {
          const response = await quotationApi.approve(quotationId, {
            quotedPrice: 0,
            validUntil: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            notes: "Approved",
          });

          if (response && response.success) {
            await fetchQuotations();
            return;
          }
        }
      } catch {
        console.log("API not available");
      }

      // Update locally if API fails
      setFilteredQuotations((prev) =>
        prev.map((q) =>
          q.id === quotationId ? { ...q, status: "approved" } : q,
        ),
      );
    } catch (error) {
      console.error("Error approving quotation:", error);
      setError("Failed to approve quotation");
    }
  };

  // Reject quotation
  const handleReject = async (quotationId: string) => {
    try {
      // Try API call
      try {
        const quotationApi = (window as WindowWithAPI).quotationApi;
        if (quotationApi && quotationApi.reject) {
          const response = await quotationApi.reject(
            quotationId,
            "Not available",
          );

          if (response && response.success) {
            await fetchQuotations();
            return;
          }
        }
      } catch {
        console.log("API not available");
      }

      // Update locally if API fails
      setFilteredQuotations((prev) =>
        prev.map((q) =>
          q.id === quotationId ? { ...q, status: "rejected" } : q,
        ),
      );
    } catch (error) {
      console.error("Error rejecting quotation:", error);
      setError("Failed to reject quotation");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
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
    <div className="min-h-screen bg-white p-8 mt-35">
      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-50 flex items-center justify-between"
          style={{ border: "1px solid #f9ead4" }}
        >
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className="bg-white overflow-hidden"
        style={{ border: "1px solid #f9ead4" }}
      >
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: "#050c3a" }}>
            <tr style={{ borderBottom: "1px solid #f9ead4" }}>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Carat Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Number of Pieces
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Quote Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Update
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Loading quotations...</p>
                </td>
              </tr>
            ) : currentQuotations.length > 0 ? (
              currentQuotations.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="hover:bg-gray-50"
                  style={{ borderBottom: "1px solid #f9ead4" }}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {quotation.stoneNumbers.slice(0, 3).map((stone, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-gray-100 text-xs"
                        >
                          {stone}
                        </span>
                      ))}
                      {quotation.stoneNumbers.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-xs">
                          +{quotation.stoneNumbers.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {quotation.stoneNumbers.length}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {quotation.quotedPrice
                      ? `$${quotation.quotedPrice.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {quotation.status === "approved" ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Approved
                      </span>
                    ) : quotation.status === "rejected" ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 font-medium">
                        <X className="w-4 h-4" />
                        Denied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {quotation.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(quotation.id)}
                          className="text-gray-700 hover:text-slate-900 font-medium transition"
                        >
                          Approve
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleReject(quotation.id)}
                          className="text-gray-700 hover:text-slate-900 font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="text-gray-400 cursor-not-allowed font-medium">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No quotations found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Quotations will appear here once submitted
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="px-6 py-4 flex justify-between items-center"
            style={{
              borderTop: "1px solid #f9ead4",
              backgroundColor: "#faf6eb",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-slate-900 disabled:text-gray-300 disabled:cursor-not-allowed transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={page === "..."}
                  className={`min-w-[40px] px-3 py-2 font-medium transition ${
                    page === currentPage
                      ? "bg-slate-900 text-white"
                      : page === "..."
                        ? "text-gray-400 cursor-default"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
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
              className="p-2 text-gray-600 hover:text-slate-900 disabled:text-gray-300 disabled:cursor-not-allowed transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
