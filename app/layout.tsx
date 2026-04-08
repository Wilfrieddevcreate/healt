import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NewsletterPopup } from "@/components/newsletter-popup";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    "fitness", "weight loss", "muscle building", "weight gain",
    "nutrition", "body transformation", "workout", "exercise",
    "BMI calculator", "TDEE calculator", "macro calculator",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FitHorizon",
    title: "FitHorizon — Science-Backed Fitness & Body Transformation",
    description: "Expert guides on weight loss, muscle building, and healthy weight gain. Evidence-based fitness and nutrition advice.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitHorizon",
    description: "Science-backed fitness, nutrition & body transformation guides.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true, follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("theme"),d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#0f172a] text-foreground dark:text-slate-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <NewsletterPopup />
      </body>
    </html>
  );
}
