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

export default function DiamondSourceshowcase() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Sell Diamonds Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <AnimatedContainer direction="scale-out">
            <div>
              <div className="relative h-[290px] md:h-[340px] w-full max-w-[480px] mx-auto overflow-hidden shadow-2xl">
                <Image
                  src="/secure_to_source/tray.jpg"
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
                  1. Share Your Requirements
                </p>{" "}
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className} `}
                >
                  Tell Us What You Need
                </h2>
              </AnimatedContainer>
              <p
                className={`text-gray-600 leading-relaxed mb-6 text-[15px] md:text-base font-normal ${jost.className}`}
              >
                Send us your full criteria including:
              </p>
              <ul className={`space-y-3 mb-8 ${jost.className}`}>
                <li className="text-gray-600 text-[15px] md:text-base flex items-start">
                  <span className="mr-3 mt-1.5 inline-block w-2 h-2 rounded-full bg-[#606060]"></span>
                  <span>Carat, color, clarity, cut/make</span>
                </li>
                <li className="text-gray-600 text-[15px] md:text-base flex items-start">
                  <span className="mr-3 mt-1.5 inline-block w-2 h-2 rounded-full bg-[#606060]"></span>
                  <span>Fluorescence preferences</span>
                </li>
                <li className="text-gray-600 text-[15px] md:text-base flex items-start">
                  <span className="mr-3 mt-1.5 inline-block w-2 h-2 rounded-full bg-[#606060]"></span>
                  <span>Budget range</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Language of Diamonds Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="max-w-xl">
              <AnimatedContainer direction="up">
                <p
                  className={`text-sm sm:text-base md:text-lg tracking-[0.05em] uppercase ${marcellus.className} bg-gradient-to-r from-[#bd9f41] via-[#e4c75f] to-[#bd9f41] bg-clip-text text-transparent font-normal`}
                >
                  2.EXPERT SEARCH
                </p>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className}`}
                >
                  We Source Through Our Global Network
                </h2>
              </AnimatedContainer>
              <p
                className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
              >
               Our experts access an exclusive worldwide network to locate diamonds tailored to your exact specifications  including rare inventory unavailable on public platforms. This ensures you receive options beyond the ordinary.
              </p>
            </div>
          </div>

          <div>
            <AnimatedContainer direction="scale-out">
              <div className="relative h-[290px] md:h-[340px] w-full max-w-[480px] mx-auto overflow-hidden shadow-2xl">
                <Image
                  src="/diamonds_source/We_Search_Our_Worldwide_Network.jpg"
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
              <div className="relative h-[290px] md:h-[340px] w-full max-w-[480px] mx-auto overflow-hidden shadow-2xl">
                <Image
                  src="/diamonds_source/handshake.jpg"
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
                  className={`text-sm sm:text-base md:text-lg tracking-[0.05em] uppercase ${marcellus.className} bg-gradient-to-r from-[#bd9f41] via-[#e4c75f] to-[#bd9f41] bg-clip-text text-transparent font-normal`}
                >
                  3. RECEIVE YOUR DIAMONDS

                </p>
                <h2
                  className={`text-[2.75rem] md:text-5xl lg:text-[3.25rem] font-light mb-7 text-gray-900 leading-[1.15] tracking-tight ${marcellus.className} `}
                >
                  Fast & Secure <br />
                  Delivery
                </h2>
              </AnimatedContainer>
              <p
                className={`text-gray-600 leading-relaxed mb-8 text-[15px] md:text-base font-normal ${jost.className}`}
              >
                Weekly shipments from India ensure your diamonds reach you quickly and safely. Delivery within Belgium is included at no additional cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
