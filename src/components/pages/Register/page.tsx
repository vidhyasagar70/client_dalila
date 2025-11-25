"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Home,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userApi } from "@/lib/api";

const playFair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RegisterPage() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const validateForm = (): boolean => {
    // Reset error
    setError("");

    // Check all fields are filled
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }

    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }

    if (!username.trim()) {
      setError("Username is required");
      return false;
    }

    // Username validation (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError(
        "Username must be 3-20 characters (letters, numbers, underscore only)",
      );
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password strength validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Initiating registration...");

      // Call the register API
      const response = await userApi.register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (response && response.success) {
        console.log("Registration successful!", response);

        setSuccess(
          "Registration successful! Redirecting to verify your email...",
        );

        // Navigate to OTP verification page after 1.5 seconds
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
        }, 1500);
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);

      if (err instanceof Error) {
        const errorMessage = err.message;

        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("already registered")
        ) {
          setError("This email is already registered. Please login instead.");
        } else if (errorMessage.includes("invalid email")) {
          setError("Please enter a valid email address.");
        } else if (errorMessage.includes("password")) {
          setError(
            "Password does not meet requirements. Must be at least 8 characters.",
          );
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("fetch")
        ) {
          setError(
            "Unable to connect to server. Please check your internet connection.",
          );
        } else {
          setError(errorMessage || "Registration failed. Please try again.");
        }
      } else {
        setError(
          "Unable to connect to server. Please check your internet connection and try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/New-Videos/diamond_countdown.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <div className="flex w-full max-w-[1100px] h-auto md:h-[600px] rounded-xl shadow-2xl border border-gray-800 overflow-hidden flex-col md:flex-row">
          {/* Left Welcome Panel */}
          <div
            className="flex flex-col justify-between text-white px-10 py-10 w-full md:w-[50%] md:min-w-[350px]"
            style={{
              background:
                "linear-gradient(to right, rgba(4, 8, 37, 0.9) 0%, rgba(4, 8, 37, 0.9) 100%)",
            }}
          >
            <div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-3 mb-2 mt-5">
                  <div className="relative w-[250px] md:w-[300px] h-[80px] md:h-[100px]">
                    <Image
                      src="/dalila_img/Dalila_Logo.png"
                      alt="Dalila Diamonds"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <h2
                className={`text-4xl md:text-6xl mb-4 md:mb-7 font-light text-[#d4a018] text-center ${playFair.className}`}
              >
                Join the Dalila Family
              </h2>

              <p className="text-sm md:text-md mt-2 mb-8 font-normal opacity-90 text-center">
                Experience timeless diamond jewelry crafted with passion,
                precision, and trust. Begin your journey with Dalila today.
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-2 mb-10 md:mb-20 space-y-2 text-sm opacity-90">
              <div className="flex items-center justify-center gap-2">
                <Phone className="text-[#FFD166] w-4 h-4 flex-shrink-0" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="text-[#FFD166] w-4 h-4 flex-shrink-0" />
                <span>contact@dalila.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="text-[#FFD166] w-4 h-4 flex-shrink-0" />
                <span>123 Diamond Street, XYZ City</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="relative flex-1 flex flex-col justify-center items-center bg-black/20 px-4 py-8 md:py-0">
            {/* Home Button */}
            <button
              className="absolute top-4 md:top-6 right-4 md:right-6 bg-[#101638]/80 rounded-full p-2 shadow-md z-50 hover:bg-[#d4a018] transition-all duration-200 hover:scale-110 cursor-pointer"
              title="Home"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/");
              }}
              type="button"
            >
              <Home className="w-5 h-5 text-white" />
            </button>

            {/* Registration Form */}
            <form
              onSubmit={handleRegister}
              className="relative z-10 w-full max-w-[400px] md:max-w-[550px]"
            >
              <h2
                className={`text-2xl md:text-3xl font-semibold text-white mb-6 text-center ${playFair.className}`}
              >
                Create an Account
              </h2>

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-200 text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-sm text-center animate-shake">
                  {error}
                </div>
              )}

              {/* First Name */}
              <div className="mb-4">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="First Name"
                  className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="given-name"
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Last Name"
                  className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="family-name"
                />
              </div>

              {/* Username */}
              <div className="mb-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Username"
                  className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="username"
                  minLength={3}
                  maxLength={20}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Email Address"
                  className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Password (min 8 characters)"
                  className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="mb-5 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Confirm Password"
                  className="w-full px-5 py-3 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                  title={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#d4a018] hover:bg-[#c4a639] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>REGISTERING...</span>
                  </>
                ) : (
                  <span>REGISTER</span>
                )}
              </button>

              {/* Login Link */}
              <div className="mt-6 text-center text-xs text-white">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                  className="text-[#FFD166] font-semibold hover:text-yellow-400 hover:underline transition-colors"
                >
                  Login Here
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
