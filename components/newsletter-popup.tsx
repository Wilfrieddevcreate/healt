"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter-popup-dismissed");
    if (dismissed) return;

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled > 0.4) {
        setShow(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("newsletter-popup-dismissed", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(dismiss, 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-[90] w-[340px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5">
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-primary" />
            </div>

            {status === "success" ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm font-medium">You&apos;re subscribed!</p>
              </div>
            ) : (
              <>
                <h4 className="font-bold text-foreground dark:text-white text-sm mb-1">
                  Get weekly fitness tips
                </h4>
                <p className="text-xs text-muted mb-3">
                  Join 10,000+ readers. No spam, unsubscribe anytime.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
                  >
                    {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                  </button>
                </form>
                {status === "error" && <p className="text-xs text-red-500 mt-2">Something went wrong.</p>}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
