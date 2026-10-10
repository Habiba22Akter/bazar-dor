"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shared/ProductCard";

export default function PriceFallers() {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: "",
  });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/navigation", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "পণ্যের তথ্য লোড করা যায়নি।");
        }

        if (!Array.isArray(data.products)) {
          throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
        }

        const topFallers = data.products
          .filter((product) => product.change?.dir === "down")
          .sort(
            (a, b) =>
              Math.abs(Number(b.change.pct) || 0) -
              Math.abs(Number(a.change.pct) || 0)
          )
          .slice(0, 6);

        setState({
          products: topFallers,
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          products: [],
          loading: false,
          error: error.message || "পণ্যের তথ্য লোড করা যায়নি।",
        });
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({
      products: [],
      loading: true,
      error: "",
    });

    setAttempt((previous) => previous + 1);
  }

  return (
    <section
      className="bazar-container bazar-products-section"
      aria-labelledby="price-fallers-title"
      aria-busy={state.loading}
    >
      <h2 id="price-fallers-title" className="bd-fallers-heading">
        <span aria-hidden="true">▼</span>
        আজ দাম কমেছে
      </h2>

      {state.loading ? (
        <div className="bazar-product-grid" role="status">
          <span className="sr-only">পণ্যের দাম লোড হচ্ছে…</span>

          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="bd-price-card bd-faller-skeleton"
              aria-hidden="true"
            >
              <div className="bd-price-card__top">
                <div className="skeleton h-12 w-12 shrink-0 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>

              <div className="bd-price-card__bottom">
                <div className="skeleton h-7 w-24" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : state.error ? (
        <div className="bazar-products-message" role="alert">
          <p>{state.error}</p>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={retry}
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : state.products.length > 0 ? (
        <div className="bazar-product-grid">
          {state.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bazar-products-message">
          <p>আজ দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।</p>
        </div>
      )}
    </section>
  );
}