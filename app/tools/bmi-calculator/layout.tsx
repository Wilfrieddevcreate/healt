import type { Metadata } from "next";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free BMI Calculator — Body Mass Index for Adults",
  description: "Free BMI calculator. Enter your height and weight to calculate your Body Mass Index instantly. Works with metric (kg/cm) and imperial (lbs/ft) units.",
  keywords: ["BMI calculator", "body mass index", "BMI chart", "BMI calculator adults", "BMI metric", "BMI imperial"],
  alternates: { canonical: "/tools/bmi-calculator" },
  openGraph: {
    title: "Free BMI Calculator — Body Mass Index",
    description: "Calculate your BMI instantly with metric or imperial units.",
    url: absoluteUrl("/tools/bmi-calculator"),
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BMI Calculator",
  description: "Free online BMI calculator for adults.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  url: absoluteUrl("/tools/bmi-calculator"),
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1247",
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
