import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DHAKA LEDGER // Personal Financial Manager",
  description: "Neo-Brutalist personal ledger, expense forecaster, DPS calculator & savings pocket tracker for Dhaka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-grid min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
