"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  published: boolean;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<PostForm>();

  useEffect(() => {
    async function load() {
      const [postsRes, catsRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/categories"),
      ]);
      if (postsRes.status === 401) { router.push("/admin/login"); return; }

      const posts = await postsRes.json();
      const cats = await catsRes.json();
      setCategories(cats);

      const post = posts.find((p: { id: string }) => p.id === id);
      if (post) {
        reset({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: post.categoryId,
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          featuredImage: post.featuredImage || "",
          published: post.published,
          featured: post.featured,
        });
      }
      setLoading(false);
    }
    load();
  }, [id, router, reset]);

  async function onSubmit(data: PostForm) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">Edit Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
            <select
              {...register("categoryId", { required: true })}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Featured Image URL</label>
            <input
              {...register("featuredImage")}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt</label>
            <textarea
              {...register("excerpt", { required: true })}
              rows={2}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Content (Markdown)</label>
            <textarea
              {...register("content", { required: true })}
              rows={16}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">SEO Title</label>
            <input
              {...register("metaTitle")}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Meta Description</label>
            <input
              {...register("metaDescription")}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("published")} className="rounded border-border" />
            <span className="font-medium text-foreground">Published</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="rounded border-border" />
            <span className="font-medium text-foreground">Featured</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </button>
          <Link href="/admin" className="px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
