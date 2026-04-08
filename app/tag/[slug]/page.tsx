import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import type { Metadata } from "next";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return {};
  return {
    title: `Articles tagged "${tag.name}"`,
    description: `Browse all fitness articles tagged with "${tag.name}" on FitHorizon.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          post: {
            include: { category: true, author: true },
          },
        },
      },
    },
  });

  if (!tag) notFound();

  const posts = tag.posts
    .map((pt) => pt.post)
    .filter((p) => p.published);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-3">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
            Tag: {tag.name}
          </h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted py-12">No articles with this tag yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
