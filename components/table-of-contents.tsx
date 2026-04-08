"use client";

import { useMemo } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => {
    const items: TocItem[] = [];
    const regex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const text = match[2].replace(/\*\*/g, "");
      items.push({
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        text,
        level: match[1].length,
      });
    }
    return items;
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="p-5 bg-surface dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700">
      <h4 className="flex items-center gap-2 font-semibold text-sm text-foreground dark:text-white mb-3">
        <List className="w-4 h-4" />
        Table of Contents
      </h4>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-xs text-muted dark:text-gray-400 hover:text-primary transition-colors leading-relaxed ${
                h.level === 3 ? "pl-3" : ""
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
