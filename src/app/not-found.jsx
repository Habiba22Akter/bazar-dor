import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bazar-container flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-green-700">
        ৪০৪
      </p>

      <h1 className="text-2xl font-bold sm:text-3xl">
        পেজটি পাওয়া যায়নি
      </h1>

      <p className="max-w-md text-gray-600">
        আপনি যে পেজটি খুঁজছেন, সেটির ঠিকানা ভুল অথবা
        পেজটি আর নেই।
      </p>

      <Link
        href="/"
        className="btn btn-primary btn-sm sm:btn-md"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}