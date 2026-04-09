import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Flame, Target } from "lucide-react";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Fitness Calculators — BMI, TDEE & Macro Calculator",
  description: "Use our free fitness calculators to find your BMI, daily calorie needs (TDEE), and optimal macronutrient split for your goals.",
  keywords: ["BMI calculator", "TDEE calculator", "macro calculator", "fitness calculator", "calorie calculator", "body mass index"],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Fitness Calculators — BMI, TDEE & Macros",
    description: "Science-based calculators for your fitness journey.",
    url: absoluteUrl("/tools"),
    type: "website",
  },
};

const tools = [
  {
    href: "/tools/bmi-calculator",
    icon: Calculator,
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index and understand what it means for your health.",
  },
  {
    href: "/tools/tdee-calculator",
    icon: Flame,
    title: "TDEE Calculator",
    description: "Find your Total Daily Energy Expenditure to know exactly how many calories you burn.",
  },
  {
    href: "/tools/macro-calculator",
    icon: Target,
    title: "Macro Calculator",
    description: "Get your optimal protein, carbs, and fat split based on your goals.",
  },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Fitness Calculators",
  description: "Collection of science-based fitness calculators",
  itemListElement: [
    {
      "@type": "SoftwareApplication",
      position: 1,
      name: "BMI Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      url: absoluteUrl("/tools/bmi-calculator"),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "SoftwareApplication",
      position: 2,
      name: "TDEE Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      url: absoluteUrl("/tools/tdee-calculator"),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "SoftwareApplication",
      position: 3,
      name: "Macro Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      url: absoluteUrl("/tools/macro-calculator"),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function ToolsPage() {
  return (
    <section className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemListJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
            Free Fitness Calculators
          </h1>
          <p className="text-muted mt-2 max-w-xl mx-auto">
            Science-based tools to help you plan your fitness journey with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-border dark:border-gray-700 hover:shadow-lg hover:border-primary/30 transition-all text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <tool.icon className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-bold text-foreground dark:text-white text-lg mb-2">{tool.title}</h2>
              <p className="text-sm text-muted">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
