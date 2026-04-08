"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, LogOut, Sparkles, FileText, Users, MessageCircle, BarChart3, Check, X } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  category: { name: string };
}

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  totalViews: number;
  categoryStats: { name: string; count: number }[];
}

interface PendingComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  post: { title: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "comments">("posts");

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((r) => { if (r.status === 401) { router.push("/admin/login"); return null; } return r.json(); }),
      fetch("/api/stats").then((r) => r.ok ? r.json() : null),
      fetch("/api/comments?pending=true&admin=true").then((r) => r.ok ? r.json() : []),
    ]).then(([postsData, statsData, commentsData]) => {
      if (postsData) setPosts(postsData);
      if (statsData) setStats(statsData);
      setPendingComments(commentsData || []);
      setLoading(false);
    });
  }, [router]);

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setPosts(posts.map((p) => (p.id === id ? { ...p, published: !published } : p)));
  }

  async function approveComment(id: string) {
    await fetch(`/api/comments/${id}`, { method: "PUT" });
    setPendingComments(pendingComments.filter((c) => c.id !== id));
  }

  async function deleteComment(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setPendingComments(pendingComments.filter((c) => c.id !== id));
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/posts/new" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Link>
          <button onClick={async () => { await fetch("/api/auth", { method: "DELETE" }); router.push("/admin/login"); }}
            className="p-2 text-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: "Published", value: stats.publishedPosts, color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
            { icon: Edit, label: "Drafts", value: stats.draftPosts, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20" },
            { icon: Users, label: "Subscribers", value: stats.totalSubscribers, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
            { icon: BarChart3, label: "Total Views", value: stats.totalViews, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20" },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-700">
              <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center mb-2`}>
                <s.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border dark:border-gray-700">
        {[
          { key: "posts", label: "Posts", count: posts.length },
          { key: "comments", label: "Pending Comments", count: pendingComments.length },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as "posts" | "comments")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"
            }`}>
            {t.label} {t.count > 0 && <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "posts" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border dark:border-gray-700 bg-surface dark:bg-gray-800">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Views</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border dark:border-gray-700 last:border-0 hover:bg-surface/50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground dark:text-white">{post.title}</span>
                        {post.featured && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{post.category.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted">{post.views || 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => togglePublish(post.id, post.published)} className="p-1.5 text-muted hover:text-foreground rounded-md hover:bg-surface transition-colors" title={post.published ? "Unpublish" : "Publish"}>
                          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-muted hover:text-foreground rounded-md hover:bg-surface transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deletePost(post.id)} className="p-1.5 text-muted hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "comments" && (
        <div className="space-y-3">
          {pendingComments.length === 0 ? (
            <p className="text-center text-muted py-12">No pending comments</p>
          ) : (
            pendingComments.map((c) => (
              <div key={c.id} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-white">{c.authorName}</p>
                    <p className="text-xs text-muted mb-2">on &quot;{c.post?.title || "Unknown post"}&quot;</p>
                    <p className="text-sm text-muted">{c.content}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => approveComment(c.id)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors" title="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteComment(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Delete">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
