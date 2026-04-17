import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

type SitemapEntry = MetadataRoute.Sitemap extends (infer E)[] ? E : never;

const ROUTES: {
  path: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/demo", changeFrequency: "weekly", priority: 0.95 },
  { path: "/guide", changeFrequency: "monthly", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
