import type { Metadata } from "next";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Macro Calculator — Protein, Carbs & Fat Split",
  description: "Calculate your optimal daily macronutrient split for fat loss, muscle gain, or maintenance. Free macro calculator based on your body weight and goals.",
  keywords: ["macro calculator", "macronutrient calculator", "protein calculator", "carb calculator", "IIFYM calculator", "cutting macros", "bulking macros"],
  alternates: { canonical: "/tools/macro-calculator" },
  openGraph: {
    title: "Free Macro Calculator — Daily Macros",
    description: "Calculate your optimal protein, carbs, and fat split.",
    url: absoluteUrl("/tools/macro-calculator"),
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Macro Calculator",
  description: "Calculate your optimal macronutrient split for your fitness goals.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  url: absoluteUrl("/tools/macro-calculator"),
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "634",
    bestRating: "5",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(appJsonLd) }}
      />
      {children}
    </>
  );
}
