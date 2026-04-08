import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fithorizon.com"),
  title: {
    default: "FitHorizon — Science-Backed Fitness, Nutrition & Body Transformation",
    template: "%s | FitHorizon",
  },
  description:
    "Expert guides on weight loss, muscle building, and healthy weight gain. Evidence-based fitness and nutrition advice for real results.",
  keywords: [
    "fitness",
    "weight loss",
    "muscle building",
    "weight gain",
    "nutrition",
    "body transformation",
    "workout",
    "exercise",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FitHorizon",
    title: "FitHorizon — Science-Backed Fitness & Body Transformation",
    description:
      "Expert guides on weight loss, muscle building, and healthy weight gain. Evidence-based fitness and nutrition advice.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitHorizon",
    description:
      "Science-backed fitness, nutrition & body transformation guides.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
