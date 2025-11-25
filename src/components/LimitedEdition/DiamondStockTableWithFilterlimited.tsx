"use client";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";

import { DiamondData } from "@/types/Diamondtable";
import type { LimitedEditionDiamond } from "@/lib/api";
import DiamondComparisonPage from "../DiamondComparisonPage";
import ColorFilterLimited from "./colorfilterLimited";

import ShapeFilter from "./shapefilteLimited";
import { CaratFilterLimited } from "./CaratFilterLimited";
import ClarityFilter from "./ClarityFilterLimited";
import FluorFilter from "./FluorescenceFilterLimited";
import DiamondStockTable from "./DiamondStockTableLimited";
import SpecialClarityFilter from "./Specialdiamond";
import LimitedEditionPage from "./limitedEditionproduct";

export default function DiamondStockTableWithFilter() {
  const [isLimitedOpen, setIsLimitedOpen] = useState(false);
  // Limited Edition Diamonds state and fetch logic lifted here
  const [limitedEditionDiamonds, setLimitedEditionDiamonds] = useState<LimitedEditionDiamond[]>([]);
    const [limitedEditionLoading, setLimitedEditionLoading] = useState(false);
    const [limitedEditionError, setLimitedEditionError] = useState("");
    const [limitedEditionHasLoadedOnce, setLimitedEditionHasLoadedOnce] = useState(false);

    const fetchLimitedEditionDiamonds = useCallback(async () => {
      try {
        setLimitedEditionLoading(true);
        setLimitedEditionError("");
        const { diamondApi } = await import("@/lib/api");
        const response = await diamondApi.getLimitedEdition();
        if (response && response.success && response.data) {
          setLimitedEditionDiamonds(response.data.diamonds);
          setLimitedEditionHasLoadedOnce(true);
        } else {
          setLimitedEditionError("Failed to fetch limited edition diamonds");
        }
      } catch {
        setLimitedEditionError("Unable to load limited edition diamonds");
      } finally {
        setLimitedEditionLoading(false);
      }
    }, []);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShape, setSelectedShape] = useState<string[]>([]);
  const [selectedClarity, setSelectedClarity] = useState<string[]>([]);
  const [selectedCut, setSelectedCut] = useState("");
  const [selectedPolish, setSelectedPolish] = useState("");
  const [selectedSymmetry, setSelectedSymmetry] = useState("");
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [selectedFluor, setSelectedFluor] = useState<string[]>([]);
  const [selectedCaratRanges, setSelectedCaratRanges] = useState<{ min: string; max: string }[]>([]);
  const [selectedDiamonds, setSelectedDiamonds] = useState<DiamondData[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleColorChange = (colors: string[]) => {
    setSelectedColor(colors);
  };

  const handleShapeChange = (shapes: string[]) => {
    setSelectedShape(shapes);
  };

  const handleFluorChange = (fluor: string[]) => {
    setSelectedFluor(fluor);
  };

  const handleClarityChange = (clarity: string[]) => {
    setSelectedClarity(clarity);
    setSearchTerm("");
  };

  const handleCutChange = (cut: string) => {
    setSelectedCut(cut);
    setSearchTerm("");
  };

  const handlePolishChange = (polish: string) => {
    setSelectedPolish(polish);
    setSearchTerm("");
  };

  const handleSymmetryChange = (symmetry: string) => {
    setSelectedSymmetry(symmetry);
    setSearchTerm("");
  };

  const handleLabsChange = (labs: string[]) => {
    setSelectedLabs(labs);
    setSearchTerm("");
  };

  const handleCaratChange = (ranges: { min: string; max: string }[]) => {
    setSelectedCaratRanges(ranges);
  };

  const handleSelectionChange = (
    selectedIds: string[],
    diamonds: DiamondData[],
  ) => {
    setSelectedDiamonds(diamonds);
  };

  const handleSaveParameters = async () => {
    try {
      const filters: {
        SHAPE?: string;
        COLOR?: string;
        CLARITY?: string;
        CUT?: string;
        POL?: string;
        SYM?: string;
        LAB?: string;
        FLOUR?: string;
        CARATS_MIN?: string;
        CARATS_MAX?: string;
      } = {};

      // Add filters only if they have values
      if (selectedShape.length > 0) {
        filters.SHAPE = selectedShape.join(",");
      }
      if (selectedColor.length > 0) {
        filters.COLOR = selectedColor.join(",");
      }
      if (selectedClarity.length > 0) {
        filters.CLARITY = selectedClarity.join(",");
      }
      if (selectedCut) {
        filters.CUT = selectedCut;
      }
      if (selectedPolish) {
        filters.POL = selectedPolish;
      }
      if (selectedSymmetry) {
        filters.SYM = selectedSymmetry;
      }
      if (selectedLabs.length > 0) {
        filters.LAB = selectedLabs.join(",");
      }
      if (selectedFluor.length > 0) {
        filters.FLOUR = selectedFluor.join(",");
      }
      // If any carat ranges are selected, use the min of the lowest and max of the highest for filtering
      if (selectedCaratRanges.length > 0) {
        const minVals = selectedCaratRanges.map(r => parseFloat(r.min)).filter(v => !isNaN(v));
        const maxVals = selectedCaratRanges.map(r => parseFloat(r.max)).filter(v => !isNaN(v));
        if (minVals.length > 0) filters.CARATS_MIN = Math.min(...minVals).toString();
        if (maxVals.length > 0) filters.CARATS_MAX = Math.max(...maxVals).toString();
      }

      console.log("Saving filters:", filters);
      
      const { diamondApi } = await import("@/lib/api");
      const response = await diamondApi.saveLimitedEditionFilters(filters);
      
      if (response && response.success) {
        toast.success("Parameters saved successfully!");
        console.log("Saved filters response:", response);
        fetchLimitedEditionDiamonds();
        window.dispatchEvent(new Event("limited-edition-updated"));
      } else {
        toast.error("Failed to save parameters");
      }
    } catch (error) {
      console.error("Error saving parameters:", error);
      toast.error("Error saving parameters");
    }
  };

  const handleLimitedToggle = () => {
    if (!isLimitedOpen && !limitedEditionHasLoadedOnce) {
      fetchLimitedEditionDiamonds();
    }
    setIsLimitedOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-[#F5F7FA] mt-30">
      {/* TOP ROW: Shapes, Carat, Clarity + Fluor/Color stack */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 px-4 py-4">
        <ShapeFilter
          selectedShape={selectedShape}
          onShapeChange={handleShapeChange}
        />
        <CaratFilterLimited
          selectedCaratRanges={selectedCaratRanges}
          onCaratChange={handleCaratChange}
        />
        <div className="flex flex-col">
          <SpecialClarityFilter
            selectedCut={selectedCut}
            selectedPolish={selectedPolish}
            selectedSymmetry={selectedSymmetry}
            selectedLabs={selectedLabs}
            onCutChange={handleCutChange}
            onPolishChange={handlePolishChange}
            onSymmetryChange={handleSymmetryChange}
            onLabsChange={handleLabsChange}
          />
          <FluorFilter
            selectedFluor={selectedFluor}
            onFluorChange={handleFluorChange}
          />
        </div>
        <div className="flex flex-col">
          <ClarityFilter
            selectedClarity={selectedClarity}
            onClarityChange={handleClarityChange}
          />
          <ColorFilterLimited
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
            onSaveParameters={handleSaveParameters}
            isLimitedOpen={isLimitedOpen}
            onLimitedToggle={handleLimitedToggle}
          />
        </div>
      </div>

      
      <LimitedEditionPage
        diamonds={limitedEditionDiamonds}
        loading={limitedEditionLoading}
        error={limitedEditionError}
        hasLoadedOnce={limitedEditionHasLoadedOnce}
        refreshLimitedEditionDiamonds={fetchLimitedEditionDiamonds}
        isOpen={isLimitedOpen}
        onToggle={handleLimitedToggle}
      />
      
      {/* Table View - With padding */}
      <div className="px-4 py-4">
        <DiamondStockTable
          searchTerm={searchTerm}
          selectedShape={selectedShape}
          selectedColor={selectedColor}
          selectedCaratRanges={selectedCaratRanges}
          selectedFluor={selectedFluor}
          selectedClarity={selectedClarity}
          selectedCut={selectedCut}
          selectedPolish={selectedPolish}
          selectedSymmetry={selectedSymmetry}
          selectedLabs={selectedLabs}
          onSelectionChange={handleSelectionChange}
          pageSize={10}
        />
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <DiamondComparisonPage
          diamonds={selectedDiamonds}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}