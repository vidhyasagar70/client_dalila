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

export default function SecureSourceshowcase() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Sell Diamonds Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <AnimatedContainer direction="scale-out">
            <div>
              <div className="relative h-[290px] md:h-[340px] w-full max-w-[480px] mx-auto  overflow-hidden shadow-2xl">
                <Image
                  src="/secure_to_source/Browse_online_platforms.jpg"
                  alt="Professional diamond dealer"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </AnimatedContainer>

          <div>
            <div className="max-w-xl">
              <AnimatedContainer direction="up">
                <p
                  className={`text-sm sm:text-base md:text-lg tracking-[0.05em] uppercase ${marcellus.className} bg-gradient-to-r from-[#bd9f41] via-[#e4c75f] to-[#bd9f41] bg-clip-text text-transparent font-normal mb-4`}
                >
                  1. Select Your Stones
                </p>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className} `}
                >
                  Browse Online <br /> Platforms
                </h2>
              </AnimatedContainer>
              <p
                className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
              >
                Explore diamonds on any trusted online platform of your choice. Browse at your convenience and shortlist the stones that meet your specifications and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Language of Diamonds Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="max-w-xl">
              <AnimatedContainer direction="up">
                <p
                  className={`text-sm sm:text-base md:text-lg tracking-[0.05em] uppercase ${marcellus.className} bg-gradient-to-r from-[#bd9f41] via-[#e4c75f] to-[#bd9f41] bg-clip-text text-transparent font-normal mb-4`}
                >
                  2. Quality Assurance
                </p>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className}`}
                >
                  We Handle Quality Control for You

                </h2>
              </AnimatedContainer>
              <p
                className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
              >
                Our experts carry out rigorous quality checks on every stone. 
                We verify that each diamond matches your chosen specifications and meets our exacting quality standards before it reaches you.
              </p>
            </div>
          </div>

          <div>
            <AnimatedContainer direction="scale-out">
              <div className="relative h-[290px] md:h-[340px] w-full max-w-[480px] mx-auto  overflow-hidden shadow-2xl">
                <Image
                  src="/secure_to_source/close-up.jpg"
                  alt="Diamond examination with tweezers"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedContainer>
          </div>
        </div>
        {/* Sell Diamonds Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-25 mt-25">
          <div>
            <AnimatedContainer direction="scale-out" delay={0.5}>
              <div className="relative h-[290px] md:h-[340px] w-full max-w-[480px] mx-auto  overflow-hidden shadow-2xl">
                <Image
                  src="/secure_to_source/flight.jpg"
                  alt="Professional diamond dealer"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedContainer>
          </div>

          <div>
            <div className="max-w-xl">
              <AnimatedContainer direction="up">
                <p
                  className={`text-sm sm:text-base md:text-lg tracking-[0.05em] uppercase ${marcellus.className} bg-gradient-to-r from-[#bd9f41] via-[#e4c75f] to-[#bd9f41] bg-clip-text text-transparent font-normal mb-4`}
                >
                  3. Swift Delivery
                </p>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className} `}
                >
                 
                  Fast and secure delivery <br /> to Belgium
                </h2>
              </AnimatedContainer>
              <p
                className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
              >
                Orders placed by Wednesday evening are scheduled to arrive in Belgium by the following Wednesday. This priority service ensures your diamonds reach you quickly and securely.
                 A small additional service fee applies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
