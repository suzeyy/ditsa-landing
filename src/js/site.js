const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

function closeNavigation() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
}

menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));

// Services dropdown: opens on hover (CSS) and on click/keyboard (this script).
const dropdown = document.querySelector('.nav-dropdown');
const dropdownToggle = dropdown?.querySelector('.nav-dropdown-toggle');
function setDropdown(open) {
  if (!dropdown) return;
  dropdown.classList.toggle('open', open);
  dropdownToggle.setAttribute('aria-expanded', String(open));
}
dropdownToggle?.addEventListener('click', () => setDropdown(!dropdown.classList.contains('open')));
document.addEventListener('click', event => {
  if (dropdown && !dropdown.contains(event.target)) setDropdown(false);
});
dropdown?.addEventListener('focusout', event => {
  if (!dropdown.contains(event.relatedTarget)) setDropdown(false);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (dropdown?.classList.contains('open')) {
    setDropdown(false);
    dropdownToggle.focus();
  } else if (navigation.classList.contains('open')) {
    closeNavigation();
    menu.focus();
  }
});


document.querySelector('#year').textContent = new Date().getFullYear();

// Add a shadow to the sticky header once the page scrolls.
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Staggered fade-in for the card rows only (skipped for reduced motion).
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.service-card, .benefit, .steps li');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach(target => {
    const siblings = [...target.parentElement.children].filter(child => child.matches(target.tagName.toLowerCase()) || child.className === target.className);
    target.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(target), 4) * 80}ms`);
    target.classList.add('reveal');
    revealObserver.observe(target);
  });
}

// Only one FAQ answer open at a time.
const faqs = [...document.querySelectorAll('.faq-list details')];
faqs.forEach(item => item.addEventListener('toggle', () => {
  if (item.open) faqs.forEach(other => { if (other !== item) other.open = false; });
}));

// Project brief form (homepage and contact page).
const briefForm = document.querySelector('#brief-form');
let briefUrl;
briefForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const brief = `CRAWLMEDIA PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nService: ${data.get('service')}\n\nProject:\n${data.get('project')}`;
  if (briefUrl) URL.revokeObjectURL(briefUrl);
  briefUrl = URL.createObjectURL(new Blob([brief], { type: 'text/plain' }));
  const result = document.querySelector('#brief-result');
  result.hidden = false;
  result.textContent = 'Your brief is ready. Download it and email it to info@ditsa.com.np. ';
  const link = document.createElement('a');
  link.href = briefUrl;
  link.download = 'crawlmedia-project-brief.txt';
  link.textContent = 'Download your brief ';
  const arrow = document.createElement('i');
  arrow.className = 'arrow';
  link.append(arrow);
  result.append(link);
});
