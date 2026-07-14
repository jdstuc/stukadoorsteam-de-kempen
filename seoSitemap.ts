import { COMPARISON_GUIDES } from "./seoContentPages";
import { getAllExpansionSitemapUrls } from "./seoExpansion";
import { EXTRA_COMPARISON_GUIDES } from "./seoExpansionServer";
import { LOCAL_LANDING_PAGES, REGION_SEO_PAGES, getCitySlug } from "./seoRegion";

export const SITEMAP_BASE_URL = "https://www.stukadoorsteamdekempen.nl";
export const SITEMAP_LASTMOD = "2026-07-14";

const SERVICE_SLUGS = [
  "glad-pleisterwerk",
  "schuurwerk-plafond",
  "renovatiestucwerk",
  "betonlook-badkamer",
  "stucwerk-nieuwbouw",
];

const ALL_COMPARISON_GUIDES = [...COMPARISON_GUIDES, ...EXTRA_COMPARISON_GUIDES];

export interface SitemapEntry {
  loc: string;
  priority: string;
}

export function getSitemapEntries(): SitemapEntry[] {
  const comboEntries = LOCAL_LANDING_PAGES.flatMap((location) =>
    SERVICE_SLUGS.map((serviceSlug) => ({
      loc: `/${serviceSlug}-${getCitySlug(location)}`,
      priority: "0.7",
    }))
  );

  return [
    { loc: "/", priority: "1.0" },
    { loc: "/werkgebied", priority: "0.95" },
    { loc: "/stukadoor-kempen", priority: "0.95" },
    { loc: "/stucwerk-kempen", priority: "0.95" },
    { loc: "/diensten", priority: "0.95" },
    { loc: "/over-ons", priority: "0.9" },
    { loc: "/stukadoor-prijzen", priority: "0.9" },
    { loc: "/contact-stukadoor", priority: "0.9" },
    { loc: "/stucwerk-droogtijd", priority: "0.8" },
    { loc: "/kosten-stucwerk", priority: "0.94" },
    { loc: "/veelgestelde-vragen", priority: "0.92" },
    { loc: "/klantervaringen", priority: "0.9" },
    { loc: "/google-bedrijfsprofiel", priority: "0.88" },
    ...ALL_COMPARISON_GUIDES.map((guide) => ({ loc: `/${guide.slug}`, priority: "0.88" })),
    ...REGION_SEO_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: page.priority })),
    ...LOCAL_LANDING_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: "0.9" })),
    ...SERVICE_SLUGS.map((slug) => ({ loc: `/${slug}`, priority: "0.85" })),
    ...comboEntries,
    ...getAllExpansionSitemapUrls(),
  ];
}

export function renderSitemapXml(baseUrl = SITEMAP_BASE_URL, lastmod = SITEMAP_LASTMOD): string {
  const urls = getSitemapEntries();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}
