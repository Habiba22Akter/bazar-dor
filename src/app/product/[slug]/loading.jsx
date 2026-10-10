export default function ProductDetailsLoading() {
  return (
    <div className="bd-details-page">
      <div
        className="bazar-container bd-detail-loading"
        role="status"
      >
        <span className="sr-only">
          পণ্যের বিস্তারিত লোড হচ্ছে…
        </span>

        <div className="skeleton h-6 w-64" />

        <div className="skeleton h-44 w-full rounded-2xl" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
        </div>

        <div className="skeleton h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}