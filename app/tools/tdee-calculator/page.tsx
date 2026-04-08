"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

const activityLevels = [
  { value: 1.2, label: "Sedentary (office job, little exercise)" },
  { value: 1.375, label: "Lightly active (1-3 days/week)" },
  { value: 1.55, label: "Moderately active (3-5 days/week)" },
  { value: 1.725, label: "Very active (6-7 days/week)" },
  { value: 1.9, label: "Extremely active (athlete/physical job)" },
];

export default function TDEECalculatorPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState(1.55);
  const [result, setResult] = useState<{ bmr: number; tdee: number; cut: number; bulk: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !h || !a) return;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = Math.round(bmr * activity);
    setResult({
      bmr: Math.round(bmr),
      tdee,
      cut: Math.round(tdee - 500),
      bulk: Math.round(tdee + 400),
    });
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flame className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">TDEE Calculator</h1>
          <p className="text-muted mt-2">Find your Total Daily Energy Expenditure</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border dark:border-gray-700 p-6 space-y-4">
          <div className="flex rounded-lg overflow-hidden border border-border dark:border-gray-600">
            {(["male", "female"] as const).map((g) => (
              <button key={g} onClick={() => setGender(g)}
                className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
                  gender === g ? "bg-primary text-white" : "bg-white dark:bg-gray-800 text-muted"
                }`}
              >{g}</button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25"
                className="w-full px-3 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75"
                className="w-full px-3 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Height (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175"
                className="w-full px-3 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Activity Level</label>
            <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              {activityLevels.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <button onClick={calculate} className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Calculate TDEE
          </button>

          {result && (
            <div className="space-y-3">
              <div className="p-5 bg-surface dark:bg-gray-800 rounded-xl text-center">
                <p className="text-sm text-muted mb-1">Your TDEE (maintenance)</p>
                <p className="text-4xl font-bold text-foreground dark:text-white">{result.tdee}</p>
                <p className="text-sm text-muted">calories/day</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-xs text-muted mb-0.5">BMR</p>
                  <p className="text-lg font-bold text-foreground dark:text-white">{result.bmr}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-xs text-muted mb-0.5">Fat Loss</p>
                  <p className="text-lg font-bold text-red-600">{result.cut}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-xs text-muted mb-0.5">Bulking</p>
                  <p className="text-lg font-bold text-green-600">{result.bulk}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
