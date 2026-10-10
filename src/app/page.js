import Hero from "@/components/home/Hero";
import PriceRisers from "@/components/home/PriceRisers";
import PriceFallers from "@/components/home/PriceFallers";

export default function Home() {
  return (
    <>
      <Hero />

      <PriceRisers />

      <PriceFallers />

      <section
        id="সব-পণ্য"
        className="bazar-container bazar-all-products"
      >
        <h2>সব পণ্য</h2>
        <p>প্রয়োজনীয় পণ্যের আজকের দাম ও পরিবর্তন এক নজরে।</p>
      </section>
    </>
  );
}