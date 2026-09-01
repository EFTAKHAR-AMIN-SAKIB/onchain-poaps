import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Onchain POAPs — Moments Live. Onchain Forever.",
  description:
    "Create, mint, and collect POAPs with artwork and event details stored directly onchain. Transparent, verifiable, and built to last on Base.",
  icons: {
    icon: "/symbol.svg",
    shortcut: "/symbol.svg",
    apple: "/symbol.svg",
  },
  openGraph: {
    title: "Onchain POAPs — Moments Live. Onchain Forever.",
    description:
      "Create, mint, and collect POAPs with artwork and event details stored directly onchain. Transparent, verifiable, and built to last on Base.",
    url: "https://onchain-poaps-ebon.vercel.app",
    siteName: "Onchain POAPs",
    images: [
      {
        url: "https://onchain-poaps-ebon.vercel.app/og.png",
        width: 1200,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onchain POAPs — Moments Live. Onchain Forever.",
    description:
      "Permanent event memories with SVG artwork stored 100% onchain on Base.",
    images: ["https://onchain-poaps-ebon.vercel.app/og.png"],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://onchain-poaps-ebon.vercel.app/og.png",
      button: {
        title: "Open Onchain POAPs",
        action: {
          type: "launch_miniapp",
          name: "Onchain POAPs",
          url: "https://onchain-poaps-ebon.vercel.app",
          splashImageUrl: "https://onchain-poaps-ebon.vercel.app/splash.png",
          splashBackgroundColor: "#0b0d10",
        },
      },
    }),
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://onchain-poaps-ebon.vercel.app/og.png",
      button: {
        title: "Open Onchain POAPs",
        action: {
          type: "launch_frame",
          name: "Onchain POAPs",
          url: "https://onchain-poaps-ebon.vercel.app",
          splashImageUrl: "https://onchain-poaps-ebon.vercel.app/splash.png",
          splashBackgroundColor: "#0b0d10",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased min-h-screen flex flex-col"
      >
        <Web3Provider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <MobileNav />
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
