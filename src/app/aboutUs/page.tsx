import AboutBanner from "@/components/pages/aboutus/Bannersection";
import AboutHero from "@/components/pages/aboutus/Herosection";
import Legacy from "@/components/pages/aboutus/Legacy";
import Aboutshowcase from "@/components/pages/aboutus/Showcase";
import CertifiedBy from "@/components/pages/homecomponents/Certified";
import DiamondExperience from "@/components/pages/homecomponents/experience";
import AboutMilestone from "@/components/pages/aboutus/MileStone";
export default function AboutPage() {
  return (
    <>
      <main className="relative">
        <AboutBanner />
        <AboutHero />
        <DiamondExperience />
        <Legacy />
        <AboutMilestone />
        <Aboutshowcase />
        <CertifiedBy />
      </main>
    </>
  );
}
