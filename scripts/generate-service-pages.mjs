import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homePricing, servicePage } from '../src/templates/service-page.js';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('src/data/services.json', root), 'utf8'));
const homePath = new URL('index.html', root);
let home = await readFile(homePath, 'utf8');
const marker = /<!-- PRICING:START -->[\s\S]*?<!-- PRICING:END -->/;
if (!marker.test(home)) throw new Error('Pricing section markers are missing from index.html.');
home = home.replace(marker, `<!-- PRICING:START -->\n${homePricing(catalog)}\n<!-- PRICING:END -->`);
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
  await writeFile(new URL('index.html', directory), servicePage(service, catalog, header, footer));
}
console.log(`Synced homepage pricing and ${catalog.services.length} service pages from src/data/services.json.`);
