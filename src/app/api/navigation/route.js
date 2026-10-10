const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("বাজারের তথ্য লোড করা যায়নি।");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
  }

  return data;
}

export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      fetchData("/categories"),
      fetchData("/products"),
    ]);

    return Response.json({ categories, products });
  } catch {
    return Response.json(
      { message: "বাজারের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।" },
      { status: 502 }
    );
  }
}