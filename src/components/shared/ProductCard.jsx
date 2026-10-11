import Link from "next/link";

const units = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const numberBn = new Intl.NumberFormat("bn-BD");

const percentBn = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function ProductCard({ product }) {
  const direction = product.change?.dir || "flat";

  const percentage = Math.abs(Number(product.change?.pct) || 0);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bd-price-card"
    >
      <div className="bd-price-card__top">
        <span
          className="bd-price-card__emoji"
          aria-hidden="true"
        >
          {product.image || product.categoryIcon}
        </span>

        <div className="bd-price-card__info">
          <h3>{product.nameBn}</h3>

          <p>প্রতি {units[product.unit] || product.unit}</p>
        </div>
      </div>

      <div className="bd-price-card__bottom">
        <div>
          <p className="bd-price-card__label">আজকের দাম</p>

          <p className="bd-price-card__amount">
            <strong>{numberBn.format(product.today)}</strong>
            <span>টাকা</span>
          </p>
        </div>

        <span
          className={`bd-price-card__change bd-price-card__change--${direction}`}
        >
          {direction === "up"
            ? "▲"
            : direction === "down"
              ? "▼"
              : "—"}{" "}
          {percentBn.format(percentage)}%
        </span>
      </div>
    </Link>
  );
}