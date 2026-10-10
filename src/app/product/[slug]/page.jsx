import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

const units = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function banglaNumber(value, digits = 0) {
  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value));
}

// পূর্ণসংখ্যা: ৬২
// ভগ্নাংশ: ৬৩.৫০
function marketPrice(value) {
  const number = Number(value);

  return banglaNumber(
    number,
    Number.isInteger(number) ? 0 : 2
  );
}

function DetailsLoading() {
  return (
    <div
      className="bazar-container space-y-6 py-10"
      role="status"
    >
      <span className="sr-only">
        পণ্যের বিস্তারিত লোড হচ্ছে…
      </span>

      <div className="skeleton h-6 w-56" />
      <div className="skeleton h-44 w-full rounded-2xl" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="skeleton h-28 rounded-xl"
          />
        ))}
      </div>

      <div className="skeleton h-72 w-full rounded-2xl" />
    </div>
  );
}

async function ProductDetails({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const unit = units[product.unit] || product.unit;
  const direction = product.change?.dir || "flat";

  const percentage = Math.abs(
    Number(product.change?.pct) || 0
  );

  const difference = Math.abs(
    Number(product.today) - Number(product.yesterday)
  );

  const emoji = product.image || product.categoryIcon;

  const markets = (
    Array.isArray(product.markets) ? product.markets : []
  )
    .filter(
      (market) =>
        market.min != null &&
        market.max != null &&
        Number.isFinite(Number(market.min)) &&
        Number.isFinite(Number(market.max))
    )
    .map((market) => {
      const min = Number(market.min);
      const max = Number(market.max);

      return {
        ...market,
        min,
        max,
        average: (min + max) / 2,
      };
    })
    .sort((a, b) => a.average - b.average);

  const minimum = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maximum = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const average = markets.length
    ? markets.reduce(
        (total, market) => total + market.average,
        0
      ) / markets.length
    : null;

  // ওপরের summary card-এ Figma অনুযায়ী পূর্ণসংখ্যা
  function summaryPrice(value) {
    return value === null ? "—" : banglaNumber(value);
  }

  return (
    <main className="bd-details-page">
      <div className="bazar-container bd-details">
        <nav
          className="bd-details__breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">হোম</Link>
          <span aria-hidden="true">›</span>

          <Link href={`/category/${product.category}`}>
            {product.categoryNameBn}
          </Link>

          <span aria-hidden="true">›</span>
          <span aria-current="page">
            {product.nameBn}
          </span>
        </nav>

        <section
          className="bd-details__hero"
          aria-labelledby="product-title"
        >
          <div className="bd-details__identity">
            <span
              className="bd-details__emoji"
              aria-hidden="true"
            >
              {emoji}
            </span>

            <div>
              <h1 id="product-title">
                {product.nameBn}
              </h1>

              <p className="bd-details__meta">
                প্রতি {unit} ·{" "}
                <Link href={`/category/${product.category}`}>
                  {product.categoryNameBn}
                </Link>
              </p>

              <p className="bd-details__comparison">
                গতকালের তুলনায় আজ দাম{" "}
                <strong>
                  {direction === "up"
                    ? "বেড়েছে"
                    : direction === "down"
                      ? "কমেছে"
                      : "অপরিবর্তিত"}
                </strong>

                {direction !== "flat" &&
                  ` · ${banglaNumber(difference)} টাকা`}
              </p>
            </div>
          </div>

          <div className="bd-details__today">
            <p>আজকের দাম</p>

            <strong>
              {banglaNumber(product.today)}
            </strong>

            <p>টাকা / {unit}</p>

            <span
              className={`bd-details__change is-${direction}`}
            >
              {direction === "up"
                ? "▲"
                : direction === "down"
                  ? "▼"
                  : "—"}{" "}
              {banglaNumber(percentage, 1)}%
            </span>
          </div>
        </section>

        <section className="bd-details__panel">
          <h2>দামের সারসংক্ষেপ</h2>

          <div className="bd-details__stats">
            <div className="bd-details__stat">
              <p>সর্বনিম্ন দাম</p>

              <p className="bd-details__stat-price is-min">
                <strong>{summaryPrice(minimum)}</strong> টাকা
              </p>

              <p>সবচেয়ে কম দামের বাজার</p>
            </div>

            <div className="bd-details__stat">
              <p>সর্বাধিক দাম</p>

              <p className="bd-details__stat-price is-max">
                <strong>{summaryPrice(maximum)}</strong> টাকা
              </p>

              <p>সবচেয়ে বেশি দামের বাজার</p>
            </div>

            <div className="bd-details__stat">
              <p>গড় দাম</p>

              <p className="bd-details__stat-price is-average">
                <strong>{summaryPrice(average)}</strong> টাকা
              </p>

              <p>প্রতি {unit}-এর হিসাবে</p>
            </div>
          </div>

          <h2 className="bd-details__markets-title">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="bd-details__table-wrap overflow-x-auto">
              <table className="bd-details__table">
                <caption className="sr-only">
                  {product.nameBn} — বাজারভিত্তিক দাম,
                  প্রতি {unit}, গড় দাম কম থেকে বেশি
                </caption>

                <thead>
                  <tr>
                    <th scope="col">বাজার</th>
                    <th scope="col">বিভাগ</th>
                    <th scope="col">সর্বনিম্ন</th>
                    <th scope="col">সর্বাধিক</th>
                    <th scope="col">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => (
                    <tr key={`${market.market}-${index}`}>
                      <td>{market.market}</td>
                      <td>{market.division}</td>

                      <td>
                        {marketPrice(market.min)} টাকা
                      </td>

                      <td>
                        {marketPrice(market.max)} টাকা
                      </td>

                      <td>
                        <strong>
                          {marketPrice(market.average)} টাকা
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="bd-details__empty">
              এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ProductDetailsPage({ params }) {
  return (
    <Suspense fallback={<DetailsLoading />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}