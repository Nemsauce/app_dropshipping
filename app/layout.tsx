import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DemandLab",
  description: "Product Intelligence Command Center for ecommerce testing decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
