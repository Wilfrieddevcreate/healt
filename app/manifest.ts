import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitHorizon — Science-Backed Fitness",
    short_name: "FitHorizon",
    description: "Expert fitness and nutrition guides for weight loss, muscle building, and body transformation.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
