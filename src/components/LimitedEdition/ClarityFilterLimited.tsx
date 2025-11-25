"use client";
import React from "react";
import Image from "next/image";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const STATIC_CLARITY_OPTIONS = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "SI3",
  "I1",
  "I2",
  "I3",
];

interface ClarityFilterProps {
  selectedClarity: string[];
  onClarityChange: (clarity: string[]) => void;
}

export default function ClarityFilterLimited({
  selectedClarity,
  onClarityChange,
}: ClarityFilterProps) {

  const handleClarityClick = (value: string) => {
    let newClarity: string[];
    if (selectedClarity.includes(value)) {
      newClarity = selectedClarity.filter((c) => c !== value);
    } else {
      newClarity = [...selectedClarity, value];
    }
    onClarityChange(newClarity);
  };

  return (
    <div className={`${mavenPro.className} mb-1.5 mt-0.5`}>
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <Image
          src="/filtersicon/clarity.png"
          alt="Clarity"
          width={18}
          height={18}
          className="w-7 h-6"
        />
        <span className="text-base font-normal text-white">Clarity</span>
      </div>

      <div
        className="p-1 bg-white"
        style={{
          border: "0.25px solid #f9e8cd",
          borderTop: "none",
          height: "165px",
        }}
      >
        {/* Clarity Options */}
        <div className="grid grid-cols-2 gap-1">
          {STATIC_CLARITY_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => handleClarityClick(option)}
              className={`px-1 py-0.5 text-sm font-normal transition-colors ${
                selectedClarity.includes(option)
                  ? "text-gray-800 bg-[#FAF6EB]"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{
                border: selectedClarity.includes(option)
                  ? "0.25px solid #FAF6EB"
                  : "0.25px solid #f9e8cd",
                borderRadius: "0",
                minHeight: "24px",
                fontSize: "13px",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
