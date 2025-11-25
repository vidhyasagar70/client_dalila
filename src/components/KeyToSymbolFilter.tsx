"use client";

import React from "react";

const KEY_TO_SYMBOL_OPTIONS = [
  "ALL",
  "PINPOINT",
  "NEEDLE",
  "FEATHER",
  "CRYSTAL",
  "CLOUD",
  "INDENTED NATURAL",
  "CAVITY",
  "TWINNING WISP",
  "NATURAL",
  "CHIP",
  "EXTRA FACET",
  "KNOT",
  "SURFACE GRAINING",
];

const EY_CLN_OPTIONS = ["100%", "90%", "80%", "70%"];
const H_AND_A_OPTIONS = ["100%", "90%", "80%", "70%"];

export interface KeySymbolFilters {
  keyToSymbol: string[];
  eyCln: string[];
  hAndA: string[];
}

interface KeySymbolFilterProps {
  filters: KeySymbolFilters;
  onFiltersChange: (filters: KeySymbolFilters) => void;
}

const FILTER_SECTIONS = [
  { label: "Ey.Cln", key: "eyCln", options: EY_CLN_OPTIONS, cols: 4 },
  { label: "H&A", key: "hAndA", options: H_AND_A_OPTIONS, cols: 4 },
];

export default function KeySymbolFilter({
  filters,
  onFiltersChange,
}: KeySymbolFilterProps) {
  const toggleFilter = (category: keyof KeySymbolFilters, value: string) => {
    const currentValues = filters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFiltersChange({ ...filters, [category]: newValues });
  };

  const isSelected = (category: keyof KeySymbolFilters, value: string) =>
    filters[category]?.includes(value) || false;

  return (
    <div
      className="mt-1"
      style={{ width: "100%", fontFamily: "'Maven Pro', sans-serif" }}
    >
      {/* Main Header with Icon */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <span className="text-base font-normal text-white">Key To Symbol</span>
      </div>

      {/* Key To Symbol Options */}
      <div
        className="bg-white"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "6px",
          padding: "6px",
          borderLeft: "1px solid #f9e8cd",
          borderRight: "1px solid #f9e8cd",
          borderBottom: "1px solid #f9e8cd",
        }}
      >
        {KEY_TO_SYMBOL_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => toggleFilter("keyToSymbol", option)}
            className={`font-normal transition-colors ${
              isSelected("keyToSymbol", option)
                ? "text-gray-800 bg-[#FAF6EB]"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{
              minWidth: "65px",
              height: "28px",
              fontSize: "14px",
              padding: "4px 6px",
              border: isSelected("keyToSymbol", option)
                ? "0.25px solid #FAF6EB"
                : "0.25px solid #f9e8cd",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Other Filter Sections */}
      <div>
        {FILTER_SECTIONS.map((section, index) => (
          <div key={section.key}>
            {/* Sub-header */}
            <div
              className="px-2.5 py-1.5 font-normal text-white text-sm"
              style={{ backgroundColor: "#000033" }}
            >
              {section.label}
            </div>

            {/* Options */}
            <div
              className="bg-white"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${section.cols}, minmax(0, 1fr))`,
                gap: "6px",
                padding: "6px",
                borderLeft: "1px solid #f9e8cd",
                borderRight: "1px solid #f9e8cd",
                borderBottom: "1px solid #f9e8cd",
              }}
            >
              {section.options.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    toggleFilter(section.key as keyof KeySymbolFilters, option)
                  }
                  className={`font-normal transition-colors ${
                    isSelected(section.key as keyof KeySymbolFilters, option)
                      ? "text-gray-800 bg-[#FAF6EB]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{
                    minWidth: "65px",
                    height: "28px",
                    fontSize: "14 px",
                    padding: "4px 6px",
                    border: isSelected(
                      section.key as keyof KeySymbolFilters,
                      option,
                    )
                      ? "0.25px solid #FAF6EB"
                      : "0.25px solid #f9e8cd",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
