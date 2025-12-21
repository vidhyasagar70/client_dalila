"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Settings } from "lucide-react";
// import { inventoryApi } from "@/lib/api";
import ConfigureAPIModal from "./ConfigureAPIModal";

interface Supplier {
  name: string;
  totalDiamonds: number;
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
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSupplierForConfig, setSelectedSupplierForConfig] = useState<string>("");

  // Update suppliers when prop changes
  React.useEffect(() => {
    setSuppliers(initialSuppliers);
  }, [initialSuppliers]);

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
        <div className="bg-[#050c3a] text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Suppliers</h2>
            <p className="text-sm text-gray-300 mt-1">
              Manage customer hold requests and diamond enquiries
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
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
              <table className="w-full">
                <thead>
                  <tr className="bg-[#050c3a] text-white">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Total Diamonds
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
                        {supplier.totalDiamonds.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenConfigModal(supplier.name)}
                            className="p-2 rounded-full bg-[#050C3A] text-white transition-colors"
                            title="Configure API"
                          >
                            <Settings className="w-4 h-4" />
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
