import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarDays, User } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { TableOfContents } from "@/components/table-of-contents";
import { MarkdownContent } from "@/components/markdown-content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReadingProgress } from "@/components/reading-progress";
import { SocialShare } from "@/components/social-share";
import { BookmarkButton } from "@/components/bookmark-button";
import { ArticleRating } from "@/components/article-rating";
import { CommentSection } from "@/components/comment-section";
import { AdSlot } from "@/components/ad-slot";
import { articleSchema, breadcrumbSchema, absoluteUrl, jsonLdString, countWords, SITE_CONFIG } from "@/lib/seo";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-render all published post pages at build time for maximum SEO performance
 */
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 3600; // ISR: revalidate every hour

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });
  if (!post) return { title: "Article not found" };

  const canonical = `/blog/${post.slug}`;
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    authors: [{ name: post.author.name }],
    keywords: [
      post.category.name.toLowerCase(),
      ...SITE_CONFIG.keywords.slice(0, 8),
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(canonical),
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      section: post.category.name,
      tags: [post.category.name, "fitness", "health"],
      images: [
        {
          url: `/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/blog/${post.slug}/opengraph-image`],
      creator: SITE_CONFIG.social.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      author: true,
      ratings: { select: { value: true } },
    },
  });

  if (!post) notFound();

  // Increment views (fire and forget)
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const relatedPosts = await prisma.post.findMany({
    where: { published: true, categoryId: post.categoryId, id: { not: post.id } },
    include: { category: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const wordCount = countWords(post.content);
  const helpfulRatings = post.ratings.filter((r) => r.value === 1).length;
  const totalRatings = post.ratings.length;

  const articleJsonLd = articleSchema({
    title: post.title,
    description: post.metaDescription || post.excerpt,
    slug: post.slug,
    image: post.featuredImage,
    publishedAt: post.createdAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    categoryName: post.category.name,
    wordCount,
    readingTime: post.readingTime,
    aggregateRating: totalRatings > 0 ? { helpful: helpfulRatings, total: totalRatings } : null,
  });

  const breadcrumbJsonLd = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.category.name, href: `/category/${post.category.slug}` },
    { label: post.title, href: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />

      <article className="py-8 sm:py-12" itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={post.title} />
        <meta itemProp="datePublished" content={post.createdAt.toISOString()} />
        <meta itemProp="dateModified" content={post.updatedAt.toISOString()} />
        <meta itemProp="wordCount" content={String(wordCount)} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.category.name, href: `/category/${post.category.slug}` },
              { label: post.title },
            ]}
          />

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link
                href={`/category/${post.category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md"
                rel="category tag"
              >
                {post.category.name}
              </Link>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{post.readingTime} min read</span>
              </span>
              <time
                dateTime={post.createdAt.toISOString()}
                className="flex items-center gap-1 text-xs text-muted"
                itemProp="datePublished"
              >
                <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                {post.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground dark:text-white leading-tight mb-4"
              itemProp="name"
            >
              {post.title}
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-6" itemProp="description">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mb-8">
              <SocialShare url={`/blog/${post.slug}`} title={post.title} description={post.excerpt} />
              <BookmarkButton
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category.name}
                featuredImage={post.featuredImage}
              />
            </div>
          </div>

          {post.featuredImage && (
            <figure className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-10 max-w-4xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                itemProp="image"
              />
            </figure>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 max-w-4xl">
            <div>
              <div
                className="prose prose-lg prose-green max-w-none prose-headings:text-foreground prose-p:text-muted prose-strong:text-foreground prose-li:text-muted dark:prose-invert"
                itemProp="articleBody"
              >
                <MarkdownContent content={post.content} />
              </div>

              <AdSlot slot="post-bottom" className="my-8" />

              <ArticleRating postId={post.id} />

              <CommentSection postId={post.id} />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <TableOfContents content={post.content} />

                <div
                  className="p-5 bg-surface dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700"
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground dark:text-white" itemProp="name">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-muted">Author</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Delivering science-backed fitness and nutrition content to help you achieve your goals.
                  </p>
                </div>

                <AdSlot slot="sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-surface dark:bg-gray-800/50" aria-labelledby="related-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="related-heading" className="text-2xl font-bold text-foreground dark:text-white mb-8">
              Related Articles
            </h2>
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
