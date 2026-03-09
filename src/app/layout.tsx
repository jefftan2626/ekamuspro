import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eKamus - Malaysian Multilingual Dictionary",
  description: "Search words in English, Malay, or Chinese. Get definitions, examples, synonyms, antonyms, and related proverbs.",
  keywords: ["dictionary", "malay", "chinese", "english", "kamus", "esaurus", "translation", "malaysia"],
  authors: [{ name: "eKamus" }],
  openGraph: {
    title: "eKamus - Malaysian Multilingual Dictionary",
    description: "Search words in English, Malay, or Chinese. Get definitions, examples, synonyms, antonyms, and related proverbs.",
    type: "website",
    locale: "en_MY",
    siteName: "eKamus",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
