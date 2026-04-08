import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalComments,
    pendingComments,
    totalSubscribers,
    totalViews,
    recentPosts,
    categoryStats,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.comment.count(),
    prisma.comment.count({ where: { approved: false } }),
    prisma.newsletter.count(),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, views: true, published: true, createdAt: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return NextResponse.json({
    totalPosts,
    publishedPosts,
    draftPosts,
    totalComments,
    pendingComments,
    totalSubscribers,
    totalViews: totalViews._sum.views || 0,
    recentPosts,
    categoryStats: categoryStats.map((c) => ({ name: c.name, count: c._count.posts })),
  });
}
