import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse | Internet Speed Test Tool",
  description: "Measure your internet connection's download speed, upload speed, and ping with our accurate pulse monitoring tool.",
  keywords: "internet speed test, network speed, download speed, upload speed, ping test, connection test, bandwidth test, pulse",
  authors: [{ name: "Pulse Team" }],
  generator: "Next.js",
  applicationName: "Pulse",
  creator: "Pulse Team",
  publisher: "Pulse",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://pulse-speed.vercel.app"),
  openGraph: {
    title: "Pulse | Internet Speed Test Tool",
    description: "Measure your internet connection's download speed, upload speed, and ping with our accurate pulse monitoring tool.",
    url: "/",
    siteName: "Pulse",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Pulse Internet Speed Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse | Internet Speed Test Tool",
    description: "Measure your internet connection's download speed, upload speed, and ping with our accurate pulse monitoring tool.",
    images: ["/logo.webp"],
    creator: "@pulse",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.webp", type: "image/png" },
    ],
    apple: [
      { url: "/logo.webp" },
    ],
    shortcut: [{ url: "/logo.webp" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || "https://pulse-speed.vercel.app"} />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
