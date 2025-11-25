"use client";

import { useEffect, useState } from "react";
import { holdApi } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import type { DiamondData } from "@/types/Diamondtable";
import DiamondDetailView from "@/components/DiamondDetailView";
import ProtectedRoute from "@/components/ProtectedRoute";
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

interface HoldItem {
  stoneNo: string;
  addedAt: string;
  _id: string;
  diamond: DiamondData;
  status: string;
}

export default function HoldStonePageProtected() {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["USER"]}>
      <HoldStonePage />
    </ProtectedRoute>
  );
}

function HoldStonePage() {
  const [holdItems, setHoldItems] = useState<HoldItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Same as Enquiry page

  useEffect(() => {
    fetchHoldItems();
  }, []);

  const fetchHoldItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await holdApi.get();
      if (response?.success && response.data?.hold?.items) {
        setHoldItems(
          response.data.hold.items.map((item: {
            stoneNo: string;
            addedAt: string;
            _id: string;
            diamond: import("@/lib/api").Diamond;
            status: string;
          }) => ({
            stoneNo: item.stoneNo,
            addedAt: item.addedAt,
            _id: item._id,
            diamond: item.diamond as unknown as DiamondData,
            status: item.status,
          }))
        );
      } else {
        setHoldItems([]);
      }
    } catch {
      setError("Failed to load hold stones. Please try again.");
      setHoldItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations (reference: Enquiry page)
  const totalPages = Math.ceil(holdItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHoldItems = holdItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    if (totalPages <= 10) {
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
      buttons.push(
        <span key="ellipsis" className="min-w-[32px] h-8 px-2 text-sm text-gray-700 flex items-center justify-center">
          ...
        </span>
      );
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

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 mt-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl font-bold text-gray-900 ${marcellus.className} mb-5`}>Hold Stones</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-none flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
            <span className="text-lg text-gray-700">Loading hold stones...</span>
          </div>
        ) : holdItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-2xl text-gray-400 mb-2">No hold stones found.</span>
          </div>
        ) : (
          <div className="bg-white dark:bg-white border border-[#060c3c]/10 dark:border-[#060c3c]/10 rounded-none overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className={`w-full ${jost.className}`}>
                <thead className="bg-[#060c3c] dark:bg-[#060c3c] text-white dark:text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Stone No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Shape</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Carat</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Color</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Clarity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Cut</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Lab</th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHoldItems.map((item, idx) => (
                    <tr
                      key={item._id}
                      className={`transition-colors font-[Marcellus,_Jost,_serif] ${idx % 2 === 0 ? 'bg-white dark:bg-white' : 'bg-[#FAF6EB] dark:bg-[#FAF6EB]'}`}
                    >
                      <td
                        className="px-4 py-3 font-medium text-[#060c3c] dark:text-[#060c3c] cursor-pointer  hover:text-blue-600 font-[Jost,_Marcellus,_serif]"
                        onClick={() => setSelectedDiamond(item.diamond)}
                      >
                        {item.stoneNo}
                      </td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{typeof item.diamond.SHAPE === "string" ? item.diamond.SHAPE : (item.diamond.SHAPE ? String(item.diamond.SHAPE) : "-")}</td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{typeof item.diamond.CARATS === "string" ? item.diamond.CARATS : (item.diamond.CARATS ? String(item.diamond.CARATS) : "-")}</td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{typeof item.diamond.COLOR === "string" ? item.diamond.COLOR : (item.diamond.COLOR ? String(item.diamond.COLOR) : "-")}</td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{typeof item.diamond.CLARITY === "string" ? item.diamond.CLARITY : (item.diamond.CLARITY ? String(item.diamond.CLARITY) : "-")}</td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{typeof item.diamond.CUT === "string" ? item.diamond.CUT : (item.diamond.CUT ? String(item.diamond.CUT) : "-")}</td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{typeof item.diamond.LAB === "string" ? item.diamond.LAB : (item.diamond.LAB ? String(item.diamond.LAB) : "-")}</td>
                      <td className="px-4 py-3 text-[#060c3c] dark:text-[#060c3c] font-[Jost,_Marcellus,_serif]">{item.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination - Always show if there are hold items */}
            {holdItems.length > 0 && (
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
      {selectedDiamond && (
        <DiamondDetailView
          diamond={selectedDiamond}
          onClose={() => setSelectedDiamond(null)}
        />
      )}
    </div>
  );
}
