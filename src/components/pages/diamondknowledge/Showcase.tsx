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

export default function Diamondshowcase() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Sell Diamonds Section */}

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <AnimatedContainer direction="left">
            <div>
              <div className="relative h-[350px] md:h-[390px] w-full max-w-[340px] mx-auto overflow-hidden shadow-2xl">
                <Image
                  src="/images/diamondwork.png"
                  alt="Professional diamond dealer"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </AnimatedContainer>
          <div>
            <AnimatedContainer direction="right">
              <div className="max-w-xl">
                <h4
                  className={`text-sm md:text-base uppercase tracking-widest text-gray-500 mb-4 font-medium ${marcellus.className}`}
                  style={{ color: "#515151" }}
                >
                  Introduction
                </h4>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className}`}
                >
                  Diamond Knowledge Guide
                </h2>
                <p
                  className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
                >
                  Diamonds are more than gemstones they are timeless symbols of love, craftsmanship and nature’s brilliance.
                   Formed deep within the Earth over billions of years, each natural diamond carries its own story.
                    Whether you’re choosing your very first stone or refining a lifelong collection,
                     understanding a diamond’s key characteristics helps you make a truly confident choice.

                     This guide walks you through every facet from how diamonds are formed to what makes each one unique.


                </p>
                
              </div>
            </AnimatedContainer>
          </div>
        </div>

        {/* Language of Diamonds Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedContainer direction="left">
            <div>
              <div className="max-w-xl">
                <h4
                  className={`text-sm md:text-base uppercase tracking-widest text-gray-500 mb-4 font-medium ${marcellus.className}`}
                  style={{ color: "#515151" }}
                >
                  Diamond&apos;s Journey
                </h4>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className}`}
                >
                  The Journey of a Diamond
                </h2>
                <p
                  className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
                >
                  Natural diamonds are created under extreme pressure and
                  temperature conditions, deep below the Earth&apos;s surface.
                  Over millions of years, these crystals travel upward through
                  volcanic activity, eventually reaching the surface where they
                  are mined and transformed into beautiful jewels.
                </p>
                <p
                  className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
                >
                  Each diamond&apos;s journey  from mine to masterpiece 
                  involves ethical sourcing, expert craftsmanship, and precise
                  grading to ensure its authenticity and value.
                </p>
              </div>
            </div>
          </AnimatedContainer>

         <div>
            <AnimatedContainer direction="right">
              <div className="relative h-[450px] md:h-[520px] w-full max-w-[400px] md:max-w-[480px] mx-auto overflow-hidden shadow-2xl">
                <Image
                  src="/images/threeimage.jpg"
                  alt="Diamond examination with tweezers"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
