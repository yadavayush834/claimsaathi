import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  IBM_Plex_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
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
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${devanagariFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
