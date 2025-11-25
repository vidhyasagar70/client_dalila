"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import GoldButton from "@/components/ui/button";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

const playFair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function HomeContent() {
    const router = useRouter();

    return (
        <div className="bg-white py-12 md:py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
                {/* Sell Diamonds Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16 md:mb-24 lg:mb-32">
                    <div>
                        <AnimatedContainer direction="scale-out">
                            <div className="relative h-[280px] sm:h-[320px] md:h-[350px] lg:h-[390px] w-full max-w-[480px] mx-auto rounded-none overflow-hidden shadow-2xl ">
                                <Image
                                    src="/diamondcuts/sell-diamonds.jpg"
                                    alt="Professional diamond dealer"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </AnimatedContainer>
                    </div>

                    <div>
                        <div className="max-w-xl">
                            <AnimatedContainer direction="up">
                                <h2
                                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-light mb-4 md:mb-6 lg:mb-7 text-gray-900 leading-[1.15] tracking-tight ${playFair.className}`}
                                >
                                    Sell Your Diamonds
                                    <br />
                                    Safely and
                                    <br />
                                    Seamlessly at Dalila
                                </h2>
                            </AnimatedContainer>
                            <AnimatedContainer direction="up" delay={0.3}>
                                <p
                                    className={`text-gray-600 leading-relaxed mb-6 md:mb-8 text-xs sm:text-sm md:text-[15px] lg:text-base font-normal ${playFair.className}`}
                                >
                                    Selling your diamond or fine jewelry should
                                    be a seamless, secure, and rewarding
                                    experience. At Dalila, we offer a
                                    transparent and hassle-free process, trusted
                                    by customers. Whether you&apos;re parting
                                    with an engagement ring, heirloom or a loose
                                    diamond, we value every piece. Here&apos;s
                                    how the process works
                                </p>
                            </AnimatedContainer>

                            <GoldButton
                                text="Sell Now"
                                onClick={() => router.push("/sud")}
                            />
                        </div>
                    </div>
                </div>

                {/* Language of Diamonds Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="max-w-xl">
                            <AnimatedContainer direction="up" delay={0.1}>
                                <h2
                                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-light mb-4 md:mb-6 lg:mb-7 text-gray-900 leading-[1.15] tracking-tight ${playFair.className}`}
                                >
                                    The Language of
                                    <br />
                                    Diamonds
                                </h2>
                            </AnimatedContainer>
                            <AnimatedContainer direction="up" delay={0.3}>
                                <p
                                    className={`text-gray-600 leading-relaxed mb-6 md:mb-8 text-xs sm:text-sm md:text-[15px] lg:text-base font-normal ${playFair.className}`}
                                >
                                    Diamonds are more than just gemstones — they
                                    are timeless symbols of love, craftsmanship,
                                    and nature&apos;s brilliance. Formed deep
                                    within the Earth over billions of years,
                                    every natural diamond carries a story of
                                    purity and perfection. Whether you&apos;re
                                    buying your first diamond or expanding your
                                    collection, understanding the key aspects of
                                    a diamond helps you make a truly informed
                                    choice. This guide is designed to help you
                                    explore every detail — from how diamonds are
                                    formed to what makes each one unique.
                                </p>
                            </AnimatedContainer>

                            <GoldButton
                                text="Explore More"
                                onClick={() => router.push("/inventory")}
                            />
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <AnimatedContainer direction="scale-out" delay={0.5}>
                            <div className="relative h-[280px] sm:h-[320px] md:h-[350px] lg:h-[390px] w-full max-w-[480px] mx-auto rounded-none overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/diamondwork.png"
                                    alt="Diamond examination with tweezers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </AnimatedContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
