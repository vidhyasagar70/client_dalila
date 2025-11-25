"use client";

import React, { useState } from 'react';

export default function FreeEstimateSteps() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      title: "Tell us about your diamond",
      details: "Shape, carat weight, color, clarity, cut/make (polish & symmetry), fluorescence. • Measurements and setting (if mounted)",
    },
    {
      number: "02",
      title: "Upload diamond photos",
      details: "Top and side view on a plain background • Taken in good natural daylight",
    },
    {
      number: "03",
      title: "Upload the certificate",
      details: "GIA / IGI / HRD certificate • Or simply share the report number",
    },
    {
      number: "04",
      title: "Add any comments",
      details: "Chips, repolish, laser inscription • Desired price and timeline",
    },
    {
      number: "05",
      title: "Share your contact details",
      details: "Name, email, phone • City and country",
    },
  ];

  const getCircleClasses = (index: number): string => {
    const isHovered = hoveredStep === index;
    
    if (isHovered) {
      return "bg-[#C89E3A] border-0";
    }
    
    if (index === 0) {
      return "bg-[#C9A961] border-0";
    }
    
    return "bg-white border-2 border-gray-700";
  };

  const getNumberClasses = (index: number): string => {
    const isHovered = hoveredStep === index;
    
    if (isHovered) {
      return "text-white";
    }
    
    if (index === 0) {
      return "text-white";
    }
    
    return "text-[#C9A961]";
  };

  return (
    <div className="bg-[#050C3A] min-h-screen py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-gray-400 text-sm md:text-base mb-3 tracking-wider">
            [ working steps ]
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-[#C9A961] leading-tight">
            Get a free estimate{" "}
            <span className="block mt-2">(5 quick steps)</span>
          </h1>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connecting Line with Dots */}
          <div className="absolute top-[90px] left-[10%] right-[10%] flex items-center justify-between z-0">
            <div className="flex-1 h-[2px] bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 mx-8"></div>
            <div className="flex-1 h-[2px] bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 mx-8"></div>
            <div className="flex-1 h-[2px] bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 mx-8"></div>
            <div className="flex-1 h-[2px] bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 mx-8"></div>
            <div className="flex-1 h-[2px] bg-gray-700"></div>
          </div>

          {/* Steps Grid */}
          <div className="relative z-10 grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center cursor-pointer"
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Circle */}
                <div
                  className={`${getCircleClasses(index)} w-28 h-28 xl:w-32 xl:h-32 rounded-full flex items-center justify-center shadow-xl mb-6 transition-all duration-300 hover:scale-110`}
                >
                  <span className={`text-4xl xl:text-5xl font-light transition-colors duration-300 ${getNumberClasses(index)}`}>
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[#C9A961] text-base xl:text-lg font-light mb-4 min-h-[50px] px-2">
                  {step.title}
                </h3>

                {/* Details */}
                <div className="text-white text-xs xl:text-sm leading-relaxed font-light px-2">
                  {step.details}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Single Navigation Line (Desktop) */}
        <div className="hidden lg:block mt-12">
          <div className="max-w-5xl mx-auto">
            <div className="w-full h-[2px] relative overflow-hidden bg-gray-700">
              <div 
                className="absolute top-0 left-0 h-full bg-[#C9A961] transition-all duration-500 ease-in-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom detail text (visible only on desktop) */}
        <div className="hidden lg:block mt-8 text-center">
          <p className="text-white text-sm font-light opacity-80">
            Shape, carat weight, color, clarity, cut/make (polish & symmetry), fluorescence. • Measurements and setting (if mounted)
          </p>
        </div>

        {/* Mobile/Tablet View */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex items-start gap-6 cursor-pointer"
              onClick={() => setActiveStep(index)}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Circle */}
              <div
                className={`${getCircleClasses(index)} w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-xl flex-shrink-0 transition-all duration-300 hover:scale-110`}
              >
                <span className={`text-2xl md:text-3xl font-light transition-colors duration-300 ${getNumberClasses(index)}`}>
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3 className="text-[#C9A961] text-base md:text-lg font-light mb-3">
                  {step.title}
                </h3>
                <div className="text-white text-sm md:text-base leading-relaxed font-light">
                  {step.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}