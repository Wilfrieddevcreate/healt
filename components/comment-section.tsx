"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  replies: Comment[];
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, authorName: name, authorEmail: email, content, parentId: replyTo }),
      });
      if (res.ok) {
        setSuccess(true);
        setContent("");
        setReplyTo(null);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? "ml-8 border-l-2 border-border dark:border-gray-700 pl-4" : ""}`}>
      <div className="py-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground dark:text-white">{comment.authorName}</p>
            <p className="text-xs text-muted">
              {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed ml-10">{comment.content}</p>
        <button
          onClick={() => setReplyTo(comment.id)}
          className="text-xs text-primary hover:text-primary-dark font-medium ml-10 mt-1"
        >
          Reply
        </button>
      </div>
      {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <div className="mt-12">
      <h3 className="flex items-center gap-2 text-xl font-bold text-foreground dark:text-white mb-6">
        <MessageCircle className="w-5 h-5" />
        Comments ({comments.length})
      </h3>

      {comments.length > 0 && (
        <div className="divide-y divide-border dark:divide-gray-700 mb-8">
          {comments.map((c) => renderComment(c))}
        </div>
      )}

      <div className="p-5 bg-surface dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700">
        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-4">
          {replyTo ? "Write a reply" : "Leave a comment"}
          {replyTo && (
            <button onClick={() => setReplyTo(null)} className="text-xs text-muted ml-2 font-normal hover:text-foreground">
              (cancel reply)
            </button>
          )}
        </h4>

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400 mb-4">
            Comment submitted! It will appear after moderation.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (not displayed)"
              required
              className="px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            required
            rows={3}
            className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
