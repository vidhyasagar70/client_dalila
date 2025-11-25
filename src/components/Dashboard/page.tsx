"use client";

import { useState, useEffect } from "react";
import {
  Package,
  FileText,
  ShoppingCart,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gem,
  List,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

import { diamondApi, cartApi, holdApi } from "@/lib/api";
import { Maven_Pro } from "next/font/google";
import type { LimitedEditionDiamond } from "@/lib/api";
import type { DiamondData } from "@/types/Diamondtable";
import DiamondDetailView from "@/components/DiamondDetailView";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function AdminDashboard() {
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [newlyAddedDiamonds, setNewlyAddedDiamonds] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [limitedEditionDiamonds, setLimitedEditionDiamonds] = useState<LimitedEditionDiamond[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedDiamond, setSelectedDiamond] = useState<LimitedEditionDiamond | null>(null);

  // Mock data
  const mockStats = {
    newArrival: 25,
    priceRevised: 1234,
    holdStone: 0,
    upcomingList: 0,
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCartCount();
    fetchHoldCount();
    fetchLimitedEditionDiamonds();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    // Listen for limited edition updates
    const handleLimitedEditionUpdate = () => {
      fetchLimitedEditionDiamonds();
    };
    window.addEventListener("limited-edition-updated", handleLimitedEditionUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("limited-edition-updated", handleLimitedEditionUpdate);
    };
  }, []);

  // Auto-play carousel effect
  useEffect(() => {
    if (!isAutoPlaying || limitedEditionDiamonds.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        (prev + 1) % Math.max(1, limitedEditionDiamonds.length - 2)
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, limitedEditionDiamonds.length]);

  const fetchCartCount = async () => {
    try {
      const response = await cartApi.get();
      console.log("Dashboard - Cart response:", response);

      if (response?.success && response.data?.cart?.items) {
        setCartCount(response.data.cart.items.length);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  const fetchHoldCount = async () => {
    try {
      const response = await holdApi.get();
      console.log("Dashboard - Hold response:", response);

      if (response?.success && response.data?.hold?.items) {
        setHoldCount(response.data.hold.items.length);
      } else {
        setHoldCount(0);
      }
    } catch {
      setHoldCount(0);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await diamondApi.getDashboardStats();

      if (response && response.success && response.data) {
        setTotalDiamonds(response.data.totalDiamonds);
        setNewlyAddedDiamonds(response.data.newlyAddedDiamonds);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLimitedEditionDiamonds = async () => {
    try {
      const response = await diamondApi.getLimitedEdition();
      if (response && response.success && response.data) {
        setLimitedEditionDiamonds(response.data.diamonds.slice(0, 6)); // Get first 6 diamonds
      }
    } catch (err) {
      console.error("Limited edition fetch error:", err);
    }
  };

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, limitedEditionDiamonds.length - 2),
    );
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, limitedEditionDiamonds.length - 2)) %
        Math.max(1, limitedEditionDiamonds.length - 2),
    );
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-30">
      <div className="w-full px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* First Row - 4 Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Inventory Card - Dark Navy - Clickable */}
          <button
            onClick={() => handleNavigate("/inventory")}
            style={{ borderColor: "#FAE9D0", backgroundColor: "#050C3A" }}
            className="p-6 text-white shadow-lg border hover:opacity-90 transition-opacity text-left w-full cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <Gem className="w-8 h-8" />
              <span className={`text-lg opacity-80 ${mavenPro.className}`}>
                Inventory
              </span>
            </div>
            <div
              className={`text-5xl font-bold text-white text-center ${mavenPro.className}`}
            >
              {totalDiamonds}
            </div>
          </button>

          {/* New Arrival Card */}
          <div
            style={{ borderColor: "#FAE9D0" }}
            className="bg-white p-6 shadow-md border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 p-2">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <span
                className={`text-lg font-semibold text-gray-900 ${mavenPro.className}`}
              >
                New Arrival
              </span>
            </div>
            <div
              className={`text-5xl font-bold text-gray-900 text-center ${mavenPro.className}`}
            >
              {newlyAddedDiamonds}
            </div>
          </div>

          {/* Price Revised Card */}
          <div
            style={{ borderColor: "#FAE9D0" }}
            className="bg-white p-6 shadow-md border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 p-2">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
              <span
                className={`text-lg font-semibold text-gray-900 ${mavenPro.className}`}
              >
                Price Revised
              </span>
            </div>
            <div
              className={`text-5xl font-bold text-gray-900 text-center ${mavenPro.className}`}
            >
              0
            </div>
          </div>

          {/* Cart Card - Clickable - Now showing real count */}
          <button
            onClick={() => handleNavigate("/cart")}
            style={{ borderColor: "#FAE9D0" }}
            className="bg-white p-6 shadow-md border hover:bg-gray-50 transition-colors text-left w-full cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 p-2">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
              </div>
              <span
                className={`text-lg font-semibold text-gray-900 ${mavenPro.className}`}
              >
                Cart
              </span>
            </div>
            <div
              className={`text-5xl font-bold text-gray-900 text-center ${mavenPro.className}`}
            >
              {cartCount}
            </div>
          </button>
        </div>

        {/* Second Row - Diamond Carousel and Right Cards */}
        <div className="grid grid-cols-12 gap-6">
          {/* Diamond Carousel - Left Side */}
          <div className="col-span-9 flex">
            <div
              style={{ borderColor: "#FAE9D0" }}
              className="bg-white p-6 shadow-md border w-full flex flex-col"
            >
              <h2
                className={`text-2xl font-bold text-gray-900 mb-6 ${mavenPro.className}`}
              >
                Limited Edition
              </h2>
              <div className="flex items-center justify-between flex-1">
                <button
                  onClick={prevSlide}
                  className="p-2 bg-[#FAE9D0] hover:bg-[#e5d5b5] transition-all duration-300 flex-shrink-0 self-center z-10 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <div className="flex gap-4 flex-1 justify-center items-center overflow-hidden relative px-4">
                  {limitedEditionDiamonds.length > 0 ? (
                    <div 
                      className="flex gap-4 transition-all duration-700 ease-out"
                      style={{
                        transform: `translateX(-${currentSlide * (224 + 16)}px)` // 224px card width + 16px gap
                      }}
                    >
                      {limitedEditionDiamonds.map((diamond, index) => (
                        <button
                          key={diamond.STONE_NO || index}
                          onClick={() => setSelectedDiamond(diamond)}
                          className="bg-white p-4 w-56 flex-shrink-0 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer text-left border border-transparent hover:border-[#FAE9D0]"
                        >
                          <div className="bg-gray-50 p-6 mb-4 flex items-center justify-center">
                            {diamond.MP4 ? (
                              <video
                                className="w-32 h-32 object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              >
                                <source src={diamond.MP4} type="video/mp4" />
                              </video>
                            ) : diamond.REAL_IMAGE ? (
                              <Image
                                src={diamond.REAL_IMAGE}
                                alt={diamond.STONE_NO}
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="text-center space-y-2">
                            <div className="flex justify-center gap-2 text-sm font-medium text-gray-900">
                              <span>{diamond.SHAPE}</span>
                              <span>{diamond.CARATS}</span>
                              <span>{diamond.COLOR}</span>
                              <span>{diamond.CLARITY}</span>
                            </div>
                            <div className="flex justify-center gap-2 text-sm text-gray-600">
                              <span>-{diamond.CUT || "N/A"}</span>
                              <span>{diamond.POL}</span>
                              <span>{diamond.SYM}</span>
                              <span>{diamond.LAB}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      No limited edition diamonds available
                    </div>
                  )}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-2 bg-[#FAE9D0] hover:bg-[#e5d5b5] transition-all duration-300 flex-shrink-0 self-center z-10 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Carousel Indicators */}
              {limitedEditionDiamonds.length > 3 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.ceil(limitedEditionDiamonds.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentSlide(index);
                        setTimeout(() => setIsAutoPlaying(true), 5000);
                      }}
                      className={`h-2 transition-all duration-500 ease-out ${
                        currentSlide === index 
                          ? 'w-8 bg-[#FAE9D0]' 
                          : 'w-2 bg-gray-300 hover:bg-gray-400 hover:w-4'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Hold Stone & Upcoming List */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* Hold Stone Card */}
            <button
              onClick={() => handleNavigate("/holdstone")}
              style={{ borderColor: "#FAE9D0" }}
              className="bg-white rounded-none p-6 shadow-md border flex-1 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-2  rounded-none">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <span
                  className={`text-lg font-semibold text-gray-900 ${mavenPro.className}`}
                >
                  Hold Stone
                </span>
              </div>
              <div
                className={`text-5xl font-bold text-gray-900 text-center ${mavenPro.className}`}
              >
                {holdCount}
              </div>
            </button>

            {/* Upcoming List Card */}
            <div
              style={{ borderColor: "#FAE9D0" }}
              className="bg-white rounded-none p-6 shadow-md border flex-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4 rounded-none">
                <div className="bg-gray-100 p-2 rounded-none">
                  <List className="w-6 h-6 text-gray-600" />
                </div>
                <span
                  className={`text-lg font-semibold text-gray-900 ${mavenPro.className}`}
                >
                  Upcoming List
                </span>
              </div>
              <div
                className={`text-5xl font-bold text-gray-900 text-center ${mavenPro.className}`}
              >
                {mockStats.upcomingList}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diamond Detail View Modal */}
      {selectedDiamond && (
        <DiamondDetailView
          diamond={selectedDiamond as unknown as DiamondData}
          onClose={() => setSelectedDiamond(null)}
        />
      )}
    </div>
  );
}