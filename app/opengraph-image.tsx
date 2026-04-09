import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FitHorizon — Science-Backed Fitness & Body Transformation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              background: "white",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 60,
            }}
          >
            🏋️
          </div>
          <div
            style={{
              fontSize: 72,
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
            fontSize: 36,
            color: "rgba(255,255,255,0.95)",
            textAlign: "center",
            maxWidth: 900,
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          Science-Backed Fitness &amp; Body Transformation
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.8)",
            marginTop: 24,
          }}
        >
          Weight Loss · Muscle Building · Nutrition
        </div>
      </div>
    ),
    { ...size }
  );
}
