"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage?: string | null;
}

export interface BookmarkItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage?: string | null;
  savedAt: string;
}

const STORAGE_KEY = "fithorizon-bookmarks";

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function BookmarkButton({ slug, title, excerpt, category, featuredImage }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setSaved(bookmarks.some((b) => b.slug === slug));
  }, [slug]);

  const toggle = () => {
    const bookmarks = getBookmarks();
    if (saved) {
      const filtered = bookmarks.filter((b) => b.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setSaved(false);
    } else {
      bookmarks.push({ slug, title, excerpt, category, featuredImage, savedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg transition-colors ${
        saved
          ? "text-primary bg-primary/10 hover:bg-primary/20"
          : "text-muted hover:text-foreground hover:bg-surface dark:hover:bg-gray-800"
      }`}
      title={saved ? "Remove bookmark" : "Save article"}
    >
      {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
    </button>
  );
}
