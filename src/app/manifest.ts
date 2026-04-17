import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo-config";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();

  return {
    name: SITE_NAME,
    short_name: "PropsVsMemo",
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    id: base,
    display: "browser",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    lang: "en-US",
    orientation: "any",
    categories: ["education", "developer tools", "productivity"],
  };
}
