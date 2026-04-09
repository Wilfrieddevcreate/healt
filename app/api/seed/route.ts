import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  // In production, require ?token=... that matches the SEED_TOKEN env var.
  // In dev, the endpoint is open for convenience.
  if (process.env.NODE_ENV === "production") {
    const token = new URL(request.url).searchParams.get("token");
    const expected = process.env.SEED_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Don't re-seed if posts already exist — prevents accidental data clobbering.
  const existingPosts = await prisma.post.count();
  if (existingPosts > 0) {
    return NextResponse.json({
      success: true,
      message: `Database already seeded (${existingPosts} posts). Skipping.`,
    });
  }

  const password = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fithorizon.com" },
    update: {},
    create: {
      email: "admin@fithorizon.com",
      password,
      name: "FitHorizon Team",
    },
  });

  const categoriesData = [
    {
      name: "Weight Loss",
      slug: "weight-loss",
      description: "Science-backed strategies for sustainable fat loss, calorie management, and healthy body composition.",
    },
    {
      name: "Weight Gain",
      slug: "weight-gain",
      description: "Proven approaches to healthy weight gain, bulking nutrition, and caloric surplus strategies.",
    },
    {
      name: "Muscle Building",
      slug: "muscle-building",
      description: "Expert guidance on hypertrophy training, progressive overload, and maximizing muscle growth.",
    },
  ];

  const createdCategories = [];
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(c);
  }

  const posts = [
    {
      title: "10 Proven Strategies to Lose Weight Without Feeling Hungry",
      slug: "10-proven-strategies-lose-weight-without-feeling-hungry",
      excerpt: "Discover science-backed methods to shed pounds while staying satisfied. These strategies focus on nutrient density, meal timing, and sustainable habits.",
      content: `## Why Most Diets Fail\n\nThe biggest reason diets fail is simple: they make you feel deprived. When hunger signals are constantly firing, willpower eventually runs out. The key to sustainable weight loss isn't eating less — it's eating smarter.\n\n## 1. Prioritize Protein at Every Meal\n\nProtein is the most satiating macronutrient. Studies show that increasing protein intake to 25-30% of total calories can reduce cravings by 60% and cut late-night snacking in half.\n\n**Action step:** Aim for 1.6-2.2g of protein per kilogram of body weight daily.\n\n## 2. Load Up on Fiber-Rich Foods\n\nFiber slows digestion and promotes feelings of fullness. Vegetables, legumes, and whole grains are your best allies.\n\n**Action step:** Target 25-35g of fiber daily from whole food sources.\n\n## 3. Stay Hydrated Throughout the Day\n\nThirst is often mistaken for hunger. Drinking water before meals can reduce calorie intake by up to 13%.\n\n**Action step:** Drink at least 8 glasses of water daily, and one full glass 30 minutes before each meal.\n\n## 4. Use the Volumetrics Approach\n\nEat foods with high water content and low calorie density. Soups, salads, and fruits let you eat large portions without excess calories.\n\n## 5. Practice Mindful Eating\n\nSlow down, chew thoroughly, and pay attention to hunger cues. Research shows mindful eating reduces overall calorie intake by 10-15%.\n\n## 6. Get Quality Sleep\n\nSleep deprivation increases ghrelin (hunger hormone) and decreases leptin (satiety hormone). Aim for 7-9 hours nightly.\n\n## 7. Manage Stress Levels\n\nChronic stress elevates cortisol, which promotes fat storage, especially around the midsection. Incorporate stress-management techniques like meditation or walking.\n\n## 8. Don't Skip Meals\n\nSkipping meals leads to overeating later. Consistent meal timing helps regulate appetite hormones.\n\n## 9. Choose Whole Foods Over Processed\n\nUltra-processed foods are engineered to override your natural satiety signals. Whole foods naturally regulate appetite.\n\n## 10. Move More Throughout the Day\n\nBeyond structured exercise, increasing non-exercise activity thermogenesis (NEAT) through walking, standing, and fidgeting can burn an extra 200-500 calories daily.\n\n## The Bottom Line\n\nSustainable weight loss isn't about restriction — it's about making strategic choices that keep you satisfied while creating a moderate caloric deficit. Focus on these strategies consistently, and the results will follow.`,
      metaTitle: "10 Proven Weight Loss Strategies That Actually Work | FitHorizon",
      metaDescription: "Learn 10 science-backed strategies to lose weight without feeling hungry. Sustainable fat loss tips backed by research.",
      featuredImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop",
      readingTime: 7,
      published: true,
      featured: true,
      categoryId: createdCategories[0].id,
      authorId: admin.id,
    },
    {
      title: "The Complete Guide to Building Muscle: From Beginner to Advanced",
      slug: "complete-guide-building-muscle-beginner-advanced",
      excerpt: "Everything you need to know about hypertrophy training, progressive overload, and nutrition for maximum muscle growth.",
      content: `## Understanding Muscle Growth\n\nMuscle hypertrophy occurs when muscle protein synthesis exceeds muscle protein breakdown. To achieve this, you need three key components: mechanical tension, metabolic stress, and muscle damage.\n\n## The Foundation: Progressive Overload\n\nProgressive overload is the single most important principle for muscle growth. You must continuously increase the demands placed on your muscles over time.\n\n### How to Apply Progressive Overload\n\n- **Increase weight:** Add 2.5-5 lbs to upper body and 5-10 lbs to lower body lifts\n- **Increase reps:** Add 1-2 reps per set before increasing weight\n- **Increase sets:** Add volume gradually over training blocks\n- **Improve form:** Better technique means better muscle engagement\n\n## Optimal Training Volume\n\nResearch suggests 10-20 sets per muscle group per week is optimal for most people:\n\n- **Beginners:** 10-12 sets per muscle group/week\n- **Intermediate:** 12-16 sets per muscle group/week\n- **Advanced:** 16-20+ sets per muscle group/week\n\n## Nutrition for Muscle Growth\n\n### Caloric Surplus\nEat 300-500 calories above maintenance for lean gains.\n\n### Protein Requirements\nConsume 1.6-2.2g of protein per kilogram of body weight daily, spread across 3-5 meals.\n\n### Carbohydrates\nCarbs fuel your training. Aim for 4-7g per kg of body weight depending on activity level.\n\n## Recovery\n\n- **Sleep:** 7-9 hours per night is non-negotiable\n- **Rest days:** Include 1-2 full rest days per week\n- **Deload weeks:** Every 4-6 weeks, reduce volume by 40-50%\n\n## The Bottom Line\n\nBuilding muscle is a long-term endeavor that requires consistency in training, nutrition, and recovery. Follow these evidence-based principles and be patient — significant results take months, not weeks.`,
      metaTitle: "Complete Muscle Building Guide: Beginner to Advanced | FitHorizon",
      metaDescription: "Master muscle building with our comprehensive guide covering hypertrophy training, progressive overload, nutrition, and recovery strategies.",
      featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=630&fit=crop",
      readingTime: 10,
      published: true,
      featured: true,
      categoryId: createdCategories[2].id,
      authorId: admin.id,
    },
    {
      title: "How to Gain Weight Healthily: A Nutritionist's Guide",
      slug: "how-to-gain-weight-healthily-nutritionist-guide",
      excerpt: "Struggling to gain weight? Learn the science of healthy weight gain with practical meal plans and calorie-dense food strategies.",
      content: `## Why Gaining Weight Can Be Challenging\n\nFor hardgainers — people with naturally fast metabolisms — gaining weight requires a deliberate, consistent strategy.\n\n## Understanding Your Caloric Needs\n\n### Calculate Your TDEE\nYour Total Daily Energy Expenditure determines how many calories you burn. To gain weight, you need to eat above this number consistently.\n\n**Formula:** TDEE + 300-500 calories = weight gain target\n\n## The Best Calorie-Dense Foods\n\n### Healthy Fats (9 calories per gram)\n- Nuts and nut butters\n- Avocados\n- Olive oil and coconut oil\n- Fatty fish (salmon, mackerel)\n\n### Complex Carbohydrates\n- Oats and granola\n- Rice and pasta\n- Sweet potatoes\n- Whole grain bread\n\n## Meal Timing Strategies\n\n### Eat Every 3 Hours\nDon't wait until you're hungry. Set alarms if needed.\n\n### Never Skip Breakfast\nA calorie-dense breakfast sets the tone for the day.\n\n### Pre-Bed Snack\nA casein-rich snack before bed provides sustained amino acids during sleep.\n\n## Training for Weight Gain\n\nFocus on compound movements:\n- Squats\n- Deadlifts\n- Bench Press\n- Overhead Press\n- Rows\n\nKeep cardio minimal — 2-3 sessions of 20 minutes per week maximum.\n\n## The Bottom Line\n\nHealthy weight gain requires the same discipline as weight loss — just in the opposite direction. Be consistent, patient, and strategic with your nutrition and training.`,
      metaTitle: "How to Gain Weight Healthily: Complete Nutritionist Guide | FitHorizon",
      metaDescription: "Learn how to gain weight the healthy way with our nutritionist-approved guide. Meal plans, calorie-dense foods, and proven strategies.",
      featuredImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=630&fit=crop",
      readingTime: 8,
      published: true,
      featured: true,
      categoryId: createdCategories[1].id,
      authorId: admin.id,
    },
    {
      title: "HIIT vs Steady-State Cardio: Which Burns More Fat?",
      slug: "hiit-vs-steady-state-cardio-which-burns-more-fat",
      excerpt: "We compare high-intensity interval training and steady-state cardio to determine which is more effective for fat loss.",
      content: `## The Great Cardio Debate\n\nWhen it comes to fat loss, two forms of cardiovascular exercise dominate the conversation: HIIT and Steady-State Cardio.\n\n## What Is HIIT?\n\nHIIT alternates between short bursts of maximum effort and recovery periods.\n\n### Benefits of HIIT\n- **EPOC effect:** Continue burning calories for hours after your workout\n- **Time-efficient:** 20 minutes of HIIT can match 40+ minutes of steady-state\n- **Preserves muscle mass:** Better for maintaining lean tissue\n\n## What Is Steady-State Cardio?\n\nMaintaining consistent moderate intensity for 30-60 minutes.\n\n### Benefits of Steady-State\n- **Lower impact on recovery**\n- **Accessible for beginners**\n- **Sustainable long-term**\n\n## The Optimal Approach\n\nCombine both:\n- 2-3 HIIT sessions per week (20-25 minutes)\n- 2-3 steady-state sessions per week (30-45 minutes)\n\n## The Bottom Line\n\nThe best cardio for fat loss is the one you'll actually do consistently.`,
      metaTitle: "HIIT vs Steady-State Cardio: Which Burns More Fat? | FitHorizon",
      metaDescription: "Compare HIIT and steady-state cardio for fat loss. Learn which burns more fat and fits your fitness goals.",
      featuredImage: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1200&h=630&fit=crop",
      readingTime: 6,
      published: true,
      featured: false,
      categoryId: createdCategories[0].id,
      authorId: admin.id,
    },
    {
      title: "The Best Protein Sources for Muscle Recovery and Growth",
      slug: "best-protein-sources-muscle-recovery-growth",
      excerpt: "Not all proteins are created equal. Learn which protein sources maximize muscle recovery and growth.",
      content: `## Why Protein Quality Matters\n\nThe quality of protein depends on its amino acid profile, digestibility, and bioavailability.\n\n## Top Protein Sources Ranked\n\n### 1. Whey Protein (BV: 104)\nFast-absorbing, ideal post-workout. Complete amino acid profile rich in leucine.\n\n### 2. Whole Eggs (BV: 100)\nThe reference protein for biological value. 6g protein per large egg.\n\n### 3. Chicken Breast (BV: 79)\nLean, versatile, and affordable. 31g protein per 100g.\n\n### 4. Greek Yogurt (BV: ~85)\nContains both whey and casein proteins. 15-20g protein per serving.\n\n### 5. Salmon (BV: ~83)\nRich in omega-3 fatty acids. 25g protein per 100g.\n\n## Plant-Based Options\n\n### Soy Protein\nMost complete plant protein with PDCAAS of 1.0.\n\n### Lentils and Legumes\n18g protein per cup (cooked). High in fiber.\n\n## The Bottom Line\n\nPrioritize high-quality, complete protein sources and distribute your intake throughout the day.`,
      metaTitle: "Best Protein Sources for Muscle Growth & Recovery | FitHorizon",
      metaDescription: "Discover the best protein sources ranked by biological value for muscle recovery and growth.",
      featuredImage: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&h=630&fit=crop",
      readingTime: 8,
      published: true,
      featured: false,
      categoryId: createdCategories[2].id,
      authorId: admin.id,
    },
    {
      title: "Understanding Metabolism: How to Speed Up Your Calorie Burn",
      slug: "understanding-metabolism-speed-up-calorie-burn",
      excerpt: "Your metabolism isn't fixed. Learn the science behind metabolic rate and actionable strategies to boost your daily calorie burn.",
      content: `## What Is Metabolism?\n\nMetabolism encompasses all the chemical reactions in your body that keep you alive.\n\n## Components of TDEE\n\n### 1. Basal Metabolic Rate (BMR) — 60-70%\nEnergy used at rest for basic functions.\n\n### 2. Thermic Effect of Food (TEF) — 10%\nEnergy to digest, absorb, and process food.\n\n### 3. Non-Exercise Activity Thermogenesis (NEAT) — 15-30%\nAll non-exercise movement.\n\n## Proven Ways to Boost Metabolism\n\n### Build More Muscle\nMuscle burns 6 cal/lb at rest vs. 2 cal/lb for fat.\n\n### Increase Protein Intake\nProtein has a thermic effect of 20-30%.\n\n### Stay Active Throughout the Day\nNEAT can add 200-500 calories daily.\n\n### Don't Crash Diet\nSevere restriction triggers metabolic adaptation.\n\n## The Bottom Line\n\nYour metabolism responds to your habits. Focus on building muscle, staying active, eating adequate protein, and sleeping well.`,
      metaTitle: "How to Speed Up Your Metabolism: Science-Backed Guide | FitHorizon",
      metaDescription: "Learn how metabolism works and discover proven strategies to boost your daily calorie burn.",
      featuredImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=630&fit=crop",
      readingTime: 7,
      published: true,
      featured: false,
      categoryId: createdCategories[0].id,
      authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  return NextResponse.json({ success: true, message: "Database seeded successfully" });
}
