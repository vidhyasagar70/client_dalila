"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Maven_Pro } from "next/font/google";
import { ChevronUp, ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface InventoryDiamond {
  _id: string;
  STONE_NO: string;
  source: string;
  SHAPE: string;
  CARATS: string;
  COLOR: string;
  CLARITY: string;
  CUT: string;
  POL: string;
  SYM: string;
  FLOUR: string;
  LAB: string;
  LOCATION: string;
  NET_RATE: string;
  DISC_PER: string;
  NET_VALUE: string;
  RAP_PRICE: string;
  DEPTH_PER: string;
  TABLE_PER: string;
  MEASUREMENTS: string;
  REPORT_NO: string;
  REAL_IMAGE: string;
  MP4: string;
  CERTI_PDF: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryTableProps {
  data: InventoryDiamond[];
  loading: boolean;
  error: string | null;
  pageSize?: number;
  viewMode?: "list" | "grid";
}

const InventoryDiamondTable: React.FC<InventoryTableProps> = ({
  data,
  loading,
  error,
  pageSize = 20,
  viewMode = "list",
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (data.length === 0) return data;

    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof InventoryDiamond];
      const bValue = b[sortConfig.key as keyof InventoryDiamond];

      const aNum = parseFloat(String(aValue));
      const bNum = parseFloat(String(bValue));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const formatCurrency = (value: string | number) => {
    const num = parseFloat(String(value));
    return isNaN(num)
      ? "N/A"
      : `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: string | number) => {
    const num = parseFloat(String(value));
    return isNaN(num) ? "N/A" : `${num.toFixed(2)}%`;
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <div className="ml-1 inline-flex flex-col">
          <ChevronUp className="w-3 h-3 text-gray-400" />
          <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
        </div>
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 w-4 h-4 inline" />
    ) : (
      <ChevronDown className="ml-1 w-4 h-4 inline" />
    );
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStockClick = (stoneNo: string) => {
    // Navigate to product detail page
    router.push(`/sud?stockId=${encodeURIComponent(stoneNo)}`);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-[#050c3a] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#050c3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2 text-4xl">⚠️</div>
          <p className="text-red-600 font-medium">Error loading inventory</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-3">No inventory data found</p>
        </div>
      </div>
    );
  }

  // Grid View Rendering
  if (viewMode === "grid") {
    return (
      <div className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedData.map((diamond) => (
              <div
                key={diamond._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleStockClick(diamond.STONE_NO)}
              >
                {/* Diamond Image */}
                <div className="relative h-48 bg-gray-100">
                  {diamond.REAL_IMAGE ? (
                    <Image
                      src={diamond.REAL_IMAGE}
                      alt={diamond.STONE_NO}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Diamond Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2 hover:underline">
                    {diamond.STONE_NO || "N/A"}
                  </h3>
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-medium text-gray-900">{diamond.source || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shape:</span>
                      <span className="font-medium text-gray-900">{diamond.SHAPE || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carat:</span>
                      <span className="font-medium text-gray-900">{diamond.CARATS || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium text-gray-900">{diamond.COLOR || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clarity:</span>
                      <span className="font-medium text-gray-900">{diamond.CLARITY || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cut:</span>
                      <span className="font-medium text-gray-900">{diamond.CUT || "N/A"}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">$/ct:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(diamond.NET_RATE)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-green-600">
                          {diamond.NET_VALUE !== "NA" ? formatCurrency(diamond.NET_VALUE) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for Grid View */}
          <div
            className="px-4 py-3 mt-6 border-t border-gray-200 flex items-center justify-between"
            style={{
              background: "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)",
            }}
          >
            <div className="text-sm text-gray-700 font-medium">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
              {sortedData.length} diamonds
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">
                  Items per page
                </span>
                <select
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#070b3a] focus:border-transparent transition-all"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={20}>20</option>
                  <option value={24}>24</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {renderPaginationButtons()}

                {totalPages > 10 && currentPage < totalPages - 4 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Table View Rendering (default)
  return (
    <div
      className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}
    >
      <div className="bg-white shadow-sm flex flex-col rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead
              className={`bg-[#050c3a] text-white sticky top-0 z-10 ${mavenPro.className}`}
            >
              <tr>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[150px]"
                  onClick={() => handleSort("STONE_NO")}
                >
                  <div className="flex items-center">
                    Stock ID
                    <SortIcon columnKey="STONE_NO" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[120px]"
                  onClick={() => handleSort("source")}
                >
                  <div className="flex items-center">
                    Source
                    <SortIcon columnKey="source" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[100px]"
                  onClick={() => handleSort("SHAPE")}
                >
                  <div className="flex items-center">
                    Shape
                    <SortIcon columnKey="SHAPE" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("CARATS")}
                >
                  <div className="flex items-center">
                    Carat
                    <SortIcon columnKey="CARATS" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("COLOR")}
                >
                  <div className="flex items-center">
                    Color
                    <SortIcon columnKey="COLOR" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("CLARITY")}
                >
                  <div className="flex items-center">
                    Clarity
                    <SortIcon columnKey="CLARITY" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("CUT")}
                >
                  <div className="flex items-center">
                    Cut
                    <SortIcon columnKey="CUT" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("POL")}
                >
                  <div className="flex items-center">
                    Polish
                    <SortIcon columnKey="POL" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("SYM")}
                >
                  <div className="flex items-center">
                    Symmetry
                    <SortIcon columnKey="SYM" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("FLOUR")}
                >
                  <div className="flex items-center">
                    Fluor
                    <SortIcon columnKey="FLOUR" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("LAB")}
                >
                  <div className="flex items-center">
                    Lab
                    <SortIcon columnKey="LAB" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#070d4a] transition-colors w-[80px]"
                  onClick={() => handleSort("LOCATION")}
                >
                  <div className="flex items-center">
                    Location
                    <SortIcon columnKey="LOCATION" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#070d4a] transition-colors w-[100px]"
                  onClick={() => handleSort("NET_RATE")}
                >
                  <div className="flex items-center justify-end">
                    $/ct
                    <SortIcon columnKey="NET_RATE" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#070d4a] transition-colors w-[100px]"
                  onClick={() => handleSort("DISC_PER")}
                >
                  <div className="flex items-center justify-end">
                    Disc%
                    <SortIcon columnKey="DISC_PER" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#070d4a] transition-colors w-[120px]"
                  onClick={() => handleSort("NET_VALUE")}
                >
                  <div className="flex items-center justify-end">
                    Total $
                    <SortIcon columnKey="NET_VALUE" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#070d4a] transition-colors w-[100px]"
                  onClick={() => handleSort("DEPTH_PER")}
                >
                  <div className="flex items-center justify-end">
                    Depth%
                    <SortIcon columnKey="DEPTH_PER" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#070d4a] transition-colors w-[100px]"
                  onClick={() => handleSort("TABLE_PER")}
                >
                  <div className="flex items-center justify-end">
                    Table%
                    <SortIcon columnKey="TABLE_PER" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={row._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td 
                    className="py-3 px-4 text-blue-600 hover:underline cursor-pointer font-medium"
                    onClick={() => handleStockClick(row.STONE_NO)}
                  >
                    {row.STONE_NO || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {row.source || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.SHAPE || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.CARATS || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.COLOR || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.CLARITY || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.CUT || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">{row.POL || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-800">{row.SYM || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.FLOUR || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">{row.LAB || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-800">
                    {row.LOCATION || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800">
                    {formatCurrency(row.NET_RATE)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800">
                    {formatPercentage(row.DISC_PER)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800">
                    {row.NET_VALUE !== "NA"
                      ? formatCurrency(row.NET_VALUE)
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800">
                    {formatPercentage(row.DEPTH_PER)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800">
                    {formatPercentage(row.TABLE_PER)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="px-4 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0"
          style={{
            background: "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)",
          }}
        >
          <div className="text-sm text-gray-700 font-medium">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length} diamonds
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">
                Rows per page
              </span>
              <select
                className="border border-gray-300 rounded-none px-3 py-1.5 text-sm text-gray-800 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#070b3a] focus:border-transparent transition-all"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {renderPaginationButtons()}

              {totalPages > 10 && currentPage < totalPages - 4 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDiamondTable;
