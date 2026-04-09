"use client";

import { useState } from "react";
import { Target } from "lucide-react";

const goals = [
  { value: "lose", label: "Fat Loss", proteinMult: 2.2, fatPct: 0.25 },
  { value: "maintain", label: "Maintain Weight", proteinMult: 1.8, fatPct: 0.3 },
  { value: "gain", label: "Muscle Gain", proteinMult: 2.0, fatPct: 0.25 },
];

export default function MacroCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [result, setResult] = useState<{ protein: number; carbs: number; fat: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const cal = parseInt(calories);
    if (!w || !cal) return;

    const g = goals.find((g) => g.value === goal)!;
    const protein = Math.round(w * g.proteinMult);
    const fat = Math.round((cal * g.fatPct) / 9);
    const carbsCal = cal - protein * 4 - fat * 9;
    const carbs = Math.round(Math.max(0, carbsCal) / 4);

    setResult({ protein, carbs, fat });
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Macro Calculator</h1>
          <p className="text-muted mt-2">Find your optimal macronutrient split</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border dark:border-gray-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Your Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {goals.map((g) => (
                <button key={g.value} onClick={() => setGoal(g.value)}
                  className={`py-2 text-sm font-medium rounded-lg transition-colors ${
                    goal === g.value ? "bg-primary text-white" : "bg-surface dark:bg-gray-800 text-muted border border-border dark:border-gray-600"
                  }`}
                >{g.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Body Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75"
              className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-1.5">Daily Calories</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="2500"
              className="w-full px-3.5 py-2.5 border border-border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <p className="text-xs text-muted mt-1">Use our TDEE calculator if you&apos;re not sure</p>
          </div>

          <button onClick={calculate} className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Calculate Macros
          </button>

          {result && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-xs text-muted mb-1">Protein</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.protein}g</p>
                <p className="text-xs text-muted">{result.protein * 4} cal</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-xs text-muted mb-1">Carbs</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{result.carbs}g</p>
                <p className="text-xs text-muted">{result.carbs * 4} cal</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-xs text-muted mb-1">Fat</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.fat}g</p>
                <p className="text-xs text-muted">{result.fat * 9} cal</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
