import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import slugify from "slug";
import readingTime from "reading-time";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
  }

  try {
    const { keywords, categoryId } = await request.json();

    if (!keywords?.length || !categoryId) {
      return NextResponse.json({ error: "Keywords array and categoryId are required" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });

    const results = [];

    for (const keyword of keywords.slice(0, 5)) {
      try {
        const prompt = `You are a professional health and fitness content writer. Write a comprehensive, SEO-optimized blog article about "${keyword}" in the category "${category.name}".

Requirements:
1. Professional, authoritative, yet approachable tone
2. Target international English-speaking audience (US/UK)
3. Use markdown with ## for H2 and ### for H3 headings
4. 5-7 sections with clear headings
5. Actionable tips and evidence-based information
6. 800-1200 words

Return valid JSON:
{
  "title": "SEO title (60-70 chars)",
  "metaTitle": "Meta title (50-60 chars)",
  "metaDescription": "Meta description (150-160 chars)",
  "excerpt": "2-3 sentence excerpt",
  "content": "Full markdown content"
}

Only return JSON.`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        });

        const article = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (!article.title || !article.content) continue;

        const slug = slugify(article.title, { lower: true });
        const stats = readingTime(article.content);

        const post = await prisma.post.create({
          data: {
            title: article.title,
            slug: `${slug}-${Date.now().toString(36)}`,
            content: article.content,
            excerpt: article.excerpt || "",
            categoryId,
            metaTitle: article.metaTitle || article.title,
            metaDescription: article.metaDescription || article.excerpt,
            readingTime: Math.ceil(stats.minutes),
            authorId: session.userId,
            published: false,
          },
        });

        results.push({ keyword, status: "success", postId: post.id, title: post.title });
      } catch {
        results.push({ keyword, status: "error" });
      }
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Bulk generation failed" }, { status: 500 });
  }
}
