"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const number = (value, digits = 0) =>
  new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const units = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function subscribeDate(callback) {
  const timer = setInterval(callback, 60000);

  return () => clearInterval(timer);
}

function currentDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function PriceChange({ change }) {
  const direction = change?.dir || "flat";

  return (
    <span className={`bazar-change ${direction}`}>
      {direction === "up"
        ? "▲"
        : direction === "down"
          ? "▼"
          : "—"}{" "}
      {number(Math.abs(Number(change?.pct || 0)), 1)}%
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const date = useSyncExternalStore(
    subscribeDate,
    currentDate,
    () => "",
  );

  const { data: session, isPending } = authClient.useSession();

  const [catalog, setCatalog] = useState({
    categories: [],
    products: [],
    loading: true,
    error: "",
  });

  const [attempt, setAttempt] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/navigation", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        setCatalog({
          ...data,
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
            error.message || "বাজারের তথ্য লোড করা যায়নি।",
        });
      }
    }

    load();

    return () => controller.abort();
  }, [attempt]);

  async function signOut() {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) throw new Error(error.message);

      toast.success("সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="bazar-header">
      {/* Logo, date এবং authentication buttons */}
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
          {isPending ? (
            <span
              className="skeleton h-9 w-32"
              aria-label="অ্যাকাউন্ট লোড হচ্ছে"
            />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                className="btn btn-ghost btn-sm bazar-profile"
              >
                <span className="bazar-avatar">
                  {session.user.name?.slice(0, 1) || "●"}
                </span>
                <span>আমার প্রোফাইল</span>
              </Link>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={signOut}
                disabled={signingOut}
              >
                {signingOut ? "অপেক্ষা করুন…" : "সাইন আউট"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-ghost btn-sm"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="btn btn-primary btn-sm"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* দ্বিতীয় সারিতে category navigation */}
      <div className="bazar-nav-row">
        <nav
          className="bazar-container bazar-category-nav"
          aria-label="পণ্যের বিভাগ"
        >
          <Link
            href="/"
            className={`bazar-nav-link ${
              pathname === "/" ? "is-active" : ""
            }`}
            aria-current={
              pathname === "/" ? "page" : undefined
            }
          >
            সব পণ্য
          </Link>

          {catalog.loading
            ? Array.from({ length: 6 }, (_, i) => (
                <span
                  key={i}
                  className="skeleton bazar-nav-skeleton"
                />
              ))
            : catalog.categories.map((category) => {
                const href = `/category/${category.slug}`;

                const active =
                  pathname === href ||
                  pathname.startsWith(`${href}/`);

                return (
                  <Link
                    href={href}
                    key={category.id || category.slug}
                    className={`bazar-nav-link ${
                      active ? "is-active" : ""
                    }`}
                    aria-current={
                      active ? "page" : undefined
                    }
                  >
                    <span aria-hidden="true">
                      {category.icon}
                    </span>
                    {category.nameBn}
                  </Link>
                );
              })}
        </nav>
      </div>

      {/* Navbar-এর নিচে infinite price ticker */}
      {catalog.loading ? (
        <div className="bazar-ticker-loading" role="status">
          <span className="loading loading-spinner loading-xs" />
          বাজারের দাম লোড হচ্ছে…
        </div>
      ) : catalog.error ? (
        <div className="bazar-ticker-error" role="alert">
          <span>{catalog.error}</span>

          <button
            type="button"
            onClick={() => {
              setCatalog((state) => ({
                ...state,
                loading: true,
                error: "",
              }));

              setAttempt((value) => value + 1);
            }}
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
                className="bazar-ticker-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {catalog.products.map((product) => (
                  <span
                    className="bazar-ticker-item"
                    key={product.id}
                  >
                    <span aria-hidden="true">
                      {product.image || product.categoryIcon}
                    </span>

                    <span>{product.nameBn}</span>

                    <strong>
                      {number(Number(product.today))} টাকা/
                      {units[product.unit] || product.unit}
                    </strong>

                    <PriceChange change={product.change} />
                  </span>
                ))}
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