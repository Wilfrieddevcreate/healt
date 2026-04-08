"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Trash2 } from "lucide-react";
import { type BookmarkItem, getBookmarks } from "@/components/bookmark-button";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const remove = (slug: string) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    localStorage.setItem("fithorizon-bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground dark:text-white">Saved Articles</h1>
            <p className="text-sm text-muted">{bookmarks.length} article{bookmarks.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <p className="text-muted mb-2">No saved articles yet</p>
            <Link href="/blog" className="text-sm font-semibold text-primary hover:text-primary-dark">
              Browse articles
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((b) => (
              <div key={b.slug} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-700 group">
                {b.featuredImage && (
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={b.featuredImage} alt={b.title} fill className="object-cover" sizes="80px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/blog/${b.slug}`} className="font-medium text-sm text-foreground dark:text-white hover:text-primary transition-colors line-clamp-1">
                    {b.title}
                  </Link>
                  <p className="text-xs text-muted mt-0.5">{b.category}</p>
                </div>
                <button
                  onClick={() => remove(b.slug)}
                  className="p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
