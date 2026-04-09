import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "FitHorizon health and fitness disclaimer. Important information about the content on our website.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-8">Disclaimer</h1>
      <div className="prose prose-lg prose-green max-w-none prose-headings:text-foreground prose-p:text-muted dark:prose-invert">
        <p><em>Last updated: April 8, 2026</em></p>

        <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl not-prose mb-8">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            The information provided on FitHorizon is for general informational and educational purposes only. It is not intended as, and should not be understood or construed as, medical advice, diagnosis, or treatment.
          </p>
        </div>

        <h2>1. Not Medical Advice</h2>
        <p>The content on FitHorizon, including but not limited to articles, guides, tips, and recommendations about fitness, nutrition, weight loss, weight gain, and muscle building, is for informational purposes only. This content is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment.</p>
        <p>Always seek the advice of your physician, registered dietitian, or other qualified health provider with any questions you may have regarding a medical condition, dietary changes, or exercise program. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.</p>

        <h2>2. No Professional-Client Relationship</h2>
        <p>Use of this Site does not create a professional-client relationship between you and FitHorizon or any of its contributors. The information provided is general in nature and may not be suitable for your specific circumstances.</p>

        <h2>3. Individual Results May Vary</h2>
        <p>Fitness and health outcomes depend on many individual factors, including but not limited to:</p>
        <ul>
          <li>Age, gender, and genetics</li>
          <li>Current health status and medical history</li>
          <li>Consistency and adherence to programs</li>
          <li>Diet, sleep, and lifestyle factors</li>
          <li>Pre-existing medical conditions</li>
        </ul>
        <p>We make no guarantees regarding specific results from following any advice or recommendations provided on this Site.</p>

        <h2>4. Exercise and Nutrition Risks</h2>
        <p>Physical exercise carries inherent risks, including but not limited to injury, aggravation of pre-existing conditions, and in rare cases, serious medical events. Before beginning any exercise program or making significant dietary changes, we strongly recommend:</p>
        <ul>
          <li>Consulting with a qualified healthcare professional</li>
          <li>Getting a physical examination if you have not exercised recently</li>
          <li>Starting gradually and progressing at an appropriate pace</li>
          <li>Stopping immediately if you experience pain, dizziness, or discomfort</li>
        </ul>

        <h2>5. Supplement Information</h2>
        <p>Any information about dietary supplements on this Site is for educational purposes only. Supplements are not regulated by the FDA in the same manner as prescription medications. Always consult with a healthcare professional before taking any supplements, especially if you are pregnant, nursing, taking medications, or have medical conditions.</p>

        <h2>6. Accuracy of Information</h2>
        <p>While we strive to provide accurate, up-to-date information based on current scientific research, the fields of fitness and nutrition are constantly evolving. We cannot guarantee that all information on the Site is complete, accurate, or current at all times.</p>

        <h2>7. Affiliate and Advertising Disclosure</h2>
        <p>FitHorizon may contain affiliate links and advertisements. We may earn commissions from qualifying purchases made through affiliate links. This does not affect our editorial integrity or the accuracy of our content. Advertisements displayed through Google AdSense are provided by third parties, and we do not endorse the products or services advertised.</p>

        <h2>8. External Links</h2>
        <p>Links to external websites are provided for convenience and informational purposes. FitHorizon does not endorse, control, or take responsibility for the content of external sites. Use external links at your own discretion.</p>

        <h2>9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, FitHorizon and its contributors shall not be held liable for any damages, injuries, or losses resulting from the use of information provided on this Site.</p>

        <h2>10. Contact</h2>
        <p>If you have questions about this disclaimer, contact us at <strong>legal@fithorizon.com</strong>.</p>
      </div>
    </div>
  );
}
