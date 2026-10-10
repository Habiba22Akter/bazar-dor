import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import "./globals.css";

export const metadata = {
  title: "বাজার দর — আজকের বাজারের দাম",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="bazardor">
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
          fallback={<div className="skeleton h-36 w-full" />}
        >
          <Navbar />
        </Suspense>

        {children}

        <Toaster position="top-right" />
      </body>
    </html>
  );
}