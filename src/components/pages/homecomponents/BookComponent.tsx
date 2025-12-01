"use client";
import { useRef, useEffect } from "react";

import { Marcellus,Jost} from "next/font/google";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { useRouter } from "next/navigation";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export default function BookComponent() {
    const router = useRouter();
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center max-w-7xl mx-auto">
                    {/* Left Content Section */}
                    <div
                        className="p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl flex flex-col justify-center h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]"
                        style={{
                            background:
                                "linear-gradient(to right, #050c3a 0%, #050c3a 100%)",
                        }}
                    >
                        <AnimatedContainer direction="up">
                            <h1
                                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 md:mb-4 leading-tight ${marcellus.className}`}
                            >
                                From Classic Cuts to Rare Shapes, We Have It All
                            </h1>
                        </AnimatedContainer>

                        <AnimatedContainer direction="up" delay={0.3}>
                            <p
                                className={`text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 md:mb-6 ${jost.className}`}
                            >
                                At Dalila, every diamond tells a story of
                                unmatched brilliance. From timeless classics to
                                unique heart-shaped treasures, our collection
                                reflects elegance and perfection. Each piece is
                                crafted with care, ensuring beauty, rarity, and
                                everlasting value. Experience luxury beyond
                                imagination with us.
                            </p>
                        </AnimatedContainer>
                        <AnimatedContainer direction="up">
                            <button
                                className={`py-2 px-4 md:py-2.5 md:px-5 lg:px-6 text-xs sm:text-sm lg:text-base text-white border border-[#c89e3a] hover:bg-[#c89e3a] hover:text-white transition-colors cursor-pointer whitespace-nowrap w-fit ${jost.className}`}
                                onClick={() => router.push("/inventory")}
                            >
                                BOOK NOW
                            </button>
                        </AnimatedContainer>
                    </div>

                    {/* Right Video Section */}
                    <div className="relative overflow-hidden shadow-2xl h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/images/video1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Overlay gradient for better video visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
