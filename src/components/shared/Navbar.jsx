"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import UserMenu from "@/components/auth/UserMenu";

const units = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function banglaNumber(value, digits = 0) {
  const number = Number(value);

  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(
    Number.isFinite(number) ? number : 0
  );
}

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

function getServerDate() {
  return "";
}

function PriceChange({ change }) {
  const direction = change?.dir || "flat";

  return (
    <span
      className={`bazar-change ${direction}`}
    >
      {direction === "up"
        ? "▲"
        : direction === "down"
          ? "▼"
          : "—"}{" "}
      {banglaNumber(
        Math.abs(Number(change?.pct) || 0),
        1
      )}
      %
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const date = useSyncExternalStore(
    subscribeDate,
    getDate,
    getServerDate
  );

  const [catalog, setCatalog] = useState({
    categories: [],
    products: [],
    loading: true,
    error: "",
  });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNavigation() {
      try {
        const response = await fetch(
          "/api/navigation",
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
            "বাজারের তথ্য লোড করা যায়নি।"
          );
        }

        if (
          !Array.isArray(data.categories) ||
          !Array.isArray(data.products)
        ) {
          throw new Error(
            "বাজারের তথ্য সঠিকভাবে পাওয়া যায়নি।"
          );
        }

        if (controller.signal.aborted) return;

        setCatalog({
          categories: data.categories.filter(
            (category) =>
              typeof category.slug === "string" &&
              category.slug.trim()
          ),

          products: data.products.filter(
            (product) =>
              typeof product.slug === "string" &&
              product.slug.trim()
          ),

          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setCatalog({
          categories: [],
          products: [],
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "বাজারের তথ্য লোড করা যায়নি।",
        });
      }
    }

    loadNavigation();

    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setCatalog((previous) => ({
      ...previous,
      loading: true,
      error: "",
    }));

    setAttempt((previous) => previous + 1);
  }

  return (
    <header className="bazar-header">
      <div className="bazar-container bazar-topbar">
        <Link
          href="/"
          className="bazar-brand"
          aria-label="বাজার দর হোম"
        >
          <span className="bazar-logo">
            <Image
              src="/assets/logo-icon.png"
              alt=""
              width={22}
              height={22}
              priority
            />

            বাজার দর
          </span>

          <span className="bazar-date">
            {date || "বাংলাদেশের বাজার দর"}
          </span>
        </Link>

        <div className="bazar-auth">
          <UserMenu />
        </div>
      </div>

      <div className="bazar-nav-row">
        <nav
          className="bazar-container bazar-category-nav"
          aria-label="পণ্যের বিভাগ"
        >
          {catalog.loading
            ? Array.from(
                { length: 6 },
                (_, index) => (
                  <span
                    key={index}
                    className="skeleton bazar-nav-skeleton"
                  />
                )
              )
            : catalog.categories.map(
                (category) => {
                  const href =
                    `/category/${encodeURIComponent(
                      category.slug
                    )}`;

                  const active =
                    pathname === href ||
                    pathname?.startsWith(
                      `${href}/`
                    );

                  return (
                    <Link
                      key={category.slug}
                      href={href}
                      className={
                        `bazar-nav-link ${
                          active
                            ? "is-active"
                            : ""
                        }`
                      }
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                    >
                      <span aria-hidden="true">
                        {category.icon}
                      </span>

                      {category.nameBn}
                    </Link>
                  );
                }
              )}
        </nav>
      </div>

      {catalog.loading ? (
        <div
          className="bazar-ticker-loading"
          role="status"
        >
          <span className="loading loading-spinner loading-xs" />
          বাজারের দাম লোড হচ্ছে…
        </div>
      ) : catalog.error ? (
        <div
          className="bazar-ticker-error"
          role="alert"
        >
          <span>{catalog.error}</span>

          <button
            type="button"
            onClick={retry}
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : catalog.products.length > 0 ? (
        <div
          className="bazar-ticker"
          aria-label="আজকের বাজারের দাম"
        >
          <div className="bazar-ticker-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="bazar-ticker-group"
                aria-hidden={
                  copy === 1
                    ? true
                    : undefined
                }
              >
                {catalog.products.map(
                  (product) => (
                    <Link
                      key={
                        product.id ??
                        product.slug
                      }
                      href={
                        `/product/${encodeURIComponent(
                          product.slug
                        )}`
                      }
                      className="bazar-ticker-item"
                      tabIndex={
                        copy === 1
                          ? -1
                          : undefined
                      }
                    >
                      <span aria-hidden="true">
                        {product.image ||
                          product.categoryIcon}
                      </span>

                      <span>
                        {product.nameBn}
                      </span>

                      <strong>
                        {banglaNumber(
                          product.today
                        )}{" "}
                        টাকা/
                        {units[product.unit] ||
                          product.unit}
                      </strong>

                      <PriceChange
                        change={product.change}
                      />
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bazar-ticker-loading">
          এখন কোনো পণ্যের দাম পাওয়া যায়নি।
        </div>
      )}
    </header>
  );
}