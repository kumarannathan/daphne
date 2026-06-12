import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daphne's Portfolio ✨",
  description: "A gift from Karthik & Kumi — Daphne's first birthday investment portfolio.",
  openGraph: {
    title: "Daphne's Portfolio ✨",
    description: "Before she could walk, she owned part of Disney.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
