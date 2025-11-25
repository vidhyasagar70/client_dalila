"use client";
import Image from "next/image";
import Link from "next/link";
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

export default function ContactBanner() {
  return (
    <section className="relative h-[60vh] md:h-[55vh] lg:h-[50vh] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner-dalila-contact.png"
          alt="About Us Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center py-14">
        <AnimatedContainer direction="right">
          <div className="opacity-100">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide text-white mb-3 mt-35 ${marcellus.className}`}
            >
              CONTACT US
            </h1>
            <div className="w-[35%] h-px bg-amber-400 mx-auto mb-6 " />
            <p className="text-[#8E939C]">
              Have a question or need assistance with your booking? Our
              dedicated team is<br></br> available around the clock to provide
              you with prompt and friendly service.
            </p>
          </div>
        </AnimatedContainer>

        <div className="opacity-100 mt-6">
          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm md:text-base">
            <Link
              href="/"
              className={`hover:text-amber-400 transition-colors ${jost.className}`}
            >
              Home
            </Link>
            <span>›</span>
            <span>CONTACT US</span>
          </div>
        </div>
      </div>
    </section>
  );
}
