"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Download,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  X,
  Check,
  GitCompare,
} from "lucide-react";
import { cartApi, diamondApi } from "@/lib/api";
import Image from "next/image";
import type { DiamondData } from "@/types/Diamondtable";

// Dynamic imports for modal components
const DiamondComparisonPage = dynamic(
  () => import("../../components/DiamondComparisonPage"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
      </div>
    ),
  }
);

const DiamondDetailView = dynamic(
  () => import("@/components/DiamondDetailView"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
      </div>
    ),
  }
);

interface CartDiamondData {
  _id: string;
  STONE_NO: string;
  SHAPE?: string;
  CARATS?: string;
  COLOR?: string;
  CLARITY?: string;
  CUT?: string;
  POL?: string;
  SYM?: string;
  LAB?: string;
  NET_VALUE?: string;
  NET_RATE?: string;
  RAP_PRICE?: string;
  FLOUR?: string;
  MEASUREMENTS?: string;
  TABLE_PER?: string;
  DEPTH_PER?: string;
  REPORT_NO?: string;
  REPORT_DATE?: string;
  COMMENTS_1?: string;
  TINGE?: string;
  LOCATION?: string;
  STAGE?: string;
  REAL_IMAGE?: string;
  ARROW_IMAGE?: string;
  HEART_IMAGE?: string;
  MP4?: string;
  CERTI_PDF?: string;
  DNA?: string;
  CROWN_ANGLE?: string;
  CROWN_HEIGHT?: string;
  PAVILLION_ANGLE?: string;
  PAVILLION_HEIGHT?: string;
  DISC_PER?: string;
  KEY_TO_SYMBOLS?: string;
  REPORT_COMMENTS?: string;
  HA?: string;
  [key: string]: string | undefined;
}
interface ApiCartItem {
  stoneNo: string;
  addedAt: string;
  _id: string;
  diamond: Partial<CartDiamondData>;
}
interface CartItemWithDetails {
  stoneNo: string;
  addedAt: string;
  _id: string;
  diamond: CartDiamondData;
}

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showComparison, setShowComparison] = useState(false);
  const [selectedDiamondsForComparison, setSelectedDiamondsForComparison] =
    useState<Array<CartDiamondData & { _id: string }>>([]);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondData | null>(
    null,
  );

  // Toast management
  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Fetch cart items on mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await cartApi.get();

      if (response?.success && response.data?.cart?.items) {
        const items = (response.data.cart.items as ApiCartItem[]).map(
          (item) => ({
            stoneNo: item.stoneNo,
            addedAt: item.addedAt,
            _id: item._id,
            diamond: {
              _id: item.diamond._id || item._id || item.stoneNo,
              STONE_NO: item.diamond.STONE_NO || item.stoneNo,
              ...item.diamond,
            } as CartDiamondData,
          }),
        );

        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart items. Please try again.");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;

    try {
      setError(null);
      const selectedStones = cartItems.filter((item) =>
        selectedItems.has(item.stoneNo),
      );

      for (const item of selectedStones) {
        await handleRemoveItem(item.stoneNo);
      }

      setSelectedItems(new Set());
    } catch (err) {
      console.error("Error removing selected items:", err);
      addToast("error", "Failed to remove some items");
    }
  };

  const handleRemoveItem = async (stoneNo: string) => {
    try {
      setIsRemoving(stoneNo);
      setError(null);

      const response = await cartApi.remove(stoneNo);

      if (response?.success) {
        setCartItems((prev) => prev.filter((item) => item.stoneNo !== stoneNo));
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(stoneNo);
          return newSet;
        });

        addToast("success", `${stoneNo} removed from cart`);

        window.dispatchEvent(new CustomEvent("cart-updated"));
      } else {
        addToast("error", response?.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      addToast(
        "error",
        err instanceof Error ? err.message : "Failed to remove item from cart",
      );
    } finally {
      setIsRemoving(null);
    }
  };

  const toggleSelectItem = (stoneNo: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stoneNo)) {
        newSet.delete(stoneNo);
      } else {
        newSet.add(stoneNo);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map((item) => item.stoneNo)));
    }
  };

  const handleExportToExcel = () => {
    if (selectedItems.size === 0) {
      addToast("error", "Please select at least one item to export");
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.stoneNo),
    );
    const headers = [
      "Stone No",
      "Location",
      "Report No",
      "Lab",
      "Shape",
      "Carat",
      "Color",
      "Clarity",
      "Cut",
      "Polish",
      "Rap Price",
      "Total",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedCartItems.map((item) =>
        [
          item.stoneNo,
          item.diamond.LOCATION || "",
          item.diamond.REPORT_NO || "",
          item.diamond.LAB || "",
          item.diamond.SHAPE || "",
          item.diamond.CARATS || "",
          item.diamond.COLOR || "",
          item.diamond.CLARITY || "",
          item.diamond.CUT || "",
          item.diamond.POL || "",
          item.diamond.RAP_PRICE || "",
          item.diamond.NET_VALUE || "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cart-items.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    addToast("success", "Cart items exported successfully");
  };

  const handleCompare = () => {
    if (selectedItems.size === 0) {
      addToast("error", "Please select at least one item to compare");
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.stoneNo),
    );
    const diamondsToCompare = selectedCartItems
      .map((item) => {
        const diamondId = item._id || item.diamond._id || item.stoneNo;
        if (!diamondId) return null;

        return {
          ...item.diamond,
          _id: diamondId,
        };
      })
      .filter(
        (diamond): diamond is CartDiamondData & { _id: string } =>
          diamond !== null,
      );

    setSelectedDiamondsForComparison(diamondsToCompare);
    setShowComparison(true);
  };

  const handleEnquire = async () => {
    if (selectedItems.size === 0) {
      addToast("error", "Please select at least one item to enquire");
      return;
    }

    setIsEmailSending(true);
    setError(null);

    try {
      const authToken =
        getCookie("authToken") || localStorage.getItem("authToken");

      if (!authToken) {
        addToast(
          "error",
          "Authentication token not found. Please log in again.",
        );
        setIsEmailSending(false);
        return;
      }

      let userEmail = null;
      const userCookie = getCookie("user");

      if (userCookie) {
        try {
          const user = JSON.parse(decodeURIComponent(userCookie));
          userEmail = user.email;
        } catch (e) {
          console.error("Error parsing user cookie:", e);
        }
      }

      if (!userEmail) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userEmail = user.email;
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
          }
        }
      }

      if (!userEmail) {
        addToast("error", "User email not found. Please log in again.");
        setIsEmailSending(false);
        return;
      }

      const selectedStoneNumbers = Array.from(selectedItems);

      const response = await diamondApi.email({
        stoneNumbers: selectedStoneNumbers,
        emails: [userEmail],
      });

      if (response.success) {
        addToast(
          "success",
          `Successfully emailed ${response.data.totalEmailed} diamond(s) to ${userEmail}`,
        );
      } else {
        addToast("error", response.message || "Failed to send email");
      }
    } catch (err: unknown) {
      console.error("Email error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send email. Please try again.";
      addToast("error", errorMessage);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleAddItem = () => {
    router.push("/inventory");
  };

  // Pagination
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const paginatedItems = cartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatCurrency = (value: string | undefined) => {
    if (!value) return "$0.00";
    const num = parseFloat(value);
    return isNaN(num)
      ? "$0.00"
      : `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMeasurement = (measurements: string | undefined, index: number) => {
    if (!measurements) return "N/A";
    const parts = measurements.split("x");
    return parts[index]?.trim() || "N/A";
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.stoneNo))
      .reduce((sum, item) => {
        const netValue = parseFloat(item.diamond.NET_VALUE || "0");
        return sum + netValue;
      }, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB]" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf6eb] dark:bg-[#faf6eb] pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-3xl font-bold text-[#060c3c] dark:text-[#060c3c] mb-4">
              My Cart
            </h1>
            <p className="text-[#060c3c]/60 dark:text-[#060c3c]/60 mb-6">
              Your cart is empty
            </p>
            <button
              onClick={handleAddItem}
              className="px-6 py-3 bg-[#c89e3a] text-white rounded-lg hover:bg-[#b08830] transition-colors"
            >
              Browse Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-white pt-32 pb-16 mt-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#060c3c] dark:text-[#060c3c] mb-2">
            My Cart
          </h1>
        </div>

        {/* Error Message (top banner) */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 dark:bg-red-500/10 border border-red-500/30 dark:border-red-500/30 rounded-lg flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-600 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-600 hover:text-red-700 dark:hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-4 flex flex-wrap items-center gap-0 bg-white dark:bg-white">
          <button
            onClick={handleRemoveSelected}
            disabled={selectedItems.size === 0 || isRemoving !== null}
            className="flex items-center gap-2 px-4 py-2.5 text-[#151C48] dark:text-[#151C48] hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-200 dark:border-gray-200"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Remove from cart</span>
          </button>
          <button
            onClick={handleExportToExcel}
            disabled={selectedItems.size === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-[#050C3A] dark:text-[#050C3A] hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-200 dark:border-gray-200"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export to excel</span>
          </button>
          <button
            onClick={handleCompare}
            disabled={selectedItems.size === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-[#050C3A] dark:text-[#050C3A] hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-200 dark:border-gray-200"
          >
            <GitCompare className="w-4 h-4" />
            <span className="text-sm font-medium">Compare stone</span>
          </button>
          <button
            onClick={handleEnquire}
            disabled={selectedItems.size === 0 || isEmailSending}
            className="flex items-center gap-2 px-4 py-2.5 text-[#050C3A] dark:text-[#050C3A] hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEmailSending ? (
               <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isEmailSending ? "Sending..." : "Enquiree"}
            </span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-white border border-[#060c3c]/10 dark:border-[#060c3c]/10 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#060c3c] dark:bg-[#060c3c] text-white dark:text-white">
                <tr>
                  <th className="px-4 py-3 text-left border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.size === paginatedItems.length &&
                        paginatedItems.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 cursor-pointer accent-[#c89e3a]"
                      style={{
                        outline: "1px solid #F9E8CD",
                        outlineOffset: "-1px",
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Pct No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Report No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Lab
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Shape
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Carat
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Purty
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Cut
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Pol
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Rap.($)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Length
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Width
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    Depth
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#F9E8CD] dark:border-[#F9E8CD]">
                    $/Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`${idx % 2 === 0 ? "bg-white dark:bg-white" : "bg-[#faf6eb] dark:bg-[#faf6eb]"} border-b border-[#F9E8CD] dark:border-[#F9E8CD]`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.stoneNo)}
                        onChange={() => toggleSelectItem(item.stoneNo)}
                        className="w-4 h-4 cursor-pointer accent-[#c89e3a]"
                        style={{
                          outline: "1px solid #F9E8CD",
                          outlineOffset: "-1px",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-[#060c3c]/10 dark:bg-[#060c3c]/10 rounded overflow-hidden">
                        {item.diamond.REAL_IMAGE ? (
                          <Image
                            src={item.diamond.REAL_IMAGE}
                            alt={item.stoneNo}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23e5e7eb' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#060c3c]/50 dark:text-[#060c3c]/50 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td 
                      className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c] font-medium cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => setSelectedDiamond(item.diamond as unknown as DiamondData)}
                    >
                      {item.stoneNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.LOCATION || "BE"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.REPORT_NO || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.LAB || "GIA"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.SHAPE || "ROUND"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.CARATS || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.COLOR || "F"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.CLARITY || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.CUT || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.POL || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {formatCurrency(item.diamond.RAP_PRICE)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {getMeasurement(item.diamond.MEASUREMENTS, 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {getMeasurement(item.diamond.MEASUREMENTS, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#060c3c] dark:text-[#060c3c]">
                      {item.diamond.DEPTH_PER || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#c89e3a] dark:text-[#c89e3a] font-semibold">
                      {formatCurrency(item.diamond.NET_VALUE)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-white dark:bg-white px-6 py-4 flex items-center justify-between border-t border-[#F9E8CD] dark:border-[#F9E8CD]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-[#060c3c] dark:text-[#060c3c] hover:bg-[#060c3c]/5 dark:hover:bg-[#060c3c]/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(totalPages, 10) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[28px] h-7 px-2 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#060c3c] dark:bg-[#060c3c] text-white dark:text-white"
                        : "text-[#060c3c] dark:text-[#060c3c] hover:bg-[#060c3c]/5 dark:hover:bg-[#060c3c]/5"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {totalPages > 10 && (
                  <>
                    <span className="text-[#060c3c]/50 dark:text-[#060c3c]/50 px-2 text-xs">
                      ...
                    </span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`min-w-[28px] h-7 px-2 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                        currentPage === totalPages
                          ? "bg-[#060c3c] dark:bg-[#060c3c] text-white dark:text-white"
                          : "text-[#060c3c] dark:text-[#060c3c] hover:bg-[#060c3c]/5 dark:hover:bg-[#060c3c]/5"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center text-[#060c3c] dark:text-[#060c3c] hover:bg-[#060c3c]/5 dark:hover:bg-[#060c3c]/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Placeholder for future buttons */}
            </div>
          </div>
        </div>

        {/* Selected Total */}
        {selectedItems.size > 0 && (
          <div className="mt-6 p-4 bg-white dark:bg-white border border-[#060c3c]/10 dark:border-[#060c3c]/10 rounded-lg flex items-center justify-between shadow-sm">
            <span className="text-[#060c3c] dark:text-[#060c3c] text-lg">
              Selected Items:{" "}
              <span className="font-semibold text-[#c89e3a] dark:text-[#c89e3a]">
                {selectedItems.size}
              </span>
            </span>
            <span className="text-[#c89e3a] dark:text-[#c89e3a] text-xl font-bold">
              Total: {formatCurrency(calculateTotal().toString())}
            </span>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <DiamondComparisonPage
          diamonds={selectedDiamondsForComparison}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Diamond Detail Modal (from cart row click) */}
      {selectedDiamond && (
        <DiamondDetailView
          diamond={selectedDiamond as unknown as DiamondData}
          onClose={() => setSelectedDiamond(null)}
        />
      )}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out animate-slide-in ${
              toast.type === "success"
                ? "bg-[#FAF6EB] border-green-300"
                : "bg-[#FAF6EB] border-red-300"
            }`}
            style={{
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {toast.type === "success" ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                toast.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-auto ${
                toast.type === "success"
                  ? "text-green-600 hover:text-green-700"
                  : "text-red-600 hover:text-red-700"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
