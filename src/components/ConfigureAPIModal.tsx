"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import ShapeFilter from "./ShapeFilter";
import CaratFilter from "./CaratFilter";
import ClarityFilter from "./ClarityFilter";
import ColorFilter from "./ColorFilter";
import InventoryDiamondTable from "./InventoryDiamondTable";
import { inventoryApi } from "@/lib/api";

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

  useEffect(() => {
    if (!isOpen) {
      // Reset filters when modal closes
      clearAllFilters();
      setDiamondData([]);
    }
  }, [isOpen]);

  const fetchFilteredData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        supplier: supplierName,
        page: 1,
        limit: 10000,
      };

      if (selectedShapes.length > 0) {
        params.shape = selectedShapes.join(',');
      }

      if (selectedClarities.length > 0) {
        params.clarity = selectedClarities.join(',');
      }

      if (selectedColors.length > 0) {
        params.color = selectedColors.join(',');
      }

      if (selectedCaratRanges.length > 0) {
        const mins = selectedCaratRanges.map((r) => parseFloat(r.min));
        const maxs = selectedCaratRanges.map((r) => parseFloat(r.max));
        params.minCarat = Math.min(...mins);
        params.maxCarat = Math.max(...maxs);
      }

      const response = await inventoryApi.getAllDiamonds(params);
      setDiamondData(response.data || []);
    } catch (err) {
      console.error('Error fetching diamond data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setDiamondData([]);
    } finally {
      setLoading(false);
    }
  }, [supplierName, selectedShapes, selectedCaratRanges, selectedClarities, selectedColors]);

  // Fetch diamond data when filters change
  useEffect(() => {
    if (isOpen && activeTab === 'inventory') {
      fetchFilteredData();
    }
  }, [isOpen, activeTab, fetchFilteredData]);

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
      let maxCarat = 10;
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
        alert("Filters applied successfully!");
        if (onConfigSaved) {
          onConfigSaved();
        }
        onClose();
      } else {
        alert(response.message || "Failed to apply filters");
      }
    } catch (err) {
      console.error("Error applying filters:", err);
      alert(err instanceof Error ? err.message : "Failed to apply filters");
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#050c3a] text-white p-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Configure API</h2>
            <p className="text-sm text-gray-300 mt-1">
              Configure filters for {supplierName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Top Toggle */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 pt-4">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-t-md font-semibold transition-colors ${activeTab === 'inventory' ? 'bg-white text-[#050c3a] border-b-2 border-[#050c3a]' : 'text-gray-600 hover:text-[#050c3a]'}`}
              onClick={() => setActiveTab('inventory')}
            >
              Configure Inventory Data
            </button>
            <button
              className={`px-4 py-2 rounded-t-md font-semibold transition-colors ${activeTab === 'api' ? 'bg-white text-[#050c3a] border-b-2 border-[#050c3a]' : 'text-gray-600 hover:text-[#050c3a]'}`}
              onClick={() => setActiveTab('api')}
            >
              Configure API Data
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'inventory' ? (
            <>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Diamonds
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
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

              {/* Diamond Data Table */}
              <div>
                <InventoryDiamondTable
                  data={diamondData}
                  loading={loading}
                  error={error}
                  pageSize={20}
                  viewMode="list"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-2xl font-bold text-gray-400 mb-2">Coming Soon</span>
              <span className="text-gray-500">This feature will be available in a future update.</span>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {activeTab === 'inventory' && (
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={isApplying}
              className="bg-[#050c3a] text-white px-8 py-2.5 rounded-md hover:bg-[#070d4a] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isApplying ? "Applying..." : "Apply Filters"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigureAPIModal;
