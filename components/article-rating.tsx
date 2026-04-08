"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function ArticleRating({ postId }: { postId: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [stats, setStats] = useState({ helpful: 0, total: 0 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/ratings?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        const stored = localStorage.getItem(`rating-${postId}`);
        if (stored) { setRating(parseInt(stored)); setSubmitted(true); }
      })
      .catch(() => {});
  }, [postId]);

  const submitRating = async (value: number) => {
    if (submitted) return;
    setRating(value);
    setSubmitted(true);
    localStorage.setItem(`rating-${postId}`, String(value));

    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, value }),
      });
      setStats((prev) => ({
        helpful: prev.helpful + (value === 1 ? 1 : 0),
        total: prev.total + 1,
      }));
    } catch { /* silent */ }
  };

  return (
    <div className="p-5 bg-surface dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 text-center">
      <p className="font-medium text-foreground dark:text-white text-sm mb-3">
        Was this article helpful?
      </p>
      <div className="flex items-center justify-center gap-3 mb-2">
        <button
          onClick={() => submitRating(1)}
          disabled={submitted}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            rating === 1
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-white dark:bg-gray-700 text-muted hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 border border-border dark:border-gray-600"
          } ${submitted ? "cursor-default" : "cursor-pointer"}`}
        >
          <ThumbsUp className="w-4 h-4" /> Yes
        </button>
        <button
          onClick={() => submitRating(0)}
          disabled={submitted}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            rating === 0
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-white dark:bg-gray-700 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 border border-border dark:border-gray-600"
          } ${submitted ? "cursor-default" : "cursor-pointer"}`}
        >
          <ThumbsDown className="w-4 h-4" /> No
        </button>
      </div>
      {stats.total > 0 && (
        <p className="text-xs text-muted">
          {stats.helpful} of {stats.total} readers found this helpful
        </p>
      )}
    </div>
  );
}
