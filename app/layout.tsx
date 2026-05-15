import type { Metadata, Viewport } from "next";
import { SiteNav } from "@/app/components/SiteNav";
import { PageTransition } from "@/app/components/motion/PageTransition";
import { Inter, Merriweather, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dharmagranth.example";
const SITE_NAME = "Dharma Granth";
const DEFAULT_TITLE = "Dharma Granth — Hindu Scriptures, Verse by Verse";
const DEFAULT_DESCRIPTION =
  "Famous verses from the Bhagavad Gita, Upanishads, and other Hindu scriptures, explained verse by verse in Sanskrit, Hindi, and plain English. Free and ad-free.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — Dharma Granth",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Bhagavad Gita",
    "Upanishads",
    "Hindu scripture",
    "Sanskrit verses",
    "Vedas",
    "Hindi commentary",
    "dharma",
    "verse meaning",
  ],
  authors: [{ name: "Dharma Granth" }],
  creator: "Dharma Granth",
  publisher: "Dharma Granth",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["hi_IN"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "religion",
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-merriweather",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-devanagari",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="font-sans bg-dharma-bg text-dharma-text antialiased">
        <SiteNav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
