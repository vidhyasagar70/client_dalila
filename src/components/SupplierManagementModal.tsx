"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import Toggle from "./ui/Toggle";
import { inventoryApi } from "@/lib/api";
import ConfigureAPIModal from "./ConfigureAPIModal";
import toast from "react-hot-toast";
import { Marcellus, Jost ,Maven_Pro } from "next/font/google";
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

interface Supplier {
  name: string;
  totalDiamonds: number;
  activeDiamonds?: number;
  isVisible: boolean;
}

interface SupplierManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onSupplierUpdate?: () => void;
}

const SupplierManagementModal: React.FC<SupplierManagementModalProps> = ({
  isOpen,
  onClose,
  suppliers: initialSuppliers,
  onSupplierUpdate,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => initialSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSupplierForConfig, setSelectedSupplierForConfig] = useState<string>("");
  const [loadingCounts, setLoadingCounts] = useState(false);

  // Fetch real diamond counts for all suppliers
  const fetchRealDiamondCounts = async (supplierList: Supplier[]) => {
    setLoadingCounts(true);
    try {
      const updatedSuppliers = await Promise.all(
        supplierList.map(async (supplier) => {
          try {
            // Fetch total diamonds (all, unfiltered)
            const totalRes = await inventoryApi.searchDiamonds({
              source: supplier.name,
              page: 1,
              limit: 1,
            });
            const totalCount = totalRes.pagination?.totalRecords || 0;

            // Fetch active diamonds (filtered, as in inventory-management Active Diamonds card)
            // This must use the /api/diamonds/search endpoint, not admin, and get totalFilteredRecords
            const activeRes = await fetch(
              `https://dalila-inventory-service-dev.caratlogic.com/api/diamonds/search?supplier=${encodeURIComponent(supplier.name)}`
            );
            const activeData = await activeRes.json();
            const activeCount = activeData.totalFilteredRecords ?? 0;

            return {
              ...supplier,
              totalDiamonds: totalCount,
              activeDiamonds: activeCount,
            };
          } catch (error) {
            console.error(`Error fetching count for ${supplier.name}:`, error);
            return supplier; // Keep original count if fetch fails
          }
        })
      );
      setSuppliers(updatedSuppliers);
    } catch (error) {
      console.error('Error fetching diamond counts:', error);
    } finally {
      setLoadingCounts(false);
    }
  };

  // Sync suppliers state with initialSuppliers prop and fetch real counts when modal opens or suppliers prop changes
  React.useEffect(() => {
    if (isOpen && initialSuppliers.length > 0) {
      // On open, sync local state to prop, but override isVisible with localStorage if present
      const suppliersWithVisibility = initialSuppliers.map(supplier => {
        const stored = localStorage.getItem(`supplier_visibility_${supplier.name}`);
        return {
          ...supplier,
          isVisible: stored !== null ? JSON.parse(stored) : supplier.isVisible,
        };
      });
      setSuppliers(suppliersWithVisibility);
      fetchRealDiamondCounts(suppliersWithVisibility);
    }
  }, [isOpen, initialSuppliers]);

  // (Removed duplicate effect)

  const handleOpenConfigModal = (supplierName: string) => {
    setSelectedSupplierForConfig(supplierName);
    setShowConfigModal(true);
  };

  const handleConfigSaved = () => {
    // Refresh data after config is saved
    if (onSupplierUpdate) {
      onSupplierUpdate();
    }
  };

  const handleToggleVisibility = async (supplierName: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const response = await inventoryApi.toggleSupplierVisibility(supplierName, newStatus);
      
      if (response.success) {
        toast.success(response.message || `Supplier ${newStatus ? 'activated' : 'deactivated'} successfully`);
        
        // Update local state
        setSuppliers(prev => 
          prev.map(s => 
            s.name === supplierName ? { ...s, isVisible: newStatus } : s
          )
        );
        
        // Update localStorage
        localStorage.setItem(`supplier_visibility_${supplierName}`, JSON.stringify(newStatus));
        
        // Notify parent to refresh
        if (onSupplierUpdate) {
          onSupplierUpdate();
        }
      } else {
        toast.error(response.message || 'Failed to update supplier status');
      }
    } catch (err) {
      console.error('Error toggling supplier visibility:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update supplier status');
    }
  };

  if (!isOpen) return null;

  // Pagination
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = suppliers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? "bg-[#050c3a] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className={`${marcellus.variable} text-2xl font-bold text-[#040d39]`}>My Suppliers</h2>
            <p className={`${jost.variable} text-sm text-gray-500 mt-1`}>
              Manage customer hold requests and diamond enquiries
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {suppliers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No suppliers found</p>
            </div>
          ) : (
            <>
              <table className={`w-full ${mavenPro.variable}`}>
                <thead>
                  <tr className="bg-[#050c3a] text-white">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Total Diamonds
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Active Diamonds
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSuppliers.map((supplier, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-800">
                        {supplier.name}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-800">
                        {loadingCounts ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : (
                          supplier.totalDiamonds.toLocaleString()
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-800">
                        {loadingCounts ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : (
                          (supplier.activeDiamonds || 0).toLocaleString()
                        )}
                      </td>
                     
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <Toggle
                            checked={supplier.isVisible}
                            onChange={() => handleToggleVisibility(supplier.name, supplier.isVisible)}
                            disabled={loadingCounts}
                          />
                          <button
                            onClick={() => handleOpenConfigModal(supplier.name)}
                            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                            title="Configure API"
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {renderPaginationButtons()}

                  {totalPages > 10 && currentPage < totalPages - 4 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => goToPage(totalPages)}
                        className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Configure API Modal */}
      <ConfigureAPIModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        supplierName={selectedSupplierForConfig}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
};

export default SupplierManagementModal;
