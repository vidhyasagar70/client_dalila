"use client";

import React, { useState, useEffect } from "react";
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

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FilterProps {
  shapes?: string[];
  colors?: string[];
  clarities?: string[];
  minCarats?: number;
  maxCarats?: number;
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
  const router = useRouter();
  const [data, setData] = useState<InventoryDiamond[]>(propData || []);
  const [loading, setLoading] = useState(propLoading ?? false);
  const [error, setError] = useState<string | null>(propError || null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  
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
        
        // Add filter parameters if provided
        if (filterProps) {
          if (filterProps.shapes && filterProps.shapes.length > 0) {
            filterProps.shapes.forEach(shape => url.searchParams.append('shapes[]', shape));
          }
          if (filterProps.colors && filterProps.colors.length > 0) {
            filterProps.colors.forEach(color => url.searchParams.append('colors[]', color));
          }
          if (filterProps.clarities && filterProps.clarities.length > 0) {
            filterProps.clarities.forEach(clarity => url.searchParams.append('clarities[]', clarity));
          }
          if (filterProps.minCarats !== undefined) {
            url.searchParams.append('minCarats', filterProps.minCarats.toString());
          }
          if (filterProps.maxCarats !== undefined) {
            url.searchParams.append('maxCarats', filterProps.maxCarats.toString());
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

  const handleSort = (key: string) => {
    // Disable sorting when using external data
    if (isExternalData) {
      return;
    }
    
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

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

  const handleStockClick = (stoneNo: string) => {
    // Navigate to product detail page
    router.push(`/sud?stockId=${encodeURIComponent(stoneNo)}`);
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
        <div className="bg-white shadow-sm rounded-lg p-6 relative">
          {/* Loading Overlay */}
          {(loading || isTransitioning) && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-[#050c3a]" />
            </div>
          )}
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${(loading || isTransitioning) ? 'opacity-50 pointer-events-none' : ''}`}>
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
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-green-600">
                          {diamond.NET_VALUE !== "NA" ? formatCurrency(diamond.NET_VALUE) : "N/A"}
                        </span>
                      </div> */}
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
    );
  }

  // Table View Rendering (default)
  return (
    <div
      className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}
    >
      <div className="bg-white shadow-sm flex flex-col rounded-none relative">
        {/* Loading Overlay */}
        {(loading || isTransitioning) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#050c3a]" />
          </div>
        )}
        
        <div className={`overflow-x-auto ${(loading || isTransitioning) ? 'opacity-50 pointer-events-none' : ''}`}>
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
                    className="py-3 px-4 text-blue-600 font-medium"
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

        {!noPagination && (
          <div
            className="px-4 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0"
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
  );
};

export default InventoryDiamondTable;
