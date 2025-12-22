"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { Maven_Pro,Marcellus,Jost } from "next/font/google";
import { Package, Users, Gem, List } from "lucide-react";
import InventoryDiamondTable from "@/components/InventoryDiamondTable";
import DiamondStockTable from "@/components/DiamondStockTable";
import SupplierManagementModal from "@/components/SupplierManagementModal";
import SearchBar from "@/components/SearchBar";
import { inventoryApi } from "@/lib/api";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Singleton wrapper to ensure DiamondStockTable only renders once
const ActiveDiamondsTableWrapper = memo(() => {
  const hasRendered = useRef(false);
  const isMounted = useRef(true);
  
  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      console.log('ActiveDiamondsTable mounted');
    }
    
    return () => {
      isMounted.current = false;
      console.log('ActiveDiamondsTable unmounting');
    };
  }, []);

  // Only render once, never update
  if (!isMounted.current) {
    return null;
  }

  return <DiamondStockTable key="active-diamonds-singleton" />;
}, () => true); // Always return true to prevent any re-renders

ActiveDiamondsTableWrapper.displayName = 'ActiveDiamondsTableWrapper';

interface InventoryDiamond {
  _id: string;
  STONE_NO: string;
  source: string;
  SHAPE: string;
  CARATS: string;
  COLOR: string;
  CLARITY: string;
  CUT: string;
  POL: string;
  SYM: string;
  FLOUR: string;
  LAB: string;
  LOCATION: string;
  NET_RATE: string;
  DISC_PER: string;
  NET_VALUE: string;
  RAP_PRICE: string;
  DEPTH_PER: string;
  TABLE_PER: string;
  MEASUREMENTS: string;
  REPORT_NO: string;
  REAL_IMAGE: string;
  MP4: string;
  CERTI_PDF: string;
  createdAt: string;
  updatedAt: string;
}

export default function InventoryManagement() {
  const router = useRouter();
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [activeDiamonds, setActiveDiamonds] = useState(0);
  const [activeSuppliers, setActiveSuppliers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [suppliers, setSuppliers] = useState<Array<{ name: string; totalDiamonds: number; isVisible: boolean }>>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [viewMode, setViewMode] = useState<"inventory" | "active">("inventory");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<InventoryDiamond[]>([]);
  const [searchPagination, setSearchPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | undefined>(undefined);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [hasActiveDiamondsBeenViewed, setHasActiveDiamondsBeenViewed] = useState(false);

  useEffect(() => {
    // Check if user is admin or superadmin
    const checkAuthorization = () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            const userData = JSON.parse(user);
            const role = userData.role?.toLowerCase();
            if (role === "admin" || role === "superadmin" || role === "super_admin") {
              setIsAuthorized(true);
              return true;
            }
          } catch (err) {
            console.error("Error parsing user data:", err);
          }
        }
        router.push("/login");
        return false;
      }
      return false;
    };

    if (checkAuthorization()) {
      fetchInventoryData();
      fetchActiveDiamondsCount();
    }
  }, [router]);

  const handleSearchBar = async (term: string) => {
    // setSearchTerm removed (unused)
    
    // If search term is empty, exit search mode and show all inventory
    if (term.trim() === "") {
      setIsSearchMode(false);
      setSearchResults([]);
      setSearchPagination(undefined);
      setIsSearching(false);
      return;
    }

    // Make API call with search term
    setIsSearching(true);
    setIsSearchMode(true);
    
    try {
      const response = await inventoryApi.searchDiamonds({
        searchTerm: term,
        page: 1,
        limit: 100, // Get more results for search
      });

      if (response.success && response.data) {
        setSearchResults(response.data);
        setSearchPagination(response.pagination);
      } else {
        setSearchResults([]);
        setSearchPagination(undefined);
      }
    } catch (err) {
      console.error('Error searching diamonds:', err);
      setSearchResults([]);
      setSearchPagination(undefined);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchActiveDiamondsCount = async () => {
    try {
      const response = await fetch('https://dalila-inventory-service-dev.caratlogic.com/api/diamonds/search');
      const data = await response.json();
      
      if (data.success && data.totalFilteredRecords !== undefined) {
        setActiveDiamonds(data.totalFilteredRecords);
      }
    } catch (err) {
      console.error('Error fetching active diamonds count:', err);
    }
  };

  const fetchInventoryData = async () => {
    try {
      // setLoading and setError removed (unused)
      const response = await inventoryApi.getAllDiamonds({
        page: 1,
        limit: 10000,
      });

      if (response.success && response.data) {
        setTotalDiamonds(response.pagination.totalRecords);

        // Extract unique suppliers from diamond data
        const supplierMap = new Map<string, { count: number; isVisible: boolean }>();
        response.data.forEach((diamond) => {
          if (diamond.source) {
            const existing = supplierMap.get(diamond.source);
            if (existing) {
              existing.count++;
            } else {
              // Check if we have stored visibility state in localStorage
              const storedVisibility = localStorage.getItem(`supplier_visibility_${diamond.source}`);
              const isVisible = storedVisibility ? JSON.parse(storedVisibility) : false;
              supplierMap.set(diamond.source, { count: 1, isVisible });
            }
          }
        });

        const supplierList = Array.from(supplierMap.entries()).map(([name, data]) => ({
          name,
          totalDiamonds: data.count,
          isVisible: data.isVisible,
        }));

        setSuppliers(supplierList);
        setTotalSuppliers(supplierList.length);
        setActiveSuppliers(supplierList.filter((s) => s.isVisible).length);
      } else {
        // setError removed (unused)
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      // setError removed (unused)
    } finally {
      // setLoading removed (unused)
    }
  };

  const handleSupplierUpdate = () => {
    // Refresh inventory, supplier data, and active diamonds count after supplier update
    fetchInventoryData();
    fetchActiveDiamondsCount();
  };

  if (!isAuthorized) {
    return null;
  }

  return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
      <div className="bg-gray-50 w-full">
        <div className="px-2 sm:px-4 py-3 w-full mt-30">
          <h1 className={`text-xl font-bold text-gray-900 ${marcellus.className}`}>Inventory and Suppliers</h1>
          
        </div>
      </div>
      {/* Stats Cards */}
      <div className={`w-full px-1 sm:px-2 md:px-4 py-4 ${mavenPro.className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {/* Total Diamonds Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Total Diamonds
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalDiamonds < 10 ? `0${totalDiamonds}` : totalDiamonds}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All stocks (currently available)
                </p>
              </div>
            </div>
          </div>

          {/* Active Diamonds Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Active Diamonds
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeDiamonds < 10 ? `0${activeDiamonds}` : activeDiamonds}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Filtered and active stocks
                </p>
              </div>
            </div>
          </div>

          {/* Active Suppliers Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Suppliers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeSuppliers < 10 ? `0${activeSuppliers}` : activeSuppliers}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Not try to follow dealer assets
                </p>
              </div>
            </div>
          </div>

          {/* Total Suppliers Card */}
          <div className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${mavenPro.className}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Suppliers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalSuppliers < 10 ? `0${totalSuppliers}` : totalSuppliers}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Onboarding successfully
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar - Table/Grid View, Search, Manage Suppliers */}
        <div className="bg-[#FAF6EB] rounded-lg shadow-sm p-1 sm:p-2 border border-gray-200 mt-4 w-full">
          <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 min-h-[38px]">
            {/* Left Side - View Toggles */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
              <button
                onClick={() => setViewMode('inventory')}
                className={`flex items-center gap-1 px-2 py-1 text-sm transition-colors ${
                  viewMode === 'inventory'
                    ? 'bg-[#050c3a] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {/* <List className="w-3.5 h-3.5" /> */}
                <span className="hidden sm:inline">Inventory View</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('active');
                  setHasActiveDiamondsBeenViewed(true);
                }}
                className={`flex items-center gap-1 px-2 py-1  text-sm transition-colors ${
                  viewMode === 'active'
                    ? 'bg-[#050c3a] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {/* <Gem className="w-3.5 h-3.5" /> */}
                <span className="hidden sm:inline">Active Diamonds</span>
              </button>
            </div>

            {/* Right Side - Search and Manage Suppliers */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Search Bar */}
              <div className="max-w-xs w-full mr-30">
                <SearchBar onSearch={handleSearchBar} isSearching={isSearching} />
              </div>

              {/* Manage Suppliers Button */}
              <button
                onClick={() => setShowSupplierModal(true)}
                className="bg-[#050C3A] text-white px-3 py-1.5 transition-colors font-medium flex items-center gap-1 text-sm whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Manage Suppliers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table/Active Diamonds */}
        <div className="mt-4 w-full">
          {/* Active Diamonds Table - Only mount after first view */}
          {hasActiveDiamondsBeenViewed && (
            <div 
              key="active-diamonds-container"
              style={{ display: viewMode === 'active' ? 'block' : 'none' }}
            >
              <ActiveDiamondsTableWrapper />
            </div>
          )}
          
          {/* Inventory Table - Always mounted */}
          <div style={{ display: viewMode === 'inventory' ? 'block' : 'none' }}>
            {isSearchMode ? (
              <InventoryDiamondTable
                data={searchResults}
                loading={isSearching}
                error={null}
                viewMode="list"
                externalPagination={searchPagination}
              />
            ) : (
              <InventoryDiamondTable viewMode="list" />
            )}
          </div>
        </div>
      </div>

      {/* Supplier Management Modal */}
      <SupplierManagementModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        suppliers={suppliers}
        onSupplierUpdate={handleSupplierUpdate}
      />
    </div>
  );
}
