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
    "वेद, उपनिषद, गीता, पुराण और भक्ति ग्रंथों को पढ़ें — 63,800+ श्लोकों की गहन हिन्दी व्याख्या के साथ",
  keywords: ["धर्म ग्रंथ", "वेद", "उपनिषद", "गीता", "पुराण", "संस्कृत", "हिन्दी व्याख्या", "सनातन धर्म"],
  openGraph: {
    title: "धर्म ग्रंथ — सनातन धर्म के पवित्र ग्रंथ",
    description: "66 ग्रंथों के 63,800+ श्लोकों की गहन हिन्दी व्याख्या — शब्दार्थ, भावार्थ, वैज्ञानिक दृष्टि और जीवन-साधना",
    type: "website",
    locale: "hi_IN",
  },
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
          <footer className="relative mt-16">
            <div className="footer-glow" />
            <div className="py-10 text-center">
              <p className="text-2xl mb-3 animate-float">🙏</p>
              <p className="font-serif-deva text-lg font-bold text-foreground/80">
                धर्म ग्रंथ
              </p>
              <p className="text-sm text-muted mt-1">
                सनातन धर्म के पवित्र ग्रंथों का डिजिटल संग्रह
              </p>
              <p className="font-scripture text-xs text-muted-light mt-3 italic">
                सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-light">
                <span>66 ग्रंथ</span>
                <span className="text-accent/40">•</span>
                <span>63,800+ श्लोक</span>
                <span className="text-accent/40">•</span>
                <span>सम्पूर्ण हिन्दी व्याख्या</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
