import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Osteps Educational Platform",
    short_name: "Osteps",
    description:
      "Learning, assessment, communication, rewards, and school management in one educational platform.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eef9f2",
    theme_color: "#272736",
    orientation: "any",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/osteps-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/osteps-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/osteps-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Open dashboard",
        short_name: "Dashboard",
        url: "/dashboard/subject-cards",
        icons: [
          {
            src: "/icons/osteps-192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "Open games",
        short_name: "Games",
        url: "/dashboard/games",
        icons: [
          {
            src: "/icons/osteps-192.png",
            sizes: "192x192",
          },
        ],
      },
    ],
  };
}
