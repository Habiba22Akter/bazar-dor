import "server-only";

const BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

async function fetchJson(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
  }

  return response.json();
}

export async function getProductBySlug(slug) {
  const products = await fetchJson("/products");

  if (!Array.isArray(products)) {
    throw new Error("পণ্যের তালিকা সঠিকভাবে পাওয়া যায়নি।");
  }

  const selectedProduct = products.find(
    (product) => product.slug === slug
  );

  if (!selectedProduct) {
    return null;
  }

  const product = await fetchJson(
    `/products/${encodeURIComponent(selectedProduct.id)}`
  );

  if (!product || product.slug !== slug) {
    throw new Error("পণ্যের বিস্তারিত সঠিকভাবে পাওয়া যায়নি।");
  }

  return product;
}