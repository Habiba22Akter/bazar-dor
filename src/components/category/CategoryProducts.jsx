"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

const numberBn = new Intl.NumberFormat("bn-BD");

function numericPrice(value) {
  const text = String(value ?? "")
    .replace(/[০-৯]/g, (digit) =>
      "০১২৩৪৫৬৭৮৯".indexOf(digit)
    )
    .replace(/[,\s]/g, "");

  const number = Number(text);

  return Number.isFinite(number) ? number : 0;
}

function CategorySkeleton() {
  return (
    <div role="status">
      <span className="sr-only">পণ্য লোড হচ্ছে…</span>

      <div className="skeleton bd-category__heading-skeleton" />
      <div className="skeleton bd-category__sort-skeleton" />
      <div className="skeleton bd-category__count-skeleton" />

      <div className="bd-category__grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="skeleton bd-category__card-skeleton"
          />
        ))}
      </div>
    </div>
  );
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

    async function loadCategory() {
      setState({
        loading: true,
        error: "",
        category: null,
        products: [],
      });

      try {
        const response = await fetch(
          `/api/category?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (controller.signal.aborted) return;

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
            data.message || "পণ্যের তথ্য লোড করা যায়নি।"
          );
        }

        if (!data.category || !Array.isArray(data.products)) {
          throw new Error("পণ্যের তথ্য সঠিকভাবে পাওয়া যায়নি।");
        }

        setState({
          loading: false,
          error: "",
          category: data.category,
          products: data.products.filter(
            (product) => product.category === slug
          ),
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "পণ্যের তথ্য লোড করা যায়নি।",
          category: null,
          products: [],
        });
      }
    }

    loadCategory();

    return () => controller.abort();
  }, [slug, attempt]);

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

  const icon = state.category?.icon;

  return (
    <main className="bd-category-page">
      <section className="bazar-container bd-category">
        {state.loading ? (
          <CategorySkeleton />
        ) : state.error ? (
          <div className="bd-category__message" role="alert">
            <h1>তথ্য লোড করা যায়নি</h1>
            <p>{state.error}</p>

            <button
              type="button"
              className="btn btn-primary bd-category__message-button"
              onClick={() =>
                setAttempt((previous) => previous + 1)
              }
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : !state.category || products.length === 0 ? (
          <div className="bd-category__message">
            <h1>৪০৪ — এই বিভাগে পণ্য পাওয়া যায়নি</h1>
            <p>
              বিভাগটি সঠিক নয় অথবা এখানে কোনো পণ্য নেই।
            </p>

            <Link
              href="/"
              className="btn btn-primary bd-category__message-button"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <>
            <header className="bd-category__heading">
              <span
                className="bd-category__icon"
                aria-hidden="true"
              >
                {icon}
              </span>

              <div>
                <h1>{state.category.nameBn}</h1>
                <p>
                  {numberBn.format(products.length)}টি পণ্যের
                  আজকের দাম ও পরিবর্তন
                </p>
              </div>
            </header>

            <div className="bd-category__toolbar">
              <label
                htmlFor="category-sort"
                className="bd-category__sort-label"
              >
                সাজান
              </label>

              <div className="bd-category__select-wrap">
                <select
                  id="category-sort"
                  className="bd-category__select"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="asc">
                    দাম: কম থেকে বেশি
                  </option>
                  <option value="desc">
                    দাম: বেশি থেকে কম
                  </option>
                </select>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p
              className="bd-category__count"
              aria-live="polite"
            >
              মোট {numberBn.format(products.length)}টি পণ্য
              দেখানো হচ্ছে
            </p>

            <div className="bd-category__grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id ?? product.slug}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}