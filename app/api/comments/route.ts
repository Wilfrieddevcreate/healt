import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const commentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().min(1).max(100),
  authorEmail: z.email(),
  content: z.string().min(1).max(5000),
  parentId: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) return NextResponse.json([]);

  const comments = await prisma.comment.findMany({
    where: { postId, approved: true, parentId: null },
    include: {
      replies: {
        where: { approved: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = commentSchema.parse(body);

    await prisma.comment.create({
      data: {
        postId: data.postId,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        content: data.content,
        parentId: data.parentId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
