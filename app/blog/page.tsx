import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Fitness, Weight Loss & Muscle Building Articles",
  description:
    "Browse our collection of science-backed fitness articles covering weight loss, muscle building, nutrition, and healthy weight gain strategies.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Blog</h1>
            <p className="text-muted mt-2">
              Science-backed fitness and nutrition articles for every goal
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted py-12">
              No articles published yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}
