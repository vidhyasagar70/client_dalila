"use client";
import Image from "next/image";
import { Marcellus, Jost } from "next/font/google";
import { useState, useEffect } from "react";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const carouselImages = [
    "/images/firstimage.jpg",
    "/images/secondimage.jpg", 
    "/images/thirdimage.jpg", 
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length, isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

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
                  Diamonds are more than gemstones they are timeless symbols of love, craftsmanship and nature&apos;s brilliance.
                   Formed deep within the Earth over billions of years, each natural diamond carries its own story.
                    Whether you&apos;re choosing your very first stone or refining a lifelong collection,
                     understanding a diamond&apos;s key characteristics helps you make a truly confident choice.

                     This guide walks you through every facet from how diamonds are formed to what makes each one unique.
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
                  Each diamond&apos;s journey — from mine to masterpiece —
                  involves ethical sourcing, expert craftsmanship, and precise
                  grading to ensure its authenticity and value.
                </p>
              </div>
            </div>
          </AnimatedContainer>

          <div>
            <AnimatedContainer direction="right">
              <div className="relative h-[370px] md:h-[400px] w-full max-w-[380px] mx-auto overflow-hidden shadow-2xl group">
                {/* Carousel Container with sliding effect */}
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {carouselImages.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="min-w-full h-full relative"
                    >
                      <Image
                        src={image}
                        alt={`Diamond showcase ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicator Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentImageIndex(index);
                        setTimeout(() => setIsAutoPlaying(true), 5000);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? "bg-white w-8" 
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}