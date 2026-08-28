import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_Devanagari,
  Plus_Jakarta_Sans,
} from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const devanagariFont = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "ClaimSaathi | Citizen EPF Withdrawal Companion",
  description:
    "An independent, citizen-first prototype for a clearer, stress-free EPF withdrawal journey.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${devanagariFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
