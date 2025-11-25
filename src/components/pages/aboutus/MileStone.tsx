"use client";
import Image from "next/image";
import { Gem } from "lucide-react";
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

export default function AboutMilestone() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <AnimatedContainer direction="up">
          <h1
            className={`text-4xl md:text-5xl lg:text-[3.5rem] font-normal text-center mb-20 text-gray-900 ${marcellus.className}`}
          >
            Milestones & Achievements
          </h1>
        </AnimatedContainer>

        {/* Milestones Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <AnimatedContainer direction="left" delay={0.5}>
              <div className="relative h-[350px] md:h-[390px] w-full max-w-[480px] mx-auto overflow-hidden">
                <Image
                  src="/images/about_us_3.png"
                  alt="Diamond on display"
                  width={480}
                  height={390}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-contain"
                />
              </div>
            </AnimatedContainer>
          </div>

          <div>
            <AnimatedContainer direction="right" delay={0.5}>
              <div className="space-y-8">
                {/* Achievement 1 */}
                <div className="flex gap-4">
                  <Gem className="text-[#c89e3a] flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <p
                      className={`text-gray-600 text-base md:text-lg leading-relaxed ${jost.className} [&>span]:text-[#181818]`}
                    >
                      <span className="font-semibold">
                        50+ years of family expertise in the diamond industry.

                      </span>
                    </p>
                  </div>
                  <Gem className="text-[#c89e3a] flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <p
                      className={`text-gray-600 text-base md:text-lg leading-relaxed ${jost.className} [&>span]:text-[#181818]`}
                    >
                      <span className="font-semibold">
                        Expansion from Surat and Mumbai to a global presence.

                      </span>
                    </p>
                  </div>
                </div>

                {/* Achievement 2 */}
                <div className="flex gap-4">
                  <Gem className="text-[#c89e3a] flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <p
                      className={`text-gray-600 text-base md:text-lg leading-relaxed ${jost.className} [&>span]:text-[#181818]`}
                    >
                      <span className="font-semibold">
                         Strategic establishment in Antwerp (since 2007) to serve and strengthen our European clientele.

                      </span>
                    </p>
                  </div>
                  <Gem className="text-[#c89e3a] flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <p
                      className={`text-gray-600 text-base md:text-lg leading-relaxed ${jost.className} [&>span]:text-[#181818]`}
                    >
                      <span className="font-semibold">
                        A strong international network spanning the United States, Europe, Hong Kong, China, and beyond.

                      </span>
                    </p>
                  </div>
                </div>

                {/* Achievement 3 */}
                <div className="flex gap-4">
                  <Gem className="text-[#c89e3a] flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <p
                      className={`text-gray-600 text-base md:text-lg leading-relaxed ${jost.className} [&>span]:text-[#181818]`}
                    >
                      <span className="font-semibold">
                        A reputation built on quality, transparency, and long-standing relationships.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
