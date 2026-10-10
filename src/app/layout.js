/* eslint-disable @next/next/no-page-custom-font */

import { Suspense } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <Suspense
          fallback={
            <div className="bazar-container py-6" role="status">
              বাজার দর লোড হচ্ছে…
            </div>
          }
        >
          <Navbar />
        </Suspense>

        <main>{children}</main>

        <Footer />

        <Toaster position="top-right" />
      </body>
    </html>
  );
}