import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IntegratESG | E-Learning",
    short_name: "IntegratESG",
    description: "IntegratESG e-learning platform for ESG education.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: "#f4f4f2",
    theme_color: "#31425a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
