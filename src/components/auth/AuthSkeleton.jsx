export default function AuthSkeleton() {
  return (
    <div className="ba-page" role="status">
      <span className="sr-only">
        অ্যাকাউন্ট লোড হচ্ছে…
      </span>

      <div className="ba-shell">
        <div className="skeleton ba-skeleton-title" />

        <div className="skeleton ba-skeleton-subtitle" />

        <div className="ba-card ba-skeleton-card">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="skeleton ba-skeleton-field"
            />
          ))}
        </div>
      </div>
    </div>
  );
}