import { Suspense } from "react";
import CategoryProducts from "@/components/category/CategoryProducts";

async function CategoryContent({ params }) {
  const { slug } = await params;

  return <CategoryProducts key={slug} slug={slug} />;
}

export default function CategoryPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="bazar-container py-8" role="status">
          <div className="skeleton h-24 w-full rounded-2xl" />
          <span className="sr-only">পণ্য লোড হচ্ছে…</span>
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}