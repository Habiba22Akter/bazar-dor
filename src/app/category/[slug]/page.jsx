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
        <div className="bazar-container py-10" role="status">
          লোড হচ্ছে…
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}