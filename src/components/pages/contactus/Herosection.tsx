"use client";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
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

export default function ContactHeroSection() {
  const goldColor = "#B58900";

  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-7xl px-4 pt-16 pb-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <p
              className={`text-sm uppercase tracking-widest mb-4 ${jost.className}`}
              style={{ color: goldColor }}
            >
              GET IN TOUCH
            </p>

            <h1
              className={`text-5xl lg:text-6xl  mb-12 text-gray-900 ${marcellus.className}`}
            >
              Contact Us
            </h1>

            {/* Contact Cards */}
            <AnimatedContainer direction="right">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Email Support Card */}

                <div className="space-y-4">
                  <div
                    className="w-20 h-20 flex items-center justify-center"
                    style={{ backgroundColor: goldColor }}
                  >
                    <Mail className="w-10 h-10 text-white" />
                  </div>

                  <h3
                    className={`text-xl  text-gray-900 ${marcellus.className}`}
                  >
                    Email Support
                  </h3>

                  <p
                    className={`text-gray-600 text-sm leading-relaxed ${jost.className}`}
                  >
                    Reach out to us via email for any inquiries or support. Our
                    team responds within 24 hours.
                  </p>
                </div>

                {/* Call Us Card */}

                <div className="space-y-4">
                  <div
                    className="w-20 h-20 flex items-center justify-center"
                    style={{ backgroundColor: goldColor }}
                  >
                    <Phone className="w-10 h-10 text-white" />
                  </div>

                  <h3
                    className={`text-xl  text-gray-900 ${marcellus.className}`}
                  >
                    Call Us
                  </h3>

                  <p
                    className={`text-gray-600 text-sm leading-relaxed ${jost.className}`}
                  >
                    Contact our friendly team by phone for immediate assistance
                    or to book an appointment.
                  </p>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* Right Column - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Service Representative Image */}
              <AnimatedContainer direction="up">
                <div className="relative bg-gray-100 rounded-none overflow-hidden h-[500px]">
                  <Image
                    src="/dalila_img/contact-1.webp"
                    alt="Customer service representative"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </AnimatedContainer>

              {/* Diamond Image */}
              <AnimatedContainer direction="up" delay={0.2}>
                <div className="relative bg-black rounded-none overflow-hidden h-[500px]">
                  <Image
                    src="/dalila_img/contact-3.png"
                    alt="Luxury diamond"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
