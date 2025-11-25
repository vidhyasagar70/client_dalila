"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

const playFair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  shapeName: string;
}

function ImagePopup({ isOpen, onClose, imageSrc, shapeName }: ImagePopupProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${playFair.className}`}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-white/10 hover:bg-white/20 transition-all duration-300 group"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] p-6 md:p-12">
          <Image
            src={imageSrc}
            alt={`${shapeName} cut diamond`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="py-4 md:py-6 text-center bg-[#c89e3a]">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {shapeName}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function DiamondShapes() {
  const [selectedShape, setSelectedShape] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const shapes = [
    { name: "Round", image: "/DiamondsinBlubg/Round.jpg" },
    { name: "Oval", image: "/DiamondsinBlubg/Oval.jpg" },
    { name: "Pear", image: "/DiamondsinBlubg/Pear.jpg" },
    { name: "Emerald", image: "/DiamondsinBlubg/Emerald.jpg" },
    { name: "Heart", image: "/DiamondsinBlubg/Heart.jpg" },
    { name: "Cushion", image: "/DiamondsinBlubg/Cushion.jpg" },

    { name: "Asscher", image: "/DiamondsinBlubg/Asscher.jpg" },
    { name: "Radiant", image: "/DiamondsinBlubg/Radiant.jpg" },

    { name: "Princess", image: "/DiamondsinBlubg/Princess.jpg" },

    { name: "Marquise", image: "/DiamondsinBlubg/Marquise.jpg" },
  ];

  const handleShapeClick = (shape: { name: string; image: string }) =>
    setSelectedShape(shape);
  const closePopup = () => setSelectedShape(null);

  return (
    <div
      className={`bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 lg:py-20 ${playFair.className}`}
    >
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-slate-800 mb-4">
            Diamond Cuts
          </h2>
        </div>

        {/* Mobile Layout (2 columns) */}
        <AnimatedContainer direction="up">
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {shapes.map((shape) => (
              <div
                key={shape.name}
                className="cursor-pointer overflow-hidden shadow-lg"
                onClick={() => handleShapeClick(shape)}
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <Image
                    src={shape.image}
                    alt={`${shape.name} cut diamond`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="py-2 px-2 text-center bg-[#c89e3a]">
                  <h3 className="font-semibold text-white text-sm">
                    {shape.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>

        {/* Tablet Layout (3 columns) */}
        <AnimatedContainer direction="up">
          <div className="hidden md:grid lg:hidden grid-cols-3 gap-3">
            {shapes.map((shape) => (
              <div
                key={shape.name}
                className="cursor-pointer overflow-hidden shadow-lg"
                onClick={() => handleShapeClick(shape)}
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <Image
                    src={shape.image}
                    alt={`${shape.name} cut diamond`}
                    fill
                    loading="lazy"
                    sizes="(min-width: 768px) and (max-width: 1024px) 33vw, 16vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="py-3 px-3 text-center bg-[#c89e3a]">
                  <h3 className="font-semibold text-white text-base">
                    {shape.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>

        {/* Desktop Layout (6 + 4 centered) */}
        <AnimatedContainer direction="up">
          <div className="hidden lg:block">
            {/* First row (6 items) */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              {shapes.slice(0, 6).map((shape) => (
                <div
                  key={shape.name}
                  className="cursor-pointer overflow-hidden shadow-lg"
                  onClick={() => handleShapeClick(shape)}
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <Image
                      src={shape.image}
                      alt={`${shape.name} cut diamond`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 16vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="py-3 px-4 text-center bg-[#c89e3a]">
                    <h3 className="font-semibold text-white text-lg">
                      {shape.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Second row (4 items centered) */}
            <div className="grid grid-cols-6 gap-2">
              <div className="col-start-2 col-span-1">
                <div
                  className="cursor-pointer overflow-hidden shadow-lg"
                  onClick={() => handleShapeClick(shapes[6])}
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <Image
                      src={shapes[6].image}
                      alt={`${shapes[6].name} cut diamond`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 16vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="py-3 px-4 text-center bg-[#c89e3a]">
                    <h3 className="font-semibold text-white text-lg">
                      {shapes[6].name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div
                  className="cursor-pointer overflow-hidden shadow-lg"
                  onClick={() => handleShapeClick(shapes[7])}
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <Image
                      src={shapes[7].image}
                      alt={`${shapes[7].name} cut diamond`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 16vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="py-3 px-4 text-center bg-[#c89e3a]">
                    <h3 className="font-semibold text-white text-lg">
                      {shapes[7].name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div
                  className="cursor-pointer overflow-hidden shadow-lg"
                  onClick={() => handleShapeClick(shapes[8])}
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <Image
                      src={shapes[8].image}
                      alt={`${shapes[8].name} cut diamond`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 16vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="py-3 px-4 text-center bg-[#c89e3a]">
                    <h3 className="font-semibold text-white text-lg">
                      {shapes[8].name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div
                  className="cursor-pointer overflow-hidden shadow-lg"
                  onClick={() => handleShapeClick(shapes[9])}
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <Image
                      src={shapes[9].image}
                      alt={`${shapes[9].name} cut diamond`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 16vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="py-3 px-4 text-center bg-[#c89e3a]">
                    <h3 className="font-semibold text-white text-lg">
                      {shapes[9].name}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Popup */}
      <ImagePopup
        isOpen={selectedShape !== null}
        onClose={closePopup}
        imageSrc={selectedShape?.image || ""}
        shapeName={selectedShape?.name || ""}
      />
    </div>
  );
}
