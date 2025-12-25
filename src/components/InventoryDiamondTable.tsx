"use client";

import React, { useState, useEffect } from "react";
import { Maven_Pro } from "next/font/google";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { InclusionFilters } from "./InclusionFilter";
import type { KeySymbolFilters } from "./KeyToSymbolFilter";
import type { PriceLocationFilters } from "./Priceandloction";
import DiamondDetailView from "./DiamondDetailView";

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
  REPORT_COMMENTS?: string;
  REPORT_DATE?: string;
  CROWN_ANGLE?: string;
  CROWN_HEIGHT?: string;
  PAVILLION_ANGLE?: string;
  PAVILLION_HEIGHT?: string;
  CN?: string;
  CW?: string;
  SN?: string;
  SW?: string;
  TINGE?: string;
  LENGTH?: string;
  WIDTH?: string;
  DEPTH?: string;
  GIRDLE?: string;
  GIRDLE_PER?: string;
  STAR?: string;
  RATIO?: string;
  KEY_TO_SYMBOLS?: string | string[];
  ARROW_IMAGE?: string;
  HEART_IMAGE?: string;
  DNA?: string;
  HA?: string;
  BRANCH?: string;
  STAGE?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface MeasurementFilters {
  length?: { from: string; to: string };
  width?: { from: string; to: string };
  depth?: { from: string; to: string };
  table?: { from: string; to: string };
  depthPercent?: { from: string; to: string };
  pavAngle?: { from: string; to: string };
  pavHeight?: { from: string; to: string };
  crAngle?: { from: string; to: string };
  crHeight?: { from: string; to: string };
}

interface FilterProps {
  shapes?: string[];
  colors?: string[];
  clarities?: string[];
  minCarats?: number;
  maxCarats?: number;
  fluors?: string[];
  cut?: string;
  polish?: string;
  symmetry?: string;
  inclusions?: InclusionFilters;
  keySymbols?: KeySymbolFilters;
  priceFilters?: PriceLocationFilters;
  locations?: string[];
  labs?: string[];
  measurements?: MeasurementFilters;
}

interface InventoryTableProps {
  data?: InventoryDiamond[];
  loading?: boolean;
  error?: string | null;
  pageSize?: number;
  viewMode?: "list" | "grid";
  externalPagination?: PaginationData;
  onPageChange?: (page: number, rowsPerPage: number) => void;
  filterSource?: string;
  noPagination?: boolean;
  filterProps?: FilterProps;
}

const InventoryDiamondTable: React.FC<InventoryTableProps> = ({
  data: propData,
  loading: propLoading,
  error: propError,
  pageSize = 10,
  viewMode = "list",
  externalPagination,
  onPageChange,
  filterSource,
  noPagination = false,
  filterProps,
}) => {
  const [data, setData] = useState<InventoryDiamond[]>(propData || []);
  const [loading, setLoading] = useState(propLoading ?? false);
  const [error, setError] = useState<string | null>(propError || null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedDiamond, setSelectedDiamond] = useState<InventoryDiamond | null>(null);
  
  // Track if component is being used with external data (from props)
  const isExternalData = propData !== undefined;

  // Update local state when props change (for external data usage)
  useEffect(() => {
    if (isExternalData) {
      console.log('InventoryTable - External data update:', {
        dataLength: propData?.length,
        loading: propLoading,
        error: propError,
        externalPagination
      });
      
      setData(propData || []);
      setLoading(propLoading ?? false);
      setError(propError || null);
      setIsTransitioning(false); // Clear transition state
      
      // Use external pagination if provided
      if (externalPagination) {
        // Keep the original total records from backend
        const adjustedPagination = {
          ...externalPagination,
          totalPages: Math.ceil(externalPagination.totalRecords / rowsPerPage),
          recordsPerPage: rowsPerPage,
          hasNextPage: Math.ceil(externalPagination.totalRecords / rowsPerPage) > externalPagination.currentPage,
          hasPrevPage: externalPagination.currentPage > 1,
        };
        setPagination(adjustedPagination);
        setCurrentPage(externalPagination.currentPage); // Sync with external pagination's current page
        console.log('Using external pagination:', adjustedPagination);
      } else {
        // Create mock pagination for external data
        const totalRecords = propData?.length || 0;
        const totalPages = Math.ceil(totalRecords / rowsPerPage);
        setPagination({
          currentPage: 1,
          totalPages,
          totalRecords,
          recordsPerPage: rowsPerPage,
          hasNextPage: totalPages > 1,
          hasPrevPage: false,
        });
        setCurrentPage(1); // Reset to first page when new data comes in
      }
    }
  }, [propData, propLoading, propError, isExternalData, rowsPerPage, externalPagination]);

  // Reset to page 1 when rowsPerPage changes to prevent out-of-bounds errors
  useEffect(() => {
    if (pagination && currentPage > pagination.totalPages) {
      console.warn(`Current page ${currentPage} exceeds total pages ${pagination.totalPages}, resetting to page 1`);
      setCurrentPage(1);
    }
  }, [pagination, currentPage]);
  
  // Clear pagination when rowsPerPage changes to prevent stale data
  useEffect(() => {
    // Don't reset pagination for external data - it's managed by the parent
    if (!isExternalData) {
      setIsTransitioning(true);
      setPagination(null);
      setCurrentPage(1);
    }
  }, [rowsPerPage, isExternalData]);

  // Fetch data from API (only when not using external data)
  useEffect(() => {
    // Skip fetch if using external data (props)
    if (isExternalData) {
      return;
    }

    const fetchInventoryData = async () => {
      setLoading(true);
      setError(null);
      
      // Validate page number before making request
      if (currentPage < 1) {
        setCurrentPage(1);
        setLoading(false);
        return;
      }
      
      // If we have pagination info and page exceeds it, don't fetch
      if (pagination && currentPage > pagination.totalPages) {
        console.warn(`Page ${currentPage} exceeds totalPages ${pagination.totalPages}, resetting`);
        setCurrentPage(pagination.totalPages);
        setLoading(false);
        return;
      }
      
      try {
        const url = new URL('https://dalila-inventory-service-dev.caratlogic.com/api/diamonds/admin/search');
        url.searchParams.append('page', currentPage.toString());
        url.searchParams.append('limit', rowsPerPage.toString());
        
        if (sortConfig) {
          url.searchParams.append('sortBy', sortConfig.key);
          url.searchParams.append('sortOrder', sortConfig.direction);
        }
        
        // Add filter parameters if provided - using correct query param names for admin/search endpoint
        if (filterProps) {
          if (filterProps.shapes && filterProps.shapes.length > 0) {
            filterProps.shapes.forEach(shape => url.searchParams.append('SHAPE', shape));
          }
          if (filterProps.colors && filterProps.colors.length > 0) {
            filterProps.colors.forEach(color => url.searchParams.append('COLOR', color));
          }
          if (filterProps.clarities && filterProps.clarities.length > 0) {
            filterProps.clarities.forEach(clarity => url.searchParams.append('CLARITY', clarity));
          }
          if (filterProps.fluors && filterProps.fluors.length > 0) {
            filterProps.fluors.forEach(fluor => url.searchParams.append('FLOUR', fluor));
          }
          if (filterProps.minCarats !== undefined) {
            url.searchParams.append('CARATS_MIN', filterProps.minCarats.toString());
          }
          if (filterProps.maxCarats !== undefined) {
            url.searchParams.append('CARATS_MAX', filterProps.maxCarats.toString());
          }
          if (filterProps.cut) {
            url.searchParams.append('CUT', filterProps.cut);
          }
          if (filterProps.polish) {
            url.searchParams.append('POL', filterProps.polish);
          }
          if (filterProps.symmetry) {
            url.searchParams.append('SYM', filterProps.symmetry);
          }
          if (filterProps.locations && filterProps.locations.length > 0) {
            filterProps.locations.forEach(loc => url.searchParams.append('LOCATION', loc));
          }
          if (filterProps.labs && filterProps.labs.length > 0) {
            filterProps.labs.forEach(lab => url.searchParams.append('LAB', lab));
          }
          if (filterProps.inclusions) {
            const { centerBlack, centerWhite, sideBlack, sideWhite } = filterProps.inclusions;
            if (centerBlack && centerBlack.length > 0) centerBlack.forEach(val => url.searchParams.append('CN', val));
            if (centerWhite && centerWhite.length > 0) centerWhite.forEach(val => url.searchParams.append('CW', val));
            if (sideBlack && sideBlack.length > 0) sideBlack.forEach(val => url.searchParams.append('SN', val));
            if (sideWhite && sideWhite.length > 0) sideWhite.forEach(val => url.searchParams.append('SW', val));
          }
          if (filterProps.keySymbols) {
            const { keyToSymbol } = filterProps.keySymbols;
            if (keyToSymbol && keyToSymbol.length > 0) keyToSymbol.forEach(val => url.searchParams.append('KEY_TO_SYMBOLS', val));
          }
          if (filterProps.priceFilters) {
            const { pricePerCarat, discount, totalPrice } = filterProps.priceFilters;
            if (pricePerCarat?.from) url.searchParams.append('NET_RATE_MIN', pricePerCarat.from);
            if (pricePerCarat?.to) url.searchParams.append('NET_RATE_MAX', pricePerCarat.to);
            if (discount?.from) url.searchParams.append('DISC_PER_MIN', discount.from);
            if (discount?.to) url.searchParams.append('DISC_PER_MAX', discount.to);
            if (totalPrice?.from) url.searchParams.append('NET_VALUE_MIN', totalPrice.from);
            if (totalPrice?.to) url.searchParams.append('NET_VALUE_MAX', totalPrice.to);
          }
          if (filterProps.measurements) {
            const { length, width, depth, table, depthPercent, pavAngle, pavHeight, crAngle, crHeight } = filterProps.measurements;
            if (length?.from) url.searchParams.append('LENGTH_MIN', length.from);
            if (length?.to) url.searchParams.append('LENGTH_MAX', length.to);
            if (width?.from) url.searchParams.append('WIDTH_MIN', width.from);
            if (width?.to) url.searchParams.append('WIDTH_MAX', width.to);
            if (depth?.from) url.searchParams.append('DEPTH_MIN', depth.from);
            if (depth?.to) url.searchParams.append('DEPTH_MAX', depth.to);
            if (table?.from) url.searchParams.append('TABLE_PER_MIN', table.from);
            if (table?.to) url.searchParams.append('TABLE_PER_MAX', table.to);
            if (depthPercent?.from) url.searchParams.append('DEPTH_PER_MIN', depthPercent.from);
            if (depthPercent?.to) url.searchParams.append('DEPTH_PER_MAX', depthPercent.to);
            if (pavAngle?.from) url.searchParams.append('PAVILLION_ANGLE_MIN', pavAngle.from);
            if (pavAngle?.to) url.searchParams.append('PAVILLION_ANGLE_MAX', pavAngle.to);
            if (pavHeight?.from) url.searchParams.append('PAVILLION_HEIGHT_MIN', pavHeight.from);
            if (pavHeight?.to) url.searchParams.append('PAVILLION_HEIGHT_MAX', pavHeight.to);
            if (crAngle?.from) url.searchParams.append('CROWN_ANGLE_MIN', crAngle.from);
            if (crAngle?.to) url.searchParams.append('CROWN_ANGLE_MAX', crAngle.to);
            if (crHeight?.from) url.searchParams.append('CROWN_HEIGHT_MIN', crHeight.from);
            if (crHeight?.to) url.searchParams.append('CROWN_HEIGHT_MAX', crHeight.to);
          }
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          credentials: 'include', // Include cookies for admin authentication
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 500 && currentPage > 1) {
            // If page is out of bounds, reset to page 1
            console.warn(`Page ${currentPage} out of bounds, resetting to page 1`);
            setCurrentPage(1);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch inventory data: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
          setPagination(result.pagination);
          setIsTransitioning(false);
          
          // If current page exceeds total pages, go to last page
          if (result.pagination && currentPage > result.pagination.totalPages) {
            setCurrentPage(result.pagination.totalPages);
          }
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to load inventory data');
        setData([]);
        setIsTransitioning(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [currentPage, rowsPerPage, sortConfig, isExternalData, filterProps]);

  // Optionally filter by source if filterSource is provided
  let paginatedData: InventoryDiamond[];
  let totalRecords: number;

  if (noPagination) {
    // Show all data without pagination
    paginatedData = filterSource ? data.filter((d) => d.source === filterSource) : data;
    totalRecords = paginatedData.length;
  } else {
    // Internal pagination for local data (when externalPagination is not provided)
    const isInternalPagination = isExternalData && !externalPagination;
    if (isInternalPagination) {
      const filtered = filterSource ? data.filter((d) => d.source === filterSource) : data;
      const startIdx = (currentPage - 1) * rowsPerPage;
      const endIdx = startIdx + rowsPerPage;
      paginatedData = filtered.slice(startIdx, endIdx);
      totalRecords = filtered.length;
    } else if (isExternalData) {
      paginatedData = filterSource ? data.filter((d) => d.source === filterSource) : data;
      totalRecords = paginatedData.length;
    } else {
      paginatedData = data;
      totalRecords = pagination?.totalRecords || 0;
    }
  }
  
  const totalPages = pagination?.totalPages || 1;

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

  const goToPage = (page: number) => {
    // Block navigation during loading or transitions
    if (loading || isTransitioning) {
      console.warn('Navigation blocked during loading/transition');
      return;
    }
    
    // Ensure page is within valid bounds and not already on that page
    if (page < 1 || page === currentPage || !totalPages || !pagination) {
      return;
    }
    
    // Only navigate if page is within bounds of current pagination
    if (page <= totalPages && page <= pagination.totalPages) {
      setCurrentPage(page);
      
      // If using external data with page change callback, notify parent to fetch new data
      if (isExternalData && onPageChange) {
        onPageChange(page, rowsPerPage);
      }
    } else {
      console.warn(`Cannot navigate to page ${page}. Max is ${totalPages}`);
    }
  };

  const handleStockClick = (diamond: InventoryDiamond) => {
    // Show diamond detail view
    setSelectedDiamond(diamond);
  };

  const renderPaginationButtons = () => {
    const buttons: React.ReactElement[] = [];
    const maxButtons = 5;
    
    // Safety check to prevent rendering invalid page numbers
    if (!totalPages || totalPages < 1 || isTransitioning || !pagination) {
      return buttons;
    }

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
          disabled={i === currentPage}
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

  if (loading && data.length === 0 && !isExternalData) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          
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
      <>
      <div className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}>
        <div className="bg-white shadow-sm rounded-lg p-6 relative">
          {/* Loading Overlay */}
          {(loading || isTransitioning) && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
              <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
            </div>
          )}
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${(loading || isTransitioning) ? 'opacity-50 pointer-events-none' : ''}`}>
            {paginatedData.map((diamond) => (
              <div
                key={diamond._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleStockClick(diamond)}
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
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{diamond.LOCATION || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stage:</span>
                      <span className="font-medium text-gray-900">{diamond.STAGE || "N/A"}</span>
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
                        <span className="text-gray-600">Rap Price:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(diamond.RAP_PRICE || "0")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Disc%:</span>
                        <span className="font-semibold text-red-600">{formatPercentage(diamond.DISC_PER || "0")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Rate:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(diamond.NET_RATE || "0")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Value:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(diamond.NET_VALUE || "0")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for Grid View */}
          {!noPagination && (
            <div
              className="px-4 py-3 mt-6 border-t border-gray-200 flex items-center justify-between"
              style={{
                background: "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)",
              }}
            >
              <div className="text-sm text-gray-700 font-medium">
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, totalRecords)} of{" "}
                {totalRecords.toLocaleString()} diamonds
              </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">
                  Items per page
                </span>
                <select
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#070b3a] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  value={rowsPerPage}
                  disabled={loading || isTransitioning}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    // currentPage will be reset by the useEffect
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                 
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {!loading && renderPaginationButtons()}

                {!loading && totalPages > 10 && currentPage < totalPages - 4 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages || loading}
                      className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages || !pagination?.hasNextPage || loading}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      {selectedDiamond && (
        <DiamondDetailView
          diamond={{
            ...selectedDiamond,
            CARATS: parseFloat(selectedDiamond.CARATS) || 0,
            RAP_PRICE: parseFloat(selectedDiamond.RAP_PRICE) || 0,
            DISC_PER: parseFloat(selectedDiamond.DISC_PER) || 0,
            NET_VALUE: parseFloat(selectedDiamond.NET_VALUE) || 0,
            NET_RATE: selectedDiamond.NET_RATE,
            TABLE_PER: selectedDiamond.TABLE_PER ? parseFloat(selectedDiamond.TABLE_PER) : undefined,
            DEPTH_PER: selectedDiamond.DEPTH_PER ? parseFloat(selectedDiamond.DEPTH_PER) : undefined,
            CROWN_ANGLE: selectedDiamond.CROWN_ANGLE ? parseFloat(selectedDiamond.CROWN_ANGLE) : undefined,
            CROWN_HEIGHT: selectedDiamond.CROWN_HEIGHT ? parseFloat(selectedDiamond.CROWN_HEIGHT) : undefined,
            PAVILLION_ANGLE: selectedDiamond.PAVILLION_ANGLE ? parseFloat(selectedDiamond.PAVILLION_ANGLE) : undefined,
            PAVILLION_HEIGHT: selectedDiamond.PAVILLION_HEIGHT ? parseFloat(selectedDiamond.PAVILLION_HEIGHT) : undefined,
            KEY_TO_SYMBOLS: Array.isArray(selectedDiamond.KEY_TO_SYMBOLS) 
              ? selectedDiamond.KEY_TO_SYMBOLS.join(", ") 
              : selectedDiamond.KEY_TO_SYMBOLS,
            STAGE: selectedDiamond.STAGE || 'inventory',
          }}
          onClose={() => setSelectedDiamond(null)}
        />
      )}
      </>
    );
  }

  // Table View Rendering (default)
  return (
    <>
    <div
      className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}
    >
      <div className="bg-white shadow-sm flex flex-col rounded-none relative">
        {/* Loading Overlay */}
        {(loading || isTransitioning) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
          </div>
        )}
        
        <div className={`overflow-x-auto ${(loading || isTransitioning) ? 'opacity-50 pointer-events-none' : ''}`}>
          <table className="w-full border-collapse table-fixed">
            <thead
              className={`bg-[#050c3a] text-white sticky top-0 z-10 ${mavenPro.className}`}
            >
              <tr>
                <th className="w-28 px-2 py-3 text-left text-[14px] font-medium">Stock ID</th>
                <th className="w-28 px-2 py-3 text-left text-[14px] font-medium">Source</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Location</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Stage</th>
                <th className="w-25 px-2 py-3 text-left text-[14px] font-medium">Shape</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Carat</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Color</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Clarity</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Cut</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Polish</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Symmetry</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Fluor</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Lab</th>
                <th className="w-24 px-2 py-3 text-left text-[14px] font-medium">Rap Price</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Disc%</th>
                <th className="w-24 px-2 py-3 text-left text-[14px] font-medium">Net Rate</th>
                <th className="w-24 px-2 py-3 text-left text-[14px] font-medium">Net Value</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Depth%</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Table%</th>
                <th className="w-30 px-2 py-3 text-left text-[14px] font-medium">Measure</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Length</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Width</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Depth</th>
                <th className="w-16 px-2 py-3 text-left text-[14px] font-medium">Ratio</th>
                <th className="w-35 px-2 py-3 text-left text-[14px] font-medium">Key Symbols</th>
                <th className="w-60 px-2 py-3 text-left text-[14px] font-medium">Report Comments</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Crn Angle</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Crn Height</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Pav Angle</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Pav Height</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">CN</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">CW</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">SN</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">SW</th>
                <th className="w-30 px-2 py-3 text-left text-[14px] font-medium">Report No</th>
                <th className="w-24 px-2 py-3 text-left text-[14px] font-medium">Report Date</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Tinge</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Girdle</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Girdle %</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Star</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">H&A</th>
                <th className="w-20 px-2 py-3 text-left text-[14px] font-medium">Branch</th>
                <th className="w-30 px-2 py-3 text-left text-[14px] font-medium">DNA</th>
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
                  <td 
                    className="px-2 py-1 text-[14px] text-gray-700 font-medium truncate cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => handleStockClick(row)}
                  >
                    {row.STONE_NO || "N/A"}
                  </td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 text-sm truncate">{row.source || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.LOCATION || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.STAGE || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 truncate">{row.SHAPE || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CARATS || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.COLOR || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CLARITY || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CUT || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.POL || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.SYM || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.FLOUR || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.LAB || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{formatCurrency(row.RAP_PRICE || 0)}</td>
                  <td className="px-2 py-1 text-[14px] font-semibold text-red-600">{formatPercentage(row.DISC_PER || 0)}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{formatCurrency(row.NET_RATE || 0)}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 font-medium">{formatCurrency(row.NET_VALUE || 0)}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.DEPTH_PER || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.TABLE_PER || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 truncate">{row.MEASUREMENTS || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.LENGTH || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.WIDTH || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.DEPTH || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.RATIO || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 truncate">
                    {Array.isArray(row.KEY_TO_SYMBOLS) 
                      ? row.KEY_TO_SYMBOLS.join(", ") || "N/A"
                      : row.KEY_TO_SYMBOLS || "N/A"}
                  </td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 max-w-[240px]" title={row.REPORT_COMMENTS}>
                    <div className="truncate">{row.REPORT_COMMENTS || "N/A"}</div>
                  </td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CROWN_ANGLE || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CROWN_HEIGHT || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.PAVILLION_ANGLE || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.PAVILLION_HEIGHT || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CN || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.CW || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.SN || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.SW || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700" style={{maxWidth: '220px', whiteSpace: 'normal', wordBreak: 'break-all'}}>
                    {row.REPORT_NO || "N/A"}
                  </td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 truncate">
                    {row.REPORT_DATE ? new Date(row.REPORT_DATE).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 truncate">{row.TINGE || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.GIRDLE || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.GIRDLE_PER || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.STAR || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.HA || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700">{row.BRANCH || "N/A"}</td>
                  <td className="px-2 py-1 text-[14px] text-gray-700 truncate">
                    {row.DNA ? (
                      <a 
                        href={row.DNA} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    ) : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!noPagination && (
          <div
            className="px-4 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0"
            style={{
              background: "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)",
            }}
          >
            <div className="text-sm text-gray-700 font-medium">
              {(() => {
                let start, end, total;
                if (externalPagination) {
                  const { currentPage, recordsPerPage, totalRecords } = externalPagination;
                  start = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
                  end = Math.min(currentPage * recordsPerPage, totalRecords);
                  total = totalRecords;
                } else {
                  start = (currentPage - 1) * rowsPerPage + 1;
                  end = Math.min(currentPage * rowsPerPage, totalRecords);
                  total = totalRecords;
                }
                return `Showing ${start} to ${end} of ${total.toLocaleString()} diamonds`;
              })()}
            </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">
                Rows per page
              </span>
              <select
                className="border border-gray-300 rounded-none px-3 py-1.5 text-sm text-gray-800 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#070b3a] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                value={rowsPerPage}
                disabled={loading || isTransitioning}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  // currentPage will be reset by the useEffect
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {!loading && renderPaginationButtons()}

              {!loading && totalPages > 10 && currentPage < totalPages - 4 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || !pagination?.hasNextPage || loading}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
    {selectedDiamond && (
      <DiamondDetailView
        diamond={{
          ...selectedDiamond,
          CARATS: parseFloat(selectedDiamond.CARATS) || 0,
          RAP_PRICE: parseFloat(selectedDiamond.RAP_PRICE) || 0,
          DISC_PER: parseFloat(selectedDiamond.DISC_PER) || 0,
          NET_VALUE: parseFloat(selectedDiamond.NET_VALUE) || 0,
          NET_RATE: selectedDiamond.NET_RATE,
          TABLE_PER: selectedDiamond.TABLE_PER ? parseFloat(selectedDiamond.TABLE_PER) : undefined,
          DEPTH_PER: selectedDiamond.DEPTH_PER ? parseFloat(selectedDiamond.DEPTH_PER) : undefined,
          CROWN_ANGLE: selectedDiamond.CROWN_ANGLE ? parseFloat(selectedDiamond.CROWN_ANGLE) : undefined,
          CROWN_HEIGHT: selectedDiamond.CROWN_HEIGHT ? parseFloat(selectedDiamond.CROWN_HEIGHT) : undefined,
          PAVILLION_ANGLE: selectedDiamond.PAVILLION_ANGLE ? parseFloat(selectedDiamond.PAVILLION_ANGLE) : undefined,
          PAVILLION_HEIGHT: selectedDiamond.PAVILLION_HEIGHT ? parseFloat(selectedDiamond.PAVILLION_HEIGHT) : undefined,
          KEY_TO_SYMBOLS: Array.isArray(selectedDiamond.KEY_TO_SYMBOLS) 
            ? selectedDiamond.KEY_TO_SYMBOLS.join(", ") 
            : selectedDiamond.KEY_TO_SYMBOLS,
          STAGE: selectedDiamond.STAGE || 'inventory',
        }}
        onClose={() => setSelectedDiamond(null)}
      />
    )}
    </>
  );
};

export default InventoryDiamondTable;
