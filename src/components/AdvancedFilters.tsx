"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface AdvancedFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  onResetFilters?: () => void;
}

interface FilterState {
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  lab: string;
  location: string;
}

export default function AdvancedFilters({
  onFiltersChange,
  onResetFilters,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    cut: "ALL",
    polish: "ALL",
    symmetry: "ALL",
    fluorescence: "ALL",
    lab: "ALL",
    location: "ALL",
  });

  const cutOptions = ["ALL", "Excellent", "Very Good", "Good", "Fair", "Poor"];
  const polishOptions = [
    "ALL",
    "Excellent",
    "Very Good",
    "Good",
    "Fair",
    "Poor",
  ];
  const symmetryOptions = [
    "ALL",
    "Excellent",
    "Very Good",
    "Good",
    "Fair",
    "Poor",
  ];
  const fluorescenceOptions = [
    "ALL",
    "None",
    "Faint",
    "Medium",
    "Strong",
    "Very Strong",
  ];
  const labOptions = ["ALL", "GIA", "IGI", "HRD", "AGS", "GCAL", "EGL"];
  const locationOptions = [
    "ALL",
    "Mumbai",
    "New York",
    "Hong Kong",
    "Antwerp",
    "Dubai",
    "Surat",
  ];

  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetState = {
      cut: "ALL",
      polish: "ALL",
      symmetry: "ALL",
      fluorescence: "ALL",
      lab: "ALL",
      location: "ALL",
    };
    setFilters(resetState);
    onResetFilters?.();
    onFiltersChange?.(resetState);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        {/* Show Advanced Filters Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#000033] text-white text-sm font-medium rounded shadow-sm"
        >
          <Image
            src="/filtersicon/filter-add.png"
            alt="Filter Icon"
            width={16}
            height={16}
            className="w-3.5 h-3.5"
          />
          <span>Show Advanced Filters</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Reset Filters Button */}
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-2 px-4 py-1.5 bg-white text-[#D4A574] text-sm font-medium rounded-none shadow-sm border border-[#D4A574]"
        >
          <Image
            src="/filtersicon/filter-remove.png"
            alt="Reset Icon"
            width={16}
            height={16}
            className="w-3.5 h-3.5"
          />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Section */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-md p-5 mb-4 border border-gray-200">
          <div className="grid grid-cols-3 gap-5">
            {(
              [
                ["Cut Grade", "cut", cutOptions],
                ["Polish", "polish", polishOptions],
                ["Symmetry", "symmetry", symmetryOptions],
                ["Fluorescence", "fluorescence", fluorescenceOptions],
                ["Lab Certification", "lab", labOptions],
                ["Location", "location", locationOptions],
              ] as const
            ).map(([label, key, options]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <select
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded outline-none appearance-none cursor-pointer text-gray-700 text-sm"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
