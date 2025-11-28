import DiamondBanner from "@/components/pages/diamondknowledge/Bannersection";
import Diamondshowcase from "@/components/pages/diamondknowledge/Showcase";
import Diamondcuts from "@/components/pages/diamondknowledge/Diamondcuts";
import NaturalVsLabDiamonds from "@/components/pages/diamondknowledge/Lab-GrownDiamonds";
import DiamondShapeCuts from "@/components/pages/diamondknowledge/DiamondShapecuts";
import DiamondCertification from "@/components/pages/diamondknowledge/DiamondCertification";
// import CaringForDiamond from "@/components/pages/diamondknowledge/CaringForDiamond";
export default function Contact() {
  return (
    <>
      <main className="relative">
        <DiamondBanner />
        <Diamondshowcase />
        <Diamondcuts />
        <NaturalVsLabDiamonds />
        <DiamondShapeCuts />
        <DiamondCertification />
        {/* <CaringForDiamond /> */}
      </main>
    </>
  );
}
