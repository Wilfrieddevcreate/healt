import type { Metadata } from "next";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free TDEE Calculator — Daily Calorie Needs",
  description: "Calculate your Total Daily Energy Expenditure (TDEE) with our free calculator. Find out how many calories you burn and eat per day for your goals.",
  keywords: ["TDEE calculator", "daily calorie calculator", "maintenance calories", "BMR calculator", "calorie deficit calculator", "bulking calories"],
  alternates: { canonical: "/tools/tdee-calculator" },
  openGraph: {
    title: "Free TDEE Calculator — Daily Calorie Needs",
    description: "Find your maintenance, cutting, and bulking calories.",
    url: absoluteUrl("/tools/tdee-calculator"),
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TDEE Calculator",
  description: "Calculate Total Daily Energy Expenditure and daily calorie needs.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  url: absoluteUrl("/tools/tdee-calculator"),
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "892",
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
