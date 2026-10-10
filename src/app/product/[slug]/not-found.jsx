import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="bd-details-page">
      <div className="bazar-container bd-detail-loading">
        <div className="bd-details__message">
          <h1>৪০৪ — পণ্য পাওয়া যায়নি</h1>

          <p>এই ঠিকানায় কোনো পণ্য নেই।</p>

          <Link href="/" className="btn btn-primary">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}