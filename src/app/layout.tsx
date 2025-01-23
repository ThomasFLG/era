import Header from "../components/Header";
import Footer from "../components/Footer";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8"/>
        <title>Era v2</title>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main>
        {children}
        </main>
        <Footer />
      </body>

    </html>
  );
}
