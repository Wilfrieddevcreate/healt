import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    featuredImage: string | null;
    readingTime: number;
    createdAt: Date;
    category: {
      name: string;
      slug: string;
    };
  };
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden">
        <div className={`relative ${featured ? "h-full min-h-[280px]" : "aspect-[16/10]"}`}>
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="w-full h-full bg-surface-alt flex items-center justify-center">
              <span className="text-muted text-sm">No image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Link
              href={`/category/${post.category.slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md hover:bg-primary/20 transition-colors"
            >
              {post.category.name}
            </Link>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block">
            <h3
              className={`font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 ${
                featured ? "text-xl sm:text-2xl" : "text-lg"
              }`}
            >
              {post.title}
            </h3>
          </Link>

          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          Read article
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
