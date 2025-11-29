"use client";
import React from "react";
import Image from "next/image";
import { Maven_Pro } from "next/font/google";
import { Save } from "lucide-react";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const STATIC_COLOR_OPTIONS = [
  { label: "D", value: "D" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "G", value: "G" },
  { label: "H", value: "H" },
  { label: "I", value: "I" },
  { label: "J", value: "J" },
  { label: "K", value: "K" },
  { label: "L", value: "L" },
  { label: "M", value: "M" },
  { label: "N", value: "N" },
  { label: "N-Z", value: "N-Z" },
  { label: "Fancy", value: "FANCY" },
];

interface ColorFilterProps {
  selectedColor: string[]; // Changed to array
  onColorChange: (color: string[]) => void; // Changed to array
  onSaveParameters?: () => void;
}

interface ColorFilterLimitedProps extends ColorFilterProps {
  isLimitedOpen: boolean;
  onLimitedToggle: () => void;
}

export default function ColorFilterLimited({
  selectedColor,
  onColorChange,
  onSaveParameters,
  isLimitedOpen,
  onLimitedToggle,
}: ColorFilterLimitedProps) {
  const handleColorClick = (color: string) => {
    const currentColors = Array.isArray(selectedColor) ? selectedColor : [];

    if (currentColors.includes(color)) {
      // Remove color if already selected
      onColorChange(currentColors.filter((c) => c !== color));
    } else {
      // Add color to selection
      onColorChange([...currentColors, color]);
    }
  };

  const isSelected = (color: string) => {
    return Array.isArray(selectedColor) && selectedColor.includes(color);
  };

  return (
    <div>
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <Image
          src="/filtersicon/color.png"
          alt="Color"
          width={18}
          height={18}
          className="w-7 h-6"
        />
        <span
          className={`${mavenPro.className} text-base font-normal text-white`}
        >
          Color
        </span>
      </div>
      <div
        className="grid grid-cols-3 gap-1 p-1.5 bg-white"
        style={{
          border: "0.25px solid #f9e8cd",
          borderTop: "none",
        }}
      >
        {STATIC_COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleColorClick(option.value)}
            className={`${mavenPro.className} px-1 py-1 text-sm font-normal transition-colors ${
              isSelected(option.value)
                ? "text-gray-800 bg-[#FAF6EB]"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{
              minWidth: 40,
              border: isSelected(option.value)
                ? "0.25px solid #FAF6EB"
                : "0.25px solid #f9e8cd",
              borderRadius: "0",
              minHeight: "32px",
              fontSize: "13px",
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {/* Save Parameters Button and Limited Button Side by Side */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={onLimitedToggle}
          className="bg-[#181847] px-2 py-2 shadow-md hover:bg-[#252564] transition-all duration-300 inline-flex items-center gap-1 rounded-none"
          style={{ minWidth: 'auto', width: 'auto', height: '40px' }}
        >
          <span className={`${mavenPro.className} font-medium text-white text-sm`}>Limited</span>
          {isLimitedOpen ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          )}
        </button>
        <button
          onClick={onSaveParameters}
          className={`${mavenPro.className} flex-1 flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-white font-normal transition-colors hover:opacity-90`}
          style={{
            backgroundColor: "#000033",
            border: "0.25px solid #f9e8cd",
            borderTop: "none",
            fontSize: "14px",
          }}
        >
          <Save size={16} strokeWidth={2} />
          <span>Save Parameters</span>
        </button>
      </div>
    </div>
  );
}
