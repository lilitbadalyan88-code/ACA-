import type { MetadataRoute } from "next";
import { site } from "@config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: "AI photo generator and editor",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: site.themeColor,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
