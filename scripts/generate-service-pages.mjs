import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { homePricing, servicePage } from '../src/templates/service-page.js';
import { siteOrigin, withSeo, sitemapXml } from './seo.mjs';

const root = new URL('../', import.meta.url);
const site = JSON.parse(await readFile(new URL('src/data/site.json', root), 'utf8'));
const origin = siteOrigin(site);
const catalog = JSON.parse(await readFile(new URL('src/data/services.json', root), 'utf8'));
const homePath = new URL('index.html', root);
let home = await readFile(homePath, 'utf8');
const marker = /<!-- PRICING:START -->[\s\S]*?<!-- PRICING:END -->/;
if (!marker.test(home)) throw new Error('Pricing section markers are missing from index.html.');
home = home.replace(marker, `<!-- PRICING:START -->\n${homePricing(catalog)}\n<!-- PRICING:END -->`);
home = withSeo(home, site, '/', origin);
await writeFile(homePath, home);
const header = home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]
  .replaceAll('href="#', 'href="/#')
  .replace('class="active"', 'class=""')
  .replace(' aria-current="location"', '')
  .replace('href="/#services"', 'href="/#services" class="active" aria-current="page"');
const footer = home.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0].replaceAll('href="#', 'href="/#');
for (const service of catalog.services) {
  const directory = new URL(`services/${service.slug}/`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), withSeo(servicePage(service, catalog, header, footer), site, `/services/${service.slug}/`, origin, service));
}
console.log(`Synced homepage pricing and ${catalog.services.length} service pages from src/data/services.json.`);

const paths = ['/', ...catalog.services.map(service => `/services/${service.slug}/`)];
await writeFile(new URL('public/robots.txt', root), `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`);
const sitemapPath = new URL('public/sitemap.xml', root);
if (origin) await writeFile(sitemapPath, sitemapXml(paths, origin));
else {
  await rm(sitemapPath, { force: true });
  console.log('Set siteUrl in src/data/site.json before launch to generate canonical URLs and sitemap.xml.');
}
