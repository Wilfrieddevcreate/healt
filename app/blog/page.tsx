import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Pagination } from "@/components/pagination";
import { absoluteUrl, jsonLdString } from "@/lib/seo";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Blog — Fitness, Weight Loss & Muscle Building Articles",
  description: "Browse our collection of science-backed fitness articles covering weight loss, muscle building, nutrition, and healthy weight gain strategies.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Fitness, Weight Loss & Muscle Building Articles",
    description: "Browse our collection of science-backed fitness articles.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
};

export const revalidate = 1800;

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function loadPosts(currentPage: number) {
  try {
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        include: { category: true, author: true },
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      }),
      prisma.post.count({ where: { published: true } }),
    ]);
    return { posts, totalCount };
  } catch {
    return { posts: [], totalCount: 0 };
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const { posts, totalCount } = await loadPosts(currentPage);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/blog")}#collection`,
    url: absoluteUrl("/blog"),
    name: "FitHorizon Blog",
    description: "Science-backed fitness and nutrition articles.",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.createdAt.toISOString(),
      author: { "@type": "Person", name: p.author.name },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(collectionJsonLd) }}
      />
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white">Blog</h1>
            <p className="text-muted mt-2">
              Science-backed fitness and nutrition articles for every goal
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted py-12">No articles published yet. Check back soon!</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
            </>
          )}
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}
