import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface PriceRange {
  from: string;
  to: string;
}

export interface PriceLocationFilters {
  pricePerCarat: PriceRange;
  discount: PriceRange;
  totalPrice: PriceRange;
  locations: string[];
  labs: string[];
}

interface PriceLocationFilterProps {
  filters: PriceLocationFilters;
  onFiltersChange: (filters: PriceLocationFilters) => void;
}

interface Diamond {
  NET_RATE?: string | number;
  DISC_PER?: string | number;
  NET_VALUE?: string | number;
  [key: string]: unknown;
}

const LOCATION_OPTIONS = [
  { label: "MUM", value: "MUM", apiValue: "MU" },
  { label: "BEL", value: "BEL", apiValue: "BE" },
  { label: "DUB", value: "DUB", apiValue: "DU" },
  { label: "HK", value: "HK", apiValue: "HK" },
  { label: "NYC", value: "NYC", apiValue: "NY" },
];

const LAB_OPTIONS = [
  { label: "GIA", value: "GIA", apiValue: "GIA" },
  { label: "IGI", value: "IGI", apiValue: "IGI" },
  { label: "HRD", value: "HRD", apiValue: "HRD" },
  { label: "OTHERS", value: "OTHERS", apiValue: "OTHERS" },
];

// Note: Price filtering is now done server-side via API
// This function is kept for backward compatibility
export const matchesPriceFilters = (
  diamond: Diamond,
  filters: PriceLocationFilters,
): boolean => {
  return true; // All filtering done server-side
};

export const getLocationApiValues = (selectedLocations: string[]): string[] => {
  return selectedLocations
    .map((location) => {
      const option = LOCATION_OPTIONS.find((opt) => opt.value === location);
      return option?.apiValue || location;
    })
    .filter(Boolean);
};

export const getLabApiValues = (selectedLabs: string[]): string[] => {
  return selectedLabs
    .map((lab) => {
      const option = LAB_OPTIONS.find((opt) => opt.value === lab);
      return option?.apiValue || lab;
    })
    .filter(Boolean);
};

export default function PriceLocationFilter({
  filters,
  onFiltersChange,
}: PriceLocationFilterProps) {
  const handlePriceChange = (
    field: "pricePerCarat" | "discount" | "totalPrice",
    type: "from" | "to",
    value: string,
  ) => {
    onFiltersChange({
      ...filters,
      [field]: {
        ...filters[field],
        [type]: value,
      },
    });
  };

  const incrementValue = (
    field: "pricePerCarat" | "discount" | "totalPrice",
    type: "from" | "to",
  ) => {
    const currentValue = parseFloat(filters[field]?.[type] || "0");
    const newValue = (currentValue + 0.01).toFixed(2);
    handlePriceChange(field, type, newValue);
  };

  const decrementValue = (
    field: "pricePerCarat" | "discount" | "totalPrice",
    type: "from" | "to",
  ) => {
    const currentValue = parseFloat(filters[field]?.[type] || "0");
    const newValue = Math.max(
      field === "discount" ? -999 : 0,
      currentValue - 0.01,
    ).toFixed(2);
    handlePriceChange(field, type, newValue);
  };

  const toggleLocation = (location: string) => {
    const currentLocations = filters.locations || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter((l) => l !== location)
      : [...currentLocations, location];

    onFiltersChange({
      ...filters,
      locations: newLocations,
    });
  };

  const toggleLab = (lab: string) => {
    const currentLabs = filters.labs || [];
    const newLabs = currentLabs.includes(lab)
      ? currentLabs.filter((l) => l !== lab)
      : [...currentLabs, lab];

    onFiltersChange({
      ...filters,
      labs: newLabs,
    });
  };

  const isLocationSelected = (location: string) => {
    return filters.locations?.includes(location) || false;
  };

  const isLabSelected = (lab: string) => {
    return filters.labs?.includes(lab) || false;
  };

  return (
    <div
      className="mb-2 mt-1"
      style={{ width: "100%", fontFamily: "Maven Pro, sans-serif" }}
    >
      {/* Price Section */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ backgroundColor: "#000033" }}
      >
        <span className="text-base font-normal text-white">Price</span>
      </div>
      <div
        className="bg-white p-2"
        style={{ border: "1px solid #f9e8cd", borderTop: "none" }}
      >
        <div className="space-y-1.5">
          {/* $/ct */}
          <div className="flex items-center gap-1.5">
            <div
              className="px-2 py-2 font-normal text-white rounded-none text-xs"
              style={{ backgroundColor: "#000033", minWidth: "65px" }}
            >
              $/ct
            </div>

            <div
              className="flex items-center bg-white rounded-none"
              style={{ border: "1px solid #f9e8cd" }}
            >
              <input
                type="number"
                step="0.01"
                value={filters.pricePerCarat?.from || ""}
                onChange={(e) =>
                  handlePriceChange("pricePerCarat", "from", e.target.value)
                }
                placeholder="0"
                className="w-14 px-1.5 py-0.5 text-center text-xs outline-none"
                style={{ appearance: "textfield", fontFamily: "inherit" }}
              />
              <div
                className="flex flex-col border-l"
                style={{ borderColor: "#e5e7eb" }}
              >
                <button
                  onClick={() => incrementValue("pricePerCarat", "from")}
                  className="px-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => decrementValue("pricePerCarat", "from")}
                  className="px-1 hover:bg-gray-100 transition-colors border-t"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            <span className="text-gray-500 text-xs font-normal">To</span>

            <div
              className="flex items-center bg-white rounded-none"
              style={{ border: "1px solid #f9e8cd" }}
            >
              <input
                type="number"
                step="0.01"
                value={filters.pricePerCarat?.to || ""}
                onChange={(e) =>
                  handlePriceChange("pricePerCarat", "to", e.target.value)
                }
                placeholder="TO"
                className="w-14 px-1.5 py-0.5 text-center text-xs outline-none"
                style={{ appearance: "textfield", fontFamily: "inherit" }}
              />
              <div
                className="flex flex-col border-l"
                style={{ borderColor: "#f9e8cd" }}
              >
                <button
                  onClick={() => incrementValue("pricePerCarat", "to")}
                  className="px-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => decrementValue("pricePerCarat", "to")}
                  className="px-1 hover:bg-gray-100 transition-colors border-t"
                  style={{ borderColor: "#f9e8cd" }}
                >
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Disc% */}
          <div className="flex items-center gap-1.5">
            <div
              className="px-2 py-2 font-normal text-white rounded-none text-xs"
              style={{ backgroundColor: "#000033", minWidth: "65px" }}
            >
              Disc%
            </div>

            <div
              className="flex items-center bg-white rounded-none"
              style={{ border: "1px solid #f9e8cd" }}
            >
              <input
                type="number"
                step="0.01"
                value={filters.discount?.from || ""}
                onChange={(e) =>
                  handlePriceChange("discount", "from", e.target.value)
                }
                placeholder="0"
                className="w-14 px-1.5 py-0.5 text-center text-xs outline-none"
                style={{ appearance: "textfield", fontFamily: "inherit" }}
              />
              <div
                className="flex flex-col border-l"
                style={{ borderColor: "#e5e7eb" }}
              >
                <button
                  onClick={() => incrementValue("discount", "from")}
                  className="px-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => decrementValue("discount", "from")}
                  className="px-1 hover:bg-gray-100 transition-colors border-t"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            <span className="text-gray-500 text-xs font-normal">To</span>

            <div
              className="flex items-center bg-white rounded-none"
              style={{ border: "1px solid #f9e8cd" }}
            >
              <input
                type="number"
                step="0.01"
                value={filters.discount?.to || ""}
                onChange={(e) =>
                  handlePriceChange("discount", "to", e.target.value)
                }
                placeholder="TO"
                className="w-14 px-1.5 py-0.5 text-center text-xs outline-none"
                style={{ appearance: "textfield", fontFamily: "inherit" }}
              />
              <div
                className="flex flex-col border-l"
                style={{ borderColor: "#e5e7eb" }}
              >
                <button
                  onClick={() => incrementValue("discount", "to")}
                  className="px-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => decrementValue("discount", "to")}
                  className="px-1 hover:bg-gray-100 transition-colors border-t"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Total $ */}
          <div className="flex items-center gap-1.5">
            <div
              className="px-2 py-2 font-normal text-white rounded-none text-xs"
              style={{ backgroundColor: "#000033", minWidth: "65px" }}
            >
              Total $
            </div>

            <div
              className="flex items-center bg-white rounded-none"
              style={{ border: "1px solid #f9e8cd" }}
            >
              <input
                type="number"
                step="0.01"
                value={filters.totalPrice?.from || ""}
                onChange={(e) =>
                  handlePriceChange("totalPrice", "from", e.target.value)
                }
                placeholder="0"
                className="w-14 px-1.5 py-0.5 text-center text-xs outline-none"
                style={{ appearance: "textfield", fontFamily: "inherit" }}
              />
              <div
                className="flex flex-col border-l"
                style={{ borderColor: "#f9e8cd" }}
              >
                <button
                  onClick={() => incrementValue("totalPrice", "from")}
                  className="px-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => decrementValue("totalPrice", "from")}
                  className="px-1 hover:bg-gray-100 transition-colors border-t"
                  style={{ borderColor: "#f9e8cd" }}
                >
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            <span className="text-gray-500 text-xs font-normal">To</span>

            <div
              className="flex items-center bg-white rounded-none"
              style={{ border: "1px solid #f9e8cd" }}
            >
              <input
                type="number"
                step="0.01"
                value={filters.totalPrice?.to || ""}
                onChange={(e) =>
                  handlePriceChange("totalPrice", "to", e.target.value)
                }
                placeholder="TO"
                className="w-14 px-1.5 py-0.5 text-center text-xs outline-none"
                style={{ appearance: "textfield", fontFamily: "inherit" }}
              />
              <div
                className="flex flex-col border-l"
                style={{ borderColor: "#f9e8cd" }}
              >
                <button
                  onClick={() => incrementValue("totalPrice", "to")}
                  className="px-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => decrementValue("totalPrice", "to")}
                  className="px-1 hover:bg-gray-100 transition-colors border-t"
                  style={{ borderColor: "#f9e8cd" }}
                >
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div
        className="px-2 py-1.5 font-normal text-white text-sm flex items-center gap-2"
        style={{ backgroundColor: "#000033" }}
      >
        <span>Location</span>
      </div>
      <div
        className="bg-white p-2"
        style={{ border: "1px solid #f9e8cd", borderTop: "none" }}
      >
        <div className="grid grid-cols-5 gap-1.5">
          {LOCATION_OPTIONS.map((location) => (
            <button
              key={location.value}
              onClick={() => toggleLocation(location.value)}
              className={`px-2 py-1 rounded-none text-sm font-normal transition-colors ${
                isLocationSelected(location.value)
                  ? "text-gray-800 bg-[#FAF6EB]"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{
                minWidth: "50px",
                minHeight: "28px",
                fontFamily: "inherit",
                border: isLocationSelected(location.value)
                  ? "0.25px solid #FAF6EB"
                  : "1px solid #f9e8cd",
              }}
            >
              {location.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Section */}
      <div
        className="px-2 py-1.5 font-normal text-white text-sm flex items-center gap-2"
        style={{ backgroundColor: "#000033" }}
      >
        <span>Lab :</span>
      </div>
      <div
        className="bg-white p-2"
        style={{ border: "1px solid #f9e8cd", borderTop: "none" }}
      >
        <div className="grid grid-cols-4 gap-1.5">
          {LAB_OPTIONS.map((lab) => (
            <button
              key={lab.value}
              onClick={() => toggleLab(lab.value)}
              className={`px-2 py-1 rounded-none text-sm3 font-normal transition-colors ${
                isLabSelected(lab.value)
                  ? "text-gray-800 bg-[#FAF6EB]"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{
                minWidth: "55px",
                minHeight: "28px",
                fontFamily: "inherit",
                border: isLabSelected(lab.value)
                  ? "0.25px solid #FAF6EB"
                  : "1px solid #f9e8cd",
              }}
            >
              {lab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
