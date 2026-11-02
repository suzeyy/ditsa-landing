const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function siteOrigin(config) {
  const configured = process.env.SITE_URL?.trim() || config.siteUrl.trim();
  if (!configured) return '';
  const url = new URL(configured);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SITE_URL / siteUrl must be the final HTTPS site origin, for example https://your-domain.com.');
  }
  return url.origin;
}

export function withSeo(html, config, pathname, origin, service) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/ )?.[1];
  if (!title || !description) throw new Error(`Missing SEO title or description for ${pathname}`);
  const canonical = origin ? new URL(pathname, origin).href : '';
  const organization = {
    '@type': 'Organization',
    name: config.name,
    email: config.email,
    address: { '@type': 'PostalAddress', addressLocality: config.city, addressCountry: config.country },
    ...(origin ? { '@id': `${origin}/#organization`, url: `${origin}/`, logo: `${origin}/assets/images/logo.png` } : {}),
  };
  const graph = [organization];
  if (service) {
    graph.push({
      '@type': 'Service',
      name: service.title,
      description: service.description,
      provider: origin ? { '@id': `${origin}/#organization` } : { '@type': 'Organization', name: config.name },
      ...(canonical ? { url: canonical } : {}),
    });
  }
  const structuredData = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
  const markup = `<!-- SEO:START -->
  <meta name="google-site-verification" content="${escape(config.googleSiteVerification)}" />
  <meta property="og:site_name" content="${escape(config.name)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  ${canonical ? `<link rel="canonical" href="${escape(canonical)}">\n  <meta property="og:url" content="${escape(canonical)}">` : '<!-- Set siteUrl in src/data/site.json to generate canonical URLs and sitemap.xml. -->'}
  <script type="application/ld+json">${structuredData}</script>
  <!-- SEO:END -->`;
  const marker = /<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/;
  return marker.test(html) ? html.replace(marker, () => markup) : html.replace('</head>', `${markup}\n</head>`);
}

export function sitemapXml(paths, origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>${escape(new URL(path, origin).href)}</loc></url>`).join('\n')}\n</urlset>\n`;
}
