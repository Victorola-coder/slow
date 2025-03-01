import "./global.css";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { AOS } from "./components/global";
import { Montserrat } from "next/font/google";
import type { Metadata, Viewport } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://speedpulse.dev"),
  icons: {
    icon: "/icon.png",
  },
  title: "SpeedPulse - Internet Speed Test",
  description: "Test your internet speed, check your IP, and compare regional network performance with SpeedPulse.",
  applicationName: "SpeedPulse",
  authors: [{ name: "SpeedPulse", url: "https://speedpulse.dev" }],
  keywords: ["Speed Test", "Internet Speed", "Network Test", "IP Check", "Network Statistics"],
  creator: "SpeedPulse",
  publisher: "SpeedPulse",
  generator: "Next.js",
  referrer: "origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SpeedPulse - Internet Speed Test",
    description: "Fast and accurate internet speed testing",
    url: "https://speedpulse.dev",
    siteName: "SpeedPulse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    site: "nextapp",
    creator: "socialmediahandle",
    title:
      "nextapp template - I fell in love with next.js, im trying to make a template for it tooo",
    description:
      "I fell in love with next.js, im trying to make a template for it too",
    card: "summary_large_image",
    images: ["linktoopengraph.com"],
  },
  appleWebApp: {
    capable: true,
    title: "nextapp template",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  abstract:
    "I fell in love with next.js, im trying to make a template for it tooo",
  category: "Social",
  classification: "Social",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${montserrat.className} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        <AOS />
        {children}
      </body>
    </html>
  );
}
