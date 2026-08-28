import type { Metadata } from "next";
import { Anek_Devanagari, Noto_Sans_Devanagari } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const displayFont = Anek_Devanagari({
  variable: "--font-display",
  subsets: ["devanagari", "latin"],
  display: "swap",
});

const bodyFont = Noto_Sans_Devanagari({
  variable: "--font-body",
  subsets: ["devanagari", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClaimSaathi",
  description: "An independent prototype for a clearer EPF withdrawal journey.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
