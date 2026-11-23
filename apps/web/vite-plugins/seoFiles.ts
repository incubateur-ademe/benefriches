import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnv, type Plugin } from "vite";

type Entry = { path: string; indexable: boolean };

export function seoFiles(): Plugin {
  let siteUrl = "";
  let allowIndexing = false;
  let indexablePaths: string[] = [];

  return {
    name: "seo-files",
    apply: "build",

    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir, "");
      allowIndexing = env.WEBAPP_SEO_DISABLE_INDEXING !== "true";

      const file = path.resolve(config.root, "src/app/seo.json");
      const seoConfig = JSON.parse(readFileSync(file, "utf8")) as {
        siteUrl: string;
        routes: Record<string, Entry>;
      };
      siteUrl = seoConfig.siteUrl;
      indexablePaths = Object.values(seoConfig.routes)
        .filter((e) => e.indexable)
        .map((e) => e.path);
    },

    generateBundle() {
      const robots = allowIndexing
        ? ["User-agent: *", "Allow: /", "Disallow: /api/", "", `Sitemap: ${siteUrl}/sitemap.xml`]
        : ["User-agent: *", "Disallow: /"];
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots.join("\n") + "\n" });

      if (allowIndexing) {
        const urls = indexablePaths.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source:
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
    },
  };
}
