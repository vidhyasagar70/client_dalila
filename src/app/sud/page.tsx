import WebuyBanner from "@/components/pages/sud/Bannersection";
import Webuyhero from "@/components/pages/sud/Herosection";
import SellDiamondsProcess from "@/components/pages/sud/SellDiamond";
import SellDiamondsForm from "@/components/pages/sud/SellDiamondform";
import FreeEstimateSteps from "@/components/pages/sud/FreeEstimateSteps";
export default function Webuy() {
  return (
    <>
      <main className="relative">
        <WebuyBanner />
        <Webuyhero />
        <SellDiamondsProcess />
        <FreeEstimateSteps />
        <SellDiamondsForm />
      </main>
    </>
  );
}
