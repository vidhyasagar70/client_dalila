"use client";
import { Jost } from "next/font/google";
import React from "react";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

interface GoldButtonProps {
  text: string;
  onClick?: () => void;
}

const GoldButton: React.FC<GoldButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#c89e3a] hover:bg-[#b38d2f] text-white font-medium px-9 py-3.5  transition-all duration-300 text-[13px] tracking-[0.08em] uppercase shadow-md hover:shadow-lg cursor-pointer ${jost.className}`}
    >
      {text}
    </button>
  );
};

export default GoldButton;
