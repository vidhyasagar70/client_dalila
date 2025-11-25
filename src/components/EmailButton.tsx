"use client";

import React, { useState } from "react";
import { Mail, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";

interface EmailButtonProps {
  selectedCount?: number;
  selectedStoneNumbers?: string[];
  onEmail?: () => void;
  disabled?: boolean;
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

export default function EmailButton({
  selectedCount = 0,
  selectedStoneNumbers = [],
  onEmail,
  disabled = false,
}: EmailButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleEmailClick = () => {
    if (!disabled && selectedCount > 0) {
      setShowModal(true);
      setEmailStatus({ type: null, message: "" });
    }
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    setEmailStatus({ type: null, message: "" });

    try {
      // Get auth token from cookies
      const authToken =
        getCookie("authToken") || localStorage.getItem("authToken");

      console.log("Auth token exists:", !!authToken);
      console.log("All cookies:", document.cookie);

      if (!authToken) {
        setEmailStatus({
          type: "error",
          message: "Authentication token not found. Please log in again.",
        });
        setIsLoading(false);
        return;
      }

      // Get user email from cookies or localStorage
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

      // Fallback to localStorage
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
        setEmailStatus({
          type: "error",
          message: "User email not found. Please log in again.",
        });
        setIsLoading(false);
        return;
      }

      console.log("Sending email request:", {
        stoneCount: selectedStoneNumbers.length,
        email: userEmail,
        tokenLength: authToken.length,
      });

      // Make API call with proper authorization header
      const response = await fetch(
        "https://dalila-inventory-service-dev.caratlogic.com/api/diamonds/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include", // Important: include cookies in the request
          body: JSON.stringify({
            stoneNumbers: selectedStoneNumbers,
            emails: [userEmail],
          }),
        },
      );

      const data = await response.json();

      console.log("Email API Response:", {
        status: response.status,
        ok: response.ok,
        data: data,
      });

      if (response.ok && data.success) {
        setEmailStatus({
          type: "success",
          message: `Successfully emailed ${data.data.totalEmailed} diamond(s) to ${userEmail}`,
        });

        // Call parent callback if provided
        if (onEmail) {
          onEmail();
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      } else {
        // Handle error responses
        if (response.status === 401) {
          setEmailStatus({
            type: "error",
            message: "Session expired. Please log in again.",
          });
        } else {
          setEmailStatus({
            type: "error",
            message: data.message || data.error || "Failed to send email",
          });
        }
      }
    } catch (error) {
      console.error("Email error:", error);
      setEmailStatus({
        type: "error",
        message: "Failed to send email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleEmailClick}
        disabled={disabled || selectedCount === 0}
        className={`flex items-center justify-center cursor-pointer gap-2 px-3 py-2 text-white text-sm font-medium rounded-none shadow-sm transition-colors ${
          disabled || selectedCount === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#000033] hover:bg-[#000055]"
        }`}
      >
        <Mail className="w-4 h-4" />
        <span>Email Selected</span>
        {selectedCount > 0 && (
          <span className="bg-white text-[#000033] px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center">
            {selectedCount}
          </span>
        )}
      </button>

      {/* Email Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Diamond Details
              </h3>
              <p className="text-sm text-gray-600">
                Send details of {selectedCount} selected diamond
                {selectedCount > 1 ? "s" : ""} to your email?
              </p>
            </div>

            {/* Status Messages */}
            {emailStatus.type && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                  emailStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {emailStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{emailStatus.message}</p>
              </div>
            )}

            {/* Selected Stones Preview */}
            {!emailStatus.type && selectedStoneNumbers.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Selected Stones:
                </p>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {selectedStoneNumbers.slice(0, 10).map((stone, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-neutral-200 text-gray-900 px-2 py-1 rounded border border-gray-300 shadow-sm"
                      style={{
                        // fallback for older browsers or custom themes
                        backgroundColor: '#e5e7eb', // Tailwind's gray-200
                        color: '#111827', // Tailwind's gray-900
                      }}
                    >
                      {stone}
                    </span>
                  ))}
                  {selectedStoneNumbers.length > 10 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{selectedStoneNumbers.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!emailStatus.type && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-[#000033] text-white rounded hover:bg-[#000055] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
