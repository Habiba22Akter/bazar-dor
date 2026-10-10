import "server-only";

const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
  "https://openapi.programming-hero.com/api/bazardor",
];

async function fetchJson(url) {
  const response = await fetch(url, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

export async function getProductBySlug(slug) {
  for (const base of API_BASES) {
    try {
      const products = await fetchJson(`${base}/products`);

      if (!Array.isArray(products)) {
        continue;
      }

      const match = products.find((product) => product.slug === slug);

      if (!match) {
        return null;
      }

      const product = await fetchJson(
        `${base}/products/${encodeURIComponent(match.id)}`
      );

      if (
        product &&
        product.slug === slug &&
        Array.isArray(product.markets)
      ) {
        return product;
      }
    } catch {
      // এই API ব্যর্থ হলে পরের API চেষ্টা করবে।
    }
  }

  throw new Error("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
}