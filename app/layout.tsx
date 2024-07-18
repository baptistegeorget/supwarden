import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUPWARDEN",
  description: "Password manager by SUPWARDEN.",
  icons: {
    icon:  '/icon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-full bg-black text-white flex flex-col">{children}</body>
    </html>
  );
}
