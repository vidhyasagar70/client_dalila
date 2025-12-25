"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ArrowLeft, Package, Globe, Check } from "lucide-react";
import ShapeFilter from "./ShapeFilter";
import CaratFilter from "./CaratFilter";
import ClarityFilter from "./ClarityFilter";
import ColorFilter from "./ColorFilter";
import InventoryDiamondTable from "./InventoryDiamondTable";
import { inventoryApi } from "@/lib/api";
import toast from "react-hot-toast";

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

interface ConfigureAPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string;
  onConfigSaved?: () => void;
}

const ConfigureAPIModal: React.FC<ConfigureAPIModalProps> = ({
  isOpen,
  onClose,
  supplierName,
  onConfigSaved,
}) => {
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedCaratRanges, setSelectedCaratRanges] = useState<
    { min: string; max: string }[]
  >([]);
  const [selectedClarities, setSelectedClarities] = useState<string[]>([]);
  const [selectedSpecial, setSelectedSpecial] = useState<string>("");
  const [selectedCut, setSelectedCut] = useState<string>("");
  const [selectedPolish, setSelectedPolish] = useState<string>("");
  const [selectedSymmetry, setSelectedSymmetry] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCutsForPayload, setSelectedCutsForPayload] = useState<
    string[]
  >([]);

  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'api'>('inventory');
  const [diamondData, setDiamondData] = useState<InventoryDiamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<{
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | undefined>(undefined);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // For Check button and dropdown
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterData, setFilterData] = useState<Record<string, string[]> | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  // Handle Check button click
  const handleCheckFilters = async () => {
    setIsChecking(true);
    setShowFilterDropdown(false);
    setFilterData(null);
    try {
      const response = await fetch(
        `https://dalila-inventory-service-dev.caratlogic.com/api/users/admin/supplier-settings/Dharam%20Web%20Api/filters`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch filter data");
      const data = await response.json();
      if (data.success && data.data) {
        setFilterData(data.data);
        setShowFilterDropdown(true);
      } else {
        toast.error(data.message || "No filter data found");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch filter data");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset filters when modal closes
      clearAllFilters();
      setDiamondData([]);
      setCurrentPage(1);
      setPaginationInfo(undefined);
    }
  }, [isOpen]);

  const fetchFilteredData = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      // Calculate min and max carat from selected ranges
      let minCarat: number | undefined;
      let maxCarat: number | undefined;
      if (selectedCaratRanges.length > 0) {
        const mins = selectedCaratRanges.map((r) => parseFloat(r.min));
        const maxs = selectedCaratRanges.map((r) => parseFloat(r.max));
        minCarat = Math.min(...mins);
        maxCarat = Math.max(...maxs);
      }

      console.log('Fetching with filters:', {
        source: supplierName,
        shapes: selectedShapes,
        colors: selectedColors,
        clarities: selectedClarities,
        minCarat,
        maxCarat,
        page,
        limit: rowsPerPage
      });

      // Fetch diamonds with pagination
      const response = await inventoryApi.searchDiamonds({
        source: supplierName,
        page: page,
        limit: rowsPerPage,
        shapes: selectedShapes.length > 0 ? selectedShapes : undefined,
        colors: selectedColors.length > 0 ? selectedColors : undefined,
        clarities: selectedClarities.length > 0 ? selectedClarities : undefined,
        minCarats: minCarat,
        maxCarats: maxCarat,
      });

      console.log('Filtered response:', response);
      console.log('Number of diamonds:', response.data?.length || 0);
      setDiamondData(response.data || []);
      setPaginationInfo(response.pagination || null);
    } catch (err) {
      console.error('Error fetching diamond data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setDiamondData([]);
    } finally {
      setLoading(false);
    }
  }, [supplierName, selectedShapes, selectedCaratRanges, selectedClarities, selectedColors, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (isOpen && activeTab === 'inventory') {
      setCurrentPage(1);
    }
  }, [isOpen, activeTab, selectedShapes, selectedCaratRanges, selectedClarities, selectedColors]);

  // Fetch diamond data when page or filters change
  useEffect(() => {
    if (isOpen && activeTab === 'inventory') {
      fetchFilteredData(currentPage);
    }
  }, [isOpen, activeTab, currentPage, rowsPerPage, supplierName, fetchFilteredData]);

  const handlePageChange = (page: number, newRowsPerPage: number) => {
    console.log('Page change requested:', { page, newRowsPerPage });
    if (newRowsPerPage !== rowsPerPage) {
      setRowsPerPage(newRowsPerPage);
      setCurrentPage(1); // Reset to page 1 when rows per page changes
    } else {
      setCurrentPage(page);
    }
  };

  const clearAllFilters = () => {
    setSelectedShapes([]);
    setSelectedCaratRanges([]);
    setSelectedClarities([]);
    setSelectedSpecial("");
    setSelectedCut("");
    setSelectedPolish("");
    setSelectedSymmetry("");
    setSelectedColors([]);
    setSelectedCutsForPayload([]);
  };

  const handleApplyFilters = async () => {
    try {
      setIsApplying(true);

      // Calculate min and max carat from selected ranges
      let minCarat = 0;
      let maxCarat = 0;
      if (selectedCaratRanges.length > 0) {
        const mins = selectedCaratRanges.map((r) => parseFloat(r.min));
        const maxs = selectedCaratRanges.map((r) => parseFloat(r.max));
        minCarat = Math.min(...mins);
        maxCarat = Math.max(...maxs);
      }

      const filterPayload = {
        isFilterEnabled: true,
        shapes: selectedShapes.length > 0 ? selectedShapes : undefined,
        colors: selectedColors.length > 0 ? selectedColors : undefined,
        carats: {
          min: minCarat,
          max: maxCarat,
        },
        cuts:
          selectedCutsForPayload.length > 0
            ? selectedCutsForPayload
            : undefined,
        clarities:
          selectedClarities.length > 0 ? selectedClarities : undefined,
      };

      const response = await inventoryApi.applySupplierFilters(
        supplierName,
        filterPayload
      );

      if (response.success) {
        toast.success(response.message || "Filters applied successfully!");
        if (onConfigSaved) {
          onConfigSaved();
        }
        onClose();
      } else {
        toast.error(response.message || "Failed to apply filters");
      }
    } catch (err) {
      console.error("Error applying filters:", err);
      toast.error(err instanceof Error ? err.message : "Failed to apply filters");
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white p-6 flex justify-between items-center flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 border border-[#B6B8C6] rounded px-2 py-1 bg-white text-[#373B5C] font-normal text-base shadow-sm hover:bg-gray-50 focus:outline-none"
              style={{ boxShadow: '0 0 0 1px #E0E1EA', minWidth: 'auto' }}
            >
              <ArrowLeft size={18} stroke="#373B5C" strokeWidth={2} />
              <span style={{fontFamily: 'inherit', fontWeight: 400, fontSize: '15px'}}>Back to List</span>
            </button>
            <h2 className="text-xl font-bold text-[#050C3A] ml-1">Configure API</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#050C3A] hover:text-gray-400 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Top Toggle */}
        <div className="flex border-b border-gray-200">
          <button
            className={`w-1/2 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'inventory' ? 'text-white' : 'text-gray-700'
            }`}
            style={{ backgroundColor: activeTab === 'inventory' ? '#050C3A' : '#FAF6EB' }}
            onClick={() => setActiveTab('inventory')}
          >
            <Package className="w-4 h-4" />
            Configure Inventory Data
          </button>
          <button
            className={`w-1/2 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'api' ? 'text-white' : 'text-gray-700'
            }`}
            style={{ backgroundColor: activeTab === 'api' ? '#050C3A' : '#FAF6EB' }}
            onClick={() => setActiveTab('api')}
          >
            <Globe className="w-4 h-4" />
            Configure API Data
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'inventory' ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-3">
                {/* Shape Filter - Column 1 */}
                <div>
                  <ShapeFilter
                    selectedShape={selectedShapes}
                    onShapeChange={setSelectedShapes}
                  />
                </div>

                {/* Carat Filter - Column 2 */}
                <div>
                  <CaratFilter
                    selectedCaratRanges={selectedCaratRanges}
                    onCaratChange={setSelectedCaratRanges}
                  />
                </div>

                {/* Column 3 - Clarity and Color stacked */}
                <div className="flex flex-col gap-4">
                  {/* Clarity Filter */}
                  <div>
                    <ClarityFilter
                      selectedClarity={selectedClarities}
                      selectedSpecial={selectedSpecial}
                      selectedCut={selectedCut}
                      selectedPolish={selectedPolish}
                      selectedSymmetry={selectedSymmetry}
                      onClarityChange={setSelectedClarities}
                      onSpecialChange={setSelectedSpecial}
                      onCutChange={setSelectedCut}
                      onPolishChange={setSelectedPolish}
                      onSymmetryChange={setSelectedSymmetry}
                      hideExtras={true}
                    />
                  </div>

                  {/* Color Filter - Below Clarity */}
                  <div>
                    <ColorFilter
                      selectedColor={selectedColors}
                      onColorChange={setSelectedColors}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button - Positioned at the right end below filters */}
              <div className="flex justify-end mb-3 gap-2">
                {/* Check Button */}
                <div className="relative">
                  <button
                    onClick={handleCheckFilters}
                    disabled={isChecking}
                    className="bg-[#050C3A] text-white px-6 py-2 rounded-md hover:bg-[#070d4a] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {isChecking ? "Loading..." : "Applied Filters"}
                  </button>
                  {/* Dropdown for filter data */}
                  {showFilterDropdown && filterData && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#FAF6EB] text-gray-900 border border-gray-300 rounded shadow-lg z-50 p-4 text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">Applied Filters</span>
                        <button onClick={() => setShowFilterDropdown(false)} className="text-gray-600 hover:text-gray-900"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(filterData).map(([key, value]) => (
                          <div key={key} className="flex gap-2 text-gray-800">
                            <span className="font-medium capitalize min-w-[80px]">{key}:</span>
                            <span>
                              {Array.isArray(value)
                                ? value.join(", ")
                                : typeof value === "object" && value !== null
                                  ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(", ")
                                  : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Save Button */}
                <button
                  onClick={handleApplyFilters}
                  disabled={isApplying}
                  className="bg-[#050c3a] text-white px-12 py-2 rounded-md hover:bg-[#070d4a] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mr-5"
                >
                  <Check className="w-4 h-4" />
                  {isApplying ? "Saving..." : "Save"}
                </button>
              </div>

              {/* Diamond Data Table */}
              <div>
                <InventoryDiamondTable
                  data={diamondData}
                  loading={loading}
                  error={error}
                  viewMode="list"
                  externalPagination={paginationInfo}
                  onPageChange={handlePageChange}
                  pageSize={rowsPerPage}
                />
                {/* Diamond count summary */}
                {paginationInfo && (
                  <div className="mt-4 p-3 bg-[#050C3A] border border-blue-200">
                    <p className="text-sm font-semibold text-white">
                      Total diamonds {paginationInfo.totalRecords.toLocaleString()} from Dharam Web Api 
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-2xl font-bold text-gray-400 mb-2">Coming Soon</span>
              <span className="text-gray-500">This feature will be available in a future update.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigureAPIModal;