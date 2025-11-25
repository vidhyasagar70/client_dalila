"use client";
import React from "react";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const INCLUSION_OPTIONS = [
  "NONE",
  "NOT VISIBLE",
  "MINOR",
  "MEDIUM",
  "HEAVY",
  "PINPOINT",
];

const INCLUSION_TYPES = [
  { label: "Center Black", key: "centerBlack" },
  { label: "Center White", key: "centerWhite" },
  { label: "Side Black", key: "sideBlack" },
  { label: "Side White", key: "sideWhite" },
];

export interface InclusionFilters {
  centerBlack: string[];
  centerWhite: string[];
  sideBlack: string[];
  sideWhite: string[];
}

interface InclusionFilterProps {
  inclusions: InclusionFilters;
  onInclusionChange: (inclusions: InclusionFilters) => void;
}

export default function InclusionFilter({
  inclusions,
  onInclusionChange,
}: InclusionFilterProps) {
  const toggleInclusion = (type: keyof InclusionFilters, value: string) => {
    const currentValues = inclusions[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onInclusionChange({
      ...inclusions,
      [type]: newValues,
    });
  };

  const isSelected = (type: keyof InclusionFilters, value: string) => {
    return inclusions[type]?.includes(value) || false;
  };

  return (
    <div className="mt-1" style={{ width: "100%" }}>
      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <span
          className={`${mavenPro.className} text-base font-normal text-white`}
        >
          INCLUSION
        </span>
      </div>

      {/* Inclusion Filters */}
      <div style={{ marginTop: "6px" }}>
        {INCLUSION_TYPES.map((type) => (
          <div key={type.key}>
            {/* Sub-header */}
            <div
              className={`${mavenPro.className} px-2.5 py-1.5 font-normal text-white text-sm`}
              style={{ backgroundColor: "#000033" }}
            >
              {type.label}
            </div>

            {/* Options */}
            <div
              className="bg-white"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "6px",
                padding: "6px",
                borderLeft: "1px solid #f9e8cd",
                borderRight: "1px solid #f9e8cd",
                borderBottom: "1px solid #f9e8cd",
              }}
            >
              {INCLUSION_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    toggleInclusion(type.key as keyof InclusionFilters, option)
                  }
                  className={`${mavenPro.className} font-normal transition-colors ${
                    isSelected(type.key as keyof InclusionFilters, option)
                      ? "text-gray-800 bg-[#FAF6EB]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{
                    minWidth: "80px",
                    height: "28px",
                    fontSize: "14px",
                    padding: "4px 6px",
                    border: isSelected(
                      type.key as keyof InclusionFilters,
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
