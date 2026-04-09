/**
 * SEO utilities for FitHorizon
 * Provides canonical URL helpers and structured data builders
 */

export const SITE_CONFIG = {
  name: "FitHorizon",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fithorizon.com",
  ogImage: "/opengraph-image",
  description:
    "Science-backed fitness, nutrition, and body transformation guides. Expert advice on weight loss, muscle building, and healthy weight gain for lasting results.",
  keywords: [
    "fitness",
    "weight loss",
    "muscle building",
    "weight gain",
    "nutrition",
    "body transformation",
    "workout",
    "exercise",
    "healthy eating",
    "BMI calculator",
    "TDEE calculator",
    "macro calculator",
    "strength training",
    "fat loss",
    "bulking",
  ],
  author: {
    name: "FitHorizon Team",
    url: "https://fithorizon.com/about",
  },
  social: {
    twitter: "@fithorizon",
  },
} as const;

/**
 * Build an absolute canonical URL
 */
export function absoluteUrl(path: string = "/"): string {
  const base = SITE_CONFIG.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Build the Organization JSON-LD schema (for root layout)
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
      width: 512,
      height: 512,
    },
    description: SITE_CONFIG.description,
    sameAs: [
      "https://twitter.com/fithorizon",
      "https://www.facebook.com/fithorizon",
      "https://www.instagram.com/fithorizon",
    ],
  };
}

/**
 * Build the WebSite JSON-LD schema with SearchAction (enables Google sitelinks search box)
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

/**
 * Build a full Article JSON-LD schema (for blog posts)
 */
interface ArticleSchemaParams {
  title: string;
  description: string;
  slug: string;
  image: string | null;
  publishedAt: Date;
  updatedAt: Date;
  authorName: string;
  categoryName: string;
  wordCount: number;
  readingTime: number;
  aggregateRating?: { helpful: number; total: number } | null;
}

export function articleSchema(params: ArticleSchemaParams) {
  const url = absoluteUrl(`/blog/${params.slug}`);
  const image = params.image || absoluteUrl("/opengraph-image");

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: params.title,
    description: params.description,
    image: [image],
    datePublished: params.publishedAt.toISOString(),
    dateModified: params.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: params.authorName,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: params.categoryName,
    wordCount: params.wordCount,
    timeRequired: `PT${params.readingTime}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  if (params.aggregateRating && params.aggregateRating.total > 0) {
    const ratingValue = Math.max(
      1,
      Math.min(5, 1 + (params.aggregateRating.helpful / params.aggregateRating.total) * 4)
    );
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      ratingCount: params.aggregateRating.total,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

/**
 * Build BreadcrumbList JSON-LD
 */
export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/**
 * Safely serialize JSON-LD (escape </ to prevent XSS)
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Count words in markdown content (excludes markdown syntax)
 */
export function countWords(content: string): number {
  const plain = content
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/`[^`]+`/g, "") // inline code
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/[-*+]\s+/g, ""); // list markers

  return plain.split(/\s+/).filter(Boolean).length;
}
