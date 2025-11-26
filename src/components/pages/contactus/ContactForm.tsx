"use client";
import { useState, ChangeEvent } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Marcellus, Jost } from "next/font/google";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
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

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const goldColor = "#B58900";
    const goldGradient = "linear-gradient(to right, #B58900 0%, #B58900 100%)";

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
        alert("Message sent successfully!");
    };

    return (
        <div className="bg-gray-50">
            {/* Contact Form Section */}
            <section className="pt-16 pb-16 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <AnimatedContainer direction="left">
                            <div className="bg-white rounded-none p-8 lg:p-12">
                                <h2
                                    className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-2 ${
                                        marcellus.className
                                    }`}
                                >
                                    Get in Touch
                                </h2>
                                <div
                                    className="w-20 h-1 mb-8"
                                    style={{ background: goldGradient }}
                                ></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column - Form Fields */}
                                    <div className="space-y-6">
                                        <div>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-none focus:outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                                                onFocus={(e) =>
                                                    (e.target.style.borderColor =
                                                        goldColor)
                                                }
                                                onBlur={(e) =>
                                                    (e.target.style.borderColor =
                                                        "#d1d5db")
                                                }
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-none focus:outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                                                onFocus={(e) =>
                                                    (e.target.style.borderColor =
                                                        goldColor)
                                                }
                                                onBlur={(e) =>
                                                    (e.target.style.borderColor =
                                                        "#d1d5db")
                                                }
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Your Phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-none focus:outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                                                onFocus={(e) =>
                                                    (e.target.style.borderColor =
                                                        goldColor)
                                                }
                                                onBlur={(e) =>
                                                    (e.target.style.borderColor =
                                                        "#d1d5db")
                                                }
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-center items-center h-full ml-10">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="px-10 py-3 text-white font-semibold transition-all duration-300 rounded-none uppercase cursor-pointer tracking-wide text-sm"
                                                    style={{
                                                        background:
                                                            goldGradient,
                                                        boxShadow:
                                                            "0 2px 4px rgba(181, 137, 0, 0.2)",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            "linear-gradient(to right, #9d7400 0%, #9d7400 100%)";
                                                        e.currentTarget.style.boxShadow =
                                                            "0 4px 8px rgba(181, 137, 0, 0.3)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            goldGradient;
                                                        e.currentTarget.style.boxShadow =
                                                            "0 2px 4px rgba(181, 137, 0, 0.2)";
                                                    }}
                                                >
                                                    Send Message
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Message Field */}
                                    <div>
                                        <textarea
                                            name="message"
                                            placeholder="Your Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={7}
                                            className="w-full  px-4 py-3 bg-white border border-gray-300 rounded-none focus:outline-none transition-colors resize-none text-gray-700 placeholder:text-gray-400"
                                            onFocus={(e) =>
                                                (e.target.style.borderColor =
                                                    goldColor)
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor =
                                                    "#d1d5db")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </AnimatedContainer>

                        {/* Right Column - Contact Information */}
                        <AnimatedContainer direction="right">
                            <div className="bg-white rounded-none p-8 lg:p-12 shadow-sm">
                                <h2
                                    className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-8 ${marcellus.className}`}
                                >
                                    Contact Information
                                </h2>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex-shrink-0 w-10 h-10 rounded-none flex items-center justify-center"
                                            style={{ background: goldGradient }}
                                        >
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-gray-900 font-semibold text-base mb-1 ${jost.className}`}
                                            >
                                                Dalila Diamonds
                                            </p>
                                            <p
                                                className={`text-gray-600 text-base ${jost.className}`}
                                            >
                                                Shreyas D. Gandhi
                                            </p>
                                            <p
                                                className={`text-gray-600 text-base ${jost.className}`}
                                            >
                                                Hoveniersstraat 30, Box - 105
                                            </p>
                                            <p
                                                className={`text-gray-600 text-base ${jost.className}`}
                                            >
                                                Suite 326, 2018 Antwerpen
                                            </p>
                                            <p
                                                className={`text-gray-600 text-base mt-2 ${jost.className}`}
                                            >
                                                BTW BE: 0736.671.250
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex-shrink-0 w-10 h-10 rounded-none flex items-center justify-center"
                                            style={{ background: goldGradient }}
                                        >
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-gray-600 text-base ${jost.className}`}
                                            >
                                                +32487939351
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex-shrink-0 w-10 h-10 rounded-none flex items-center justify-center"
                                            style={{ background: goldGradient }}
                                        >
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-gray-600 text-base ${jost.className}`}
                                            >
                                                business@daliladiamonds.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex-shrink-0 w-10 h-10 rounded-none flex items-center justify-center"
                                            style={{ background: goldGradient }}
                                        >
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-gray-600 text-base ${jost.className}`}
                                            >
                                                Mon - Fri: 9:00 AM - 5:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContainer>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="px-4 pb-16">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-white rounded-none shadow-sm overflow-hidden">
                        <div className="relative h-96 bg-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2499.2772864045445!2d4.411851776909697!3d51.21893463306524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f70762e5678b%3A0x5d9b8c8b5e8b8b8b!2sHoveninersstraat%2030%2C%202018%20Antwerpen%2C%20Belgium!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className="absolute inset-0"
                                title="Dalila Diamonds Location - Antwerp, Belgium"
                            />
                            <a
                                href="https://www.google.com/maps/place/Hoveninersstraat+30,+2018+Antwerpen,+Belgium"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-4 left-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded shadow-md hover:bg-gray-50 transition-colors"
                            >
                                View larger map
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
