"use client";
import { Marcellus, Jost } from "next/font/google";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import GoldButton from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

export default function DiamondContact() {
  const router = useRouter();
  return (
    <div className="bg-white py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        {/* Heading */}
        <AnimatedContainer direction="up">
          <h2
            className={`text-3xl md:text-4xl lg:text-[2.75rem] font-normal mb-5 text-gray-900 tracking-tight ${marcellus.className}`}
          >
            Have Any Questions?
          </h2>
        </AnimatedContainer>

        {/* Description */}
        <AnimatedContainer direction="up" delay={0.2}>
          <p
            className={`text-gray-700 text-base md:text-lg mb-8 ${jost.className}`}
          >
            Contact us now to learn more about our diamond sourcing services
          </p>
        </AnimatedContainer>

        {/* CTA Button */}
        <AnimatedContainer direction="up" delay={0.4}>
          <div className="flex justify-center">
            <GoldButton
              text="CONTACT US"
              onClick={() => router.push("/contact")}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
