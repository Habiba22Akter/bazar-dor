"use client";

import Link from "next/link";

export default function ProductDetailsError({ reset }) {
  return (
    <div className="bd-details-page">
      <div className="bazar-container bd-detail-loading">
        <div className="bd-details__message" role="alert">
          <h1>পণ্যের তথ্য লোড করা যায়নি</h1>

          <p>কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>

          <div className="bd-details__message-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => reset()}
            >
              আবার চেষ্টা করুন
            </button>

            <Link href="/" className="btn btn-outline">
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}