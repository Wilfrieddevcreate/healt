import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: { select: { name: true, slug: true } },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
