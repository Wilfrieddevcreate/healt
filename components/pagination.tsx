import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const buildHref = (page: number) => page === 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted text-sm">...</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground hover:bg-surface dark:hover:bg-gray-800"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </nav>
  );
}
