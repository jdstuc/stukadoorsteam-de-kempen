import { writeFileSync } from "fs";
import { renderSitemapXml } from "../seoSitemap";

const xml = renderSitemapXml();
writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`Sitemap geschreven naar public/sitemap.xml (${xml.length} bytes)`);
