"use client";
import { Marcellus, Jost } from "next/font/google";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import GoldButton from "@/components/ui/button";
import { FaCheck } from "react-icons/fa";
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

export default function DiamondSourceAdvantages() {
  const router = useRouter();

  const advantages = [
    {
      title: "Weekly Shipments from India",
      description: "Reliable weekly dispatches (excluding Indian public holidays)",
    },
    {
      title: "Free Delivery in Belgium",
      description: "Enjoy secure delivery at no additional cost",
    },
    {
      title: "EU Shipping Available",
      description: "FedEx rates apply for other EU destinations",
    },
    {
      title: "Euro Payment Accepted",
      description: "Simple and convenient payments in your local currency",
    },
  ];

  return (
    <div className="bg-[#0B1A33] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <AnimatedContainer direction="up">
          <h2
            className={`text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-center mb-8 md:mb-10 text-white tracking-tight ${marcellus.className}`}
          >
            WHY CHOOSE DS4U?
          </h2>
        </AnimatedContainer>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-10 max-w-5xl mx-auto mb-8">
          {advantages.map((advantage, index) => (
            <AnimatedContainer
              key={advantage.title}
              direction="up"
              delay={index * 0.15}
            >
              <div className="flex items-start gap-3.5">
                {/* Icon Circle */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-white" size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  {/* Title */}
                  <h3
                    className={`text-lg md:text-xl font-normal mb-1 text-white leading-snug ${marcellus.className}`}
                  >
                    {advantage.title}
                  </h3>
                  {/* Description */}
                  <p
                    className={`text-white/75 text-[14px] md:text-[15px] leading-relaxed ${jost.className}`}
                  >
                    {advantage.description}
                  </p>
                </div>
              </div>
            </AnimatedContainer>
          ))}
        </div>

        {/* Contact Button */}
        <AnimatedContainer direction="up" delay={0.6}>
          <div className="flex justify-center mt-6">
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
