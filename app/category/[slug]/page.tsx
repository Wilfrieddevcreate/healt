import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Pagination } from "@/components/pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { absoluteUrl, jsonLdString, breadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 9;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({ select: { slug: true } });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  let category: { name: string; slug: string; description: string | null } | null = null;
  try {
    category = await prisma.category.findUnique({ where: { slug } });
  } catch { /* DB unavailable */ }
  if (!category) return { title: "Category not found" };

  const title = `${category.name} Articles — Expert Guides & Tips`;
  const description = category.description || `Browse our ${category.name} articles for expert, science-backed fitness advice.`;
  const canonical = `/category/${category.slug}`;

  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} guide`,
      `${category.name.toLowerCase()} tips`,
      "fitness",
      "nutrition",
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function loadCategoryData(slug: string, currentPage: number) {
  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return null;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, categoryId: category.id },
        include: { category: true, author: true },
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      }),
      prisma.post.count({ where: { published: true, categoryId: category.id } }),
    ]);
    return { category, posts, totalCount };
  } catch {
    return null;
  }
}

export const revalidate = 1800;

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));

  const data = await loadCategoryData(slug, currentPage);
  if (!data) notFound();
  const { category, posts, totalCount } = data;

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(`/category/${category.slug}`)}#collection`,
    url: absoluteUrl(`/category/${category.slug}`),
    name: `${category.name} Articles`,
    description: category.description || `${category.name} articles`,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: {
      "@type": "Thing",
      name: category.name,
    },
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.createdAt.toISOString(),
      dateModified: p.updatedAt.toISOString(),
      author: { "@type": "Person", name: p.author.name },
      image: p.featuredImage || undefined,
    })),
  };

  const breadcrumbJsonLd = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: category.name, href: `/category/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: category.name },
            ]}
          />

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-3">
              {totalCount} article{totalCount !== 1 ? "s" : ""}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white">{category.name}</h1>
            {category.description && <p className="text-muted mt-2 max-w-2xl">{category.description}</p>}
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted py-12">No articles in this category yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/category/${slug}`} />
            </>
          )}
        </div>
      </section>
      <NewsletterForm />
    </>
  );
}
