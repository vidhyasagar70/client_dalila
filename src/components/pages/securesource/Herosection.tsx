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

export default function SecureSourceHero() {
  return (
    <div className="bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="space-y-4 md:space-y-6 lg:pl-4">
            <p
              className={`text-sm sm:text-base md:text-lg tracking-[0.2em] uppercase ${jost.className} bg-gradient-to-r from-[#bd9f41] via-[#e4c75f] to-[#bd9f41] bg-clip-text text-transparent font-normal`}
            >
              Here&apos;s How We Help
            </p>
            <AnimatedContainer direction="up">
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight ${marcellus.className}`}
              >
                TRUSTED DIAMOND SOURCING

              </h3>
            </AnimatedContainer>
            <AnimatedContainer direction="up" delay={0.5}>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed">
                We offer two specialised diamond-sourcing services tailored to your needs in Europe.
                 From secure access to public trading platforms to personalised worldwide searches, 
                 we ensure every diamond is sourced transparently, 
                responsibly and with complete peace of mind.
              </p>
            </AnimatedContainer>
          </div>

          <div className="relative pb-6 md:pb-8 lg:pb-12">
            <AnimatedContainer direction="scale-out">
              <div className="relative w-full h-64 sm:h-80 md:h-96 bg-black  overflow-hidden shadow-2xl">
                <Image
                  src="/secure_to_source/stos.jpg"
                  alt="Diamond shapes collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
