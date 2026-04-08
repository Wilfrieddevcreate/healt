import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarDays, ArrowLeft, User } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { TableOfContents } from "@/components/table-of-contents";
import { MarkdownContent } from "@/components/markdown-content";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [],
      section: post.category.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { category: true, author: true },
  });

  if (!post) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      categoryId: post.categoryId,
      id: { not: post.id },
    },
    include: { category: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.featuredImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "FitHorizon",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/category/${post.category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md"
              >
                {post.category.name}
              </Link>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <CalendarDays className="w-3.5 h-3.5" />
                {post.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-8">{post.excerpt}</p>
          </div>

          {post.featuredImage && (
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-10 max-w-4xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 max-w-4xl">
            <div className="prose prose-lg prose-green max-w-none prose-headings:text-foreground prose-p:text-muted prose-strong:text-foreground prose-li:text-muted">
              <MarkdownContent content={post.content} />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <TableOfContents content={post.content} />

                <div className="p-5 bg-surface rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{post.author.name}</p>
                      <p className="text-xs text-muted">Author</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Delivering science-backed fitness and nutrition content to help you achieve your goals.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterForm />
    </>
  );
}
