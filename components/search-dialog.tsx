"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: { name: string; slug: string };
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border dark:border-gray-700">
                <Search className="w-5 h-5 text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent text-sm text-foreground dark:text-white placeholder:text-muted focus:outline-none"
                />
                {loading && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
                <button onClick={() => setOpen(false)} className="p-1 text-muted hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {results.length === 0 && query.trim() && !loading && (
                  <p className="text-sm text-muted text-center py-8">No results found</p>
                )}
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-surface dark:hover:bg-gray-800 transition-colors border-b border-border/50 dark:border-gray-700/50 last:border-0"
                  >
                    <p className="text-sm font-medium text-foreground dark:text-white">{r.title}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{r.excerpt}</p>
                    <span className="text-xs text-primary mt-1 inline-block">{r.category.name}</span>
                  </Link>
                ))}
              </div>

              {!query.trim() && (
                <p className="text-xs text-muted text-center py-6">
                  Type to search &middot; <kbd className="px-1.5 py-0.5 bg-surface dark:bg-gray-800 rounded text-[10px] font-mono">Esc</kbd> to close
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
