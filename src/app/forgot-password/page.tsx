"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Home,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userApi } from "@/lib/api";

const playFair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Step = "email" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending OTP to email:", email);

      const response = await userApi.sendOtp(email);

      if (response && response.success) {
        setSuccess("OTP sent successfully! Please check your email.");
        setCountdown(60);
        setCurrentStep("password");
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      } else {
        setError(response?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Send OTP error:", err);

      if (err instanceof Error) {
        const errorMessage = err.message;

        if (errorMessage.includes("not found")) {
          setError("Email address not found. Please check and try again.");
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("fetch")
        ) {
          setError(
            "Unable to connect to server. Please check your internet connection.",
          );
        } else {
          setError(errorMessage || "Failed to send OTP. Please try again.");
        }
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Update Password with email, newPassword, and OTP
  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Updating password...");

      const response = await userApi.updatePassword({
        email: email,
        newPassword: newPassword,
        otp: otpString,
      });

      if (response && response.success) {
        setSuccess(
          "Password updated successfully! Redirecting to login page...",
        );

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(
          response?.message || "Failed to update password. Please try again.",
        );
      }
    } catch (err: unknown) {
      console.error("Update password error:", err);

      if (err instanceof Error) {
        const errorMessage = err.message;

        if (
          errorMessage.includes("Invalid OTP") ||
          errorMessage.includes("expired")
        ) {
          setError("Invalid or expired OTP. Please request a new OTP.");
        } else {
          setError(
            errorMessage || "Failed to update password. Please try again.",
          );
        }
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await userApi.sendOtp(email);

      if (response && response.success) {
        setSuccess("OTP sent successfully to your email!");
        setCountdown(60);
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(
          response?.message || "Failed to resend OTP. Please try again.",
        );
      }
    } catch (err: unknown) {
      console.error("Resend OTP error:", err);

      if (err instanceof Error) {
        setError(err.message || "Failed to resend OTP. Please try again.");
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{4}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputRefs.current[3]?.focus();
  };

  const handleBackStep = () => {
    setError("");
    setSuccess("");
    setCurrentStep("email");
    setOtp(["", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setCountdown(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/New-Videos/diamond_countdown.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <div className="flex w-full max-w-[1000px] h-auto md:h-[550px] rounded-xl shadow-2xl border border-gray-800 overflow-hidden flex-col md:flex-row">
          {/* Left Panel */}
          <div
            className="flex flex-col justify-between text-white px-10 py-10 w-full md:w-[50%] md:min-w-[350px]"
            style={{
              background:
                "linear-gradient(to right, rgba(4, 8, 37, 0.9) 0%, rgba(4, 8, 37, 0.9) 100%)",
            }}
          >
            <div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative w-[250px] md:w-[300px] h-[80px] md:h-[100px]">
                  <Image
                    src="/dalila_img/Dalila_Logo.png"
                    alt="Dalila Diamonds"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <h1
                className={`text-4xl md:text-6xl font-light mt-2 mb-4 text-[#d4a018] text-center ${playFair.className}`}
              >
                Reset Password
              </h1>

              <p className="text-sm md:text-md mt-2 mb-8 font-normal opacity-90 text-center">
                {currentStep === "email" &&
                  "Enter your email address and we'll send you a verification code to reset your password."}
                {currentStep === "password" &&
                  "Enter the OTP sent to your email and create a new secure password for your account."}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="mt-2 mb-10 md:mb-20">
              <div className="flex justify-center items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep === "email"
                      ? "bg-[#d4a018] border-[#d4a018] text-white"
                      : "bg-transparent border-[#FFD166] text-[#FFD166]"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div
                  className={`w-12 h-0.5 ${currentStep === "password" ? "bg-[#FFD166]" : "bg-gray-600"}`}
                />
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep === "password"
                      ? "bg-[#d4a018] border-[#d4a018] text-white"
                      : "bg-transparent border-gray-600 text-gray-600"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="relative flex-1 flex flex-col justify-center items-center bg-black/20 px-4 py-8 md:py-0">
            <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 z-10">
              {currentStep === "password" && (
                <button
                  className="bg-[#101638]/80 rounded-full p-2 shadow-md hover:bg-[#d4a018] transition-all duration-200 hover:scale-110"
                  title="Back"
                  onClick={handleBackStep}
                  type="button"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <button
                className="bg-[#101638]/80 rounded-full p-2 shadow-md hover:bg-[#d4a018]cursor-pointer transition-all duration-200 hover:scale-110"
                title="Home"
                onClick={() => router.push("/")}
                type="button"
              >
                <Home className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="relative z-10 w-full max-w-[400px]">
              <h2
                className={`text-2xl md:text-3xl font-semibold text-white mb-6 text-center ${playFair.className}`}
              >
                {currentStep === "email" && "Enter Your Email"}
                {currentStep === "password" && "Reset Your Password"}
              </h2>

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-200 text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-sm text-center animate-shake">
                  {error}
                </div>
              )}

              {/* Step 1: Email Form */}
              {currentStep === "email" && (
                <form onSubmit={handleSendOtp}>
                  <div className="mb-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Enter your email address"
                      className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#d4a018] hover:bg-[#c4a639] text-white font-semibold py-3 cursor-pointer rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <span>SEND OTP</span>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Password Reset Form with OTP */}
              {currentStep === "password" && (
                <form onSubmit={handleUpdatePassword}>
                  {/* OTP Input */}
                  <div className="mb-6">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Enter OTP
                    </label>
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          disabled={isLoading}
                          className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-lg bg-white border-2 border-gray-300 focus:border-[#FFD166] text-black focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          autoComplete="off"
                        />
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      {countdown > 0 ? (
                        <p className="text-xs text-gray-400">
                          Resend code in{" "}
                          <span className="text-[#FFD166] font-semibold">
                            {countdown}s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResending}
                          className="text-xs text-[#FFD166] hover:text-yellow-400 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <span>Resend OTP</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="mb-4 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="New Password (min 8 characters)"
                      className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Confirm New Password"
                      className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#d4a018] hover:bg-[#c4a639] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>UPDATING...</span>
                      </>
                    ) : (
                      <span>UPDATE PASSWORD</span>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center text-xs text-white">
                Remember your password?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                  className="text-[#FFD166] font-semibold hover:text-yellow-400 hover:underline cursor-pointer transition-colors"
                >
                  Login Here
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
