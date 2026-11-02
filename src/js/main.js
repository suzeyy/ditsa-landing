import './portfolio.js';

import './site.js';
import './pricing.js';

// Reflect the section being viewed in the main navigation.
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navigation.querySelectorAll('a:not(.nav-cta)').forEach(link => {
      const active = link.hash === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-10% 0px -60% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
// The home link represents the hero, rather than the whole page wrapper.
const hero = document.querySelector('.hero');
hero.id = 'hero';
const homeObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  navigation.querySelectorAll('a:not(.nav-cta)').forEach(link => {
    const active = link.hash === '#home';
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { threshold: .35 });
homeObserver.observe(hero);

// Keyboard accessible process tabs.
const tabs = [...document.querySelectorAll('.step-tab')];
function selectStep(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStep(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectStep(tabs[next]);
    tabs[next].focus();
  });
});

let briefUrl;
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const brief = `DITSA — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nService: ${data.get('service')}\n\nProject:\n${data.get('project')}`;
  if (briefUrl) URL.revokeObjectURL(briefUrl);
  briefUrl = URL.createObjectURL(new Blob([brief], { type: 'text/plain' }));
  const result = document.querySelector('#brief-result');
  result.hidden = false;
  result.textContent = 'Your brief is ready. Download it and email it to info@ditsa.com.np. ';
  const link = document.createElement('a');
  link.href = briefUrl;
  link.download = 'ditsa-project-brief.txt';
  link.textContent = 'Download your brief ↗';
  result.append(link);
});

// Keep the page usable if WebGL or the artwork cannot load.
import('./wireframe.js').then(module => module.initWireframe()).catch(error => {
  console.warn('The 3D artwork is unavailable; displaying the Ditsa logo.', error);
});
