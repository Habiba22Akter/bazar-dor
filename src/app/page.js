import Hero from "@/components/home/Hero";
import PriceRisers from "@/components/home/PriceRisers";
import PriceFallers from "@/components/home/PriceFallers";
import AllProducts from "@/components/home/AllProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <PriceRisers />
      <PriceFallers />
      <AllProducts />
    </>
  );
}