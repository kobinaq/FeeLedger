import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeeLedger",
  description: "Private school fee collection platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
