import { portfolio } from '../data/portfolio.js';

function caption(title, description) {
  const wrapper = document.createElement('div');
  wrapper.className = 'portfolio-caption';
  const heading = document.createElement('h4');
  heading.textContent = title;
  wrapper.append(heading);
  if (description) {
    const text = document.createElement('p');
    text.textContent = description;
    wrapper.append(text);
  }
  return wrapper;
}

function videoCard(item) {
  const card = document.createElement('article');
  card.className = 'portfolio-card';
  const video = document.createElement('video');
  video.className = 'portfolio-video';
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.src = item.src;
  video.setAttribute('aria-label', item.title);
  if (item.poster) video.poster = item.poster;
  if (item.captions) {
    const track = document.createElement('track');
    track.kind = 'captions';
    track.src = item.captions;
    track.srclang = 'en';
    track.label = 'English';
    video.append(track);
  }
  video.append('Your browser does not support embedded video.');
  // A download/open link stays available if inline playback is unsupported.
  const fallback = document.createElement('a');
  fallback.href = item.src;
  fallback.textContent = 'Open video ↗';
  fallback.className = 'portfolio-resource-link';
  card.append(video, caption(item.title, item.description), fallback);
  return card;
}

function bookCard(item) {
  const card = document.createElement('article');
  card.className = 'portfolio-card';
  const preview = document.createElement('a');
  preview.className = 'brand-book-preview';
  preview.href = item.pdf;
  preview.target = '_blank';
  preview.rel = 'noopener noreferrer';
  preview.setAttribute('aria-label', `View ${item.title} (PDF, opens in a new tab)`);
  if (item.cover) {
    const image = document.createElement('img');
    image.src = item.cover;
    image.alt = `${item.title} cover`;
    image.loading = 'lazy';
    preview.append(image);
  } else {
    const cover = document.createElement('span');
    cover.className = 'book-cover-fallback';
    cover.textContent = item.title;
    preview.append(cover);
  }
  const badge = document.createElement('span');
  badge.className = 'book-preview-badge';
  badge.textContent = 'View brand book ↗';
  preview.append(badge);
  card.append(preview, caption(item.title, item.description));
  return card;
}

const videos = portfolio.videos.filter(item => item.src && item.title);
const books = portfolio.brandBooks.filter(item => item.pdf && item.title);
if (videos.length) document.querySelector('#video-portfolio').replaceChildren(...videos.map(videoCard));
if (books.length) document.querySelector('#brand-portfolio').replaceChildren(...books.map(bookCard));

// Playing a second sample pauses the first. Samples never autoplay.
document.querySelectorAll('.portfolio-video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('.portfolio-video').forEach(other => {
      if (other !== video) other.pause();
    });
  });
});
