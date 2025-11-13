import type { Metadata } from "next";
import { Geist, Geist_Mono, Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import LoadingAnimation from "./components/LoadingAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: "700",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio website",
  icons: {
    icon: '/logo-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${crimsonPro.variable} ${inter.variable}`}>
        <LoadingAnimation />
        {children}
      </body>
    </html>
  );
}
