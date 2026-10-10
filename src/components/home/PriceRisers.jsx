"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shared/ProductCard";

export default function PriceRisers() {
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
                    throw new Error("পণ্যের তথ্য সঠিকভাবে পাওয়া যায়নি।");
                }

                const topRisers = data.products
                    .filter((product) => product.change?.dir === "up")
                    .sort(
                        (a, b) =>
                            Number(b.change.pct) - Number(a.change.pct)
                    )
                    .slice(0, 6);

                setState({
                    products: topRisers,
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
            aria-labelledby="price-risers-title"
            aria-busy={state.loading}
        >
          <h2 id="price-risers-title" className="bd-risers-heading">
  <span aria-hidden="true">▲</span>
  আজ দাম বেড়েছে
</h2>

            {state.loading ? (
                <div className="bazar-product-grid" role="status">
                    <span className="sr-only">পণ্যের তথ্য লোড হচ্ছে…</span>

                    {Array.from({ length: 6 }, (_, index) => (
                        <div
                            className="bazar-product-card"
                            key={index}
                            aria-hidden="true"
                        >
                            <div className="bazar-product-top">
                                <div className="skeleton h-12 w-12 shrink-0" />

                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-5 w-3/4" />
                                    <div className="skeleton h-3 w-16" />
                                </div>
                            </div>

                            <div className="bazar-product-bottom">
                                <div className="skeleton h-7 w-24" />
                                <div className="skeleton h-6 w-16" />
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
            ) : state.products.length ? (
                <div className="bazar-product-grid">
                    {state.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="bazar-products-message">
                    আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
                </div>
            )}
        </section>
    );
}