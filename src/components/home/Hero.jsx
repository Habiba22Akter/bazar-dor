"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

function subscribeDate(callback) {
  const timer = setInterval(callback, 60000);
  return () => clearInterval(timer);
}

function getDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Hero() {
  const date = useSyncExternalStore(subscribeDate, getDate, () => "");

  return (
    <section className="bazar-container bazar-hero">
      <div className="bazar-hero-content">
        <span className="bazar-hero-eyebrow">
          {date || "আজকের বাজার দর"}
        </span>

        <h1>আজকের বাজারের দাম এক নজরে</h1>

        <p>
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
          বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের
          পরিবর্তন এক জায়গায়।
        </p>

        <a href="#সব-পণ্য" className="btn bazar-hero-button">
          সব পণ্য দেখুন
        </a>
      </div>

      <div className="bazar-hero-visual">
        <Image
          src="/assets/bazar-hero.png"
          alt="ফল ও বাজারের পণ্যে ভরা ঝুড়ি"
          width={315}
          height={263}
          className="bazar-hero-image"
          priority
        />
      </div>
    </section>
  );
}