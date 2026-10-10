const BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

async function fetchArray(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("তথ্য লোড করা যায়নি।");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
  }

  return data;
}

export async function GET(request) {
  const slug = new URL(request.url).searchParams.get("slug");

  if (!slug) {
    return Response.json(
      { category: null, products: [] },
      { status: 404 }
    );
  }

  try {
    const [categories, allProducts] = await Promise.all([
      fetchArray("/categories"),
      fetchArray("/products"),
    ]);

    const category = categories.find(
      (item) => item.slug === slug
    );

    if (!category) {
      return Response.json(
        { category: null, products: [] },
        { status: 404 }
      );
    }

    const products = allProducts.filter(
      (item) => item.category === slug
    );

    return Response.json({ category, products });
  } catch {
    return Response.json(
      {
        message: "পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।",
      },
      { status: 502 }
    );
  }
}