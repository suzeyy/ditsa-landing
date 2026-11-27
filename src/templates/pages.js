import { escape, page, ctaBand, arrow, EMAIL } from './layout.js';
import { serviceCards } from './service-cards.js';

const pageHero = ({ eyebrow, heading, lead, actions = '', crumb = '' }) => `<section class="page-hero"><div class="container">
  ${crumb}<p class="eyebrow">${eyebrow}</p>
  <h1>${heading}</h1>
  <p class="page-lead">${lead}</p>
  ${actions ? `<div class="hero-actions">${actions}</div>` : ''}
</div></section>`;

const primaryButton = (href, label) => `<a class="button" href="${href}">${label} <span aria-hidden="true">${arrow()}</span></a>`;
const ghostButton = (href, label) => `<a class="button button-ghost" href="${href}">${label}</a>`;

/* ---------- About ---------- */
export function aboutPage() {
  const values = [
    ['Clarity first', 'Scope, deliverables, revisions and timelines are agreed in writing before any work begins, so everyone knows what “done” looks like.'],
    ['Craft over volume', 'We would rather deliver fewer pieces that work hard for your brand than flood your channels with forgettable content.'],
    ['Honest expectations', 'We tell you what a plan includes, what it doesn’t, and what results depend on. No guaranteed rankings, no vague promises.'],
    ['Remote by design', 'Our process is built for working across time zones: clear briefs, milestone check-ins and consolidated feedback rounds.'],
  ];
  const main = `${pageHero({
    eyebrow: 'About CrawlMedia',
    heading: 'A creative team built for <em>working across borders.</em>',
    lead: 'CrawlMedia is an outsourced creative studio in Kathmandu, Nepal. We help brands, agencies and creators around the world with video editing, branding and SEO, delivered remotely with a clear scope from day one.',
    actions: `${primaryButton('/contact/', 'Start a project')}${ghostButton('/services/', 'Explore services')}`,
  })}
<section class="section about-story"><div class="container split">
  <div><p class="eyebrow"><span class="eyebrow-num">01</span> Why we exist</p><h2>Great creative work <em>shouldn’t depend on your postcode.</em></h2></div>
  <div class="prose">
    <p>Growing teams need a steady flow of edited video, consistent brand assets and a website that people can find. Hiring specialists for each of those in-house is slow and expensive, and juggling freelancers takes time most teams don’t have.</p>
    <p>We started CrawlMedia to offer a simpler option: one remote partner with three focused specialties, transparent pricing in USD, and a process designed for teams in different time zones.</p>
    <p>Every engagement starts with listening. We learn your audience, goals and references, agree on exactly what we will deliver, and then get to work while your team focuses on everything else.</p>
  </div>
</div></section>
<section class="section about-values"><div class="container">
  <div class="section-heading-row"><div><p class="eyebrow"><span class="eyebrow-num">02</span> What we believe</p><h2>How we like <em>to work.</em></h2></div><p class="description">Four principles that shape every brief, every edit and every report we send.</p></div>
  <div class="benefits-grid">${values.map(([title, text], index) => `<article class="benefit"><span class="benefit-icon" aria-hidden="true">0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
</div></section>
<section class="section about-place"><div class="container split">
  <div class="place-card"><span class="place-label">Based in</span><strong>Kathmandu, Nepal</strong><span class="place-zone">GMT+5:45</span><p>Working with teams in North America, Europe, Australia and Asia, our hours often overlap with your evening or morning, so work moves forward while you are offline.</p></div>
  <div><p class="eyebrow"><span class="eyebrow-num">03</span> What we do</p><h2>Three specialties. <em>One partner.</em></h2>
    <ul class="about-services">
      <li><a href="/services/video-editing/"><strong>Video Editing</strong><span>Short-form content, YouTube edits and brand films.</span>${arrow()}</a></li>
      <li><a href="/services/branding/"><strong>Branding</strong><span>Logos, visual identity and brand guidelines.</span>${arrow()}</a></li>
      <li><a href="/services/seo/"><strong>SEO</strong><span>Audits, on-page optimisation and monthly reporting.</span>${arrow()}</a></li>
    </ul>
  </div>
</div></section>
${ctaBand('Let’s build<br><em>something good.</em>')}`;
  return page({ title: 'About | CrawlMedia', description: 'CrawlMedia is an outsourced creative studio in Kathmandu, Nepal, offering video editing, branding and SEO to teams around the world.', active: 'about', bodyClass: 'inner-page', main });
}

/* ---------- Services overview ---------- */
export function servicesPage(catalog) {
  const from = service => Math.min(...service.packages.map(plan => plan.price));
  const basis = service => (service.basis === 'month' ? 'per month' : 'per project');
  const monthly = catalog.services.filter(service => service.basis === 'month');
  const project = catalog.services.filter(service => service.basis !== 'month');
  const names = list => list.map(service => service.shortTitle || service.title).join(' and ');
  const main = `${pageHero({
    eyebrow: 'Services',
    heading: 'Creative services, <em>outsourced properly.</em>',
    lead: 'Video editing, branding and SEO from one remote team. Pick a single service or combine them, with fixed USD pricing and deliverables agreed before work begins.',
    actions: `${primaryButton('/contact/', 'Get a quote')}${ghostButton('/#pricing', 'Compare plans')}`,
  })}
<section class="section services"><div class="container section-heading-row"><div><p class="eyebrow"><span class="eyebrow-num">01</span> Our specialties</p><h2>Choose what <em>you need.</em></h2></div><p class="description">Each service has its own detail page with full package inclusions, add-ons and delivery times.</p></div>
<div class="container services-grid">${serviceCards}</div></section>
<section class="section service-rows"><div class="container">
  <div class="section-heading-row"><div><p class="eyebrow"><span class="eyebrow-num">02</span> In detail</p><h2>What each service <em>covers.</em></h2></div></div>
  ${catalog.services.map((service, index) => `<article class="service-row">
    <span class="service-row-num">0${index + 1}</span>
    <div><p class="service-row-eyebrow">${escape(service.eyebrow)}</p><h3><a href="/services/${service.slug}/">${escape(service.shortTitle || service.title)}</a></h3><p>${escape(service.description)}</p></div>
    <ul>${service.scope.map(item => `<li>${escape(item)}</li>`).join('')}</ul>
    <div class="service-row-price"><span>From</span><strong>$${from(service)}</strong><span>USD ${basis(service)}</span><a class="text-button" href="/services/${service.slug}/">View packages <span aria-hidden="true">${arrow()}</span></a></div>
  </article>`).join('')}
</div></section>
<section class="section engagement"><div class="container">
  <div class="section-heading-row"><div><p class="eyebrow"><span class="eyebrow-num">03</span> Ways to work together</p><h2>Flexible engagement, <em>clear terms.</em></h2></div></div>
  <div class="engagement-grid">
    <article><h3>Monthly plans</h3><p>Ongoing support for ${escape(names(monthly))}, billed at the start of each month. Move between plans as your needs change.</p><a class="text-button" href="/#pricing">See monthly plans <span aria-hidden="true">${arrow()}</span></a></article>
    <article class="engagement-featured"><h3>Fixed projects</h3><p>${escape(names(project))} delivered as a defined project, from discovery to final files, for one agreed price.</p><a class="text-button" href="/services/branding/">See project packages <span aria-hidden="true">${arrow()}</span></a></article>
    <article><h3>Custom scope</h3><p>One-off projects, extra deliverables or a mix of services. Tell us what you need and we will put together a tailored quote.</p><a class="text-button" href="/contact/">Request a quote <span aria-hidden="true">${arrow()}</span></a></article>
  </div>
</div></section>
${ctaBand()}`;
  return page({ title: 'Services | CrawlMedia', description: 'Outsourced video editing, branding and SEO services with fixed USD pricing and clear deliverables. Explore what each service covers.', active: 'services', bodyClass: 'inner-page', main });
}

/* ---------- Contact ---------- */
export function contactPage() {
  const main = `${pageHero({
    eyebrow: 'Contact',
    heading: 'Tell us about <em>your project.</em>',
    lead: 'Share what you need and we will reply with a recommended plan or a custom quote. No commitment until the scope is agreed.',
  })}
<section class="section contact contact-page"><div class="container contact-card">
  <div class="contact-intro">
    <p class="eyebrow"><span class="eyebrow-num">01</span> Get in touch</p>
    <h2>Email us <em>directly.</em></h2>
    <a class="contact-email" href="mailto:${EMAIL}">${EMAIL} <span aria-hidden="true">${arrow()}</span></a>
    <dl class="contact-details-list">
      <div><dt>Location</dt><dd>Kathmandu, Nepal</dd></div>
      <div><dt>Time zone</dt><dd>GMT+5:45</dd></div>
      <div><dt>Working with</dt><dd>Teams worldwide, fully remote</dd></div>
    </dl>
    <h3 class="next-steps-title">What happens next</h3>
    <ol class="next-steps">
      <li><span>01</span>We review your brief and ask any questions.</li>
      <li><span>02</span>You receive a recommended plan or custom quote.</li>
      <li><span>03</span>Once agreed, we schedule kickoff and get started.</li>
    </ol>
  </div>
  <form id="brief-form" class="contact-form">
    <h3>Build your project brief</h3>
    <div class="form-row"><label>Your name<input name="name" autocomplete="name" required maxlength="100" placeholder="Your full name"></label><label>Work email<input type="email" name="email" autocomplete="email" required placeholder="you@company.com"></label></div>
    <label>What do you need?<select name="service"><option>Video editing</option><option>Branding</option><option>SEO</option><option>Multiple services</option></select></label>
    <label>About your project<textarea name="project" required maxlength="3000" placeholder="Your goals, timeline, and anything we should know…"></textarea></label>
    <button class="button" type="submit">Prepare my brief <span class="btn-arrow" aria-hidden="true">${arrow()}</span></button>
    <p class="form-note">This creates a downloadable brief. Email it to ${EMAIL} to start the conversation.</p>
    <div id="brief-result" class="brief-result" role="status" hidden></div>
  </form>
</div></section>
<section class="section contact-faq"><div class="container split">
  <div><p class="eyebrow"><span class="eyebrow-num">02</span> Before you write</p><h2>Good to <em>know.</em></h2></div>
  <div class="faq-list">
    <details><summary>How quickly can we start?<span aria-hidden="true">+</span></summary><p>Timelines begin once payment is received and we have the content, access and brand materials needed for the work.</p></details>
    <details><summary>Which currency do you charge in?<span aria-hidden="true">+</span></summary><p>All prices are in USD. Monthly services are billed at the start of each cycle; projects are paid before work begins.</p></details>
    <details><summary>Can I combine services?<span aria-hidden="true">+</span></summary><p>Yes. Many clients pair video editing with branding or SEO. Choose “Multiple services” in the form and describe what you need.</p></details>
  </div>
</div></section>`;
  return page({ title: 'Contact | CrawlMedia', description: 'Contact CrawlMedia for outsourced video editing, branding and SEO. Build a project brief and get a recommended plan or custom quote.', active: 'contact', bodyClass: 'inner-page', main });
}

/* ---------- Blog ---------- */
const formatDate = iso => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const categoryClass = category => ({ 'Video editing': 'video-service', Branding: 'branding-service', SEO: 'seo-service' }[category] || 'video-service');
const cover = post => `<div class="post-cover ${categoryClass(post.category)}" aria-hidden="true"><span>${escape(post.category)}</span></div>`;
const meta = post => `<p class="post-meta"><span>${escape(post.category)}</span><time datetime="${post.date}">${formatDate(post.date)}</time><span>${escape(post.readTime)}</span></p>`;
const postCard = (post, featured = false) => `<article class="post-card${featured ? ' post-card-featured' : ''}"><a href="/blog/${post.slug}/">${cover(post)}<div class="post-card-body">${meta(post)}<h${featured ? 2 : 3}>${escape(post.title)}</h${featured ? 2 : 3}><p>${escape(post.excerpt)}</p><span class="text-button">Read article <span aria-hidden="true">${arrow()}</span></span></div></a></article>`;

export function blogIndexPage(blog) {
  const [featured, ...rest] = [...blog.posts].sort((a, b) => b.date.localeCompare(a.date));
  const main = `${pageHero({
    eyebrow: 'Blog',
    heading: 'Notes on video, <em>brand and search.</em>',
    lead: 'Practical advice for teams who want better creative work, whether you outsource it or keep it in-house.',
  })}
<section class="section blog-list"><div class="container">
  ${postCard(featured, true)}
  ${rest.length ? `<div class="post-grid">${rest.map(post => postCard(post)).join('')}</div>` : ''}
</div></section>
${ctaBand('Need a hand<br><em>with the work?</em>')}`;
  return page({ title: 'Blog | CrawlMedia', description: 'Practical articles on video editing, branding and SEO from the CrawlMedia team.', active: 'blog', bodyClass: 'inner-page', main });
}

const block = item => {
  if (item.type === 'h2') return `<h2>${escape(item.text)}</h2>`;
  if (item.type === 'ul') return `<ul>${item.items.map(text => `<li>${escape(text)}</li>`).join('')}</ul>`;
  if (item.type === 'quote') return `<blockquote>${escape(item.text)}</blockquote>`;
  return `<p>${escape(item.text)}</p>`;
};

export function blogPostPage(post, blog) {
  const related = blog.posts.filter(other => other.slug !== post.slug).slice(0, 2);
  const main = `<article class="article">
  <header class="article-header"><div class="container article-narrow">
    <a class="breadcrumb" href="/blog/">${arrow('left')} All articles</a>
    ${meta(post)}
    <h1>${escape(post.title)}</h1>
    <p class="page-lead">${escape(post.excerpt)}</p>
    <p class="article-author"><span class="author-mark" aria-hidden="true">CM</span>By the CrawlMedia team</p>
  </div></header>
  <div class="container article-narrow">${cover(post)}</div>
  <div class="container article-narrow article-body">${post.body.map(block).join('\n')}</div>
</article>
${related.length ? `<section class="section related-posts"><div class="container"><div class="section-heading-row"><div><p class="eyebrow">Keep reading</p><h2>More <em>articles.</em></h2></div><a class="text-button" href="/blog/">All articles <span aria-hidden="true">${arrow()}</span></a></div><div class="post-grid">${related.map(other => postCard(other)).join('')}</div></div></section>` : ''}
${ctaBand('Need a hand<br><em>with the work?</em>')}`;
  return page({ title: `${post.title} | CrawlMedia`, description: post.excerpt, active: 'blog', bodyClass: 'inner-page', main });
}
