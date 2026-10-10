import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Hero />

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