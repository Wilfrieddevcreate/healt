import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "FitHorizon terms of use. Read our terms and conditions for using our website and services.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-8">Terms of Use</h1>
      <div className="prose prose-lg prose-green max-w-none prose-headings:text-foreground prose-p:text-muted dark:prose-invert">
        <p><em>Last updated: April 8, 2026</em></p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using FitHorizon (&quot;the Site&quot;), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Site.</p>

        <h2>2. Use of Content</h2>
        <p>All content on this Site, including articles, images, graphics, and logos, is the property of FitHorizon and is protected by copyright laws. You may:</p>
        <ul>
          <li>View and read content for personal, non-commercial use</li>
          <li>Share links to our content on social media</li>
          <li>Quote brief excerpts with proper attribution</li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>Reproduce, distribute, or republish content without written permission</li>
          <li>Use content for commercial purposes without authorization</li>
          <li>Remove or alter any copyright or proprietary notices</li>
        </ul>

        <h2>3. User Conduct</h2>
        <p>When using our Site, you agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Attempt to interfere with the proper functioning of the Site</li>
          <li>Upload or transmit viruses or malicious code</li>
          <li>Collect user information without consent</li>
          <li>Use automated systems to access the Site without permission</li>
        </ul>

        <h2>4. Newsletter Subscription</h2>
        <p>By subscribing to our newsletter, you consent to receive periodic emails from FitHorizon. You may unsubscribe at any time using the link provided in each email.</p>

        <h2>5. Third-Party Links</h2>
        <p>Our Site may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Visiting linked sites is at your own risk.</p>

        <h2>6. Advertising</h2>
        <p>The Site may display advertisements provided by third-party advertising networks, including Google AdSense. These advertisements may use cookies to serve relevant ads. We are not responsible for the content of third-party advertisements.</p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>The Site and its content are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Site will be uninterrupted, error-free, or free of harmful components.</p>

        <h2>8. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, FitHorizon shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or reliance on any content provided.</p>

        <h2>9. Indemnification</h2>
        <p>You agree to indemnify and hold harmless FitHorizon, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Site or violation of these Terms.</p>

        <h2>10. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.</p>

        <h2>11. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the modified Terms.</p>

        <h2>12. Contact</h2>
        <p>For questions regarding these Terms, contact us at <strong>legal@fithorizon.com</strong>.</p>
      </div>
    </div>
  );
}
