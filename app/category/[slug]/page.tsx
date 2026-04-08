import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 9;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name} Articles — Expert Guides & Tips`,
    description: category.description || `Browse our ${category.name} articles for expert fitness advice.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

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

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
