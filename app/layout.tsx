import type { Metadata } from "next";
import { Noto_Serif_Devanagari, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import Header from "@/app/components/Header";

const notoSerif = Noto_Serif_Devanagari({
  variable: "--font-serif-deva",
  subsets: ["latin", "devanagari"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans_Devanagari({
  variable: "--font-sans-deva",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "धर्म ग्रंथ — सनातन धर्म के पवित्र ग्रंथ",
  description:
    "वेद, उपनिषद, गीता, पुराण और भक्ति ग्रंथों को पढ़ें — हिन्दी व्याख्या के साथ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${notoSerif.variable} ${notoSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans-deva">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
        >
          मुख्य सामग्री पर जाएँ
        </a>
        <ThemeProvider>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted">
            <p>🙏 धर्म ग्रंथ — सनातन धर्म के पवित्र ग्रंथों का संग्रह</p>
            <p className="mt-1 text-xs">सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
