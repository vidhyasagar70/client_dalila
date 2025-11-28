"use client";

import { useState, useEffect, Suspense } from "react";
import {
    Phone,
    Mail,
    MapPin,
    Home,
    Loader2,
    CheckCircle,
    Building2,
    User,
    Globe,
    FileText,
    ArrowLeft,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { userApi } from "@/lib/api";

const playFair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

// Country codes for phone number
const countryCodes = [
    { code: "+1", country: "Canada" },
    { code: "+1", country: "United States" },
    { code: "+7", country: "Kazakhstan" },
    { code: "+7", country: "Russia" },
    { code: "+20", country: "Egypt" },
    { code: "+27", country: "South Africa" },
    { code: "+30", country: "Greece" },
    { code: "+31", country: "Netherlands" },
    { code: "+32", country: "Belgium" },
    { code: "+33", country: "France" },
    { code: "+34", country: "Spain" },
    { code: "+36", country: "Hungary" },
    { code: "+39", country: "Italy" },
    { code: "+40", country: "Romania" },
    { code: "+41", country: "Switzerland" },
    { code: "+43", country: "Austria" },
    { code: "+44", country: "United Kingdom" },
    { code: "+45", country: "Denmark" },
    { code: "+46", country: "Sweden" },
    { code: "+47", country: "Norway" },
    { code: "+47", country: "Svalbard and Jan Mayen" },
    { code: "+48", country: "Poland" },
    { code: "+49", country: "Germany" },
    { code: "+51", country: "Peru" },
    { code: "+52", country: "Mexico" },
    { code: "+53", country: "Cuba" },
    { code: "+54", country: "Argentina" },
    { code: "+55", country: "Brazil" },
    { code: "+56", country: "Chile" },
    { code: "+57", country: "Colombia" },
    { code: "+58", country: "Venezuela" },
    { code: "+60", country: "Malaysia" },
    { code: "+61", country: "Australia" },
    { code: "+61", country: "Christmas Island" },
    { code: "+61", country: "Cocos Islands" },
    { code: "+62", country: "Indonesia" },
    { code: "+63", country: "Philippines" },
    { code: "+64", country: "New Zealand" },
    { code: "+64", country: "Pitcairn" },
    { code: "+65", country: "Singapore" },
    { code: "+66", country: "Thailand" },
    { code: "+81", country: "Japan" },
    { code: "+82", country: "South Korea" },
    { code: "+84", country: "Vietnam" },
    { code: "+86", country: "China" },
    { code: "+90", country: "Turkey" },
    { code: "+91", country: "India" },
    { code: "+92", country: "Pakistan" },
    { code: "+93", country: "Afghanistan" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+95", country: "Myanmar" },
    { code: "+98", country: "Iran" },
    { code: "+211", country: "South Sudan" },
    { code: "+212", country: "Morocco" },
    { code: "+212", country: "Western Sahara" },
    { code: "+213", country: "Algeria" },
    { code: "+216", country: "Tunisia" },
    { code: "+218", country: "Libya" },
    { code: "+220", country: "Gambia" },
    { code: "+221", country: "Senegal" },
    { code: "+222", country: "Mauritania" },
    { code: "+223", country: "Mali" },
    { code: "+224", country: "Guinea" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+227", country: "Niger" },
    { code: "+228", country: "Togo" },
    { code: "+229", country: "Benin" },
    { code: "+230", country: "Mauritius" },
    { code: "+231", country: "Liberia" },
    { code: "+232", country: "Sierra Leone" },
    { code: "+233", country: "Ghana" },
    { code: "+234", country: "Nigeria" },
    { code: "+235", country: "Chad" },
    { code: "+236", country: "Central African Republic" },
    { code: "+237", country: "Cameroon" },
    { code: "+238", country: "Cape Verde" },
    { code: "+239", country: "Sao Tome and Principe" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+241", country: "Gabon" },
    { code: "+242", country: "Republic of the Congo" },
    { code: "+243", country: "Democratic Republic of the Congo" },
    { code: "+244", country: "Angola" },
    { code: "+245", country: "Guinea-Bissau" },
    { code: "+246", country: "British Indian Ocean Territory" },
    { code: "+248", country: "Seychelles" },
    { code: "+249", country: "Sudan" },
    { code: "+250", country: "Rwanda" },
    { code: "+251", country: "Ethiopia" },
    { code: "+252", country: "Somalia" },
    { code: "+253", country: "Djibouti" },
    { code: "+254", country: "Kenya" },
    { code: "+255", country: "Tanzania" },
    { code: "+256", country: "Uganda" },
    { code: "+257", country: "Burundi" },
    { code: "+258", country: "Mozambique" },
    { code: "+260", country: "Zambia" },
    { code: "+261", country: "Madagascar" },
    { code: "+262", country: "Mayotte" },
    { code: "+262", country: "Reunion" },
    { code: "+263", country: "Zimbabwe" },
    { code: "+264", country: "Namibia" },
    { code: "+265", country: "Malawi" },
    { code: "+266", country: "Lesotho" },
    { code: "+268", country: "Swaziland" },
    { code: "+269", country: "Comoros" },
    { code: "+290", country: "Saint Helena" },
    { code: "+291", country: "Eritrea" },
    { code: "+297", country: "Aruba" },
    { code: "+298", country: "Faroe Islands" },
    { code: "+299", country: "Greenland" },
    { code: "+350", country: "Gibraltar" },
    { code: "+351", country: "Portugal" },
    { code: "+352", country: "Luxembourg" },
    { code: "+353", country: "Ireland" },
    { code: "+354", country: "Iceland" },
    { code: "+355", country: "Albania" },
    { code: "+356", country: "Malta" },
    { code: "+357", country: "Cyprus" },
    { code: "+358", country: "Finland" },
    { code: "+359", country: "Bulgaria" },
    { code: "+370", country: "Lithuania" },
    { code: "+371", country: "Latvia" },
    { code: "+372", country: "Estonia" },
    { code: "+373", country: "Moldova" },
    { code: "+374", country: "Armenia" },
    { code: "+375", country: "Belarus" },
    { code: "+376", country: "Andorra" },
    { code: "+377", country: "Monaco" },
    { code: "+378", country: "San Marino" },
    { code: "+379", country: "Vatican" },
    { code: "+380", country: "Ukraine" },
    { code: "+381", country: "Serbia" },
    { code: "+382", country: "Montenegro" },
    { code: "+383", country: "Kosovo" },
    { code: "+385", country: "Croatia" },
    { code: "+386", country: "Slovenia" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+389", country: "Macedonia" },
    { code: "+420", country: "Czech Republic" },
    { code: "+421", country: "Slovakia" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+500", country: "Falkland Islands" },
    { code: "+501", country: "Belize" },
    { code: "+502", country: "Guatemala" },
    { code: "+503", country: "El Salvador" },
    { code: "+504", country: "Honduras" },
    { code: "+505", country: "Nicaragua" },
    { code: "+506", country: "Costa Rica" },
    { code: "+507", country: "Panama" },
    { code: "+508", country: "Saint Pierre and Miquelon" },
    { code: "+509", country: "Haiti" },
    { code: "+590", country: "Saint Barthelemy" },
    { code: "+590", country: "Saint Martin" },
    { code: "+591", country: "Bolivia" },
    { code: "+592", country: "Guyana" },
    { code: "+593", country: "Ecuador" },
    { code: "+595", country: "Paraguay" },
    { code: "+597", country: "Suriname" },
    { code: "+598", country: "Uruguay" },
    { code: "+599", country: "Curacao" },
    { code: "+670", country: "East Timor" },
    { code: "+672", country: "Antarctica" },
    { code: "+673", country: "Brunei" },
    { code: "+674", country: "Nauru" },
    { code: "+675", country: "Papua New Guinea" },
    { code: "+676", country: "Tonga" },
    { code: "+677", country: "Solomon Islands" },
    { code: "+678", country: "Vanuatu" },
    { code: "+679", country: "Fiji" },
    { code: "+680", country: "Palau" },
    { code: "+681", country: "Wallis and Futuna" },
    { code: "+682", country: "Cook Islands" },
    { code: "+683", country: "Niue" },
    { code: "+685", country: "Samoa" },
    { code: "+686", country: "Kiribati" },
    { code: "+687", country: "New Caledonia" },
    { code: "+688", country: "Tuvalu" },
    { code: "+689", country: "French Polynesia" },
    { code: "+690", country: "Tokelau" },
    { code: "+691", country: "Micronesia" },
    { code: "+692", country: "Marshall Islands" },
    { code: "+850", country: "North Korea" },
    { code: "+852", country: "Hong Kong" },
    { code: "+853", country: "Macau" },
    { code: "+855", country: "Cambodia" },
    { code: "+856", country: "Laos" },
    { code: "+880", country: "Bangladesh" },
    { code: "+886", country: "Taiwan" },
    { code: "+960", country: "Maldives" },
    { code: "+961", country: "Lebanon" },
    { code: "+962", country: "Jordan" },
    { code: "+963", country: "Syria" },
    { code: "+964", country: "Iraq" },
    { code: "+965", country: "Kuwait" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+967", country: "Yemen" },
    { code: "+968", country: "Oman" },
    { code: "+970", country: "Palestine" },
    { code: "+971", country: "United Arab Emirates" },
    { code: "+972", country: "Israel" },
    { code: "+974", country: "Qatar" },
    { code: "+975", country: "Bhutan" },
    { code: "+976", country: "Mongolia" },
    { code: "+977", country: "Nepal" },
    { code: "+992", country: "Tajikistan" },
    { code: "+993", country: "Turkmenistan" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+995", country: "Georgia" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+998", country: "Uzbekistan" },
    { code: "+1-242", country: "Bahamas" },
    { code: "+1-246", country: "Barbados" },
    { code: "+1-264", country: "Anguilla" },
    { code: "+1-268", country: "Antigua and Barbuda" },
    { code: "+1-284", country: "British Virgin Islands" },
    { code: "+1-340", country: "U.S. Virgin Islands" },
    { code: "+1-345", country: "Cayman Islands" },
    { code: "+1-441", country: "Bermuda" },
    { code: "+1-473", country: "Grenada" },
    { code: "+1-649", country: "Turks and Caicos Islands" },
    { code: "+1-664", country: "Montserrat" },
    { code: "+1-670", country: "Northern Mariana Islands" },
    { code: "+1-671", country: "Guam" },
    { code: "+1-684", country: "American Samoa" },
    { code: "+1-721", country: "Sint Maarten" },
    { code: "+1-758", country: "Saint Lucia" },
    { code: "+1-767", country: "Dominica" },
    { code: "+1-784", country: "Saint Vincent and the Grenadines" },
    { code: "+1-787", country: "Puerto Rico" },
    { code: "+1-809", country: "Dominican Republic" },
    { code: "+1-868", country: "Trinidad and Tobago" },
    { code: "+1-869", country: "Saint Kitts and Nevis" },
    { code: "+1-876", country: "Jamaica" },
    { code: "+44-1481", country: "Guernsey" },
    { code: "+44-1534", country: "Jersey" },
    { code: "+44-1624", country: "Isle of Man" },
];

// Business types
const businessTypes = [
    "Wholesale",
    "Retail",
    "Manufacturer",
    "Trader",
    "Jeweler",
    "Other",
];

function CustomerDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Personal Information
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("+32");
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    // Address Information
    const [street, setStreet] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [country, setCountry] = useState<string>("");

    // Business Information
    const [companyName, setCompanyName] = useState<string>("");
    const [businessType, setBusinessType] = useState<string>("");
    const [vatNumber, setVatNumber] = useState<string>("");
    const [websiteUrl, setWebsiteUrl] = useState<string>("");

    // UI States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    // CHECK IF USER HAS ALREADY SUBMITTED CUSTOMER DATA
    useEffect(() => {
        const checkCustomerDataStatus = () => {
            if (typeof window === "undefined") {
                setIsCheckingStatus(false);
                return;
            }

            try {
                // Get user from localStorage
                const userString = localStorage.getItem("user");

                if (userString) {
                    const user = JSON.parse(userString);

                    console.log("🔍 Checking customer data status...");
                    console.log("User data:", user);
                    console.log("Customer data exists:", !!user.customerData);
                    console.log("KYC Status:", user.kycStatus);

                    // Check if customer data already exists and is complete
                    if (
                        user.customerData &&
                        user.customerData.firstName &&
                        user.customerData.businessInfo &&
                        user.customerData.address
                    ) {
                        console.log("✅ Customer data already submitted");

                        // Check KYC status
                        if (user.kycStatus === "approved") {
                            console.log(
                                "✅ Already approved - redirecting to home"
                            );
                            setSuccess(
                                "Your account is already approved! Redirecting..."
                            );
                            setTimeout(() => {
                                router.push("/");
                            }, 2000);
                        } else if (user.kycStatus === "pending") {
                            console.log(
                                "⏳ Pending approval - showing message"
                            );
                            setError(
                                "Your customer details are pending approval. Please wait for admin verification."
                            );
                            setTimeout(() => {
                                router.push("/");
                            }, 3000);
                        } else if (user.kycStatus === "rejected") {
                            console.log("❌ Rejected - showing message");
                            setError(
                                "Your application was rejected. Please contact support."
                            );
                            setTimeout(() => {
                                router.push("/");
                            }, 3000);
                        } else {
                            // Has customer data but no KYC status (shouldn't happen, but handle it)
                            console.log(
                                "⚠️ Has customer data but no KYC status"
                            );
                            setSuccess(
                                "Customer details already submitted. Redirecting..."
                            );
                            setTimeout(() => {
                                router.push("/");
                            }, 2000);
                        }
                    } else {
                        console.log(
                            "📝 No customer data yet - allowing access to form"
                        );
                        setIsCheckingStatus(false);
                    }
                } else {
                    console.log(
                        "ℹ️ No user in localStorage - checking for email param"
                    );

                    // If no user but has email param, allow access (coming from OTP verification)
                    const emailParam = searchParams.get("email");
                    if (!emailParam) {
                        console.log(
                            "⚠️ No email param - redirecting to register"
                        );
                        setError("Session expired. Please register again.");
                        setTimeout(() => {
                            router.push("/register");
                        }, 2000);
                    } else {
                        setIsCheckingStatus(false);
                    }
                }
            } catch (error) {
                console.error("Error checking customer data status:", error);
                // Don't block the user on error, let them proceed
                setIsCheckingStatus(false);
            }
        };

        checkCustomerDataStatus();
    }, [router, searchParams]);

    const validateForm = (): boolean => {
        setError("");

        // Personal Information Validation
        if (!firstName.trim()) {
            setError("First name is required");
            return false;
        }

        if (!lastName.trim()) {
            setError("Last name is required");
            return false;
        }

        if (!phoneNumber.trim()) {
            setError("Phone number is required");
            return false;
        }

        // Phone number validation (10-15 digits)
        const phoneRegex = /^\d{8,15}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError("Phone number must be 10-15 digits");
            return false;
        }

        // Address Validation
        if (!street.trim()) {
            setError("Street address is required");
            return false;
        }

        if (!city.trim()) {
            setError("City is required");
            return false;
        }

        if (!state.trim()) {
            setError("State/Province is required");
            return false;
        }

        if (!postalCode.trim()) {
            setError("Postal code is required");
            return false;
        }

        if (!country.trim()) {
            setError("Country is required");
            return false;
        }

        // Business Information Validation
        if (!companyName.trim()) {
            setError("Company name is required");
            return false;
        }

        if (!businessType) {
            setError("Business type is required");
            return false;
        }

        if (!vatNumber.trim()) {
            setError("VAT/Tax number is required");
            return false;
        }

        // Website URL validation (optional, but if provided must be valid)
        if (websiteUrl.trim()) {
            const urlRegex =
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(websiteUrl)) {
                setError("Please enter a valid website URL");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            console.log("🚀 Submitting customer details...");

            // Get email from URL params or sessionStorage
            const urlEmail = searchParams.get("email");
            const storedEmail =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("pendingEmail")
                    : null;
            const userEmail = urlEmail || storedEmail;

            console.log("📧 Email for submission:", userEmail);

            if (!userEmail) {
                setError("Session expired. Please register again.");
                setTimeout(() => router.push("/register"), 2000);
                return;
            }

            // CRITICAL: Match the EXACT API structure
            const customerData = {
                email: userEmail, // Include email to identify the user
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(), // Just the number without country code
                countryCode: countryCode, // Send separately
                address: {
                    street: street.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    postalCode: postalCode.trim(),
                    country: country.trim(),
                },
                businessInfo: {
                    companyName: companyName.trim(),
                    businessType: businessType,
                    vatNumber: vatNumber.trim(),
                    websiteUrl: websiteUrl.trim() || undefined,
                },
            };

            console.log("📤 Payload:", JSON.stringify(customerData, null, 2));

            const response = await userApi.submitCustomerData(customerData);

            if (response && response.success) {
                console.log(
                    "✅ Customer details submitted successfully!",
                    response
                );

                // Clear sessionStorage
                if (typeof window !== "undefined") {
                    sessionStorage.removeItem("pendingEmail");
                }

                setSuccess(
                    "Customer details submitted successfully! Your account is pending approval. You can now login, but full access will be granted after admin approval."
                );

                // Clear form
                setFirstName("");
                setLastName("");
                setPhoneNumber("");
                setStreet("");
                setCity("");
                setState("");
                setPostalCode("");
                setCountry("");
                setCompanyName("");
                setBusinessType("");
                setVatNumber("");
                setWebsiteUrl("");

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setError(
                    response?.message ||
                        "Failed to submit customer details. Please try again."
                );
            }
        } catch (err: unknown) {
            console.error("❌ Submit customer details error:", err);

            if (err instanceof Error) {
                const errorMessage = err.message;

                if (errorMessage.includes("already submitted")) {
                    setError(
                        "Customer details already submitted. Redirecting to login..."
                    );
                    setTimeout(() => router.push("/login"), 2000);
                } else if (
                    errorMessage.includes("unauthorized") ||
                    errorMessage.includes("Unauthorized")
                ) {
                    setError(
                        "Session expired. Please verify your email again."
                    );
                    setTimeout(() => {
                        const emailParam = searchParams.get("email");
                        if (emailParam) {
                            router.push(
                                `/verify-otp?email=${encodeURIComponent(emailParam)}`
                            );
                        } else {
                            router.push("/register");
                        }
                    }, 2000);
                } else if (
                    errorMessage.includes("network") ||
                    errorMessage.includes("fetch")
                ) {
                    setError(
                        "Unable to connect to server. Please check your internet connection."
                    );
                } else {
                    setError(
                        errorMessage || "Failed to submit. Please try again."
                    );
                }
            } else {
                setError(
                    "Unable to connect to server. Please check your internet connection and try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking status
    if (isCheckingStatus) {
        return (
            <div className="relative w-full min-h-screen overflow-hidden bg-black flex items-center justify-center">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/New-Videos/auth-bg.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#d4a018]" />
                    <p className="text-white text-lg">
                        Checking your account status...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-black">
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

            <div className="relative z-10 flex items-center justify-center w-full min-h-screen p-4 py-8">
                <div className="flex w-full max-w-[1200px] min-h-[700px] rounded-xl shadow-2xl border border-gray-800 overflow-hidden flex-col md:flex-row">
                    {/* Left Welcome Panel */}
                    <div
                        className="flex flex-col justify-between text-white px-10 py-10 w-full md:w-[40%] md:min-w-[350px]"
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
                                className={`text-4xl md:text-5xl mb-4 md:mb-6 font-light text-[#d4a018] text-center ${playFair.className}`}
                            >
                                Complete Your Profile
                            </h2>

                            <p className="text-sm md:text-md mt-2 mb-6 font-normal opacity-90 text-center">
                                We need some additional information to set up
                                your account. Please provide your business and
                                contact details below.
                            </p>

                            <div className="bg-white/10 rounded-lg p-4 mb-4">
                                <h3 className="text-lg font-semibold text-[#FFD166] mb-2">
                                    What happens next?
                                </h3>
                                <ul className="text-sm space-y-2 opacity-90">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-[#FFD166] mt-0.5 flex-shrink-0" />
                                        <span>
                                            Your details will be reviewed by our
                                            team
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-[#FFD166] mt-0.5 flex-shrink-0" />
                                        <span>
                                            You&apos;ll receive approval
                                            notification via email
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-[#FFD166] mt-0.5 flex-shrink-0" />
                                        <span>
                                            Once approved, you can start
                                            browsing diamonds
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-4 space-y-2 text-sm opacity-90">
                            <div className="flex items-center justify-center gap-2">
                                <Phone className="text-[#FFD166] w-4 h-4 flex-shrink-0" />

                                <span> +32487939351</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Mail className="text-[#FFD166] w-4 h-4 flex-shrink-0" />
                                <span>business@daliladiamonds.com</span>
                            </div>
                            <div className="flex text-center items-center justify-center gap-2">
                                <MapPin className="text-[#FFD166] w-4 h-4 flex-shrink-0" />
                                <span>
                                    Shreyas D. Gandhi, Hoveniersstraat 30, Box -
                                    105,Suite 326, 2018 Antwerpen, BTW BE:
                                    0736.671.250
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="relative flex-1 flex flex-col justify-center items-center bg-black/20 px-4 py-8 overflow-y-auto max-h-screen">
                        {/* Navigation Buttons */}
                        <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 z-10">
                            <button
                                className="bg-[#101638]/80 rounded-full p-2 shadow-md hover:bg-[#d4a018] transition-all duration-200 hover:scale-110"
                                title="Back to Login"
                                onClick={() => router.push("/login")}
                                type="button"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                                className="bg-[#101638]/80 rounded-full p-2 shadow-md cursor-pointer hover:bg-[#d4a018] transition-all duration-200 hover:scale-110"
                                title="Home"
                                onClick={() => router.push("/")}
                                type="button"
                            >
                                <Home className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="relative z-10 w-full max-w-[500px] mt-12"
                        >
                            <h2
                                className={`text-2xl md:text-3xl font-semibold text-white mb-6 text-center ${playFair.className}`}
                            >
                                Customer Details
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

                            {/* Personal Information Section */}
                            <div className="mb-6">
                                <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#FFD166]" />
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="First Name *"
                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    />

                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="Last Name *"
                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    />
                                </div>

                                <div className="mt-3 flex gap-3">
                                    <select
                                        value={countryCode}
                                        onChange={(e) =>
                                            setCountryCode(e.target.value)
                                        }
                                        disabled={isLoading}
                                        className="w-32 px-3 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {countryCodes.map((item) => (
                                            <option
                                                key={item.code}
                                                value={item.code}
                                            >
                                                {item.code}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="Phone Number (digits only) *"
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        maxLength={15}
                                    />
                                </div>
                            </div>

                            {/* Address Information Section */}
                            <div className="mb-6">
                                <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#FFD166]" />
                                    Address Information
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={street}
                                        onChange={(e) =>
                                            setStreet(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="Street Address *"
                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) =>
                                                setCity(e.target.value)
                                            }
                                            required
                                            disabled={isLoading}
                                            placeholder="City *"
                                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        />

                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) =>
                                                setState(e.target.value)
                                            }
                                            required
                                            disabled={isLoading}
                                            placeholder="State/Province *"
                                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) =>
                                                setPostalCode(e.target.value)
                                            }
                                            required
                                            disabled={isLoading}
                                            placeholder="Postal Code *"
                                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        />

                                        <input
                                            type="text"
                                            value={country}
                                            onChange={(e) =>
                                                setCountry(e.target.value)
                                            }
                                            required
                                            disabled={isLoading}
                                            placeholder="Country *"
                                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Business Information Section */}
                            <div className="mb-6">
                                <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-[#FFD166]" />
                                    Business Information
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) =>
                                            setCompanyName(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="Company Name *"
                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    />

                                    <select
                                        value={businessType}
                                        onChange={(e) =>
                                            setBusinessType(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <option value="">
                                            Select Business Type *
                                        </option>
                                        {businessTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        value={vatNumber}
                                        onChange={(e) =>
                                            setVatNumber(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="VAT/Tax Number (e.g., GSTIN1234567) *"
                                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    />

                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="url"
                                            value={websiteUrl}
                                            onChange={(e) =>
                                                setWebsiteUrl(e.target.value)
                                            }
                                            disabled={isLoading}
                                            placeholder="Website URL (optional)"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-[#FFD166] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD166] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info Text */}
                            <div className="mb-6 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
                                <p className="text-xs text-blue-200 flex items-start gap-2">
                                    <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>
                                        All information will be reviewed by our
                                        team. You&apos;ll receive an email
                                        notification once your account is
                                        approved.
                                    </span>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#d4a018] hover:bg-[#c4a639] text-white cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>SUBMITTING...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>SUBMIT FOR APPROVAL</span>
                                    </>
                                )}
                            </button>

                            {/* Required Fields Notice */}
                            <p className="mt-4 text-center text-xs text-gray-400">
                                * Required fields
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main component with Suspense wrapper
export default function CustomerDetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center w-full h-screen bg-black">
                    <Loader2 className="w-8 h-8 animate-spin text-[#d4a018]" />
                </div>
            }
        >
            <CustomerDetailsContent />
        </Suspense>
    );
}
