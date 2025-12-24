"use client";

import React, { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import Toggle from "./ui/Toggle";
import ConfigureAPIModal from "./ConfigureAPIModal";
import toast from "react-hot-toast";
import { Marcellus, Jost, Maven_Pro } from "next/font/google";

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

interface SupplierManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers?: Array<{ name: string; totalDiamonds: number; isVisible: boolean }>;
  onSupplierUpdate?: () => void;
}

const SUPPLIER_NAME = "Dharam Web Api";

const SupplierManagementModal: React.FC<SupplierManagementModalProps> = ({
  isOpen,
  onClose,
  onSupplierUpdate,
}) => {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Fetch total diamonds count
  const fetchTotalDiamonds = async () => {
    setLoadingCounts(true);
    try {
      const response = await fetch(
        "https://dalila-inventory-service-dev.caratlogic.com/api/diamonds/admin/search",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch diamond count");
      }

      const data = await response.json();
      if (data.pagination && data.pagination.totalRecords) {
        setTotalDiamonds(data.pagination.totalRecords);
      }
    } catch (error) {
      console.error("Error fetching diamond count:", error);
      toast.error("Failed to fetch diamond count");
    } finally {
      setLoadingCounts(false);
    }
  };

  // Fetch supplier visibility status
  const fetchSupplierStatus = async () => {
    try {
      // First, try to get from localStorage
      const storedStatus = localStorage.getItem(`supplier_${SUPPLIER_NAME}_visible`);
      if (storedStatus !== null) {
        setIsVisible(storedStatus === 'true');
      }

      const response = await fetch(
        `https://dalila-inventory-service-dev.caratlogic.com/api/users/admin/supplier-settings/${encodeURIComponent(SUPPLIER_NAME)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.isVisible !== undefined) {
          setIsVisible(data.isVisible);
          // Store in localStorage
          localStorage.setItem(`supplier_${SUPPLIER_NAME}_visible`, String(data.isVisible));
        }
      }
    } catch (error) {
      console.error("Error fetching supplier status:", error);
    }
  };

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTotalDiamonds();
      fetchSupplierStatus();
    }
  }, [isOpen]);

  const handleOpenConfigModal = () => {
    setShowConfigModal(true);
  };

  const handleConfigSaved = () => {
    // Refresh data after config is saved
    fetchTotalDiamonds();
    if (onSupplierUpdate) {
      onSupplierUpdate();
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const newStatus = !isVisible;
      const response = await fetch(
        `https://dalila-inventory-service-dev.caratlogic.com/api/users/admin/supplier-settings/${encodeURIComponent(SUPPLIER_NAME)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVisible: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update supplier status");
      }

      const data = await response.json();
      toast.success(
        data.message || `Supplier ${newStatus ? "activated" : "deactivated"} successfully`
      );

      // Update local state
      setIsVisible(newStatus);
      
      // Store in localStorage
      localStorage.setItem(`supplier_${SUPPLIER_NAME}_visible`, String(newStatus));

      // Dispatch custom event to notify inventory page
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('supplierStatusChanged', { 
          detail: { isVisible: newStatus, supplierName: SUPPLIER_NAME } 
        }));
      }

      // Notify parent to refresh
      if (onSupplierUpdate) {
        onSupplierUpdate();
      }
    } catch (err) {
      console.error("Error toggling supplier visibility:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update supplier status");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className={`${marcellus.variable} text-2xl font-bold text-[#040d39]`}>
              My Suppliers
            </h2>
            <p className={`${jost.variable} text-sm text-gray-500 mt-1`}>
              Manage your supplier configurations and inventory
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
          <table className={`w-full ${mavenPro.variable}`}>
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
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">{SUPPLIER_NAME}</td>
                <td className="py-3 px-4 text-center text-gray-800">
                  {loadingCounts ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    totalDiamonds.toLocaleString()
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-3">
                    <Toggle
                      checked={isVisible}
                      onChange={handleToggleVisibility}
                      disabled={loadingCounts}
                    />
                    <button
                      onClick={handleOpenConfigModal}
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                      title="Configure API"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Configure API Modal */}
      <ConfigureAPIModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        supplierName={SUPPLIER_NAME}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
};

export default SupplierManagementModal;
