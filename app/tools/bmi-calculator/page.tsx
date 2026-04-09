"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export default function BMICalculatorPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    let bmi: number;
    if (unit === "metric") {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100;
      if (!w || !h) return;
      bmi = w / (h * h);
    } else {
      const w = parseFloat(weight);
      const h = parseInt(heightFt) * 12 + parseInt(heightIn || "0");
      if (!w || !h) return;
      bmi = (w / (h * h)) * 703;
    }

    let category: string, color: string;
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-600 dark:text-blue-400"; }
    else if (bmi < 25) { category = "Normal weight"; color = "text-green-600 dark:text-green-400"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-amber-600 dark:text-amber-400"; }
    else { category = "Obese"; color = "text-red-600 dark:text-red-400"; }

    setResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">BMI Calculator</h1>
          <p className="text-muted mt-2">Calculate your Body Mass Index</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border dark:border-gray-700 p-6 space-y-4">
          <div className="flex rounded-lg overflow-hidden border border-border dark:border-gray-600">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => { setUnit(u); setResult(null); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  unit === u ? "bg-primary text-white" : "bg-white dark:bg-gray-800 text-muted hover:bg-surface"
                }`}
              >
                {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/ft)"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "154"}
              className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {unit === "metric" ? (
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Feet</label>
                <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5"
                  className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Inches</label>
                <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9"
                  className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}

          <button onClick={calculate} className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Calculate BMI
          </button>

          {result && (
            <div className="p-5 bg-surface dark:bg-gray-800 rounded-xl text-center">
              <p className="text-4xl font-bold text-foreground dark:text-white">{result.bmi}</p>
              <p className={`text-lg font-semibold mt-1 ${result.color}`}>{result.category}</p>
              <div className="mt-3 text-xs text-muted space-y-0.5">
                <p>Underweight: &lt;18.5 &middot; Normal: 18.5-24.9</p>
                <p>Overweight: 25-29.9 &middot; Obese: 30+</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
