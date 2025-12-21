"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Maven_Pro } from "next/font/google";
import { Package, Users, Grid3x3, List } from "lucide-react";
import InventoryDiamondTable from "@/components/InventoryDiamondTable";
import SupplierManagementModal from "@/components/SupplierManagementModal";
import SearchBar from "@/components/SearchBar";
import { inventoryApi } from "@/lib/api";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diamonds, setDiamonds] = useState<InventoryDiamond[]>([]);
  const [filteredDiamonds, setFilteredDiamonds] = useState<InventoryDiamond[]>([]);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [activeSuppliers, setActiveSuppliers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [suppliers, setSuppliers] = useState<Array<{ name: string; totalDiamonds: number; isVisible: boolean }>>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
    }
  }, [router]);

  useEffect(() => {
    // Filter diamonds based on search term
    if (searchTerm.trim() === "") {
      setFilteredDiamonds(diamonds);
    } else {
      const filtered = diamonds.filter((diamond) => {
        const search = searchTerm.toLowerCase();
        return (
          diamond.STONE_NO?.toLowerCase().includes(search) ||
          diamond.SHAPE?.toLowerCase().includes(search) ||
          diamond.COLOR?.toLowerCase().includes(search) ||
          diamond.CLARITY?.toLowerCase().includes(search) ||
          diamond.source?.toLowerCase().includes(search)
        );
      });
      setFilteredDiamonds(filtered);
    }
    setIsSearching(false);
  }, [searchTerm, diamonds]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getAllDiamonds({
        page: 1,
        limit: 10000,
      });

      if (response.success && response.data) {
        setDiamonds(response.data);
        setFilteredDiamonds(response.data);
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
        setError("Failed to fetch inventory data");
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch inventory",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierUpdate = () => {
    // Refresh inventory and supplier data after supplier update
    fetchInventoryData();
  };


  const handleSearchBar = (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${mavenPro.className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="px-2 sm:px-4 py-6 w-full">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">
            Manage customer hold requests and diamond enquiries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full px-1 sm:px-2 md:px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
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
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
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
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#050c3a] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table View</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#050c3a] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid View</span>
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

        {/* Inventory Table/Grid */}
        <div className="mt-4 w-full">
          <InventoryDiamondTable
            data={filteredDiamonds}
            loading={loading}
            error={error}
            pageSize={20}
            viewMode={viewMode}
          />
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
