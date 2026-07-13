import type { Metadata, Viewport } from "next";
import { SiteNav } from "@/app/components/SiteNav";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { PageTransition } from "@/app/components/motion/PageTransition";
// Self-hosted fonts via @fontsource — bundled at build time so the build
// has no runtime dependency on fetching Google Fonts (which is flaky and
// can fail the static export). Family names map to the CSS variables in
// globals.css (--font-inter / --font-merriweather / --font-noto-devanagari).
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/merriweather/latin-300.css";
import "@fontsource/merriweather/latin-400.css";
import "@fontsource/merriweather/latin-700.css";
import "@fontsource/merriweather/latin-300-italic.css";
import "@fontsource/merriweather/latin-400-italic.css";
import "@fontsource/merriweather/latin-700-italic.css";
import "@fontsource/noto-sans-devanagari/devanagari-300.css";
import "@fontsource/noto-sans-devanagari/devanagari-400.css";
import "@fontsource/noto-sans-devanagari/devanagari-500.css";
import "@fontsource/noto-sans-devanagari/devanagari-600.css";
import "@fontsource/noto-sans-devanagari/devanagari-700.css";
import "./globals.css";

/**
 * Inline script that runs synchronously before React hydrates so the
 * theme attribute is set on <html> in the first paint. Without this,
 * users would see a flash of the default (day) theme before the
 * ThemeProvider's useEffect runs and applies their stored preference.
 */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem('dharma-theme');
    if (t === 'sunset' || t === 'night' || t === 'day') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();
`;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dharmagranth.in";
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
  // Google Search Console ownership proof for https://dharmagranth.in/
  // (URL-prefix property). Env var overrides for other environments.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "YWMSMR_2e_0e1w2nqm5_sMRIgnkVNgF-6IRNRRdyYS4",
  },
  category: "religion",
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans bg-dharma-bg text-dharma-text antialiased">
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <SiteNav />
          <div id="main-content" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
