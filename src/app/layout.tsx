import type { Metadata } from "next";
import {
  Noto_Sans_Devanagari,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const monoFont = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
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
      className={`${displayFont.variable} ${monoFont.variable} ${devanagariFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
