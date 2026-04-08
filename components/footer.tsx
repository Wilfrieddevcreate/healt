import Link from "next/link";
import { Dumbbell } from "lucide-react";

const footerLinks = {
  Categories: [
    { href: "/category/weight-loss", label: "Weight Loss" },
    { href: "/category/weight-gain", label: "Weight Gain" },
    { href: "/category/muscle-building", label: "Muscle Building" },
  ],
  Tools: [
    { href: "/tools/bmi-calculator", label: "BMI Calculator" },
    { href: "/tools/tdee-calculator", label: "TDEE Calculator" },
    { href: "/tools/macro-calculator", label: "Macro Calculator" },
  ],
  Company: [
    { href: "/blog", label: "Blog" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Fit<span className="text-primary-light">Horizon</span>
              </span>
            </Link>
            <p className="text-muted-light text-sm leading-relaxed max-w-md">
              Science-backed fitness and nutrition advice to help you achieve your body
              transformation goals. Evidence-based guides for weight loss, muscle building,
              and healthy weight gain.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-light">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-light hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-xs text-muted-light">
            &copy; {new Date().getFullYear()} FitHorizon. All rights reserved. Content is for
            informational purposes only and is not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
