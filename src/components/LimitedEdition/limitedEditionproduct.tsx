"use client";
import { useState } from "react";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Gem } from "lucide-react";

import DiamondDetailView from "@/components/DiamondDetailView";

// Type for a limited edition diamond
interface LimitedEditionDiamond {
  STONE_NO: string;
  SHAPE: string;
  CARATS: string;
  COLOR: string;
  CLARITY: string;
  CUT?: string;
  POL: string;
  SYM: string;
  LAB: string;
  MP4?: string;
  REAL_IMAGE?: string;
}

interface LimitedEditionPageProps {
  diamonds?: LimitedEditionDiamond[];
  loading?: boolean;
  error?: string;
  hasLoadedOnce?: boolean;
  refreshLimitedEditionDiamonds?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function LimitedEditionPage({
  diamonds = [],
  loading = false,
  error = "",
  hasLoadedOnce = true,
  refreshLimitedEditionDiamonds = () => {},
  isOpen = true,
  onToggle = () => {},
}: LimitedEditionPageProps) {
  const [selectedDiamond, setSelectedDiamond] = useState<LimitedEditionDiamond | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const totalPages = Math.ceil(diamonds.length / itemsPerPage);
  const paginatedItems = diamonds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-white">
      {/* Collapsible Content - Only show when isOpen is true */}
      {isOpen && (
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#060c3c] animate-spin mb-3" />
              <p className="text-[#060c3c]/60 text-sm">Loading limited edition diamonds...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#060c3c] text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Stone No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Lab</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Shape</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Carat</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Color</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Clarity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Cut</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b border-[#F9E8CD]">Pol</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12">
                        <Gem className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No limited edition diamonds available</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((diamond: LimitedEditionDiamond, idx: number) => (
                      <tr
                        key={diamond.STONE_NO}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#faf6eb]"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            {diamond.MP4 ? (
                              <video
                                src={diamond.MP4}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                              />
                            ) : diamond.REAL_IMAGE ? (
                              <img
                                src={diamond.REAL_IMAGE}
                                alt={diamond.STONE_NO}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedDiamond(diamond)}
                            className="text-[#060c3c] font-medium hover:text-blue-600 hover:underline cursor-pointer text-left"
                          >
                            {diamond.STONE_NO}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.LAB || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.SHAPE || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.CARATS || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.COLOR || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.CLARITY || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.CUT || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#060c3c]">{diamond.POL || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pb-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-6 h-6 flex items-center justify-center text-[#060c3c] hover:bg-[#060c3c]/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[22px] h-6 px-1 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                          currentPage === page
                            ? "bg-[#060c3c] text-white"
                            : "text-[#060c3c] hover:bg-[#060c3c]/5"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-6 h-6 flex items-center justify-center text-[#060c3c] hover:bg-[#060c3c]/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Diamond Detail View Modal */}
      {selectedDiamond && (
        <DiamondDetailView
          diamond={{
            STONE_NO: selectedDiamond.STONE_NO,
            SHAPE: selectedDiamond.SHAPE,
            CARATS: Number(selectedDiamond.CARATS) || 0,
            COLOR: selectedDiamond.COLOR,
            CLARITY: selectedDiamond.CLARITY,
            CUT: selectedDiamond.CUT,
            POL: selectedDiamond.POL,
            SYM: selectedDiamond.SYM,
            LAB: selectedDiamond.LAB,
            _id: selectedDiamond.STONE_NO,
            REPORT_NO: "",
            RAP_PRICE: 0,
            DISC_PER: 0,
            NET_VALUE: 0,
            NET_RATE: "0",
            FLOUR: "",
            MEASUREMENTS: "",
            TABLE_PER: 0,
            DEPTH_PER: 0,
            REPORT_DATE: "",
            COMMENTS_1: "",
            TINGE: "",
            LOCATION: "",
            STAGE: "",
            REAL_IMAGE: selectedDiamond.REAL_IMAGE,
            MP4: selectedDiamond.MP4,
            CROWN_ANGLE: 0,
            CROWN_HEIGHT: 0,
            PAVILLION_ANGLE: 0,
            PAVILLION_HEIGHT: 0,
            KEY_TO_SYMBOLS: "",
            REPORT_COMMENTS: "",
            HA: "",
          }}
          onClose={() => setSelectedDiamond(null)}
        />
      )}
    </div>
  );
}