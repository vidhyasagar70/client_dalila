"use client";

import React from "react";
import Footer from "./Footer";
import Image from "next/image";
import { X, ArrowLeft } from "lucide-react";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface DiamondData {
  _id: string;
  REAL_IMAGE?: string;
  STONE_NO: string;
  STAGE?: string;
  LOCATION?: string;
  REPORT_NO?: string;
  LAB?: string;
  SHAPE?: string;
  CARATS?: string | number;
  COLOR?: string;
  CLARITY?: string;
  CUT?: string;
  POL?: string;
  SYM?: string;
  FLOUR?: string;
  RAP_PRICE?: string | number;
  MEASUREMENTS?: string;
  TABLE_PER?: string | number;
  DEPTH_PER?: string | number;
  CROWN_ANGLE?: string | number;
  CROWN_HEIGHT?: string | number;
  PAVILLION_ANGLE?: string | number;
  PAVILLION_HEIGHT?: string | number;
  DISC_PER?: string | number;
  NET_RATE?: string | number;
  NET_VALUE?: string | number;
  KEY_TO_SYMBOLS?: string;
  REPORT_COMMENTS?: string;
  COMMENTS_1?: string;
  HA?: string;
  REPORT_DATE?: string;
  RATIO?: string | number;
  GIRDLE?: string;
  GIRDLE_PER?: string | number;
  STAR?: string | number;
  INSCRIPTION?: string;
  BLACK_SIZE_1?: string;
  BLACK_SIZE_2?: string;
  FEATHER_SIZE_1?: string;
  FEATHER_SIZE_2?: string;
  OPEN_POS_4?: string;
  EC?: string;
  SHADE?: string;
  TYPE2_CERT?: string;
  BLOCK_TYPE_SEQ?: string;
  BRL?: string;
}

interface DiamondComparisonPageProps {
  diamonds: DiamondData[];
  onClose: () => void;
}

const DiamondComparisonPage: React.FC<DiamondComparisonPageProps> = ({
  diamonds,
  onClose,
}) => {
  const removeDiamond = (id: string) => {
    console.log("Remove diamond:", id);
  };

  // Helper function to get row styling based on index
  const getRowStyle = (index: number) => {
    if (index === 0) {
      return { bg: "#060c3c", color: "#ffffff", border: "#e7d9b3" }; // Stage row - dark blue
    }
    return { bg: "#ffffff", color: "#060c3c", border: "#e7d9b3" }; // All rows white with cream border
  };

  // Define all table rows matching the UI image
  const tableRows = [
    { label: "Stage", key: "STAGE", index: 0 },
    { label: "Packet No", key: "STONE_NO", index: 1 },
    { label: "Location", key: "LOCATION", index: 2 },
    { label: "Report No", key: "REPORT_NO", index: 3 },
    { label: "Lab", key: "LAB", index: 4 },
    { label: "Shape", key: "SHAPE", index: 5 },
    { label: "Wgt", key: "CARATS", index: 6 },
    { label: "Col", key: "COLOR", index: 7 },
    { label: "Clarity", key: "CLARITY", index: 8 },
    { label: "Cut", key: "CUT", index: 9 },
    { label: "Pol", key: "POL", index: 10 },
    { label: "Sym", key: "SYM", index: 11 },
    { label: "Fls", key: "FLOUR", index: 12 },
    { label: "Rap.($)", key: "RAP_PRICE", index: 13 },
    {
      label: "Length",
      key: "MEASUREMENTS",
      index: 14,
      transform: (val: string) => val?.split("x")[0]?.trim(),
    },
    {
      label: "Width",
      key: "MEASUREMENTS",
      index: 15,
      transform: (val: string) => val?.split("x")[1]?.trim(),
    },
    {
      label: "Depth",
      key: "MEASUREMENTS",
      index: 16,
      transform: (val: string) => val?.split("x")[2]?.trim(),
    },
    { label: "Depth %", key: "DEPTH_PER", index: 17 },
    { label: "Table %", key: "TABLE_PER", index: 18 },
    { label: "Disc %", key: "DISC_PER", index: 19 },
    { label: "Net Rate", key: "NET_RATE", index: 20 },
    { label: "Net Value", key: "NET_VALUE", index: 21 },
    { label: "C/A", key: "CROWN_ANGLE", index: 22 },
    { label: "C/H", key: "CROWN_HEIGHT", index: 23 },
    { label: "P/A", key: "PAVILLION_ANGLE", index: 24 },
    { label: "P/H", key: "PAVILLION_HEIGHT", index: 25 },
    { label: "Ratio", key: "RATIO", index: 26 },
    { label: "Girdle", key: "GIRDLE", index: 27 },
    { label: "Girdle %", key: "GIRDLE_PER", index: 28 },
    { label: "Star", key: "STAR", index: 29 },
    { label: "Key To Symbols", key: "KEY_TO_SYMBOLS", index: 30 },
    { label: "Report Comments", key: "REPORT_COMMENTS", index: 31 },
    { label: "Comments 1", key: "COMMENTS_1", index: 32 },
    { label: "Brl.", key: "BRL", index: 33 },
    { label: "Heart & Arrow", key: "HA", index: 34 },
    { label: "Inscription", key: "INSCRIPTION", index: 35 },
    { label: "Black Size 1", key: "BLACK_SIZE_1", index: 36 },
    { label: "Black Size 2", key: "BLACK_SIZE_2", index: 37 },
    { label: "Feather Size 1", key: "FEATHER_SIZE_1", index: 38 },
    { label: "Feather Size 2", key: "FEATHER_SIZE_2", index: 39 },
    { label: "Open Pos 4", key: "OPEN_POS_4", index: 40 },
    { label: "EC", key: "EC", index: 41 },
    { label: "Shade", key: "SHADE", index: 42 },
    { label: "Type2 Cert", key: "TYPE2_CERT", index: 43 },
    { label: "Block Type Seq", key: "BLOCK_TYPE_SEQ", index: 44 },
  ];

  return (
    <div
      className={`fixed left-0 right-0 bottom-0 top-0 w-full flex items-center justify-center z-40 bg-black/50 ${mavenPro.variable}`}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl w-full h-full overflow-y-auto font-maven-pro scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Header with Title */}
        <div className="bg-[#050C3A] text-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10 mt-25 ">
          {/* <h2 className="text-xl font-bold">Diamond Comparison</h2> */}
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div
            className="bg-white rounded-none shadow-sm overflow-hidden"
            style={{
              border: "1px solid #e7d9b3",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-40">
                  <tr>
                    <th
                      className="p-0 text-left text-sm font-semibold sticky left-0 z-50 min-w-[150px] bg-white align-top"
                      style={{
                        borderRight: "1px solid #e7d9b3",
                        borderBottom: "1px solid #e7d9b3",
                      }}
                    >
                      <div className="flex flex-col">
                        <button
                          onClick={onClose}
                          className="flex items-center gap-2 text-[#050C3A] hover:text-gray-600 transition-colors p-4 w-full"
                        >
                          <ArrowLeft size={18} />
                          <span className="text-sm font-normal">
                            Back to List
                          </span>
                        </button>
                        {/* <div className="px-4 pb-4">
                          <Image 
                            src="/dalila_img/DalilaLogo.png" 
                            alt="Dalila Logo" 
                            width={150}
                            height={50}
                            className="w-full h-auto"
                          />
                        </div> */}
                      </div>
                    </th>
                    {diamonds.map((diamond, index) => (
                      <td
                        key={diamond._id}
                        className="p-4 text-center relative bg-white"
                        style={{
                          borderRight:
                            index < diamonds.length - 1
                              ? "1px solid #e7d9b3"
                              : "none",
                          borderBottom: "1px solid #e7d9b3",
                          width: `${100 / diamonds.length}%`,
                          minWidth: "200px",
                        }}
                      >
                        <button
                          onClick={() => removeDiamond(diamond._id)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-none hover:bg-gray-100 transition-colors shadow-sm border border-gray-300"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="flex flex-col items-center gap-3 mt-6">
                          <div
                            className="relative w-32 h-32 bg-gray-50 rounded-none overflow-hidden"
                            style={{
                              border: "1px solid #e7d9b3",
                            }}
                          >
                            {diamond.REAL_IMAGE ? (
                              <Image
                                src={diamond.REAL_IMAGE}
                                alt={diamond.STONE_NO}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => {
                    const style = getRowStyle(row.index);
                    return (
                      <tr key={row.label}>
                        <th
                          className="p-3 text-left text-sm font-medium sticky left-0 z-10"
                          style={{
                            borderRight: "1px solid #e7d9b3",
                            borderBottom: "1px solid #e7d9b3",
                            backgroundColor: style.bg,
                            color: style.color,
                          }}
                        >
                          {row.label}
                        </th>
                        {diamonds.map((diamond, index) => {
                          let value =
                            diamond[row.key as keyof DiamondData] || "";
                          if (row.transform && typeof value === "string") {
                            value = row.transform(value) || "";
                          }

                          return (
                            <td
                              key={diamond._id}
                              className="p-3 text-center text-sm"
                              style={{
                                borderRight:
                                  index < diamonds.length - 1
                                    ? "1px solid #e7d9b3"
                                    : "none",
                                borderBottom: "1px solid #e7d9b3",
                                backgroundColor: style.bg,
                                color: style.color,
                                width: `${100 / diamonds.length}%`,
                                minWidth: "200px",
                              }}
                            >
                              {value || "-"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Footer - moved outside padding/container for full width */}
        <Footer />
      </div>
    </div>
  );
};

export default DiamondComparisonPage;
