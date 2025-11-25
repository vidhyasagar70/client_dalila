"use client";
import { Gem } from "lucide-react";
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

export default function NaturalVsLabDiamonds() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <AnimatedContainer direction="up">
          <div className="text-center mb-12 md:mb-16">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 font-normal tracking-tight ${marcellus.className}`}
            >
              Natural vs. Lab-Grown Diamonds
            </h1>
            <p
              className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
            >
              While natural diamonds are formed deep within the Earth, lab-grown
              diamonds are created in controlled environments using advanced
              technology. Both share the same chemical composition, but natural
              diamonds hold unmatched rarity, history, and emotional value.
            </p>
            <p
              className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
            >
              Buyers seeking authenticity, long-term value, and natural beauty
              often choose certified natural diamonds.
            </p>
          </div>
        </AnimatedContainer>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mt-16">
          {/* Natural Diamonds */}
          <AnimatedContainer direction="left">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h2
                  className={`text-2xl md:text-3xl text-gray-900 font-normal ${marcellus.className}`}
                >
                  Natural Diamonds
                </h2>
                <Gem className="text-blue-500 flex-shrink-0" size={28} />
              </div>
              <p
                className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
              >
                Natural diamonds are treasures of the Earth formed over
                billions of years, deep beneath its surface, under immense heat
                and pressure. Each one is a rare creation of nature, shaped by
                time and perfected through expert craftsmanship. Their unmatched
                authenticity, brilliance, and heritage make them the preferred
                choice for those who value tradition and legacy. Every natural
                diamond carries a unique story  a journey from Earth&apos;s
                core to your hands symbolizing love, strength, and eternity.
                Ethically sourced and GIA-certified, these diamonds are not just
                gemstones, but heirlooms that hold emotional and lasting value
                for generations to come.
              </p>
            </div>
          </AnimatedContainer>

          {/* Lab-Grown Diamonds */}
          <AnimatedContainer direction="right">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h2
                  className={`text-2xl md:text-3xl text-gray-900 font-normal ${marcellus.className}`}
                >
                  Lab-Grown Diamonds
                </h2>
                <Gem className="text-blue-500 flex-shrink-0" size={28} />
              </div>
              <p
                className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
              >
                Lab-grown diamonds are real diamonds created in modern
                laboratories using advanced technology that replicates the
                natural diamond-growing process. They share the same physical,
                chemical, and optical properties as mined diamonds, offering
                brilliance and beauty at a more accessible price point. What
                sets them apart is their eco-conscious origin they&apos;re
                crafted with minimal environmental impact and are completely
                conflict-free. Ideal for those who value sustainability and
                innovation, lab-grown diamonds bring together elegance,
                responsibility, and affordability without compromising on
                sparkle or quality.
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}
