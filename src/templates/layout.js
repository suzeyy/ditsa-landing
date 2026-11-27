// Shared header, footer and page shell for every page on the site.
// scripts/generate-service-pages.mjs injects the header and footer into index.html
// and uses page() to build the generated pages, so navigation stays identical everywhere.

export const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export const EMAIL = 'info@ditsa.com.np';
export const arrow = (modifier = '') => `<i class="arrow${modifier ? ` arrow-${modifier}` : ''}"></i>`;

const serviceLinks = [
  { href: '/services/video-editing/', title: 'Video Editing', text: 'Reels, YouTube and brand films' },
  { href: '/services/branding/', title: 'Branding', text: 'Logos, identity and guidelines' },
  { href: '/services/seo/', title: 'SEO', text: 'Audits, on-page and reporting' },
];

const navItems = [
  { key: 'about', href: '/about/', label: 'About' },
  { key: 'services', href: '/services/', label: 'Services', dropdown: true },
  { key: 'work', href: '/#work', label: 'Work' },
  { key: 'pricing', href: '/#pricing', label: 'Pricing' },
  { key: 'blog', href: '/blog/', label: 'Blog' },
  { key: 'contact', href: '/contact/', label: 'Contact' },
];

// `active` is the key of the nav item for the current page ('' on the homepage).
export function header(active = '') {
  const current = key => (key === active ? ' class="active" aria-current="page"' : '');
  const links = navItems.map(item => {
    if (!item.dropdown) return `<a href="${item.href}"${current(item.key)}>${item.label}</a>`;
    return `<div class="nav-dropdown">
            <button class="nav-dropdown-toggle${item.key === active ? ' active' : ''}" type="button" aria-expanded="false" aria-controls="services-menu">${item.label}<i class="chevron" aria-hidden="true"></i></button>
            <div class="nav-dropdown-menu" id="services-menu">
              ${serviceLinks.map(link => `<a href="${link.href}"><strong>${link.title}</strong><span>${link.text}</span></a>`).join('\n              ')}
              <a class="nav-dropdown-all" href="/services/">All services ${arrow()}</a>
            </div>
          </div>`;
  }).join('\n          ');
  return `<div class="top-bar"><div class="container"><span>Video editing, branding and SEO for teams worldwide</span><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
    <header class="site-header">
      <div class="container navigation">
        <a class="logo" href="/" aria-label="CrawlMedia home"><span>Crawl<b>Media</b></span><span class="logo-dot" aria-hidden="true"></span></a>
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation-links"><span></span><span></span></button>
        <nav class="nav-links" id="navigation-links" aria-label="Main navigation">
          ${links}
          <a class="button nav-cta" href="/contact/">Get a quote</a>
        </nav>
      </div>
    </header>`;
}

export function footer() {
  return `<footer class="footer"><div class="container"><div class="footer-top"><div class="footer-brand"><a class="logo" href="/"><span>Crawl<b>Media</b></span><span class="logo-dot" aria-hidden="true"></span></a><p>Outsourced video editing, branding, and SEO for teams around the world.</p></div><nav class="footer-nav" aria-label="Footer navigation"><div><h3>Services</h3>${serviceLinks.map(link => `<a href="${link.href}">${link.title}</a>`).join('')}<a href="/services/">All services</a></div><div><h3>Company</h3><a href="/about/">About</a><a href="/#process">How it works</a><a href="/#work">Work</a><a href="/#pricing">Pricing</a><a href="/blog/">Blog</a></div><div><h3>Contact</h3><a href="/contact/">Get a quote</a><a href="mailto:${EMAIL}">${EMAIL}</a><span>Kathmandu, Nepal</span></div></nav></div><div class="footer-wordmark" aria-hidden="true">CrawlMedia<em>.</em></div><div class="footer-bottom"><p>© <span id="year"></span> CrawlMedia</p><a href="#main">Back to top ${arrow('up')}</a></div></div></footer>`;
}

// Full HTML document for a generated page.
export function page({ title, description, active = '', bodyClass = '', main, script = '/src/js/service-detail.js' }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#fbfaf6"><meta name="description" content="${escape(description)}"><title>${escape(title)}</title><link rel="icon" href="/assets/images/logo.png"><link rel="stylesheet" href="/src/css/styles.css"></head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}><a class="skip-link" href="#main">Skip to content</a><div class="site-surface">${header(active)}<main id="main">
${main}
</main>${footer()}</div><script type="module" src="${script}"></script></body></html>`;
}

// Closing call-to-action band used across inner pages.
export function ctaBand(heading = 'Let’s make<br><em>it happen.</em>', href = '/contact/', label = 'Get a quote') {
  return `<section class="section service-page-cta"><div class="container"><p class="eyebrow">Your next move</p><div class="contact-title"><h2>${heading}</h2><a class="circle-button" href="${href}" aria-label="${escape(label)}">${arrow()}</a></div><a class="pricing-detail-link" href="/contact/">Or build a project brief on our contact page ${arrow()}</a></div></section>`;
}
