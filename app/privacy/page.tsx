import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "FitHorizon privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
      <div className="prose prose-lg prose-green max-w-none prose-headings:text-foreground prose-p:text-muted">
        <p><em>Last updated: April 8, 2026</em></p>

        <h2>1. Introduction</h2>
        <p>FitHorizon (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website fithorizon.com (the &quot;Site&quot;).</p>

        <h2>2. Information We Collect</h2>
        <h3>Personal Data</h3>
        <p>We may collect personal information that you voluntarily provide to us, including but not limited to:</p>
        <ul>
          <li>Email address (when subscribing to our newsletter)</li>
          <li>Name and contact information (when contacting us)</li>
        </ul>

        <h3>Automatically Collected Data</h3>
        <p>When you visit our Site, we may automatically collect certain information, including:</p>
        <ul>
          <li>IP address and browser type</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Device and operating system information</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Send newsletters and updates you have opted into</li>
          <li>Analyze website traffic and improve our content</li>
          <li>Respond to your inquiries and support needs</li>
          <li>Display relevant advertising through third-party services like Google AdSense</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to enhance your experience. Third-party services, including Google AdSense, may use cookies to serve ads based on your prior visits. You can opt out of personalized advertising by visiting <strong>Google Ads Settings</strong>.</p>

        <h2>5. Third-Party Services</h2>
        <p>We may employ third-party companies and services, including:</p>
        <ul>
          <li><strong>Google AdSense</strong> — for displaying advertisements</li>
          <li><strong>Google Analytics</strong> — for website analytics</li>
          <li><strong>Newsletter providers</strong> — for email delivery</li>
        </ul>
        <p>These third parties may have access to your personal information only to perform tasks on our behalf and are obligated not to disclose or use it for other purposes.</p>

        <h2>6. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

        <h2>7. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the following rights:</p>
        <ul>
          <li>Access, correct, or delete your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>8. Children&apos;s Privacy</h2>
        <p>Our Site is not directed to individuals under the age of 13. We do not knowingly collect personal information from children.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

        <h2>10. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at <strong>privacy@fithorizon.com</strong>.</p>
      </div>
    </div>
  );
}
