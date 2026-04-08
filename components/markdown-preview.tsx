"use client";

import { MarkdownContent } from "./markdown-content";

export function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <div className="text-sm text-muted text-center py-8">
        Start writing to see the preview...
      </div>
    );
  }

  return (
    <div className="prose prose-sm prose-green max-w-none prose-headings:text-foreground prose-p:text-muted prose-strong:text-foreground prose-li:text-muted dark:prose-invert">
      <MarkdownContent content={content} />
    </div>
  );
}
