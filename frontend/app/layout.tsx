import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar Banking",
  description: "A polished banking dashboard built on the BankingApp API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
