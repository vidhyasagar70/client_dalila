import React, { useState } from "react";
import Image from "next/image";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  isSearching?: boolean;
}

export default function SearchBar({
  onSearch,
  isSearching = false,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    onSearch(searchInput.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
  };

  return (
    <div>
      <div className="flex items-center border border-gray-200 rounded-none overflow-hidden shadow-sm w-fit bg-transparent backdrop-blur-sm">
        <div className="flex items-center px-3 py-1.5 border-r border-gray-200">
          <Image
            src="/filtersicon/filtersearch.png"
            alt="Search"
            width={16}
            height={16}
            className="w-4 h-4"
            priority
          />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search by Stone ID"
          className="px-3 py-1 outline-none text-sm text-black placeholder-gray-500 bg-transparent min-w-[280px]"
          disabled={isSearching}
        />
        {searchInput && (
          <button
            onClick={handleClear}
            className="px-2 py-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            title="Clear search"
          >
            ×
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-5 py-1.5 bg-[#000033] cursor-pointer text-white text-sm font-medium hover:bg-[#000044] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
