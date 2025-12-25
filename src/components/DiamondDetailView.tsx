"use client";
import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  X,
  Clock,
  MessageCircle,
  Download,
  ImageIcon,
  Video,
  Hand,
  FileText,
  Grip,
  ShoppingCart,
} from "lucide-react";
import type { DiamondData } from "@/types/Diamondtable";
import { cartApi, holdApi, queryApi } from "@/lib/api";
import { Maven_Pro } from "next/font/google";
import toast from "react-hot-toast";
import { Marcellus, Jost } from "next/font/google";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface DiamondDetailViewProps {
  diamond: DiamondData;
  onClose: () => void;
}

const DiamondDetailView: React.FC<DiamondDetailViewProps> = ({
  diamond,
  onClose,
}) => {
  const [selectedImage] = useState<string>(diamond.REAL_IMAGE || "");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToHold, setIsAddingToHold] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryText, setEnquiryText] = useState("");
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedMediaTab, setSelectedMediaTab] = useState<'image' | 'video' | 'hand' | 'tweezer' | 'certificate'>('image');

  // Check user role on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      let userStr = localStorage.getItem("user");

      // Fallback to cookies if not in localStorage
      if (!userStr) {
        const cookies = document.cookie.split(";");
        const userCookie = cookies.find((c) => c.trim().startsWith("user="));
        if (userCookie) {
          try {
            userStr = decodeURIComponent(userCookie.split("=")[1].trim());
          } catch (e) {
            console.error("Error decoding user cookie:", e);
          }
        }
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserRole(user.role || null);
        } catch (e) {
          console.error("Error parsing user data:", e);
          setUserRole(null);
        }
      }
    }
  }, []);

  const videoUrl = (diamond as DiamondData & { MP4?: string }).MP4 || "";
  const handVideoUrl = (diamond as DiamondData & { HandVideo?: string }).HandVideo || "";
  const tweezerVideoUrl = (diamond as DiamondData & { TweezerVideo?: string }).TweezerVideo || "";
  const certPdfUrl = diamond.CERTI_PDF || "";

  const formatCurrency = (value: string | number) => {
    const num = parseFloat(String(value));
    return isNaN(num)
      ? "N/A"
      : `$${num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);

      const response = await cartApi.add(diamond.STONE_NO);

      if (response?.success) {
        toast.success(
          response?.message ||
            `${diamond.STONE_NO} added to cart successfully!`,
        );

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cart-updated"));
        }
      } else {
        toast.error(response?.message || "Failed to add to cart");
      }
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);

      let errorMessage = "Failed to add to cart. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const err = error as {
          response?: {
            status?: number;
            data?: { error?: string; message?: string };
          };
          message?: string;
        };
        if (err.response?.status === 401) {
          errorMessage = "Please log in to add items to cart.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToHold = async () => {
    try {
      setIsAddingToHold(true);

      const response = await holdApi.add(diamond.STONE_NO);

      if (response?.success) {
        toast.success(
          response?.message ||
            `${diamond.STONE_NO} added to hold successfully!`,
        );
      } else {
        toast.error(response?.message || "Failed to add to hold");
      }
    } catch (error: unknown) {
      console.error("Error adding to hold:", error);

      let errorMessage = "Failed to add to hold. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const err = error as {
          response?: {
            status?: number;
            data?: {
              error?: string;
              message?: string;
              success?: boolean;
            };
          };
          message?: string;
        };

        if (err.response?.status === 401) {
          errorMessage = "Please log in to add items to hold.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsAddingToHold(false);
    }
  };

  const handleEnquirySubmit = async () => {
    if (!enquiryText.trim()) {
      toast.error("Please enter your query");
      return;
    }

    try {
      setIsSubmittingEnquiry(true);

      const response = await queryApi.create({
        stoneNo: diamond.STONE_NO,
        query: enquiryText.trim(),
      });

      if (response?.success) {
        toast.success("Query submitted successfully!");
        setEnquiryText("");
        setIsEnquiryOpen(false);
      } else {
        toast.error(response?.message || "Failed to submit query");
      }
    } catch (error: unknown) {
      console.error("Error submitting query:", error);

      let errorMessage = "Failed to submit query. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const err = error as {
          response?: { status?: number; data?: { error?: string } };
          message?: string;
        };
        if (err.response?.status === 401) {
          errorMessage = "Please log in to submit queries.";
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const InfoItem = ({
    label,
    value,
    description,
  }: {
    label: string;
    value: string;
    description: string;
  }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-gray-600">
        <span className={`text-sm font-medium ${marcellus.className}`}>{label}</span>
      </div>
      <p className={`text-lg font-semibold text-gray-900 ${marcellus.className}`}>{value}</p>
      {description && (
        <p className={`text-xs text-gray-500 ${marcellus.className}`}>{description}</p>
      )}
    </div>
  );

  const DetailTable = ({
    title,
    data,
    certiPdfUrl,
  }: {
    title: string;
    data: [string, string | number][];
    certiPdfUrl?: string;
  }) => (
    <div className="bg-white overflow-hidden border border-[#e9e2c6] h-fit">
      <div className="bg-[#050C3A] text-white px-4 py-3">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div>
        {data.map(([key, value], idx) => (
          <div
            key={idx}
            className="grid grid-cols-2 hover:bg-gray-50"
            style={{
              borderBottom:
                idx < data.length - 1 ? "1px solid #e9e2c6" : "none",
            }}
          >
            <div className="px-4 py-2.5 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">{key}</p>
            </div>
            <div className="px-4 py-2.5 bg-white">
              {key === "Report No" && certiPdfUrl && value && value !== "N/A" ? (
                <a
                  href={certiPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 text-sm"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm text-gray-900">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmptyMediaPlaceholder = ({ message }: { message: string }) => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center" style={{ overflow: 'hidden' }}>
      <span className="text-sm text-gray-400">{message}</span>
    </div>
  );

  // Helper to check if a URL is a direct video file
  const isDirectVideoUrl = (url: string) => {
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
  };

  // Helper to check if a URL is a viewer link (e.g., diamondview.aspx)
  const isViewerLink = (url: string) => {
    return /diamondview\.aspx/i.test(url);
  };

  const renderMediaContent = () => {
    switch(selectedMediaTab) {
      case 'image':
        if (!selectedImage) {
          return <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}><EmptyMediaPlaceholder message="No Image Available" /></div>;
        }
        return (
          <div className="bg-gray-50" style={{ overflow: 'hidden', padding: '8px' }}>
            <div className="relative" style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
              <Image
                src={selectedImage}
                alt={diamond.STONE_NO}
                fill
                style={{ objectFit: "contain" }}
                priority
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        );

      case 'video': {
        if (!videoUrl) {
          return <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}><EmptyMediaPlaceholder message="No Video Available" /></div>;
        }
        if (isDirectVideoUrl(videoUrl)) {
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(videoUrl, '_blank');
                  }}
                  className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 hover:bg-white shadow cursor-pointer"
                  title="Download Video"
                >
                  <Download className="w-5 h-5 text-[#050C3A]" />
                </button>
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          );
        } else if (isViewerLink(videoUrl)) {
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
                <iframe
                  src={videoUrl}
                  title="Diamond Video Viewer"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  scrolling="no"
                  style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          );
        } else {
          // fallback: try iframe for any other non-direct video link
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
                <iframe
                  src={videoUrl}
                  title="Diamond Video"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  scrolling="no"
                  style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          );
        }
      }

      case 'hand': {
        if (!handVideoUrl) {
          return <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}><EmptyMediaPlaceholder message="No Hand Video Available" /></div>;
        }
        if (isDirectVideoUrl(handVideoUrl)) {
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(handVideoUrl, '_blank');
                  }}
                  className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 hover:bg-white shadow cursor-pointer"
                  title="Download Hand Video"
                >
                  <Download className="w-5 h-5 text-[#050C3A]" />
                </button>
                <video
                  src={handVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          );
        } else if (isViewerLink(handVideoUrl)) {
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
                <iframe
                  src={handVideoUrl}
                  title="Hand Video Viewer"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  scrolling="no"
                  style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          );
        } else {
          // fallback: try iframe for any other non-direct video link
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
                <iframe
                  src={handVideoUrl}
                  title="Hand Video"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  scrolling="no"
                  style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          );
        }
      }

      case 'tweezer': {
        if (!tweezerVideoUrl) {
          return <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}><EmptyMediaPlaceholder message="No Tweezer Video Available" /></div>;
        }
        if (isDirectVideoUrl(tweezerVideoUrl)) {
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(tweezerVideoUrl, '_blank');
                  }}
                  className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 hover:bg-white shadow cursor-pointer"
                  title="Download Tweezer Video"
                >
                  <Download className="w-5 h-5 text-[#050C3A]" />
                </button>
                <video
                  src={tweezerVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          );
        } else if (isViewerLink(tweezerVideoUrl)) {
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
                <iframe
                  src={tweezerVideoUrl}
                  title="Tweezer Video Viewer"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  scrolling="no"
                  style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          );
        } else {
          // fallback: try iframe for any other non-direct video link
          return (
            <div
              className="bg-gray-50"
              style={{ overflow: 'hidden', padding: '8px' }}
            >
              <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
                <iframe
                  src={tweezerVideoUrl}
                  title="Tweezer Video"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  scrolling="no"
                  style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          );
        }
      }

      case 'certificate':
        if (!certPdfUrl) {
          return <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}><EmptyMediaPlaceholder message="No Certificate Available" /></div>;
        }
        return (
          <div className="bg-gray-50" style={{ overflow: 'hidden', padding: '8px' }}>
            <div style={{ width: '380px', height: '380px', maxWidth: '100%', overflow: 'hidden' }}>
              <iframe
                src={certPdfUrl}
                className="w-full h-full"
                title="Certificate PDF"
                loading="lazy"
                scrolling="no"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        );

      default:
        return <EmptyMediaPlaceholder message="Select a media type" />;
    }
  };

  return (

    <div
      className={`fixed left-0 right-0 bottom-0 top-[88px] w-full flex items-center justify-center z-40 bg-black/50 ${mavenPro.variable} ${marcellus.variable} ${jost.variable}`}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl w-full h-full overflow-y-auto font-maven-pro"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Single Container with Fixed Width */}
        <div className="mx-auto border border-[#C89E3A] mt-8 mb-[100px]" style={{ minWidth: '1200px', maxWidth: '1400px', width: '100%' }}>
          {/* Top Navigation Bar: Back Button + Media Tabs */}
          <div className="flex items-center gap-2 px-4 py-2 border-t border-b border-[#C89E3A] bg-white sticky top-0 z-30" style={{minHeight:'48px'}}>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white transition-colors rounded px-3 py-1 font-medium bg-[#050C3A] hover:bg-[#030822] text-xs"
              style={{height:'32px'}}
            >
              <ArrowLeft size={16} />
              <span>BACK</span>
            </button>
            <div className="flex flex-1 gap-1 ml-1">
              <button
                onClick={() => setSelectedMediaTab('image')}
                className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 border-b transition-colors ${
                  selectedMediaTab === 'image'
                    ? 'border-[#050C3A] text-[#050C3A] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{height:'32px'}}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Image</span>
              </button>
              <button
                onClick={() => setSelectedMediaTab('video')}
                className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 border-b transition-colors ${
                  selectedMediaTab === 'video'
                    ? 'border-[#050C3A] text-[#050C3A] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{height:'32px'}}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
              <button
                onClick={() => setSelectedMediaTab('hand')}
                className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 border-b transition-colors ${
                  selectedMediaTab === 'hand'
                    ? 'border-[#050C3A] text-[#050C3A] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{height:'32px'}}
              >
                <Hand className="w-4 h-4" />
                <span>Hand</span>
              </button>
              <button
                onClick={() => setSelectedMediaTab('tweezer')}
                className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 border-b transition-colors ${
                  selectedMediaTab === 'tweezer'
                    ? 'border-[#050C3A] text-[#050C3A] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{height:'32px'}}
              >
                <Grip className="w-4 h-4" />
                <span>Tweezer</span>
              </button>
              <button
                onClick={() => setSelectedMediaTab('certificate')}
                className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 border-b transition-colors ${
                  selectedMediaTab === 'certificate'
                    ? 'border-[#050C3A] text-[#050C3A] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{height:'32px'}}
              >
                <FileText className="w-4 h-4" />
                <span>Certificate</span>
              </button>
            </div>
          </div>

          {/* Content Area: Media + Details Side by Side */}
          <div className="p-4">
            <div className="flex gap-4">
              {/* Left Column: Media Display */}
              <div className="flex-shrink-0" style={{ width: '396px' }}>
                {/* Media Container */}
                <div className="mb-4">
                  {renderMediaContent()}
                </div>

                {/* Additional Information Section */}
                <div className="bg-white border border-[#C89E3A] overflow-hidden">
                  <div className="bg-[#050C3A] text-white px-4 py-3">
                    <h3 className="font-semibold text-sm">Additional Information</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-[#C89E3A] pb-2">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-semibold text-gray-900">{diamond.LOCATION || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#C89E3A] pb-2">
                      <span className="text-sm text-gray-600">Shade</span>
                      <span className="text-sm font-semibold text-gray-900">{(diamond as DiamondData & { SHADE?: string }).SHADE || 'NONE'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#C89E3A] pb-2">
                      <span className="text-sm text-gray-600">Culet</span>
                      <span className="text-sm font-semibold text-gray-900">{(diamond as DiamondData & { CULET?: string }).CULET || 'NONE'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Girdle</span>
                      <span className="text-sm font-semibold text-gray-900">{(diamond as DiamondData & { GIRDLE?: string }).GIRDLE || 'Med'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Details Section */}
              <div className="flex-1 pl-4" style={{ minWidth: '700px', borderLeft: '1px solid #C89E3A' }}>
                {/* Title Badge and Description */}
                <div className="flex items-start justify-between mb-3">
                  <h1 className={`text-2xl font-bold text-gray-900 ${marcellus.className}`}>
                    {diamond.SHAPE} {diamond.CARATS}ct {diamond.COLOR} {diamond.CLARITY} {diamond.CUT} {diamond.POL} {diamond.SYM} {diamond.TINGE}
                  </h1>
                  
                </div>

                {/* Stock ID, Report, Lab */}
                <div className="text-sm text-gray-600 mb-4">
                  Stock ID: <span className="font-semibold text-gray-900">{diamond.STONE_NO}</span>
                  {' • '}
                  Report #: <span className="font-semibold text-gray-900">{diamond.REPORT_NO}</span>
                  {' • '}
                  Lab: <span className="font-semibold text-gray-900">{diamond.LAB}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-[#C89E3A] mb-4" />

                {/* Total Price */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Total Price</div>
                  <div className={`text-4xl font-bold text-gray-900 ${marcellus.className}`}>
                    {formatCurrency(diamond.NET_VALUE)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Rap Price: {formatCurrency(diamond.RAP_PRICE)} | Disc %: {diamond.DISC_PER ? `${Math.abs(Number(diamond.DISC_PER)).toFixed(2)}%` : 'N/A'}
                  </div>
                </div>

                {/* Add to Cart, Hold, and Enquiry Buttons */}
                {userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 text-white py-3 rounded font-semibold transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#050C3A' }}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAddToHold}
                    disabled={isAddingToHold}
                    className="flex-1 text-white py-3 rounded font-semibold transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#050C3A' }}
                  >
                    {isAddingToHold ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Holding...
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Hold
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="flex-1 text-white py-3 rounded font-semibold transition-colors text-sm flex items-center justify-center gap-2"
                    style={{ background: '#050C3A' }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enquiry
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-[#C89E3A] mb-4" />

              {/* Diamond Specifications */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Diamond Specifications</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Shape</div>
                    <div className="font-bold text-gray-900">{diamond.SHAPE}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Carat</div>
                    <div className="font-bold text-gray-900">{diamond.CARATS} ct</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Color</div>
                    <div className="font-bold text-gray-900">{diamond.COLOR}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Clarity</div>
                    <div className="font-bold text-gray-900">{diamond.CLARITY}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Cut</div>
                    <div className="font-bold text-gray-900">{diamond.CUT}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Polish</div>
                    <div className="font-bold text-gray-900">{diamond.POL}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Symmetry</div>
                    <div className="font-bold text-gray-900">{diamond.SYM}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Fluorescence</div>
                    <div className="font-bold text-gray-900">{diamond.FLOUR}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Ratio</div>
                    <div className="font-bold text-gray-900">{diamond.MEASUREMENTS ? (parseFloat(diamond.MEASUREMENTS.split('-')[0]) / parseFloat(diamond.MEASUREMENTS.split('-')[1]?.split('*')[0])).toFixed(2) : '0.99'}</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#C89E3A] mb-4" />

              {/* Measurements */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Measurements</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Length</div>
                    <div className="font-bold text-gray-900">{diamond.MEASUREMENTS?.split('-')[0]} mm</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Width</div>
                    <div className="font-bold text-gray-900">{diamond.MEASUREMENTS?.split('-')[1]?.split('*')[0]} mm</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Depth</div>
                    <div className="font-bold text-gray-900">{diamond.MEASUREMENTS?.split('*')[1]} mm</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Crown Angle</div>
                    <div className="font-bold text-gray-900">{diamond.CROWN_ANGLE}°</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Crown Height</div>
                    <div className="font-bold text-gray-900">{diamond.CROWN_HEIGHT}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Pavilion Angle</div>
                    <div className="font-bold text-gray-900">{diamond.PAVILLION_ANGLE}°</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Table</div>
                    <div className="font-bold text-gray-900">{diamond.TABLE_PER}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Depth %</div>
                    <div className="font-bold text-gray-900">{diamond.DEPTH_PER}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Pavilion Height</div>
                    <div className="font-bold text-gray-900">{diamond.PAVILLION_HEIGHT}%</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#C89E3A] mb-4" />

              {/* Inclusion Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Inclusion Details</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Crown White</div>
                    <div className="font-bold text-gray-900">{diamond.CW || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Center Natts</div>
                    <div className="font-bold text-gray-900">{diamond.CN || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Comments</div>
                    <div className="font-bold text-gray-900">{diamond.COMMENTS_1 || 'N/A'}</div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>

         
        </div>
         {/* Footer */}
          <Footer  />
      </div>

      {/* Enquiry Modal */}
      {isEnquiryOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEnquiryOpen(false)}
        >
          <div
            className="bg-white rounded-none shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#050C3A] text-white px-6 py-4 rounded-none flex items-center justify-between">
              <h3 className="text-lg font-semibold">Submit Enquiry</h3>
              <button
                onClick={() => setIsEnquiryOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stone Number
                </label>
                <input
                  type="text"
                  value={diamond.STONE_NO}
                  disabled
                  className="w-full px-3 py-2 border border-[#C89E3A] rounded-none bg-gray-50 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Query <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={enquiryText}
                  onChange={(e) => setEnquiryText(e.target.value)}
                  placeholder="Enter your query here..."
                  rows={5}
                  className="w-full px-3 py-2 border border-[#C89E3A] rounded-none focus:outline-none focus:ring-2 focus:ring-[#050C3A] resize-none bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-none flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsEnquiryOpen(false);
                  setEnquiryText("");
                }}
                className="px-4 py-2 border border-[#C89E3A] rounded-none text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnquirySubmit}
                disabled={isSubmittingEnquiry || !enquiryText.trim()}
                className="px-4 py-2 bg-[#050C3A] text-white cursor-pointer rounded-none hover:bg-[#030822] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingEnquiry ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Query"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiamondDetailView;