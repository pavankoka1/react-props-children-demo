import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from "@/lib/seo-config";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();

  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    id: base,
    display: "browser",
    background_color: "#0a0a0f",
    theme_color: "#13131a",
    lang: "en-US",
    orientation: "any",
    categories: ["education", "developer tools", "productivity"],
    icons: [
      {
        src: `${base}/icon`,
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${base}/apple-icon`,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
