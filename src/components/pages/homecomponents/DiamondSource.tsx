"use client";
import { useRef, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

const playFair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function DiamondSource() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">
          {/* Left Content Section - Video */}
          <div>
            <div className="relative overflow-hidden shadow-2xl h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/images/world_net.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay gradient for better video visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Right Content Section - Text */}
          <div>
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] flex flex-col justify-center">
              <AnimatedContainer direction="up">
                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 md:mb-4 leading-tight font-serif ${playFair.className}`}
                >
                  Diamond Sourcing
                </h1>
              </AnimatedContainer>
              <AnimatedContainer direction="up" delay={0.3}>
                <p
                  className={`text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed ${playFair.className}`}
                >
                  At Dalila, we have the ability to source diamonds of any
                  shape, size, or quality, tailored exactly to your preferences.
                  Whether you&apos;re looking for a specific cut, color, or
                  carat weight, we can help you find the perfect diamond from
                  anywhere in the world. Our global network of trusted suppliers
                  & experts ensures that we can secure diamonds that meet the
                  highest standards of craftsmanship & value. With Dalila, you
                  don&apos;t just get a diamond - you get a personalized,
                  seamless experience, bringing you the finest options available
                  on the market.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
