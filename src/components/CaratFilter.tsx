"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});


interface CaratFilterProps {
  selectedCaratRanges: { min: string; max: string }[];
  onCaratChange: (ranges: { min: string; max: string }[]) => void;
}

interface CaratRange {
  label: string;
  value: string;
  min: number;
  max: number;
}

// Static carat ranges matching your UI image
const STATIC_CARAT_RANGES: CaratRange[] = [
  { label: "0.17 - 0.22", value: "0.17-0.22", min: 0.17, max: 0.22 },
  { label: "0.23 - 0.29", value: "0.23-0.29", min: 0.23, max: 0.29 },
  { label: "0.30 - 0.39", value: "0.30-0.39", min: 0.3, max: 0.39 },
  { label: "0.40 - 0.49", value: "0.40-0.49", min: 0.4, max: 0.49 },
  { label: "0.50 - 0.69", value: "0.50-0.69", min: 0.5, max: 0.69 },
  { label: "0.70 - 0.79", value: "0.70-0.79", min: 0.7, max: 0.79 },
  { label: "0.80 - 0.89", value: "0.80-0.89", min: 0.8, max: 0.89 },
  { label: "0.90 - 0.99", value: "0.90-0.99", min: 0.9, max: 0.99 },
  { label: "1.00 - 1.49", value: "1.00-1.49", min: 1.0, max: 1.49 },
  { label: "1.59 - 1.99", value: "1.59-1.99", min: 1.59, max: 1.99 },
  { label: "2.00 - 2.99", value: "2.00-2.99", min: 2.0, max: 2.99 },
  { label: "3.00 - 3.99", value: "3.00-3.99", min: 3.0, max: 3.99 },
  { label: "4.00 - 4.99", value: "4.00-4.99", min: 4.0, max: 4.99 },
  { label: "5.00 - 99.99", value: "5.00-99.99", min: 5.0, max: 99.99 },
];


export default function CaratFilter({
  selectedCaratRanges,
  onCaratChange,
}: CaratFilterProps) {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  // Helper to check if a static range is selected
  const isRangeSelected = (range: CaratRange) =>
    selectedCaratRanges.some(
      (r) => r.min === range.min.toString() && r.max === range.max.toString()
    );

  // Toggle static range selection
  const handleRangeClick = (range: CaratRange) => {
    const min = range.min.toString();
    const max = range.max.toString();
    const exists = selectedCaratRanges.some((r) => r.min === min && r.max === max);
    let newRanges;
    if (exists) {
      newRanges = selectedCaratRanges.filter((r) => !(r.min === min && r.max === max));
    } else {
      newRanges = [...selectedCaratRanges, { min, max }];
    }
    onCaratChange(newRanges);
  };

  // Handle manual input (single custom range)
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && parseFloat(value) < 0) return;
    setFromValue(value);
    if (value && toValue) {
      onCaratChange([
        ...selectedCaratRanges.filter((r) => r.min !== fromValue || r.max !== toValue),
        { min: value, max: toValue },
      ]);
    } else if (!value && !toValue) {
      onCaratChange(selectedCaratRanges.filter((r) => r.min !== fromValue || r.max !== toValue));
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && parseFloat(value) < 0) return;
    setToValue(value);
    if (fromValue && value) {
      onCaratChange([
        ...selectedCaratRanges.filter((r) => r.min !== fromValue || r.max !== value),
        { min: fromValue, max: value },
      ]);
    } else if (!fromValue && !value) {
      onCaratChange(selectedCaratRanges.filter((r) => r.min !== fromValue || r.max !== value));
    }
  };

  return (
    <div className={`${mavenPro.className} mb-1.5 mt-0.5`}>
      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <Image
          src="/filtersicon/carat.png"
          alt="Carat"
          width={18}
          height={18}
          className="w-7 h-6"
        />
        <span className="text-base font-normal text-white">Carat</span>
      </div>

      {/* Body */}
      <div
        className="p-3 bg-white"
        style={{
          border: "0.25px solid #f9e8cd",
          borderTop: "none",
          minHeight: "288px",
        }}
      >
        {/* Input Fields */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              value={fromValue}
              onChange={handleFromChange}
              className="w-full px-2 py-1.5 text-xs text-gray-900 border border-[#f9e8cd] min-h-[36px] focus:outline-none focus:border-[#d4b896]"
              placeholder="From"
              style={{ color: "#111827", borderRadius: "0" }}
            />
          </div>
          <div className="relative flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              value={toValue}
              onChange={handleToChange}
              className="w-full px-2 py-1.5 text-xs text-gray-900 border border-[#f9e8cd] min-h-[36px] focus:outline-none focus:border-[#d4b896]"
              placeholder="To"
              style={{ color: "#111827", borderRadius: "0" }}
            />
          </div>
        </div>

        {/* Range Buttons */}
        <div className="grid grid-cols-3 gap-1">
          {STATIC_CARAT_RANGES.map((range) => {
            const isSelected = isRangeSelected(range);
            return (
              <button
                key={range.value}
                onClick={() => handleRangeClick(range)}
                className={`px-2 py-1.5 text-small font-normal transition-colors ${
                  isSelected
                    ? "text-gray-800 bg-[#FAF6EB] border border-[#FAF6EB]"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-[#f9e8cd]"
                } min-h-[36px] min-w-[90px]`}
                style={{ borderRadius: "0" }}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
