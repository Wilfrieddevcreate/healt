import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API key not configured. Add GROQ_API_KEY to your .env file." }, { status: 500 });
  }

  try {
    const { keyword, category } = await request.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const prompt = `You are a professional health and fitness content writer. Write a comprehensive, SEO-optimized blog article about "${keyword}" in the category "${category || "fitness"}".

Requirements:
1. Write in a professional, authoritative, yet approachable tone
2. Target an international English-speaking audience (US/UK)
3. Use proper markdown formatting with ## for H2 and ### for H3 headings
4. Include at least 5-7 sections with clear headings
5. Include actionable tips and evidence-based information
6. Add a compelling introduction and conclusion
7. Use bullet points and bold text for key information
8. Article should be 800-1200 words
9. Include a health disclaimer note at the end

Return your response as a valid JSON object with these exact fields:
{
  "title": "SEO-optimized article title (60-70 chars)",
  "metaTitle": "Meta title for SEO (50-60 chars with brand)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "excerpt": "2-3 sentence excerpt summarizing the article",
  "content": "Full article content in markdown format"
}

Only return the JSON object, no additional text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const article = JSON.parse(responseText);
    return NextResponse.json(article);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 });
  }
}
