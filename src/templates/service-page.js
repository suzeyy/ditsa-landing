const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const enquiry = (service, plan) => `mailto:info@ditsa.com.np?subject=${encodeURIComponent(`Project enquiry — ${service.title}${plan ? ` / ${plan.title}` : ''}`)}`;

export function packageCards(service, expanded = false) {
  return `<div class="pricing-grid">${service.packages.map(plan => {
    const features = expanded ? plan.features : plan.features.slice(0, 4);
    const remaining = expanded ? [] : plan.features.slice(4);
    return `<article class="price-card${plan.popular ? ' price-featured' : ''}">
      <div class="plan-top"><span class="plan-name">${escape(plan.title)}</span>${plan.popular ? '<span class="popular-badge">Most popular</span>' : '<span class="plan-dot" aria-hidden="true">↗</span>'}</div>
      <div class="plan-price"><strong>$${plan.price}</strong><span>USD / ${service.basis === 'month' ? 'month' : 'project'}</span></div>
      <p class="plan-description">${escape(plan.description)}</p>
      <a class="plan-button" href="${enquiry(service, plan)}">Choose ${escape(plan.title)} <span aria-hidden="true">↗</span></a>
      <p class="plan-includes">What’s included</p>
      <ul class="plan-features">${features.map(feature => `<li>${escape(feature)}</li>`).join('')}</ul>
      ${remaining.length ? `<details class="plan-more"><summary>View all ${plan.features.length} inclusions <span aria-hidden="true">+</span></summary><ul class="plan-features">${remaining.map(feature => `<li>${escape(feature)}</li>`).join('')}</ul></details>` : ''}
      <div class="plan-delivery"><span aria-hidden="true">◷</span> ${escape(plan.delivery)}</div>
      ${plan.notes.map(note => `<p class="plan-note">${escape(note)}</p>`).join('')}
    </article>`;
  }).join('')}</div>`;
}

export function serviceTerms(catalog) {
  return `<details class="service-terms"><summary>Service terms & what to expect <span aria-hidden="true">+</span></summary><ul>${catalog.terms.map(term => `<li>${escape(term)}</li>`).join('')}</ul></details>`;
}

export function homePricing(catalog) {
  return `<section id="pricing" class="pricing section" aria-labelledby="pricing-heading">
    <div class="container">
      <div class="section-heading-row pricing-heading-row"><div><p class="eyebrow">Clear scope. Thoughtful pricing.</p><h2 id="pricing-heading">Your next chapter.<br>A plan to match.</h2></div><div><p class="description">Choose the support that fits your ambitions. Defined deliverables, clear timelines, and everything delivered digitally.</p><span class="currency-label">ALL PRICES IN USD <span aria-hidden="true">↗</span></span></div></div>
      <div class="pricing-selector" role="tablist" aria-label="Pricing by service">${catalog.services.map((service, index) => `<button type="button" id="pricing-tab-${service.slug}" class="pricing-tab${index === 0 ? ' active' : ''}" role="tab" aria-selected="${index === 0}" aria-controls="pricing-panel-${service.slug}" tabindex="${index === 0 ? '0' : '-1'}">${escape(service.shortTitle || service.title)}<span>${service.basis === 'month' ? 'Monthly' : 'One-time'}</span></button>`).join('')}</div>
      ${catalog.services.map((service, index) => `<div id="pricing-panel-${service.slug}" role="tabpanel" aria-labelledby="pricing-tab-${service.slug}" tabindex="0"${index ? ' hidden' : ''}>${packageCards(service)}<a class="pricing-detail-link" href="/services/${service.slug}/">Explore ${escape(service.shortTitle || service.title)} packages & full scope <span aria-hidden="true">↗</span></a></div>`).join('')}
      <div class="custom-plan"><div><span class="custom-plan-symbol" aria-hidden="true">✳</span><div><h3>Something outside the brief?</h3><p>One-off projects, additional deliverables, or a different scope. Let’s put together a tailored quote.</p></div></div><a class="text-button" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a></div>
      ${serviceTerms(catalog)}
    </div>
  </section>`;
}

export function servicePage(service, catalog, header, footer) {
  const title = escape(service.shortTitle || service.title);
  const asset = service.slug === 'video-editing' ? '<div class="video-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="art-orbit"></span>' : service.slug === 'branding' ? '<div class="type-art">Aa<span>✳</span></div>' : '<div class="seo-art"><i></i><i></i><i></i><i></i><span>↗</span></div>';
  const extras = service.extras.length ? `<section class="section service-addons"><div class="container"><div class="section-heading-row"><div><p class="eyebrow">A little extra</p><h2>Make it your own.</h2></div><p class="description">Additional services and suggested prices from our catalog. Final scope is agreed before work begins.</p></div><div class="addon-list">${service.extras.map(extra => `<div><span>${escape(extra.title)}</span><strong>${escape(extra.price)}${extra.price.startsWith('$') ? ' USD' : ''}</strong></div>`).join('')}</div></div></section>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f7ed"><meta name="description" content="${escape(service.description)}"><title>${title} Services & Pricing | Ditsa</title><link rel="icon" href="/assets/images/logo.png"><link rel="stylesheet" href="/src/css/styles.css"></head>
<body class="service-page"><a class="skip-link" href="#main">Skip to content</a><div class="site-surface">${header}<main id="main">
<section class="service-detail-hero"><div class="container"><a class="breadcrumb" href="/#services">← All services</a><div class="service-detail-grid"><div><p class="eyebrow">${escape(service.eyebrow)}</p><h1>${service.headline.split('\n').map((line, index) => index ? `<span>${escape(line)}</span>` : escape(line)).join('<br>')}</h1><p class="description">${escape(service.description)}</p><div class="detail-actions"><a class="button" href="#packages">Explore packages <span aria-hidden="true">↗</span></a><a class="text-button" href="${enquiry(service)}">Discuss your project <span aria-hidden="true">↗</span></a></div></div><div class="detail-art ${service.slug === 'video-editing' ? 'video-service' : service.slug === 'branding' ? 'branding-service' : 'seo-service'}" aria-hidden="true">${asset}<span class="detail-art-label">DITSA / ${title.toUpperCase()}</span></div></div><div class="service-scope">${service.scope.map((scope, index) => `<div><span>0${index + 1}</span><h2>${escape(scope)}</h2></div>`).join('')}</div></div></section>
<section id="packages" class="pricing section"><div class="container"><div class="section-heading-row pricing-heading-row"><div><p class="eyebrow">${title} packages</p><h2>Find your<br>right fit.</h2></div><div><p class="description">${service.basis === 'month' ? 'Ongoing support, billed monthly. Choose a clear scope that matches your needs.' : 'A defined brand identity project, from discovery to final files.'}</p><span class="currency-label">ALL PRICES IN USD</span></div></div>${packageCards(service, true)}</div></section>
${extras}<section class="section detail-terms"><div class="container">${serviceTerms(catalog)}</div></section>
<section class="section service-page-cta"><div class="container"><p class="eyebrow">Your next move</p><div class="contact-title"><h2>Let’s make<br>it happen.</h2><a class="circle-button" href="${enquiry(service)}" aria-label="Enquire about ${title}">↗</a></div><a class="pricing-detail-link" href="/#contact">Or prepare a project brief on our contact section ↗</a></div></section>
</main>${footer}</div><script type="module" src="/src/js/service-detail.js"></script></body></html>`;
}
