import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zoé's Secret Store ✨",
  description: "An invitation-only gift boutique",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
