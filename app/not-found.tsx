"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-muted dark:text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto px-5 py-2.5 bg-surface dark:bg-gray-800 text-foreground dark:text-white font-semibold rounded-xl border border-border dark:border-gray-700 hover:bg-surface-alt dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Browse Articles
          </Link>
        </div>

        <button
          onClick={() => history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </motion.div>
    </div>
  );
}
