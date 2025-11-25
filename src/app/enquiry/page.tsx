"use client";

import React, { useEffect, useState } from "react";
import { queryApi, Diamond } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import {  Jost,Marcellus, } from "next/font/google";
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});


const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

interface Query {
  id: string;
  userId: string;
  userEmail: string;
  stoneNo: string;
  diamond: Diamond;
  query: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminReply?: string;
  repliedAt?: string;
  repliedBy?: string;
}

function EnquiryPageContent() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await queryApi.getUserQueries();
      
      if (response.success) {
        setQueries(response.data.queries);
      } else {
        setError(response.message || "Failed to fetch enquiries");
      }
    } catch (err: unknown) {
      console.error("Error fetching queries:", err);
      setError("Failed to load enquiries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(queries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueries = queries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    

    if (totalPages <= 10) {
      // Show all pages if 10 or fewer
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`min-w-[32px] h-8 px-2 text-sm rounded ${
              currentPage === i
                ? "bg-[#050C3A] text-white font-medium"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show pages 1, 2
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`min-w-[32px] h-8 px-2 text-sm rounded ${
            currentPage === 1
              ? "bg-[#050C3A] text-white font-medium"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          1
        </button>
      );

      buttons.push(
        <button
          key={2}
          onClick={() => handlePageChange(2)}
          className={`min-w-[32px] h-8 px-2 text-sm rounded ${
            currentPage === 2
              ? "bg-[#050C3A] text-white font-medium"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          2
        </button>
      );

      // Show ellipsis
      buttons.push(
        <span key="ellipsis" className="min-w-[32px] h-8 px-2 text-sm text-gray-700 flex items-center justify-center">
          ...
        </span>
      );

      // Show second to last page
      buttons.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          className={`min-w-[32px] h-8 px-2 text-sm rounded ${
            currentPage === totalPages - 1
              ? "bg-[#050C3A] text-white font-medium"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {totalPages - 1}
        </button>
      );

      // Show last page
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`min-w-[32px] h-8 px-2 text-sm rounded ${
            currentPage === totalPages
              ? "bg-[#050C3A] text-white font-medium"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mt-32">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-none shadow-lg p-8 max-w-md w-full text-center">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchQueries}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-none transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-25">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 ${marcellus.className}`}>My Enquiries</h1>
          
        </div>

        {/* Enquiries Table */}
        {queries.length === 0 ? (
          <div className="bg-white rounded-none shadow p-12 text-center">
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Enquiries Yet
            </h2>
            <p className="text-gray-600">
              You haven&apos;t made any enquiries yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-none shadow overflow-hidden">
            <table className={`min-w-full divide-y divide-gray-200 ${jost.className}`}>
              <thead className="bg-[#050C3A]">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-medium text-white">
                    Serial No.
                  </th>
                  <th className="px-6 py-4 text-left text-base font-medium text-white">
                    Diamond ID
                  </th>
                  <th className="px-6 py-4 text-left text-base font-medium text-white">
                    Enquiry
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentQueries.map((query, index) => (
                  <React.Fragment key={query.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                        {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                        {query.stoneNo}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-900">
                        <div className="flex items-center justify-between">
                          <span>{query.query}</span>
                          {query.adminReply && (
                            <button
                              onClick={() => {
                                const element = document.getElementById(
                                  `reply-${query.id}`
                                );
                                if (element) {
                                  element.style.display =
                                    element.style.display === "none"
                                      ? "table-row"
                                      : "none";
                                }
                              }}
                              className="ml-4 text-gray-600 hover:text-gray-900"
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
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {query.adminReply && (
                      <tr
                        id={`reply-${query.id}`}
                        className="bg-gray-50"
                        style={{ display: "none" }}
                      >
                        <td colSpan={3} className="px-6 py-4">
                          <div className="ml-8">
                            <p className="text-base font-semibold text-gray-900 mb-2">
                              Reply From Dalila
                            </p>
                            <p className="text-base text-gray-700">
                              {query.adminReply}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination - Always show if there are queries */}
        {queries.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center gap-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-7 h-7 flex items-center justify-center rounded ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
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

              {/* Page Numbers */}
              <div className="flex items-center gap-0.5">
                {renderPaginationButtons()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex items-center justify-center rounded ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
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
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <ProtectedRoute requireAuth={true} requireCustomerData={true}>
      <EnquiryPageContent />
    </ProtectedRoute>
  );
}