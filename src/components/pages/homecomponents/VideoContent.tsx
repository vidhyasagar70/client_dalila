"use client";
import { useRef, useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";

const playFair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function VideoContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    const playVideo = async () => {
      try {
        await video.play();
        console.log("Video playing successfully");
      } catch (error) {
        console.error("Video autoplay prevented:", error);
        setVideoError(true);
      }
    };

    const timer = setTimeout(() => {
      playVideo();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onError={(e) => {
          console.error("Video failed to load:", e);
          setVideoError(true);
        }}
      >
        <source src="/New-Videos/LEGACY_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback background image if video fails */}
      {videoError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      )}

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Centered Text Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <h5
            className={`text-white/90 text-sm md:text-base tracking-widest mb-6 font-light ${playFair.className}`}
          >
            A LEGACY OF REFINEMENT, SHAPED TO PERFECTION
          </h5>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-wide font-light ${playFair.className}`}
          >
            Every diamond, delicately refined through skill & crafted by the
            hands of true perfectionists.
          </h1>
        </div>
      </div>

      {/* Elegant border decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/30"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/30"></div>
      </div>
    </div>
  );
}
