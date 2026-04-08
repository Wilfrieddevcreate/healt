import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/hero";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import Link from "next/link";
import { ArrowRight, Flame, TrendingUp, Dumbbell } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "weight-loss": Flame,
  "weight-gain": TrendingUp,
  "muscle-building": Dumbbell,
};

export default async function HomePage() {
  const [allPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { category: true, author: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
    }),
  ]);

  const featured = allPosts.filter((p) => p.featured).slice(0, 1);
  const rest = allPosts.filter((p) => !featured.includes(p)).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
                Latest Articles
              </h2>
              <p className="text-muted dark:text-gray-400 mt-2">
                Evidence-based guides to help you reach your goals
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((post) => (
              <PostCard key={post.id} post={post} featured />
            ))}
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-surface dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
              Explore by Category
            </h2>
            <p className="text-muted dark:text-gray-400 mt-2">
              Find the right content for your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((cat) => {
              const IconComponent = categoryIcons[cat.slug] || Dumbbell;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-border dark:border-gray-700 hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground dark:text-white text-lg mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted dark:text-gray-400 mb-3 line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="text-xs font-medium text-primary">
                    {cat._count.posts} article{cat._count.posts !== 1 ? "s" : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}
