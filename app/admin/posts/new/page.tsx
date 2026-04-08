"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Sparkles, Upload, Eye, EyeOff, Calendar, Zap } from "lucide-react";
import Link from "next/link";
import { MarkdownPreview } from "@/components/markdown-preview";

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
  scheduledAt: string;
}

interface Category { id: string; name: string; }

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [generating, setGenerating] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [bulkKeywords, setBulkKeywords] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<PostForm>({
    defaultValues: { published: false, featured: false },
  });

  const contentValue = watch("content");

  useEffect(() => {
    fetch("/api/posts").then((res) => {
      if (res.status === 401) { router.push("/admin/login"); return; }
      fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
    });
  }, [router]);

  async function onSubmit(data: PostForm) {
    const body: Record<string, unknown> = { ...data };
    if (data.scheduledAt) body.scheduledAt = new Date(data.scheduledAt).toISOString();
    else delete body.scheduledAt;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
      } else { alert(data.error || "Failed to generate"); }
    } catch { alert("Generation failed."); }
    setGenerating(false);
  }

  async function bulkGenerate() {
    const keywords = bulkKeywords.split("\n").map((k) => k.trim()).filter(Boolean);
    if (!keywords.length || !watch("categoryId")) { alert("Enter keywords and select a category"); return; }
    setBulkGenerating(true);
    try {
      const res = await fetch("/api/posts/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, categoryId: watch("categoryId") }),
      });
      const data = await res.json();
      if (res.ok) {
        const success = data.results.filter((r: { status: string }) => r.status === "success").length;
        alert(`Generated ${success}/${keywords.length} articles as drafts. Check the dashboard.`);
        setBulkKeywords("");
      } else { alert(data.error || "Bulk generation failed"); }
    } catch { alert("Bulk generation failed."); }
    setBulkGenerating(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setValue("featuredImage", data.url);
      else alert(data.error || "Upload failed");
    } catch { alert("Upload failed"); }
    setUploading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-foreground dark:text-white mb-8">Create New Post</h1>

      {/* AI Generation */}
      <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 mb-6">
        <h3 className="flex items-center gap-2 font-semibold text-foreground dark:text-white mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" /> Generate with AI
        </h3>
        <div className="flex gap-3 mb-3">
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter a keyword (e.g., 'best ab exercises')"
            className="flex-1 px-3.5 py-2.5 border border-purple-200 dark:border-purple-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-300" />
          <button onClick={generateWithAI} disabled={generating || !keyword.trim()}
            className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate
          </button>
        </div>

        {/* Bulk Generation */}
        <details className="mt-3">
          <summary className="text-xs text-purple-600 cursor-pointer font-medium flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Bulk Generate (up to 5 articles)
          </summary>
          <div className="mt-2 space-y-2">
            <textarea value={bulkKeywords} onChange={(e) => setBulkKeywords(e.target.value)} placeholder="One keyword per line..." rows={3}
              className="w-full px-3.5 py-2.5 border border-purple-200 dark:border-purple-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
            <button onClick={bulkGenerate} disabled={bulkGenerating}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-70 flex items-center gap-1.5">
              {bulkGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Generate All as Drafts
            </button>
          </div>
        </details>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Title</label>
            <input {...register("title", { required: true })} className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Article title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Category</label>
            <select {...register("categoryId", { required: true })} className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Featured Image</label>
            <div className="flex gap-2">
              <input {...register("featuredImage")} className="flex-1 px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="URL or upload" />
              <label className={`px-3 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm cursor-pointer hover:bg-surface dark:hover:bg-gray-700 transition-colors flex items-center gap-1 ${uploading ? "opacity-70" : ""}`}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Schedule Publication</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted" />
              <input type="datetime-local" {...register("scheduledAt")} className="flex-1 px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Excerpt</label>
            <textarea {...register("excerpt", { required: true })} rows={2} className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Brief summary" />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground dark:text-white">Content (Markdown)</label>
              <button type="button" onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-dark">
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
            {showPreview ? (
              <div className="grid grid-cols-2 gap-4">
                <textarea {...register("content", { required: true })} rows={16} className="px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm font-mono bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
                <div className="p-4 border border-border dark:border-gray-600 rounded-xl overflow-y-auto max-h-[400px] bg-white dark:bg-gray-800">
                  <MarkdownPreview content={contentValue || ""} />
                </div>
              </div>
            ) : (
              <textarea {...register("content", { required: true })} rows={16} className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm font-mono bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" placeholder="Write your article in markdown..." />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">SEO Title</label>
            <input {...register("metaTitle")} className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="SEO-optimized title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Meta Description</label>
            <input {...register("metaDescription")} className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="150-160 characters" />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("published")} className="rounded border-border" />
            <span className="font-medium text-foreground dark:text-white">Publish</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="rounded border-border" />
            <span className="font-medium text-foreground dark:text-white">Featured</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Post"}
          </button>
          <Link href="/admin" className="px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
