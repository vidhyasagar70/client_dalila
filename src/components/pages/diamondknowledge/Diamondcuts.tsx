"use client";
import Image from "next/image";
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

export default function Diamondcuts() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}

        <div className="text-center mb-12 md:mb-16">
          <AnimatedContainer direction="up">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 font-normal tracking-tight ${marcellus.className}`}
            >
              The 4Cs of Diamonds
            </h1>
          </AnimatedContainer>
          <p
            className={`text-gray-600 leading-relaxed text-[18px] md:text-base max-w-4xl mx-auto font-light ${jost.className}`}
          >
            When it comes to evaluating a diamond&apos;s quality and beauty,
            professionals rely on the 4Cs Cut, Color, Clarity, and Carat
            Weight. Understanding these characteristics will help you choose a
            diamond that matches your preferences and budget.
          </p>
        </div>

        {/* 4Cs Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start mt-16">
          {/* Left side - Diamond Image */}
          <div className="flex justify-center items-center">
            <AnimatedContainer direction="left">
              <div className="relative w-full max-w-[500px] aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/diamond.png"
                    alt="Brilliant cut diamonds"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* Right side - 4Cs Grid */}
          <AnimatedContainer direction="right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-10 md:gap-y-10">
              {/* Cut */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 mb-2">
                  <Gem
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <h3
                    className={`text-lg md:text-xl font-medium text-gray-900 leading-tight ${marcellus.className}`}
                  >
                    Cut: The Sparkle Factor
                  </h3>
                </div>
                <p
                  className={`text-gray-600 text-[13px] md:text-[18px] leading-relaxed font-light ${jost.className}`}
                >
                  A diamond&apos;s cut determines how well it reflects light
                  and that&apos;s what gives it brilliance. Even if a diamond
                  has perfect color or clarity, a poor cut can make it look
                  dull. The ideal cut brings out the stone&apos;s natural fire
                  and radiance.
                </p>
              </div>

              {/* Color */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 mb-2">
                  <Gem
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <h3
                    className={`text-lg md:text-xl font-medium text-gray-900 leading-tight ${marcellus.className}`}
                  >
                    Color: The Shade of Purity
                  </h3>
                </div>
                <p
                  className={`text-gray-600 text-[13px] md:text-[18px] leading-relaxed font-light ${jost.className}`}
                >
                  Diamond color grades range from D (colorless) to Z (light
                  yellow or brown). The less color a diamond has, the rarer and
                  more valuable it is. Colorless diamonds reflect more light,
                  resulting in unmatched sparkle and purity.
                </p>
              </div>

              {/* Clarity */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 mb-2">
                  <Gem
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <h3
                    className={`text-lg md:text-xl font-medium text-gray-900 leading-tight ${marcellus.className}`}
                  >
                    Clarity: Nature&apos;s Signature
                  </h3>
                </div>
                <p
                  className={`text-gray-600 text-[13px] md:text-[18px] leading-relaxed font-light ${jost.className}`}
                >
                  Every natural diamond has tiny inclusions or blemishes formed
                  during its creation. These are nature&apos;s fingerprints,
                  making each diamond unique. Clarity is graded from Flawless
                  (F) to Included (I), and most inclusions are microscopic, not
                  visible to the naked eye.
                </p>
              </div>

              {/* Carat Weight */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 mb-2">
                  <Gem
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <h3
                    className={`text-lg md:text-xl font-medium text-gray-900 leading-tight ${marcellus.className}`}
                  >
                    Carat Weight: The Measure of Size
                  </h3>
                </div>
                <p
                  className={`text-gray-600 text-[13px] md:text-[18px] leading-relaxed font-light ${jost.className}`}
                >
                  Carat refers to a diamond&apos;s weight, not its size. Larger
                  diamonds are rarer, but two diamonds of the same carat can
                  appear different depending on their cut. It&apos;s always best
                  to balance carat with the other Cs for true value.
                </p>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}
