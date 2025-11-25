import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { diamondApi } from "@/lib/api";
import type {
  DiamondData,
  TableProps,
  FilterParams,
} from "@/types/Diamondtable";
import DiamondDetailView from "../DiamondDetailView";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface CaratRangeValue { min: string; max: string; }

interface LimitedTableProps extends Omit<TableProps, 'selectedMinCarat' | 'selectedMaxCarat'> {
  selectedCaratRanges?: CaratRangeValue[];
}

const DiamondStockTable: React.FC<LimitedTableProps> = ({
  pageSize = 20,
  onRowClick,
  searchTerm = "",
  selectedShape = [],
  selectedColor = [],
  selectedCaratRanges = [],
  selectedFluor = [],
  selectedClarity = [],
  selectedCut = "",
  selectedPolish = "",
  selectedSymmetry = "",
  selectedLabs = [],
  onSelectionChange,
}) => {
  const [data, setData] = useState<DiamondData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondData | null>(
    null,
  );

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const fetchDiamonds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const hasSearchTerm = searchTerm && searchTerm.trim();
      const hasShapeFilter =
        Array.isArray(selectedShape) && selectedShape.length > 0;
      const hasColorFilter =
        Array.isArray(selectedColor) && selectedColor.length > 0;
      const hasCaratFilter = Array.isArray(selectedCaratRanges) && selectedCaratRanges.length > 0;
      const hasFluorFilter =
        Array.isArray(selectedFluor) && selectedFluor.length > 0;
      const hasClarityFilter = selectedClarity && selectedClarity.length > 0;
      const hasCutFilter = selectedCut && selectedCut.trim();
      const hasPolishFilter = selectedPolish && selectedPolish.trim();
      const hasSymmetryFilter = selectedSymmetry && selectedSymmetry.trim();
      const hasLabFilter = Array.isArray(selectedLabs) && selectedLabs.length > 0;

      const hasAnyFilter =
        hasShapeFilter ||
        hasColorFilter ||
        hasSearchTerm ||
        hasCaratFilter ||
        hasFluorFilter ||
        hasClarityFilter ||
        hasCutFilter ||
        hasPolishFilter ||
        hasSymmetryFilter ||
        hasLabFilter;

        let response;
        if (hasAnyFilter) {
          const filters: FilterParams = {
            page: 1,
            limit: 10000,
          };

          if (hasShapeFilter) {
            filters.shape = selectedShape.join(",");
          }
          if (hasColorFilter) {
            filters.color = selectedColor.join(",");
          }
          if (hasCaratFilter) {
            // Use min of all mins and max of all maxes for API filter
            const minVals = selectedCaratRanges.map(r => parseFloat(r.min)).filter(v => !isNaN(v));
            const maxVals = selectedCaratRanges.map(r => parseFloat(r.max)).filter(v => !isNaN(v));
            if (minVals.length > 0) filters.minCarats = Math.min(...minVals);
            if (maxVals.length > 0) filters.maxCarats = Math.max(...maxVals);
          }
          if (hasFluorFilter) {
            filters.fluorescence = selectedFluor.join(",");
          }
          if (hasClarityFilter) {
            filters.clarity = selectedClarity.join(",");
          }
          if (hasCutFilter) {
            filters.cut = selectedCut.trim();
          }
          if (hasPolishFilter) {
            filters.polish = selectedPolish.trim();
          }
          if (hasSymmetryFilter) {
            filters.symmetry = selectedSymmetry.trim();
          }
          if (hasLabFilter) {
            filters.lab = selectedLabs.join(",");
          }
          if (hasSearchTerm) {
          filters.searchTerm = searchTerm.trim();
        }

        response = await diamondApi.search(filters);
      } else {
        response = await diamondApi.getAllNoPagination();
      }

      if (response?.success && response.data) {
        let diamonds: DiamondData[];
        if (Array.isArray(response.data)) {
          diamonds = response.data as unknown as DiamondData[];
        } else if (
          response.data.diamonds &&
          Array.isArray(response.data.diamonds)
        ) {
          diamonds = response.data.diamonds as unknown as DiamondData[];
        } else {
          diamonds = [];
        }
        setData(diamonds);
        setCurrentPage(1);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching diamonds:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch diamonds",
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    selectedShape,
    selectedColor,
    selectedCaratRanges,
    selectedFluor,
    selectedClarity,
    selectedCut,
    selectedPolish,
    selectedSymmetry,
    selectedLabs,
  ]);

  useEffect(() => {
    fetchDiamonds();
  }, [fetchDiamonds]);

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

    // No client-side filtering needed anymore - all filtering is done server-side
    const filtered = data;

    if (!sortConfig) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof DiamondData];
      const bValue = b[sortConfig.key as keyof DiamondData];

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((row) => row._id));
      setSelectedRows(allIds);
      setSelectAll(true);
      if (onSelectionChange) {
        onSelectionChange(Array.from(allIds), paginatedData);
      }
    } else {
      setSelectedRows(new Set());
      setSelectAll(false);
      if (onSelectionChange) {
        onSelectionChange([], []);
      }
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
      setSelectAll(false);
    }
    setSelectedRows(newSelected);

    const selected = data.filter((d) => newSelected.has(d._id));
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelected), selected);
    }
  };

  const handleStockIdClick = (e: React.MouseEvent, row: DiamondData) => {
    e.stopPropagation();
    if (onRowClick) {
      onRowClick(row);
    } else {
      setSelectedDiamond(row);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ||
            (Array.isArray(selectedShape) && selectedShape.length > 0)
              ? `Searching diamonds...`
              : "Loading diamonds..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2 text-4xl">⚠️</div>
          <p className="text-red-600 font-medium">Error loading diamonds</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-3">
            {searchTerm ||
            (Array.isArray(selectedShape) && selectedShape.length > 0) ||
            (Array.isArray(selectedColor) && selectedColor.length > 0) ||
            (Array.isArray(selectedClarity) && selectedClarity.length > 0) ||
            (Array.isArray(selectedFluor) && selectedFluor.length > 0) ||
            (Array.isArray(selectedCaratRanges) && selectedCaratRanges.length > 0)
              ? `No diamonds found matching your filters`
              : "No diamonds found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}
      >
        <div className="bg-white shadow-sm flex flex-col rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed">
              <thead
                className={`bg-[#050c3a] text-white sticky top-0 z-10 ${mavenPro.className}`}
              >
                <tr>
                  <th className="w-12 px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 cursor-pointer [accent-color:#050C3A]"
                    />
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    <button
                      onClick={() => handleSort("REAL_IMAGE")}
                      className="flex items-center gap-1 hover:text-gray-300 transition-colors"
                    >
                      Image
                      <div className="flex flex-col -space-y-1">
                        <ChevronUp
                          size={12}
                          className={`text-white ${sortConfig?.key === "REAL_IMAGE" && sortConfig.direction === "asc" ? "opacity-100" : "opacity-30"}`}
                        />
                        <ChevronDown
                          size={12}
                          className={`text-white ${sortConfig?.key === "REAL_IMAGE" && sortConfig.direction === "desc" ? "opacity-100" : "opacity-30"}`}
                        />
                      </div>
                    </button>
                  </th>
                  <th className="w-24 px-2 py-3 text-left text-[12px] font-medium">
                    <button
                      onClick={() => handleSort("STONE_NO")}
                      className="flex items-center gap-1 hover:text-gray-300 transition-colors"
                    >
                      Stock ID
                      <div className="flex flex-col -space-y-1">
                        <ChevronUp
                          size={12}
                          className={
                            sortConfig?.key === "STONE_NO" &&
                            sortConfig.direction === "asc"
                              ? "opacity-100"
                              : "opacity-30"
                          }
                        />
                        <ChevronDown
                          size={12}
                          className={
                            sortConfig?.key === "STONE_NO" &&
                            sortConfig.direction === "desc"
                              ? "opacity-100"
                              : "opacity-30"
                          }
                        />
                      </div>
                    </button>
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Shape
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-[12px] font-medium">
                    Carat
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-[12px] font-medium">
                    Color
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Clarity
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-[12px] font-medium">
                    Cut
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-[12px] font-medium">
                    Polish
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Symmetry
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Fluor
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-[12px] font-medium">
                    Lab
                  </th>
                  <th className="w-24 px-2 py-3 text-left text-[12px] font-medium">
                    Report No
                  </th>
                  <th className="w-24 px-2 py-3 text-left text-[12px] font-medium">
                    Report Date
                  </th>
                  <th className="w-28 px-2 py-3 text-left text-[12px] font-medium">
                    Measure
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Table%
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Depth%
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Crn Angle
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Crn Height
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Pav Angle
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Pav Height
                  </th>
                  <th className="w-24 px-2 py-3 text-left text-[12px] font-medium">
                    Rap Price
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Disc%
                  </th>
                  <th className="w-24 px-2 py-3 text-left text-[12px] font-medium">
                    Net Rate
                  </th>
                  <th className="w-24 px-2 py-3 text-left text-[12px] font-medium">
                    Net Value
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Location
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Stage
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    Tinge
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    CN
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    CW
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    SN
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-[12px] font-medium">
                    SW
                  </th>
                  <th className="w-32 px-2 py-3 text-left text-[12px] font-medium">
                    Key Symbols
                  </th>
                  <th className="w-60 px-2 py-3 text-left text-[12px] font-medium">
                    Comments
                  </th>
                  <th className="w-60 px-2 py-3 text-left text-[12px] font-medium">
                    Report Comments
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr
                    key={row._id}
                    style={{
                      background:
                        idx % 2 === 1
                          ? "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)"
                          : "white",
                    }}
                    className="transition-opacity"
                  >
                    <td className="px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(row._id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 cursor-pointer [accent-color:#050C3A]"
                      />
                    </td>
                    <td className="px-1 py-0.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="relative w-12 h-12">
                          <div className="w-full h-full bg-gray-100 rounded overflow-hidden">
                            {row.REAL_IMAGE ? (
                              <Image
                                src={row.REAL_IMAGE}
                                alt={row.STONE_NO}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23f3f4f6' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -left-0.5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full border border-white ${row.STAGE === "A" ? "bg-green-500" : "bg-red-500"}`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-2 py-1 text-[12px] text-gray-700 font-medium truncate cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={(e) => handleStockIdClick(e, row)}
                    >
                      {row.STONE_NO}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 truncate">
                      {row.SHAPE}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CARATS}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.COLOR}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CLARITY}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CUT || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.POL || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.SYM || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.FLOUR || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.LAB}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 truncate">
                      {row.REPORT_NO}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 truncate">
                      {row.REPORT_DATE
                        ? new Date(row.REPORT_DATE).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 truncate">
                      {row.MEASUREMENTS || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.TABLE_PER || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.DEPTH_PER || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CROWN_ANGLE || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CROWN_HEIGHT || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.PAVILLION_ANGLE || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.PAVILLION_HEIGHT || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {formatCurrency(row.RAP_PRICE)}
                    </td>
                    <td className="px-2 py-1 text-[12px] font-semibold text-red-600">
                      {formatPercentage(row.DISC_PER)}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {formatCurrency(row.NET_RATE ?? 0)}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 font-medium">
                      {formatCurrency(row.NET_VALUE ?? 0)}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.LOCATION}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.STAGE}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 truncate">
                      {row.TINGE || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CN || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.CW || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.SN || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700">
                      {row.SW || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[12px] text-gray-700 truncate">
                      {row.KEY_TO_SYMBOLS || "N/A"}
                    </td>
                    <td
                      className="px-2 py-1 text-[12px] text-gray-700 max-w-[240px]"
                      title={row.COMMENTS_1}
                    >
                      <div className="truncate">{row.COMMENTS_1 || "N/A"}</div>
                    </td>
                    <td
                      className="px-2 py-1 text-[12px] text-gray-700 max-w-[240px]"
                      title={row.REPORT_COMMENTS}
                    >
                      <div className="truncate">
                        {row.REPORT_COMMENTS || "N/A"}
                      </div>
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
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#070b3a] focus:border-transparent transition-all"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#070b3a] transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft size={16} className="text-[#070b3a]" />
                </button>

                <span className="text-sm text-gray-700 font-medium px-2">
                  Page {currentPage} of {totalPages}
                </span>

                {(() => {
                  const pageNumbers = [];
                  const maxVisiblePages = 5;

                  if (totalPages <= maxVisiblePages + 2) {
                    for (let i = 1; i <= totalPages; i++) {
                      pageNumbers.push(i);
                    }
                  } else {
                    pageNumbers.push(1);

                    let startPage = Math.max(2, currentPage - 1);
                    let endPage = Math.min(totalPages - 1, currentPage + 1);

                    if (currentPage <= 3) {
                      startPage = 2;
                      endPage = maxVisiblePages;
                    }

                    if (currentPage >= totalPages - 2) {
                      startPage = totalPages - maxVisiblePages + 1;
                      endPage = totalPages - 1;
                    }

                    if (startPage > 2) {
                      pageNumbers.push("start-ellipsis");
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(i);
                    }

                    if (endPage < totalPages - 1) {
                      pageNumbers.push("end-ellipsis");
                    }

                    pageNumbers.push(totalPages);
                  }

                  return pageNumbers.map((page) => {
                    if (page === "start-ellipsis") {
                      return (
                        <button
                          key="start-ellipsis"
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 5))
                          }
                          className="w-7 h-7 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Jump back 5 pages"
                        >
                          ...
                        </button>
                      );
                    }
                    if (page === "end-ellipsis") {
                      return (
                        <button
                          key="end-ellipsis"
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 5),
                            )
                          }
                          className="w-7 h-7 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Jump forward 5 pages"
                        >
                          ...
                        </button>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-7 h-7 rounded text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-[#070b3a] text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        title={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#070b3a] transition-colors"
                  title="Next page"
                >
                  <ChevronRight size={16} className="text-[#070b3a]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedDiamond && (
        <DiamondDetailView
          diamond={selectedDiamond}
          onClose={() => setSelectedDiamond(null)}
        />
      )}
    </>
  );
};

export default DiamondStockTable;
