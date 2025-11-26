"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Diamond Knowledge", href: "/diamondKnowledge" },
        { name: "Contact", href: "/contact" },
    ];

    const serviceLinks = [
        { name: "S2S - Secure To Source", href: "/secure-to-source" },
        { name: "DS4U - Diamond Source For You", href: "/diamond-source" },
        { name: "SYD - Sell Your Diamonds", href: "/sud" },
    ];

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    return (
        <footer className="bg-[#0a0e27] text-white">
            {/* Main Footer Content */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Logo Column */}
                        <div>
                            <div className="mb-6">
                                <Image
                                    src="/dalila_img/Dalila_Logo.png"
                                    alt="Dalila Diamonds Logo"
                                    width={160}
                                    height={64}
                                    className="h-16 w-auto object-contain"
                                    priority
                                />
                            </div>
                            <div>
                                <a
                                    href="https://www.instagram.com/p/DO56RDlDKde/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-white/70 hover:text-[#c89e3a] transition-colors"
                                >
                                    <FaInstagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Address Column */}
                        <div>
                            <h4 className="text-lg font-medium mb-6">
                                Address
                            </h4>
                            <div className="text-white/70 space-y-2">
                                <p className="font-medium text-white">
                                    Dalila Diamonds
                                </p>
                                <p>Shreyas D. Gandhi</p>
                                <p>Hoveniersstraat 30, Box - 105</p>
                                <p>Suite 326, 2018 Antwerpen</p>
                                <p className="mt-3">BTW BE: 0736.671.250</p>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h4 className="text-lg font-medium mb-6">
                                Quick Links
                            </h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() =>
                                                handleNavigation(link.href)
                                            }
                                            className="text-white/70 hover:text-[#c89e3a] transition-colors text-left cursor-pointer"
                                        >
                                            {link.name}
                                        </button>
                                    </li>
                                ))}

                                {/* Our Services Dropdown */}
                                <li className="relative">
                                    <button
                                        onClick={() =>
                                            setIsServicesOpen(!isServicesOpen)
                                        }
                                        className="text-white/70 hover:text-[#c89e3a] transition-colors flex items-center gap-2 cursor-pointer"
                                    >
                                        Our Services
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {isServicesOpen && (
                                        <ul className="mt-2 ml-4 space-y-2">
                                            {serviceLinks.map((service) => (
                                                <li key={service.name}>
                                                    <button
                                                        onClick={() =>
                                                            handleNavigation(
                                                                service.href
                                                            )
                                                        }
                                                        className="text-white/60 hover:text-[#c89e3a] transition-colors text-sm text-left cursor-pointer"
                                                    >
                                                        {service.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>

                        {/* Contact Us Column */}
                        <div>
                            <h4 className="text-lg font-medium mb-6">
                                Contact Us
                            </h4>
                            <div className="space-y-3 text-white/70">
                                <p>+32487939351</p>
                                <p>business@daliladiamonds.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="py-6">
                <div className="container mx-auto px-6">
                    <p className="text-center text-white/60 text-sm">
                        Copyright 2025 - Dalila | All Rights Reserved | Powered
                        by Keval Ai
                    </p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="fixed bottom-5 right-5 w-12 h-12 bg-[#c89e3a] hover:bg-[#b08d33] rounded flex items-center justify-center shadow-lg transition-colors group"
                        aria-label="Scroll to top"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <ChevronUp className="w-6 h-6 text-white group-hover:text-white/90 transition-colors" />
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
}
