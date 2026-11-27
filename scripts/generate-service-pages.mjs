import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { homePricing, servicePage } from '../src/templates/service-page.js';
import { header, footer } from '../src/templates/layout.js';
import { serviceCards } from '../src/templates/service-cards.js';
import { aboutPage, servicesPage, contactPage, blogIndexPage, blogPostPage } from '../src/templates/pages.js';
import { siteOrigin, withSeo, sitemapXml } from './seo.mjs';

const root = new URL('../', import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const site = await readJson('src/data/site.json');
const catalog = await readJson('src/data/services.json');
const blog = await readJson('src/data/blog.json');
const origin = siteOrigin(site);

// Homepage: inject shared header, footer, service cards and pricing between markers.
const homePath = new URL('index.html', root);
let home = await readFile(homePath, 'utf8');
const inject = (html, name, content) => {
  const marker = new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`);
  if (!marker.test(html)) throw new Error(`${name} markers are missing from index.html.`);
  return html.replace(marker, () => `<!-- ${name}:START -->\n${content}\n<!-- ${name}:END -->`);
};
home = inject(home, 'HEADER', header());
home = inject(home, 'FOOTER', footer());
home = inject(home, 'SERVICE-CARDS', serviceCards);
home = inject(home, 'PRICING', homePricing(catalog));
await writeFile(homePath, withSeo(home, site, '/', origin));

// Generated pages: path -> html.
const pages = new Map([
  ['/about/', aboutPage()],
  ['/services/', servicesPage(catalog)],
  ['/contact/', contactPage()],
  ['/blog/', blogIndexPage(blog)],
  ...catalog.services.map(service => [`/services/${service.slug}/`, servicePage(service, catalog)]),
  ...blog.posts.map(post => [`/blog/${post.slug}/`, blogPostPage(post, blog)]),
]);
const serviceBySlug = Object.fromEntries(catalog.services.map(service => [`/services/${service.slug}/`, service]));

// Remove previously generated blog posts so deleted posts don't linger.
await rm(new URL('blog/', root), { recursive: true, force: true });
for (const [path, html] of pages) {
  const directory = new URL(`.${path}`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), withSeo(html, site, path, origin, serviceBySlug[path]));
}
console.log(`Generated ${pages.size} pages (${catalog.services.length} services, ${blog.posts.length} blog posts).`);

const paths = ['/', ...pages.keys()];
await writeFile(new URL('public/robots.txt', root), `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`);
const sitemapPath = new URL('public/sitemap.xml', root);
if (origin) await writeFile(sitemapPath, sitemapXml(paths, origin));
else {
  await rm(sitemapPath, { force: true });
  console.log('Set siteUrl in src/data/site.json before launch to generate canonical URLs and sitemap.xml.');
}
