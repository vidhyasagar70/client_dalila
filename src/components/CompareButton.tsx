"use client";

import React from "react";
import { Scale } from "lucide-react";

interface CompareButtonProps {
  selectedCount?: number;
  onCompare?: () => void;
  disabled?: boolean;
}

export default function CompareButton({
  selectedCount = 0,
  onCompare,
  disabled = false,
}: CompareButtonProps) {
  const handleCompare = () => {
    if (!disabled && selectedCount > 0 && onCompare) {
      onCompare();
    }
  };

  return (
    <button
      onClick={handleCompare}
      disabled={disabled || selectedCount === 0}
      className={`flex items-center justify-center cursor-pointer gap-2 px-3 py-2 text-white text-sm font-medium rounded-none shadow-sm transition-colors ${
        disabled || selectedCount === 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#000033]"
      }`}
    >
      <Scale className="w-4 h-4" />
      <span>Compare</span>
    </button>
  );
}
