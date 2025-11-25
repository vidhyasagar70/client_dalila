"use client";
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

export default function CaringForDiamond() {
  const careTips = [
    "Clean them gently with warm water and mild soap.",
    "Store separately to prevent scratching other jewelry",
    "Schedule professional cleanings once a year.",
  ];

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <AnimatedContainer direction="up">
          <div className="text-center mb-10 md:mb-14">
            <h1
              className={`text-[40px] md:text-[48px] lg:text-[52px] text-[#2d2d2d] mb-4 font-normal tracking-tight leading-tight ${marcellus.className}`}
            >
              Caring for Your Diamond
            </h1>
            <p
              className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
            >
              Diamonds are durable, but they still deserve care. To maintain
              brilliance:
            </p>
          </div>
        </AnimatedContainer>

        {/* Care Tips Grid */}
        <AnimatedContainer direction="up" delay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-8">
            {careTips.map((tip, index) => (
              <div key={index} className="text-center">
                <p
                  className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
