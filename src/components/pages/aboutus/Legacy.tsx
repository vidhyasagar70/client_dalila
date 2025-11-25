"use client";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function Legacy() {
  const videoRef = useRef<HTMLVideoElement>(null);
   const router = useRouter();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Section */}
          <div
            className="p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl flex flex-col justify-center h-[450px] sm:h-[500px] md:h-[500px] lg:h-[550px]"
            style={{
              background: "linear-gradient(to right, #050c3a 0%, #050c3a 100%)",
            }}
          >
            <AnimatedContainer direction="up">
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 md:mb-4 leading-tight ${marcellus.className}`}
              >
                Our Legacy
              </h1>
            </AnimatedContainer>
            <AnimatedContainer direction="up" delay={0.5}>
              <p
                className={`text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-3 md:mb-4 ${jost.className}`}
              >
                Since 2007, Mr. Shreyas Gandhi has been based in Antwerp, the
                world&apos;s diamond capital, further strengthening our presence
                in Europe. From this strategic hub, we continue to serve
                distinguished clients across Germany, the Netherlands, Italy,
                Belgium, the United States, Hong Kong, China, and beyond.
              </p>
              <p
                className={`text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 md:mb-6 ${jost.className}`}
              >
                Our guiding principles remain unchanged: an unwavering commitment to quality, integrity in every transaction, 
                and a passion for building enduring relationships across the global diamond community.
              </p>
            </AnimatedContainer>
            <button
             onClick={() => router.push('/contact')}
              className={`py-2 px-4 md:py-2.5 md:px-5 lg:px-6 text-xs sm:text-sm cursor-pointer lg:text-base text-white border border-[#c89e3a] hover:bg-[#c89e3a] hover:text-white transition-colors whitespace-nowrap w-fit ${jost.className}`}
            >
              CONTACT
            </button>
          </div>

          {/* Right Section */}
          <AnimatedContainer direction="right">
            <div className="relative overflow-hidden shadow-2xl h-[450px] sm:h-[500px] md:h-[500px] lg:h-[550px]">
              <Image
                src="/images/asscher-blue.jpg"
                alt="About Us Background"
                width={800}
                height={550}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}
