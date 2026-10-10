"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

function numericPrice(value) {
  const text = String(value ?? "")
    .replace(/[০-৯]/g, (digit) =>
      "০১২৩৪৫৬৭৮৯".indexOf(digit)
    )
    .replace(/[,\s]/g, "");

  const number = Number(text);

  return Number.isFinite(number) ? number : 0;
}

export default function CategoryProducts({ slug }) {
  const [state, setState] = useState({
    loading: true,
    error: "",
    category: null,
    products: [],
  });

  const [sort, setSort] = useState("default");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          `/api/category?slug=${encodeURIComponent(slug)}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (response.status === 404) {
          setState({
            loading: false,
            error: "",
            category: null,
            products: [],
          });

          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "তথ্য লোড করা যায়নি।"
          );
        }

        if (
          !data.category ||
          !Array.isArray(data.products)
        ) {
          throw new Error(
            "API থেকে সঠিক তথ্য পাওয়া যায়নি।"
          );
        }

        setState({
          loading: false,
          error: "",
          category: data.category,
          products: data.products.filter(
            (item) => item.category === slug
          ),
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          loading: false,
          error: error.message || "তথ্য লোড করা যায়নি।",
          category: null,
          products: [],
        });
      }
    }

    load();

    return () => controller.abort();
  }, [slug, attempt]);

  function retry() {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: "",
    }));

    setAttempt((previous) => previous + 1);
  }

  // Copy করে sort করছি, তাই default order অক্ষত থাকে।
  const products = [...state.products];

  if (sort === "asc") {
    products.sort(
      (a, b) => numericPrice(a.today) - numericPrice(b.today)
    );
  }

  if (sort === "desc") {
    products.sort(
      (a, b) => numericPrice(b.today) - numericPrice(a.today)
    );
  }

  return (
    <section className="bazar-container py-10 min-h-[60vh]">
      {state.loading ? (
        <div role="status">
          <span className="sr-only">
            পণ্য লোড হচ্ছে…
          </span>

          <div className="skeleton h-8 w-48 mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="skeleton h-44 rounded-2xl"
              />
            ))}
          </div>
        </div>
      ) : state.error ? (
        <div
          className="text-center py-12"
          role="alert"
        >
          <p>{state.error}</p>

          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={retry}
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : !state.category || !products.length ? (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">
            ৪০৪ — এই বিভাগে পণ্য পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-base-content/70">
            বিভাগটি সঠিক নয় অথবা এখানে কোনো পণ্য নেই।
          </p>

          <Link
            href="/"
            className="btn btn-primary mt-5"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">
              <span aria-hidden="true">
                {state.category.icon}
              </span>{" "}
              {state.category.nameBn}
            </h1>

            <label className="flex items-center gap-3">
              সাজান:

              <select
                className="select select-bordered"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
              >
                <option value="default">
                  ডিফল্ট
                </option>

                <option value="asc">
                  দাম: কম থেকে বেশি
                </option>

                <option value="desc">
                  দাম: বেশি থেকে কম
                </option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}