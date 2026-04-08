"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

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

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [generating, setGenerating] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<PostForm>({
    defaultValues: { published: false, featured: false },
  });

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (res.status === 401) { router.push("/admin/login"); return null; }
        return res.json();
      })
      .then(() => {
        fetch("/api/categories")
          .then((r) => r.json())
          .then(setCategories)
          .catch(() => {});
      })
      .catch(() => {});
  }, [router]);

  async function onSubmit(data: PostForm) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin");
  }

  async function generateWithAI() {
    if (!keyword.trim()) return;
    setGenerating(true);
    try {
      const selectedCategory = categories.find((c) => c.id === watch("categoryId"));
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, category: selectedCategory?.name || "fitness" }),
      });
      const data = await res.json();
      if (res.ok) {
        setValue("title", data.title || "");
        setValue("excerpt", data.excerpt || "");
        setValue("content", data.content || "");
        setValue("metaTitle", data.metaTitle || "");
        setValue("metaDescription", data.metaDescription || "");
      } else {
        alert(data.error || "Failed to generate");
      }
    } catch {
      alert("Generation failed. Check your Groq API key.");
    } finally {
      setGenerating(false);
    }
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

      <h1 className="text-2xl font-bold text-foreground mb-8">Create New Post</h1>

      {/* AI Generation */}
      <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200 mb-8">
        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Generate with AI
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword (e.g., 'best ab exercises')"
            className="flex-1 px-3.5 py-2.5 border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={generateWithAI}
            disabled={generating || !keyword.trim()}
            className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
            <select
              {...register("categoryId", { required: true })}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">Select category</option>
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
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt</label>
            <textarea
              {...register("excerpt", { required: true })}
              rows={2}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              placeholder="Brief summary of the article"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Content (Markdown)</label>
            <textarea
              {...register("content", { required: true })}
              rows={16}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
              placeholder="Write your article in markdown..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">SEO Title</label>
            <input
              {...register("metaTitle")}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="SEO-optimized title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Meta Description</label>
            <input
              {...register("metaDescription")}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="150-160 characters"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("published")} className="rounded border-border" />
            <span className="font-medium text-foreground">Publish</span>
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
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Post"}
          </button>
          <Link href="/admin" className="px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
