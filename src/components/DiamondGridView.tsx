import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { diamondApi } from "@/lib/api";
import type {
  DiamondData,
  GridViewProps,
  FilterParams,
} from "@/types/Diamondtable";
import DiamondDetailView from "./DiamondDetailView";
import { Maven_Pro } from "next/font/google";
import { getLocationApiValues, getLabApiValues } from "./Priceandloction";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const DiamondGridView: React.FC<GridViewProps> = ({
  onRowClick,
  searchTerm = "",
  selectedShape = [],
  selectedColor = [],
  selectedMinCarat = "",
  selectedMaxCarat = "",
  selectedFluor = [],
  selectedClarity = [],
  selectedCut = "",
  selectedPolish = "",
  selectedLocations = [],
  selectedLabs = [],
  selectedSymmetry = "",
  keySymbolFilters,
  inclusionFilters,
  priceFilters,
}) => {
  const [data, setData] = useState<DiamondData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondData | null>(
    null,
  );

  // Memoize filter strings to prevent unnecessary re-renders
  const filterKey = useMemo(() => {
    return JSON.stringify({
      searchTerm,
      selectedShape: Array.isArray(selectedShape)
        ? selectedShape.sort().join(",")
        : "",
      selectedColor: Array.isArray(selectedColor)
        ? selectedColor.sort().join(",")
        : "",
      selectedMinCarat,
      selectedMaxCarat,
      selectedFluor: Array.isArray(selectedFluor)
        ? selectedFluor.sort().join(",")
        : "",
      selectedClarity: Array.isArray(selectedClarity)
        ? selectedClarity.sort().join(",")
        : "",
      selectedCut,
      selectedPolish,
      selectedSymmetry,
      selectedLocations: Array.isArray(selectedLocations)
        ? selectedLocations.sort().join(",")
        : "",
      selectedLabs: Array.isArray(selectedLabs)
        ? selectedLabs.sort().join(",")
        : "",
      keySymbolFilters,
      inclusionFilters,
      priceFilters,
    });
  }, [
    searchTerm,
    selectedShape,
    selectedColor,
    selectedMinCarat,
    selectedMaxCarat,
    selectedFluor,
    selectedClarity,
    selectedCut,
    selectedPolish,
    selectedSymmetry,
    selectedLocations,
    selectedLabs,
    keySymbolFilters,
    inclusionFilters,
    priceFilters,
  ]);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        setLoading(true);
        setError(null);

        const hasSearchTerm = searchTerm && searchTerm.trim();
        const hasShapeFilter = Array.isArray(selectedShape) && selectedShape.length > 0;
        const hasColorFilter = Array.isArray(selectedColor) && selectedColor.length > 0;
        const hasCaratFilter = (selectedMinCarat && selectedMinCarat.trim()) || (selectedMaxCarat && selectedMaxCarat.trim());
        const hasFluorFilter = Array.isArray(selectedFluor) && selectedFluor.length > 0;
        const hasClarityFilter = Array.isArray(selectedClarity) && selectedClarity.length > 0;
        const hasCutFilter = selectedCut && selectedCut.trim();
        const hasPolishFilter = selectedPolish && selectedPolish.trim();
        const hasSymmetryFilter = selectedSymmetry && selectedSymmetry.trim();
        const hasLocationFilter = Array.isArray(selectedLocations) && selectedLocations.length > 0;
        const hasLabFilter = Array.isArray(selectedLabs) && selectedLabs.length > 0;

        // Check for price filters
        const hasPriceFilter =
          priceFilters &&
          ((priceFilters.pricePerCarat?.from && priceFilters.pricePerCarat.from.trim()) ||
            (priceFilters.pricePerCarat?.to && priceFilters.pricePerCarat.to.trim()) ||
            (priceFilters.discount?.from && priceFilters.discount.from.trim()) ||
            (priceFilters.discount?.to && priceFilters.discount.to.trim()) ||
            (priceFilters.totalPrice?.from && priceFilters.totalPrice.from.trim()) ||
            (priceFilters.totalPrice?.to && priceFilters.totalPrice.to.trim()));

        const hasInclusionFilter =
          inclusionFilters &&
          (inclusionFilters.centerBlack.length > 0 ||
            inclusionFilters.centerWhite.length > 0 ||
            inclusionFilters.sideBlack.length > 0 ||
            inclusionFilters.sideWhite.length > 0);

        // Check for Key Symbol filters
        const hasKeySymbolFilter =
          keySymbolFilters &&
          (keySymbolFilters.keyToSymbol.length > 0 ||
            keySymbolFilters.eyCln.length > 0 ||
            keySymbolFilters.hAndA.length > 0);

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
          hasLocationFilter ||
          hasLabFilter ||
          hasInclusionFilter ||
          hasKeySymbolFilter ||
          hasPriceFilter;

        let response;
        if (hasAnyFilter) {
          const filters: FilterParams = {
            page: 1,
            limit: 10000,
          };

          if (hasShapeFilter) filters.shape = selectedShape.join(",");
          if (hasColorFilter) filters.color = selectedColor.join(",");
          if (hasCaratFilter) {
            if (selectedMinCarat && selectedMinCarat.trim()) filters.minCarats = parseFloat(selectedMinCarat);
            if (selectedMaxCarat && selectedMaxCarat.trim()) filters.maxCarats = parseFloat(selectedMaxCarat);
          }
          if (hasFluorFilter) filters.fluorescence = selectedFluor.join(",");
          if (hasClarityFilter) filters.clarity = selectedClarity.join(",");
          if (hasCutFilter) filters.cut = selectedCut.trim();
          if (hasPolishFilter) filters.polish = selectedPolish.trim();
          if (hasSymmetryFilter) filters.symmetry = selectedSymmetry.trim();
          if (hasSearchTerm) filters.searchTerm = searchTerm.trim();
          if (hasLocationFilter) {
            const apiLocationValues = getLocationApiValues(selectedLocations);
            filters.location = apiLocationValues.join(",");
          }
          if (hasLabFilter) {
            const apiLabValues = getLabApiValues(selectedLabs);
            filters.lab = apiLabValues.join(",");
          }
          if (hasInclusionFilter && inclusionFilters) {
            if (inclusionFilters.centerBlack.length > 0) filters.CN = inclusionFilters.centerBlack.join(",");
            if (inclusionFilters.centerWhite.length > 0) filters.CW = inclusionFilters.centerWhite.join(",");
            if (inclusionFilters.sideBlack.length > 0) filters.SN = inclusionFilters.sideBlack.join(",");
            if (inclusionFilters.sideWhite.length > 0) filters.SW = inclusionFilters.sideWhite.join(",");
          }
          if (hasKeySymbolFilter && keySymbolFilters) {
            if (keySymbolFilters.keyToSymbol.length > 0) filters.keyToSymbols = keySymbolFilters.keyToSymbol.join(",");
            if (keySymbolFilters.eyCln.length > 0) filters.eyCln = keySymbolFilters.eyCln.join(",");
            if (keySymbolFilters.hAndA.length > 0) filters.hAndA = keySymbolFilters.hAndA.join(",");
          }
          if (hasPriceFilter && priceFilters) {
            if (priceFilters.pricePerCarat.from && priceFilters.pricePerCarat.from.trim()) filters.netRateMin = parseFloat(priceFilters.pricePerCarat.from);
            if (priceFilters.pricePerCarat.to && priceFilters.pricePerCarat.to.trim()) filters.netRateMax = parseFloat(priceFilters.pricePerCarat.to);
            if (priceFilters.discount.from && priceFilters.discount.from.trim()) filters.discPerMin = parseFloat(priceFilters.discount.from);
            if (priceFilters.discount.to && priceFilters.discount.to.trim()) filters.discPerMax = parseFloat(priceFilters.discount.to);
            if (priceFilters.totalPrice.from && priceFilters.totalPrice.from.trim()) filters.netValueMin = parseFloat(priceFilters.totalPrice.from);
            if (priceFilters.totalPrice.to && priceFilters.totalPrice.to.trim()) filters.netValueMax = parseFloat(priceFilters.totalPrice.to);
          }
          response = await diamondApi.search(filters);
        } else {
          response = await diamondApi.getAllNoPagination();
        }

        if (response?.success && response.data) {
          let diamonds: DiamondData[];
          if (Array.isArray(response.data)) {
            diamonds = response.data as unknown as DiamondData[];
          } else if (response.data.diamonds && Array.isArray(response.data.diamonds)) {
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
        console.error("Grid View - Error fetching diamonds:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch diamonds");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDiamonds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    JSON.stringify(selectedShape),
    JSON.stringify(selectedColor),
    selectedMinCarat,
    selectedMaxCarat,
    JSON.stringify(selectedFluor),
    JSON.stringify(selectedClarity),
    selectedCut,
    selectedPolish,
    selectedSymmetry,
    JSON.stringify(selectedLocations),
    JSON.stringify(selectedLabs),
    JSON.stringify(keySymbolFilters),
    JSON.stringify(inclusionFilters),
    JSON.stringify(priceFilters),
  ]);

  // Calculate pagination with rowsPerPage
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Loading state
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

  // Error state
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

  // No data state
  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-3">
            {searchTerm ||
            (Array.isArray(selectedShape) && selectedShape.length > 0) ||
            (Array.isArray(selectedColor) && selectedColor.length > 0) ||
            (Array.isArray(selectedClarity) && selectedClarity.length > 0) ||
            selectedCut ||
            selectedPolish ||
            selectedSymmetry ||
            (Array.isArray(selectedFluor) && selectedFluor.length > 0) ||
            selectedMinCarat ||
            selectedMaxCarat ||
            (Array.isArray(selectedLocations) &&
              selectedLocations.length > 0) ||
            (Array.isArray(selectedLabs) && selectedLabs.length > 0) ||
            (keySymbolFilters?.keyToSymbol &&
              keySymbolFilters.keyToSymbol.length > 0) ||
            (keySymbolFilters?.eyCln && keySymbolFilters.eyCln.length > 0) ||
            (keySymbolFilters?.hAndA && keySymbolFilters.hAndA.length > 0) ||
            (inclusionFilters?.centerBlack &&
              inclusionFilters.centerBlack.length > 0) ||
            (inclusionFilters?.centerWhite &&
              inclusionFilters.centerWhite.length > 0) ||
            (inclusionFilters?.sideBlack &&
              inclusionFilters.sideBlack.length > 0) ||
            (inclusionFilters?.sideWhite &&
              inclusionFilters.sideWhite.length > 0) ||
            priceFilters?.pricePerCarat?.from ||
            priceFilters?.pricePerCarat?.to ||
            priceFilters?.discount?.from ||
            priceFilters?.discount?.to ||
            priceFilters?.totalPrice?.from ||
            priceFilters?.totalPrice?.to
              ? `No diamonds found matching your filters`
              : "No diamonds found"}
          </p>
          {((Array.isArray(selectedShape) && selectedShape.length > 0) ||
            (Array.isArray(selectedColor) && selectedColor.length > 0) ||
            (Array.isArray(selectedClarity) && selectedClarity.length > 0) ||
            selectedCut ||
            selectedPolish ||
            selectedSymmetry ||
            (Array.isArray(selectedFluor) && selectedFluor.length > 0) ||
            selectedMinCarat ||
            selectedMaxCarat ||
            (Array.isArray(selectedLocations) &&
              selectedLocations.length > 0) ||
            (Array.isArray(selectedLabs) && selectedLabs.length > 0) ||
            (keySymbolFilters?.keyToSymbol &&
              keySymbolFilters.keyToSymbol.length > 0) ||
            (keySymbolFilters?.eyCln && keySymbolFilters.eyCln.length > 0) ||
            (keySymbolFilters?.hAndA && keySymbolFilters.hAndA.length > 0) ||
            (inclusionFilters?.centerBlack &&
              inclusionFilters.centerBlack.length > 0) ||
            (inclusionFilters?.centerWhite &&
              inclusionFilters.centerWhite.length > 0) ||
            (inclusionFilters?.sideBlack &&
              inclusionFilters.sideBlack.length > 0) ||
            (inclusionFilters?.sideWhite &&
              inclusionFilters.sideWhite.length > 0) ||
            priceFilters?.pricePerCarat?.from ||
            priceFilters?.pricePerCarat?.to ||
            priceFilters?.discount?.from ||
            priceFilters?.discount?.to ||
            priceFilters?.totalPrice?.from ||
            priceFilters?.totalPrice?.to ||
            searchTerm) && (
            <div className="text-sm text-gray-500 mt-2 space-y-1">
              {Array.isArray(selectedShape) && selectedShape.length > 0 && (
                <p>Shape: {selectedShape.join(", ")}</p>
              )}
              {Array.isArray(selectedColor) && selectedColor.length > 0 && (
                <p>Color: {selectedColor.join(", ")}</p>
              )}
              {Array.isArray(selectedClarity) && selectedClarity.length > 0 && (
                <p>Clarity: {selectedClarity.join(", ")}</p>
              )}
              {selectedCut && <p>Cut: {selectedCut}</p>}
              {selectedPolish && <p>Polish: {selectedPolish}</p>}
              {selectedSymmetry && <p>Symmetry: {selectedSymmetry}</p>}
              {Array.isArray(selectedFluor) && selectedFluor.length > 0 && (
                <p>Fluorescence: {selectedFluor.join(", ")}</p>
              )}
              {(selectedMinCarat || selectedMaxCarat) && (
                <p>
                  Carat Range: {selectedMinCarat || "0"} -{" "}
                  {selectedMaxCarat || "∞"}
                </p>
              )}
              {Array.isArray(selectedLocations) &&
                selectedLocations.length > 0 && (
                  <p>Location: {selectedLocations.join(", ")}</p>
                )}
              {Array.isArray(selectedLabs) && selectedLabs.length > 0 && (
                <p>Lab: {selectedLabs.join(", ")}</p>
              )}
              {keySymbolFilters?.keyToSymbol &&
                keySymbolFilters.keyToSymbol.length > 0 && (
                  <p>Key Symbols: {keySymbolFilters.keyToSymbol.join(", ")}</p>
                )}
              {keySymbolFilters?.eyCln && keySymbolFilters.eyCln.length > 0 && (
                <p>Eye Clean: {keySymbolFilters.eyCln.join(", ")}</p>
              )}
              {keySymbolFilters?.hAndA && keySymbolFilters.hAndA.length > 0 && (
                <p>H&A: {keySymbolFilters.hAndA.join(", ")}</p>
              )}
              {inclusionFilters?.centerBlack &&
                inclusionFilters.centerBlack.length > 0 && (
                  <p>
                    Center Black: {inclusionFilters.centerBlack.join(", ")}
                  </p>
                )}
              {inclusionFilters?.centerWhite &&
                inclusionFilters.centerWhite.length > 0 && (
                  <p>
                    Center White: {inclusionFilters.centerWhite.join(", ")}
                  </p>
                )}
              {inclusionFilters?.sideBlack &&
                inclusionFilters.sideBlack.length > 0 && (
                  <p>Side Black: {inclusionFilters.sideBlack.join(", ")}</p>
                )}
              {inclusionFilters?.sideWhite &&
                inclusionFilters.sideWhite.length > 0 && (
                  <p>Side White: {inclusionFilters.sideWhite.join(", ")}</p>
                )}
              {(priceFilters?.pricePerCarat?.from ||
                priceFilters?.pricePerCarat?.to) && (
                <p>
                  Price/ct: {priceFilters.pricePerCarat.from || "0"} -{" "}
                  {priceFilters.pricePerCarat.to || "∞"}
                </p>
              )}
              {(priceFilters?.discount?.from || priceFilters?.discount?.to) && (
                <p>
                  Discount%: {priceFilters.discount.from || "0"} -{" "}
                  {priceFilters.discount.to || "∞"}
                </p>
              )}
              {(priceFilters?.totalPrice?.from ||
                priceFilters?.totalPrice?.to) && (
                <p>
                  Total Price: {priceFilters.totalPrice.from || "0"} -{" "}
                  {priceFilters.totalPrice.to || "∞"}
                </p>
              )}
              {searchTerm && <p>Search: &quot;{searchTerm}&quot;</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className}`}
      >
        {/* Active Filters Display */}
        {(searchTerm ||
          (Array.isArray(selectedShape) && selectedShape.length > 0) ||
          (Array.isArray(selectedColor) && selectedColor.length > 0) ||
          (Array.isArray(selectedClarity) && selectedClarity.length > 0) ||
          selectedCut ||
          selectedPolish ||
          selectedSymmetry ||
          (Array.isArray(selectedFluor) && selectedFluor.length > 0) ||
          selectedMinCarat ||
          selectedMaxCarat ||
          (Array.isArray(selectedLocations) && selectedLocations.length > 0) ||
          (Array.isArray(selectedLabs) && selectedLabs.length > 0) ||
          (keySymbolFilters?.keyToSymbol &&
            keySymbolFilters.keyToSymbol.length > 0) ||
          (keySymbolFilters?.eyCln && keySymbolFilters.eyCln.length > 0) ||
          (keySymbolFilters?.hAndA && keySymbolFilters.hAndA.length > 0) ||
          (inclusionFilters?.centerBlack &&
            inclusionFilters.centerBlack.length > 0) ||
          (inclusionFilters?.centerWhite &&
            inclusionFilters.centerWhite.length > 0) ||
          (inclusionFilters?.sideBlack &&
            inclusionFilters.sideBlack.length > 0) ||
          (inclusionFilters?.sideWhite &&
            inclusionFilters.sideWhite.length > 0) ||
          priceFilters?.pricePerCarat?.from ||
          priceFilters?.pricePerCarat?.to ||
          priceFilters?.discount?.from ||
          priceFilters?.discount?.to ||
          priceFilters?.totalPrice?.from ||
          priceFilters?.totalPrice?.to) && (
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <span className="font-medium">Active Filters:</span>
            {Array.isArray(selectedShape) && selectedShape.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Shape: {selectedShape.join(", ")}
              </span>
            )}
            {Array.isArray(selectedColor) && selectedColor.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Color: {selectedColor.join(", ")}
              </span>
            )}
            {Array.isArray(selectedClarity) && selectedClarity.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Clarity: {selectedClarity.join(", ")}
              </span>
            )}
            {selectedCut && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Cut: {selectedCut}
              </span>
            )}
            {selectedPolish && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Polish: {selectedPolish}
              </span>
            )}
            {selectedSymmetry && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Symmetry: {selectedSymmetry}
              </span>
            )}
            {Array.isArray(selectedFluor) && selectedFluor.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Fluorescence: {selectedFluor.join(", ")}
              </span>
            )}
            {(selectedMinCarat || selectedMaxCarat) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Carat: {selectedMinCarat || "0"} - {selectedMaxCarat || "∞"}
              </span>
            )}
            {Array.isArray(selectedLocations) &&
              selectedLocations.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Location: {selectedLocations.join(", ")}
                </span>
              )}
            {Array.isArray(selectedLabs) && selectedLabs.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Lab: {selectedLabs.join(", ")}
              </span>
            )}
            {keySymbolFilters?.keyToSymbol &&
              keySymbolFilters.keyToSymbol.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Key Symbols: {keySymbolFilters.keyToSymbol.join(", ")}
                </span>
              )}
            {keySymbolFilters?.eyCln && keySymbolFilters.eyCln.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Eye Clean: {keySymbolFilters.eyCln.join(", ")}
              </span>
            )}
            {keySymbolFilters?.hAndA && keySymbolFilters.hAndA.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                H&A: {keySymbolFilters.hAndA.join(", ")}
              </span>
            )}
            {inclusionFilters?.centerBlack &&
              inclusionFilters.centerBlack.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  CN: {inclusionFilters.centerBlack.join(", ")}
                </span>
              )}
            {inclusionFilters?.centerWhite &&
              inclusionFilters.centerWhite.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  CW: {inclusionFilters.centerWhite.join(", ")}
                </span>
              )}
            {inclusionFilters?.sideBlack &&
              inclusionFilters.sideBlack.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  SN: {inclusionFilters.sideBlack.join(", ")}
                </span>
              )}
            {inclusionFilters?.sideWhite &&
              inclusionFilters.sideWhite.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  SW: {inclusionFilters.sideWhite.join(", ")}
                </span>
              )}
            {(priceFilters?.pricePerCarat?.from ||
              priceFilters?.pricePerCarat?.to) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                $/ct: {priceFilters.pricePerCarat.from || "0"} -{" "}
                {priceFilters.pricePerCarat.to || "∞"}
              </span>
            )}
            {(priceFilters?.discount?.from || priceFilters?.discount?.to) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Disc%: {priceFilters.discount.from || "0"} -{" "}
                {priceFilters.discount.to || "∞"}
              </span>
            )}
            {(priceFilters?.totalPrice?.from ||
              priceFilters?.totalPrice?.to) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Total $: {priceFilters.totalPrice.from || "0"} -{" "}
                {priceFilters.totalPrice.to || "∞"}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Search: {searchTerm}
              </span>
            )}
          </div>
        )}

        <div className="bg-white shadow-sm flex flex-col rounded-lg">
          {/* Grid Container */}
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {paginatedData.map((diamond) => (
                <div
                  key={diamond._id}
                  className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden relative border border-[#f9e8cd]"
                >
                  {/* Heart Icon */}
                  <button className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full transition-colors">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  {/* Image Container */}
                  <div className="relative w-full h-40 bg-gray-50 p-3">
                    {diamond.REAL_IMAGE ? (
                      <Image
                        src={diamond.REAL_IMAGE}
                        alt={diamond.STONE_NO}
                        fill
                        className="object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Diamond Info */}
                  <div className="px-4 pb-4 pt-2 space-y-1 bg-white">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        Shape:{" "}
                      </span>
                      <span className="text-gray-700">{diamond.SHAPE}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        Carat:{" "}
                      </span>
                      <span className="text-gray-700">{diamond.CARATS}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        Color:{" "}
                      </span>
                      <span className="text-gray-700">{diamond.COLOR}</span>
                    </div>
                    <div className="text-sm mb-3">
                      <span className="font-semibold text-gray-900">
                        Clarity:{" "}
                      </span>
                      <span className="text-gray-700">{diamond.CLARITY}</span>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRowClick) {
                            onRowClick(diamond);
                          } else {
                            setSelectedDiamond(diamond);
                          }
                        }}
                        className="mt-2 px-4 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 rounded border border-gray-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Footer */}
          <div
            className="px-4 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0"
            style={{
              background: "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)",
            }}
          >
            {/* Left side - Results count */}
            <div className="text-sm text-gray-700 font-medium">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, data.length)} of{" "}
              {data.length} diamonds
            </div>

            {/* Right side - Pagination controls */}
            <div className="flex items-center gap-4">
              {/* Rows per page selector */}
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
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#070b3a] transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft size={16} className="text-[#070b3a]" />
                </button>

                {/* Page info */}
                <span className="text-sm text-gray-700 font-medium px-2">
                  Page {currentPage} of {totalPages}
                </span>

                {/* Dynamic page numbers */}
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

                {/* Next button */}
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

      {/* Detail Modal */}
      {selectedDiamond && (
        <DiamondDetailView
          diamond={selectedDiamond}
          onClose={() => setSelectedDiamond(null)}
        />
      )}
    </>
  );
};

export default DiamondGridView;
