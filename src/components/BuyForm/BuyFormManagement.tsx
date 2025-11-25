"use client";

import { useState, useEffect, useCallback } from "react";
import { formApi } from "@/lib/api";
import { Eye, X, RefreshCw, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Marcellus, Jost } from "next/font/google";
import Image from "next/image";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface Image {
  fileName: string;
  s3Key: string;
  s3Url: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

interface Submission {
  _id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  countryCode: string;
  carat: number;
  material: string;
  description: string;
  images: Image[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedSubmission {
  email: string;
  submissions: Submission[];
  totalCount: number;
  lastSubmittedAt: string;
}

export default function BuyFormManagement() {
  const [groupedData, setGroupedData] = useState<GroupedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching submissions for page:", currentPage);
      
      const response = await formApi.getGroupedSubmissions({
        page: currentPage,
        limit: 10,
      });

      console.log("API Response:", response);

      if (response && response.success) {
        console.log("Submissions data:", response.data);
        console.log("Number of submissions:", response.data.length);
        setGroupedData(response.data);
      } else {
        console.error("Response not successful:", response);
        setError("No data available or request failed.");
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      console.error("Error details:", error.response?.data || error.message);
      setError(`Failed to load submissions: ${error.response?.data?.message || error.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    console.log("BuyFormManagement mounted");
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  const toggleExpandEmail = (email: string) => {
    setExpandedEmail(expandedEmail === email ? null : email);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-none mb-4 text-sm">
        {error}
      </div>
    );
  }

  // Pagination calculations
  const totalRecords = groupedData.length;
  const calculatedTotalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = groupedData.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (calculatedTotalPages <= maxVisible) {
      for (let i = 1; i <= calculatedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(calculatedTotalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < calculatedTotalPages - 2) {
        pages.push("...");
      }
      pages.push(calculatedTotalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[#E9E2C6] rounded-none p-6 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`${marcellus.className} text-2xl md:text-3xl text-[#0b1b35] mb-2`}>
              Buy Form Submissions
            </h1>
            <p className={`${jost.className} text-sm text-gray-600`}>
              Manage customer diamond buy requests
            </p>
          </div>
          <button
            onClick={() => fetchSubmissions()}
            disabled={loading}
            className={`${jost.className} flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#0b1b35] text-white rounded-md hover:bg-[#08142a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* No Data Message */}
      {!loading && groupedData.length === 0 && (
        <div className="border border-[#E9E2C6] rounded-none p-12 text-center bg-white">
          
          <h3 className={`${jost.className} text-lg font-medium text-gray-900 mb-2`}>
            No Submissions Yet
          </h3>
          <p className={`${jost.className} text-sm text-gray-600`}>
            Customer diamond buy requests will appear here once submitted.
          </p>
        </div>
      )}

      {/* Table */}
      {groupedData.length > 0 && (
        <div className="border border-[#E9E2C6] rounded-none overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-[60px_2fr_1fr_1.5fr_100px] items-center bg-[#0b1b35] text-white text-sm px-4 py-3">
            <div className={`${jost.className} font-medium`}>Sr</div>
            <div className={`${jost.className} font-medium`}>Email</div>
            <div className={`${jost.className} font-medium`}>Submissions</div>
            <div className={`${jost.className} font-medium`}>Last Submitted</div>
            <div className={`${jost.className} font-medium`}>View</div>
          </div>

          {/* Table Body */}
          {currentData.map((group, idx) => (
            <div key={group.email} className="border-t border-[#E9E2C6]">
              {/* Summary Row */}
              <div className="grid md:grid-cols-[60px_2fr_1fr_1.5fr_100px] items-center px-4 py-3 text-sm border-b border-[#E9E2C6] bg-white hover:bg-gray-50 transition-colors">
                <div className={`${jost.className} font-medium text-gray-700`}>
                  {startIndex + idx + 1}
                </div>
                <div className={`${jost.className} text-gray-800 truncate`}>
                  {group.email}
                </div>
                <div className={`${jost.className} text-gray-700`}>
                  <span className="inline-block px-2 py-0.5 text-[11px] border rounded-none bg-blue-100 text-blue-700 border-blue-300">
                    {group.totalCount} submission{group.totalCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className={`${jost.className} text-gray-700`}>
                  {formatDate(group.lastSubmittedAt)}
                </div>
                <div className="flex justify-end pr-2">
                  <button
                    onClick={() => toggleExpandEmail(group.email)}
                    className={`${jost.className} inline-flex cursor-pointer items-center gap-1 text-[#0b1b35] border border-gray-300 px-2 py-1 rounded-none hover:bg-gray-100 transition-colors text-xs`}
                  >
                    View{" "}
                    {expandedEmail === group.email ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedEmail === group.email && (
                <div className="bg-white px-4 pb-4 text-sm">
                  <div className="py-3">
                    <span className={`${jost.className} bg-[#0b1b35] text-white font-medium px-4 py-3 text-sm inline-block mb-3`}>
                      Submissions from {group.email}
                    </span>
                    <div className="space-y-3">
                      {group.submissions.map((submission) => (
                        <div
                          key={submission._id}
                          className="border border-[#E9E2C6] rounded-none p-4 bg-gray-50"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className={`${jost.className} text-xs text-gray-500 mb-1`}>Name</p>
                              <p className={`${jost.className} text-sm font-medium text-gray-900`}>
                                {submission.name}
                              </p>
                            </div>
                            <div>
                              <p className={`${jost.className} text-xs text-gray-500 mb-1`}>Phone</p>
                              <p className={`${jost.className} text-sm font-medium text-gray-900`}>
                                {submission.countryCode} {submission.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <p className={`${jost.className} text-xs text-gray-500 mb-1`}>Carat / Material</p>
                              <p className={`${jost.className} text-sm font-medium text-gray-900`}>
                                {submission.carat} ct / {submission.material}
                              </p>
                            </div>
                            <div>
                              <p className={`${jost.className} text-xs text-gray-500 mb-1`}>Status</p>
                              <span
                                className={`inline-block px-2 py-0.5 text-[11px] border rounded-none ${
                                  submission.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                    : submission.status === "APPROVED"
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-red-100 text-red-700 border-red-300"
                                }`}
                              >
                                {submission.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <p className={`${jost.className} text-xs text-gray-500`}>
                              Submitted: {formatDate(submission.createdAt)}
                            </p>
                            <button
                              onClick={() => handleViewDetails(submission)}
                              className={`${jost.className} flex items-center cursor-pointer gap-2 px-3 py-1 bg-[#0b1b35] text-white rounded-none hover:bg-[#08142a] transition-colors text-xs`}
                            >
                              <Eye className="w-3 h-3" />
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {!loading && currentData.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No records found.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {calculatedTotalPages > 1 && (
        <div className="flex items-center gap-2 justify-center mt-6 text-sm">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`${jost.className} border px-3 py-1 rounded-none border-gray-300 text-gray-700 hover:bg-[#EAD9BE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            ←
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === "number" && setCurrentPage(page)
              }
              disabled={page === "..."}
              className={`${jost.className} border px-3 py-1 rounded-none transition-colors ${
                page === currentPage
                  ? "bg-[#EAD9BE] text-gray-900 border-[#EAD9BE] font-semibold"
                  : page === "..."
                    ? "border-transparent text-gray-400 cursor-default"
                    : "border-gray-300 text-gray-700 hover:bg-[#EAD9BE]"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(calculatedTotalPages, prev + 1))
            }
            disabled={currentPage === calculatedTotalPages}
            className={`${jost.className} border px-3 py-1 rounded-none border-gray-300 text-gray-700 hover:bg-[#EAD9BE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            →
          </button>
        </div>
      )}

      {/* Details Modal */}
      {selectedSubmission && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto [color-scheme:light]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0b1b35] text-white px-6 py-4 rounded-none flex justify-between items-center z-10">
              <h2 className={`${marcellus.className} text-xl font-bold`}>Submission Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className={`${jost.className} text-lg font-semibold text-gray-900 mb-4`}>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Name</label>
                    <p className={`${jost.className} text-base text-gray-900`}>{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Email</label>
                    <p className={`${jost.className} text-base text-gray-900`}>{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Phone</label>
                    <p className={`${jost.className} text-base text-gray-900`}>
                      {selectedSubmission.countryCode} {selectedSubmission.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Address</label>
                    <p className={`${jost.className} text-base text-gray-900`}>{selectedSubmission.address}</p>
                  </div>
                </div>
              </div>

              {/* Diamond Information */}
              <div>
                <h3 className={`${jost.className} text-lg font-semibold text-gray-900 mb-4`}>
                  Diamond Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Carat</label>
                    <p className={`${jost.className} text-base text-gray-900`}>{selectedSubmission.carat}</p>
                  </div>
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Material</label>
                    <p className={`${jost.className} text-base text-gray-900`}>{selectedSubmission.material}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Description</label>
                    <p className={`${jost.className} text-base text-gray-900`}>
                      {selectedSubmission.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className={`${jost.className} text-lg font-semibold text-gray-900 mb-4`}>
                  Uploaded Images ({selectedSubmission.images.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedSubmission.images.map((image, index) => (
                    <div
                      key={index}
                      className="border border-[#E9E2C6] rounded-none overflow-hidden"
                    >
                      <div className="relative w-full h-48">
                        <Image
                          src={image.s3Url}
                          alt={image.fileName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-3 bg-gray-50">
                        <p className={`${jost.className} text-sm font-medium text-gray-900 truncate`}>
                          {image.fileName}
                        </p>
                        <p className={`${jost.className} text-xs text-gray-500`}>
                          {(image.fileSize / 1024).toFixed(2)} KB
                        </p>
                        <a
                          href={image.s3Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${jost.className} text-xs text-[#0b1b35] hover:text-[#08142a] mt-1 inline-block`}
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Dates */}
              <div>
                <h3 className={`${jost.className} text-lg font-semibold text-gray-900 mb-4`}>Status & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Status</label>
                    <p>
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] border rounded-none ${
                          selectedSubmission.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                            : selectedSubmission.status === "APPROVED"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-red-100 text-red-700 border-red-300"
                        }`}
                      >
                        {selectedSubmission.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Submitted At</label>
                    <p className={`${jost.className} text-base text-gray-900`}>
                      {formatDate(selectedSubmission.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className={`${jost.className} text-sm font-medium text-gray-500`}>Last Updated</label>
                    <p className={`${jost.className} text-base text-gray-900`}>
                      {formatDate(selectedSubmission.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-none flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className={`${jost.className} px-4 py-2 border border-gray-300 rounded-none text-gray-900 hover:bg-gray-100 transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
