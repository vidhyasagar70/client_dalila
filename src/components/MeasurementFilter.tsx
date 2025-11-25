"use client";
import React from "react";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const MEASUREMENT_FIELDS = [
  { label: "Length", key: "length" },
  { label: "Width", key: "width" },
  { label: "Depth", key: "depth" },
  { label: "Table %", key: "table" },
  { label: "Depth %", key: "depthPercent" },
  { label: "Ratio", key: "ratio" },
  { label: "Cr.Angle", key: "crAngle" },
  { label: "Pav.Angle", key: "pavAngle" },
  { label: "Gridle %", key: "gridle" },
  { label: "Cr.Height", key: "crHeight" },
  { label: "Pav.Height", key: "pavHeight" },
];

interface MeasurementRange {
  from: string;
  to: string;
}

export interface MeasurementFilters {
  length: MeasurementRange;
  width: MeasurementRange;
  depth: MeasurementRange;
  table: MeasurementRange;
  depthPercent: MeasurementRange;
  ratio: MeasurementRange;
  crAngle: MeasurementRange;
  pavAngle: MeasurementRange;
  gridle: MeasurementRange;
  crHeight: MeasurementRange;
  pavHeight: MeasurementRange;
}

interface MeasurementFilterProps {
  measurements: MeasurementFilters;
  onMeasurementChange: (measurements: MeasurementFilters) => void;
}

export default function MeasurementFilter({
  measurements,
  onMeasurementChange,
}: MeasurementFilterProps) {
  const handleChange = (
    key: keyof MeasurementFilters,
    field: "from" | "to",
    value: string,
  ) => {
    // Prevent negative values
    if (value && parseFloat(value) < 0) return;

    const updatedMeasurements = {
      ...measurements,
      [key]: {
        ...measurements[key],
        [field]: value,
      },
    };
    onMeasurementChange(updatedMeasurements);
  };

  return (
    <div
      className={`${mavenPro.className} mb-2 mt-1`}
      style={{ width: "fit-content" }}
    >
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <span className="text-base font-normal text-white">Measurement</span>
      </div>
      <div
        className="bg-white p-2"
        style={{ border: "1px solid #f9e8cd", borderTop: "none" }}
      >
        <div className="space-y-1.5">
          {MEASUREMENT_FIELDS.map((field) => (
            <div key={field.key} className="flex items-center gap-1.5">
              <div
                className="px-2 py-2 font-normal text-white rounded-none text-xs"
                style={{ backgroundColor: "#000033", minWidth: "80px" }}
              >
                {field.label}
              </div>

              {/* From Input */}
              <input
                type="number"
                step="0.01"
                min="0"
                value={
                  measurements[field.key as keyof MeasurementFilters]?.from ||
                  "0.50"
                }
                onChange={(e) =>
                  handleChange(
                    field.key as keyof MeasurementFilters,
                    "from",
                    e.target.value,
                  )
                }
                className="w-20 px-2 py-1 text-center text-xs text-gray-900 rounded-none border border-[#f9e8cd] outline-none focus:border-[#d4b896]"
                style={{ fontFamily: "inherit", color: "#111827" }}
              />

              <span className="text-gray-500 text-xs font-normal">To</span>

              {/* To Input */}
              <input
                type="number"
                step="0.01"
                min="0"
                value={
                  measurements[field.key as keyof MeasurementFilters]?.to ||
                  "0.50"
                }
                onChange={(e) =>
                  handleChange(
                    field.key as keyof MeasurementFilters,
                    "to",
                    e.target.value,
                  )
                }
                className="w-20 px-2 py-1 text-center text-xs text-gray-900 rounded-none border border-[#f9e8cd] outline-none focus:border-[#d4b896]"
                style={{ fontFamily: "inherit", color: "#111827" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
