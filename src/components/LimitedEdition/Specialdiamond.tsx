"use client";
import React from "react";

import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const LAB_OPTIONS = [
  { label: "GIA", value: "GIA" },
  { label: "IGI", value: "IGI" },
  { label: "HRD", value: "HRD" },
  { label: "OTHER", value: "OTHER" },
];

interface ClarityFilterProps {
  selectedCut: string;
  selectedPolish: string;
  selectedSymmetry: string;
  selectedLabs: string[];
  onCutChange: (cut: string) => void;
  onPolishChange: (polish: string) => void;
  onSymmetryChange: (symmetry: string) => void;
  onLabsChange: (labs: string[]) => void;
}

export default function SpecialClarityFilter({
  selectedCut,
  selectedPolish,
  selectedSymmetry,
  selectedLabs,
  onCutChange,
  onPolishChange,
  onSymmetryChange,
  onLabsChange,
}: ClarityFilterProps) {
  const cutArray = selectedCut ? selectedCut.split(",") : [];
  const polishArray = selectedPolish ? selectedPolish.split(",") : [];
  const symmetryArray = selectedSymmetry ? selectedSymmetry.split(",") : [];

  const handleCutClick = (value: string) => {
    let newCutArray: string[];
    if (cutArray.includes(value)) {
      newCutArray = cutArray.filter((c) => c !== value);
    } else {
      newCutArray = [...cutArray, value];
    }
    onCutChange(newCutArray.join(","));
  };

  const handlePolishClick = (value: string) => {
    let newPolishArray: string[];
    if (polishArray.includes(value)) {
      newPolishArray = polishArray.filter((p) => p !== value);
    } else {
      newPolishArray = [...polishArray, value];
    }
    onPolishChange(newPolishArray.join(","));
  };

  const handleSymmetryClick = (value: string) => {
    let newSymmetryArray: string[];
    if (symmetryArray.includes(value)) {
      newSymmetryArray = symmetryArray.filter((s) => s !== value);
    } else {
      newSymmetryArray = [...symmetryArray, value];
    }
    onSymmetryChange(newSymmetryArray.join(","));
  };

  const handleLabClick = (lab: string) => {
    const currentLabs = selectedLabs || [];
    const newLabs = currentLabs.includes(lab)
      ? currentLabs.filter((l) => l !== lab)
      : [...currentLabs, lab];
    onLabsChange(newLabs);
  };

  const isLabSelected = (lab: string) => {
    return selectedLabs?.includes(lab) || false;
  };

  return (
    <div className={`${mavenPro.className} mb-1.5 mt-0.5`}>
      <div
        className="p-2 bg-white"
        style={{
          border: "0.25px solid #f9e8cd",
          height: "180px",
        }}
      >
        {/* Cut, Polish, Symmetry */}
        <div className="flex flex-col gap-2">
          {/* Cut Row */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div
              className="px-1.5 py-1.5 text-xs font-normal text-white flex items-center justify-center"
              style={{
                backgroundColor: "#000033",
                borderRadius: "0",
                minHeight: "24px",
                minWidth: "35px",
              }}
            >
              Cut :
            </div>
            {["EX", "VG", "GD", "FR"].map((cut) => (
              <button
                key={cut}
                onClick={() => handleCutClick(cut)}
                className={`px-1.5 py-0.5 text-small font-normal transition-colors ${
                  cutArray.includes(cut)
                    ? "text-gray-800 bg-[#FAF6EB]"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                style={{
                  border: cutArray.includes(cut)
                    ? "0.25px solid #FAF6EB"
                    : "0.25px solid #f9e8cd",
                  borderRadius: "0",
                  minHeight: "24px",
                  maxWidth: "55px",
                }}
              >
                {cut}
              </button>
            ))}
          </div>

          {/* Polish Row */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div
              className="px-1.5 py-1.5 text-xs font-normal text-white flex items-center justify-center"
              style={{
                backgroundColor: "#000033",
                borderRadius: "0",
                minHeight: "24px",
                minWidth: "35px",
              }}
            >
              Pol :
            </div>
            {["EX", "VG", "GD", "FR"].map((polish) => (
              <button
                key={polish}
                onClick={() => handlePolishClick(polish)}
                className={`px-1.5 py-0.5 text-small font-normal transition-colors ${
                  polishArray.includes(polish)
                    ? "text-gray-800 bg-[#FAF6EB]"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                style={{
                  border: polishArray.includes(polish)
                    ? "0.25px solid #FAF6EB"
                    : "0.25px solid #f9e8cd",
                  borderRadius: "0",
                  minHeight: "24px",
                  maxWidth: "55px",
                }}
              >
                {polish}
              </button>
            ))}
          </div>

          {/* Symmetry Row */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div
              className="px-1.5 py-1.5 text-xs font-normal text-white flex items-center justify-center"
              style={{
                backgroundColor: "#000033",
                borderRadius: "0",
                minHeight: "24px",
                minWidth: "35px",
              }}
            >
              Sym :
            </div>
            {["EX", "VG", "GD", "FR"].map((symmetry) => (
              <button
                key={symmetry}
                onClick={() => handleSymmetryClick(symmetry)}
                className={`px-1.5 py-0.5 text-small font-normal transition-colors ${
                  symmetryArray.includes(symmetry)
                    ? "text-gray-800 bg-[#FAF6EB]"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                style={{
                  border: symmetryArray.includes(symmetry)
                    ? "0.25px solid #FAF6EB"
                    : "0.25px solid #f9e8cd",
                  borderRadius: "0",
                  minHeight: "24px",
                  maxWidth: "55px",
                }}
              >
                {symmetry}
              </button>
            ))}
          </div>

          {/* Lab Row */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <div
              className="px-1.5 py-1.5 text-xs font-normal text-white flex items-center justify-center"
              style={{
                backgroundColor: "#000033",
                borderRadius: "0",
                minHeight: "24px",
                minWidth: "35px",
              }}
            >
              Lab :
            </div>
            {LAB_OPTIONS.map((lab) => (
              <button
                key={lab.value}
                onClick={() => handleLabClick(lab.value)}
                className={`px-1.5 py-0.5 text-small font-normal transition-colors ${
                  isLabSelected(lab.value)
                    ? "text-gray-800 bg-[#FAF6EB]"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                style={{
                  border: isLabSelected(lab.value)
                    ? "0.25px solid #FAF6EB"
                    : "0.25px solid #f9e8cd",
                  borderRadius: "0",
                  minHeight: "24px",
                  maxWidth: "55px",
                }}
              >
                {lab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
