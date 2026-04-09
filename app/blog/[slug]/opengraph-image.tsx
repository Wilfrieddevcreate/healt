import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "FitHorizon article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PostOGImage({ params }: { params: { slug: string } }) {
  let post: { title: string; category: { name: string } } | null = null;
  try {
    post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });
  } catch { /* DB unavailable */ }

  const title = post?.title || "FitHorizon";
  const category = post?.category.name || "Fitness";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar: brand + category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "#16a34a",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🏋️
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              FitHorizon
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#16a34a",
              background: "rgba(22, 163, 74, 0.15)",
              padding: "10px 20px",
              borderRadius: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          {title}
        </div>

        {/* Bottom bar: domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid rgba(255,255,255,0.1)",
            paddingTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#94a3b8",
            }}
          >
            fithorizon.com
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#16a34a",
              fontWeight: 600,
            }}
          >
            Read the article →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
