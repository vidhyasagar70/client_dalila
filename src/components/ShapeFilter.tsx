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

const STATIC_SHAPE_OPTIONS = [
  { value: "ROUND", label: "Round", image: "/shapefilter/round.png" },
  { value: "RADIANT", label: "Radiant", image: "/shapefilter/radiant.png" },
  { value: "PEAR", label: "Pear", image: "/shapefilter/pear.png" },
  { value: "SQUARE", label: "Square", image: "/shapefilter/square.png" },
  { value: "EMERALD", label: "Emerald", image: "/shapefilter/emerald.png" },
  { value: "OVAL", label: "Oval", image: "/shapefilter/oval.png" },
  { value: "CUSHION", label: "Cushion", image: "/shapefilter/cushion.png" },
  {
    value: "TRILLIANT",
    label: "Trilliant",
    image: "/shapefilter/trilliant.png",
  },
  { value: "HEART", label: "Heart", image: "/shapefilter/Heart.png" },
  {
    value: "PRINCESS",
    label: "Princess",
    image: "/shapefilter/princess.png",
  },
  { value: "MARQUISE", label: "Marquise", image: "/shapefilter/marque.png" },
  { value: "OTHER", label: "Other", image: "/shapefilter/others.png" },
];

interface ShapeFilterProps {
  selectedShape: string[];
  onShapeChange: (shapes: string[]) => void;
}

export default function ShapeFilter({
  selectedShape,
  onShapeChange,
}: ShapeFilterProps) {
  const handleShapeClick = (shape: string) => {
    const currentShapes = Array.isArray(selectedShape) ? selectedShape : [];
    if (currentShapes.includes(shape)) {
      // Remove shape if already selected
      onShapeChange(currentShapes.filter((s) => s !== shape));
    } else {
      // Add shape to selection
      onShapeChange([...currentShapes, shape]);
    }
  };

  const isSelected = (shape: string) => {
    return Array.isArray(selectedShape) && selectedShape.includes(shape);
  };

  return (
    <div className={`${mavenPro.className} mb-1.5 mt-0.5`}>
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <Image
          src="/filtersicon/shape.png"
          alt="Shape"
          width={18}
          height={18}
          priority
        />
        <span className="text-base font-normal text-white">Shape</span>
      </div>
      <div
        className="p-2.5 bg-white"
        style={{
          border: "0.25px solid #f9e8cd",
          borderTop: "none",
          height: "288px",
        }}
      >
        <div className="grid grid-cols-4 gap-2">
          {STATIC_SHAPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleShapeClick(option.value)}
              className={`flex flex-col items-center justify-center gap-0.4 px-2 py-2 transition-colors ${
                isSelected(option.value)
                  ? "text-gray-800 bg-[#FAF6EB]"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{
                minWidth: "72px",
                minHeight: "82px",
                border: isSelected(option.value)
                  ? "0.25px solid #FAF6EB"
                  : "0.25px solid #f9e8cd",
              }}
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <Image
                  src={option.image}
                  alt={option.label}
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-small font-normal">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
