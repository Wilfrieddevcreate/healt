import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

function hashIP(ip: string): string {
  return createHash("sha256").update(ip + "fithorizon-salt").digest("hex").slice(0, 16);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ helpful: 0, total: 0 });

  const ratings = await prisma.rating.findMany({ where: { postId } });
  const helpful = ratings.filter((r) => r.value === 1).length;

  return NextResponse.json({ helpful, total: ratings.length });
}

export async function POST(request: Request) {
  try {
    const { postId, value } = await request.json();
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = hashIP(ip);

    const existing = await prisma.rating.findUnique({
      where: { postId_ipHash: { postId, ipHash } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already rated" }, { status: 400 });
    }

    await prisma.rating.create({
      data: { postId, value: value ? 1 : 0, ipHash },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
