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

export default function DiamondCertification() {
  const steps = [
    {
      number: "1.",
      title:
        "Decide your budget and prioritize the 4Cs based on what matters most to you.",
    },
    {
      number: "2.",
      title: "Choose a shape that matches your personal style.",
    },
    {
      number: "3.",
      title: "Always check certification for authenticity.",
    },
    {
      number: "4.",
      title:
        "Buy from a trusted jeweler with transparent sourcing and quality assurance.",
    },
  ];

  return (
    <div className="bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Diamond Certification Section */}
        <AnimatedContainer direction="up">
          <div className="mb-16 md:mb-20 lg:mb-24 text-center">
            <h1
              className={`text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-gray-900 mb-4 tracking-tight leading-tight ${marcellus.className}`}
            >
              Diamond Certification
            </h1>
            <p
              className={`text-gray-800 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
            >
              Every genuine diamond should come with a grading certificate from
              a recognized authority such as GIA, IGI, or HRD. These
              certificates detail the diamond&apos;s 4Cs and confirm its
              authenticity, ensuring transparency and trust. When purchasing a
              diamond, always request its certificate it&apos;s your guarantee
              of quality.
            </p>
          </div>
        </AnimatedContainer>

        {/* How to Choose Section */}
        <AnimatedContainer direction="up" delay={0.5}>
          <div className="mb-10 md:mb-12 text-center">
            <h2
              className={`text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-gray-900 mb-4 tracking-tight leading-tight ${marcellus.className}`}
            >
              How to Choose the Right Diamond
            </h2>
            <p
              className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
            >
              Choosing the perfect diamond is about balancing beauty, quality,
              and value. Here&apos;s how to start:
            </p>
          </div>
        </AnimatedContainer>

        {/* Steps Grid */}
        <AnimatedContainer direction="up" delay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 md:gap-x-10 lg:gap-x-12 mt-8">
            {steps.map((step, index) => (
              <div key={index}>
                <div className="flex items-start gap-1 mb-2">
                  <span
                    className={`text-5xl md:text-6xl lg:text-[4rem] font-normal text-gray-900 leading-none ${jost.className}`}
                  >
                    {step.number}
                  </span>
                </div>
                <p
                  className={`text-gray-600 leading-relaxed text-base md:text-lg max-w-5xl mx-auto font-light mb-3 ${jost.className}`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
