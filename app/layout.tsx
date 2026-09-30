import type { Metadata } from "next";
import { Syne, Figtree, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital CMO | Digital Marketing Blog That Ranks & Monetises",
    template: "%s | Digital CMO",
  },
  description:
    "Auto-publishing digital marketing comparisons, reviews, and playbooks—built to earn organic traffic and affiliate revenue.",
  metadataBase: new URL("https://digitalcmo.com.au"),
  keywords: [
    "digital marketing",
    "SEO tools",
    "email marketing",
    "PPC",
    "affiliate marketing",
    "content marketing",
  ],
  openGraph: {
    title: "Digital CMO | Digital Marketing Blog That Ranks & Monetises",
    description:
      "Comparisons, reviews, and guides for marketers who want traffic and revenue—not fluff.",
    url: "https://digitalcmo.com.au",
    siteName: "Digital CMO",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body
        className={`${display.variable} ${body.variable} ${geistMono.variable} site-grain min-h-screen antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
