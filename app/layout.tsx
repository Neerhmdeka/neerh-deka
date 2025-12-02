import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather, Inter, Fira_Sans } from "next/font/google";
import "./globals.css";
import ScrollSmootherWrapper from "./components/ScrollSmootherWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "500",
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Neerh Deka",
  description: "Portfolio website",
  icons: {
    icon: '/Favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} ${inter.variable} ${firaSans.variable}`}>
        <ScrollSmootherWrapper>
          {children}
        </ScrollSmootherWrapper>
      </body>
    </html>
  );
}
