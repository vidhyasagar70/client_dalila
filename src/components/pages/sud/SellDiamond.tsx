"use client";

import Image from "next/image";
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

export default function SellDiamondsProcess() {
    const steps = [
        {
            number: "1",
            title: "Complete the Form",
            heading: "Begin with a Simple Step",
            description:
                "Share a few details in our online form about your diamond or jewellery. It takes just a moment and begins the process of receiving a professional valuation.",
            image: "/sell/step_1.png",
            imagePosition: "left",
        },
        {
            number: "2",
            title: "In-Person Evaluation or Safe Pickup",
            heading: "Visit Us Personally, or Let Us Collect It Securely",
            description:
                "Meet us at one of our trusted locations for a private evaluation. Prefer not to travel? We can arrange a fully insured, secure courier pickup from anywhere in Europe. Your diamond stays protected, discreetly handled, and always in expert hands.",
            image: "/sell/step_2.png",
            imagePosition: "right",
        },
        {
            number: "3",
            title: "Professional Diamond Valuation",
            heading: "Certified Experts You Can Trust",
            description:
                "Our GIA-certified gemologists and jewellery specialists carefully assess your diamonds using the 4Cs, global market data and strict valuation standards ensuring an accurate, reliable price.",
            image: "/sell/step_3.png",
            imagePosition: "left",
        },
        {
            number: "4",
            title: "Receive the Best Offer",
            heading: "Fair & Transparent Offers.",
            description:
                " Once we’ve evaluated your diamonds, we present you with a clear, competitive offer that reflects their true value, based on current global diamond and gold market conditions",
            image: "/sell/step_4.png",
            imagePosition: "right",
        },
        {
            number: "5",
            title: "Fast and Secure Payment",
            heading: "Receive Your Payment Within 24 Hours",
            description:
                "Once you accept our offer, we process your payment within 24 hours via secure bank transfer, ensuring a smooth and reliable conclusion to your sale.",
            image: "/sell/recieve_your_payment.png",
            imagePosition: "left",
        },
    ];

    return (
        <div className="bg-white py-5 md:py-5">
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                {/* Steps */}
                <div className="space-y-16 md:space-y-24">
                    {steps.map((step, index) => (
                        <div key={index} className="relative w-full">
                            <div
                                className={`flex flex-col lg:flex-row gap-8 items-stretch ${
                                    step.imagePosition === "right"
                                        ? "lg:flex-row-reverse"
                                        : ""
                                }`}
                            >
                                {/* Image Section */}
                                <AnimatedContainer
                                    direction={
                                        step.imagePosition === "left"
                                            ? "left"
                                            : "right"
                                    }
                                    delay={0.2}
                                >
                                    <div className="w-full lg:flex-1">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            width={400}
                                            height={400}
                                            className="w-full h-64 md:h-80 lg:h-96 object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </AnimatedContainer>

                                {/* Content Section */}
                                <AnimatedContainer
                                    direction={
                                        step.imagePosition === "left"
                                            ? "right"
                                            : "left"
                                    }
                                    delay={0.4}
                                >
                                    <div className="w-full lg:flex-1 flex items-center">
                                        <div className="w-full">
                                            <div className="mb-6">
                                                <p
                                                    className={`text-sm md:text-base mb-3 ${marcellus.className}`}
                                                    style={{ color: "#C1A344" }}
                                                >
                                                    {step.number}. {step.title}
                                                </p>
                                                <h2
                                                    className={`text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 font-normal leading-tight ${marcellus.className}`}
                                                >
                                                    {step.heading}
                                                </h2>
                                            </div>
                                            <p
                                                className={`text-base md:text-lg text-gray-600 leading-relaxed ${jost.className}`}
                                            >
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
