import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductDetailsLoading from "./loading";

const units = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const numberBn = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const percentBn = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatPrice(value) {
  return value === null ? "—" : numberBn.format(value);
}

async function ProductDetails({ params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const unit = units[product.unit] || product.unit;

  const direction = product.change?.dir || "flat";

  const percentage = Math.abs(Number(product.change?.pct) || 0);

  const difference = Math.abs(
    Number(product.today) - Number(product.yesterday)
  );

  const markets = product.markets
    .filter(
      (market) =>
        market.min !== null &&
        market.min !== "" &&
        market.max !== null &&
        market.max !== "" &&
        Number.isFinite(Number(market.min)) &&
        Number.isFinite(Number(market.max))
    )
    .map((market) => ({
      ...market,
      min: Number(market.min),
      max: Number(market.max),
      average: (Number(market.min) + Number(market.max)) / 2,
    }));

  const minimum = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maximum = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const average = markets.length
    ? markets.reduce((total, market) => total + market.average, 0) /
      markets.length
    : null;

  return (
    <div className="bd-details-page">
      <div className="bazar-container bd-details">
        {/* Breadcrumb */}
        <nav
          className="bd-details__breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">হোম</Link>

          <span aria-hidden="true">›</span>

          {/* Category link Step 5-এ যুক্ত হবে */}
          <span>{product.categoryNameBn}</span>

          <span aria-hidden="true">›</span>

          <span aria-current="page">{product.nameBn}</span>
        </nav>

        {/* Product summary */}
        <section
          className="bd-details__hero"
          aria-labelledby="product-title"
        >
          <div className="bd-details__identity">
            <span
              className="bd-details__emoji"
              aria-hidden="true"
            >
              {product.image || product.categoryIcon}
            </span>

            <div>
              <h1 id="product-title">{product.nameBn}</h1>

              <p className="bd-details__meta">
                প্রতি {unit}
                <span aria-hidden="true"> · </span>
                <span className="bd-details__category">
                  {product.categoryNameBn}
                </span>
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
                  ` · ${numberBn.format(difference)} টাকা`}
              </p>
            </div>
          </div>

          {/* Today's price */}
          <div className="bd-details__today">
            <p>আজকের দাম</p>

            <strong>{numberBn.format(product.today)}</strong>

            <p>টাকা / {unit}</p>

            <span
              className={`bd-details__change is-${direction}`}
            >
              {direction === "up"
                ? "▲"
                : direction === "down"
                  ? "▼"
                  : "—"}{" "}
              {percentBn.format(percentage)}%
            </span>
          </div>
        </section>

        {/* Price summary and market table */}
        <section
          className="bd-details__panel"
          aria-labelledby="price-summary-title"
        >
          <h2 id="price-summary-title">দামের সারসংক্ষেপ</h2>

          <div className="bd-details__stats">
            <div className="bd-details__stat">
              <p>সর্বনিম্ন দাম</p>

              <p className="bd-details__stat-price is-min">
                <strong>{formatPrice(minimum)}</strong> টাকা
              </p>

              <p>সবচেয়ে কম দামের বাজার</p>
            </div>

            <div className="bd-details__stat">
              <p>সর্বাধিক দাম</p>

              <p className="bd-details__stat-price is-max">
                <strong>{formatPrice(maximum)}</strong> টাকা
              </p>

              <p>সবচেয়ে বেশি দামের বাজার</p>
            </div>

            <div className="bd-details__stat">
              <p>গড় দাম</p>

              <p className="bd-details__stat-price is-average">
                <strong>{formatPrice(average)}</strong> টাকা
              </p>

              <p>প্রতি {unit}-এর হিসাবে</p>
            </div>
          </div>

          <h2 className="bd-details__markets-title">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="bd-details__table-wrap">
              <table className="bd-details__table">
                <caption className="sr-only">
                  {product.nameBn} — বাজারভিত্তিক দাম,
                  প্রতি {unit}
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

                      <td>{formatPrice(market.min)} টাকা</td>

                      <td>{formatPrice(market.max)} টাকা</td>

                      <td>
                        <strong>
                          {formatPrice(market.average)} টাকা
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
    </div>
  );
}

export default function ProductDetailsPage({ params }) {
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}