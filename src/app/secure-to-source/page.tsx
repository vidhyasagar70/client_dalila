import SecureSourceBanner from "@/components/pages/securesource/Bannersection";
import SecureSourceHero from "@/components/pages/securesource/Herosection";
import SecureSourceshowcase from "@/components/pages/securesource/Showcase";
import S2SAdvantages from "@/components/pages/securesource/Advantage";
import SecureContact from "@/components/pages/securesource/SecureContact";
export default function Contact() {
  return (
    <>
      <main className="relative">
        <SecureSourceBanner />
        <SecureSourceHero />
        <SecureSourceshowcase />
        <S2SAdvantages />
        <SecureContact />
      </main>
    </>
  );
}
