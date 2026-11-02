# Ditsa landing page

A landing page with dedicated service pages for video editing, branding, and SEO, built with HTML, CSS, JavaScript, Three.js, and Vite. The design follows the Ditsa staging site: cream surfaces, cobalt-blue accents, General Sans typography, a wireframe D hero, dark service cards, and a large black footer. Vite provides the development server and production build; no frontend framework or backend is required.

## 1. Prerequisites

Install Node.js 22.12+ (Node.js 24 LTS recommended) from https://nodejs.org/. npm is included. Vite also supports Node.js 20.19+, but use a supported LTS version for a new setup.

Check the installation:

```sh
node --version
npm --version
```

## 2. Open the project

```sh
cd /Users/sujanapyakurel/outsourcing_website/ditsa-landing
```

Run all subsequent commands from this folder, which contains `package.json`.

## 3. Install dependencies

For initial setup:

```sh
npm install
```

This installs the development dependencies in `node_modules/`. Keep `package-lock.json` in version control. For a fresh checkout with the lockfile already present, use `npm ci` for a reproducible installation.

## 4. Start development

```sh
npm run dev
```

Open the Local URL printed in the terminal (usually http://127.0.0.1:5173). Keep this terminal running while editing. Changes appear automatically. Stop the server with Ctrl+C.

## 5. Project structure

```text
ditsa-landing/
├── index.html                 # Page content and sections
├── src/
│   ├── css/styles.css         # Design and responsive styles
│   ├── data/portfolio.js      # Video and brand book entries
│   └── js/
│       ├── main.js            # Navigation, process tabs, and brief download
│       ├── portfolio.js       # Video players and PDF book previews
│       └── wireframe.js       # Three.js hero artwork
├── public/
│   └── assets/
│       ├── images/            # Logo and original Ditsa sculpture
│       ├── fonts/             # Self-hosted General Sans fonts
│       ├── models/            # Original wireframe D model
│       ├── videos/            # Edited MP4 videos and optional captions
│       └── brand-books/       # Brand book PDFs
├── package.json               # Dependencies and npm commands
├── package-lock.json          # Exact dependency versions
├── .gitignore                 # Excludes dependencies and generated output
├── .openai/hosting.json        # Existing Sites hosting configuration
└── README.md
```

Update content in `index.html`, styles in `src/css/styles.css`, and interactions in `src/js/main.js`. Reference public images as `/assets/images/filename.png`. Use the development server instead of opening HTML directly: JavaScript is loaded as a module.

## 6. Check the production build locally

```sh
npm run build
npm run preview
```

Open the URL printed by the preview command (usually http://127.0.0.1:4173). `npm run build` creates the optimized website in `dist/`. Do not edit `dist/` directly. Preview is only for checking the build locally; it is not a production hosting server.

## 7. Before going live later

- Add approved edited video samples and brand book PDFs (instructions below).
- Confirm service descriptions and business contact information. The email link currently uses info@ditsa.com.np, taken from the reference site.
- Connect the enquiry form to an email/form backend. Currently it only downloads a project brief and sends nothing.
- Review mobile layouts, keyboard navigation, text, links, and image loading in a browser.
- Choose the production domain and hosting provider.

When ready to deploy, use project root `ditsa-landing`, install command `npm ci`, build command `npm run build`, and publish directory `dist`. Domain connection and public deployment are a separate final step. No deployment is required for local setup.

Fonts, images, and the hero model are served locally. Three.js renders the original Ditsa wireframe artwork, with a logo fallback if WebGL is unavailable. The animation respects reduced motion preferences and pauses when offscreen. This project currently requires no environment variables or API keys.

## Adding portfolio work

Edit `src/data/portfolio.js` to populate the Work section. It has two lists: `videos` and `brandBooks`. Duplicate the commented examples for each sample. Empty lists display “coming soon” cards, with no fake work or broken media links.

### Edited videos

1. Put each MP4 into `public/assets/videos/`.
2. Put its optional thumbnail into `public/assets/images/`.
3. Add an entry to `videos`:

```js
{
  title: 'Campaign film',
  description: 'Brand film / Editing & colour grading',
  src: '/assets/videos/campaign-film.mp4',
  poster: '/assets/images/campaign-film-cover.jpg',
  // captions: '/assets/videos/campaign-film-en.vtt',
},
```

Videos have native playback controls, play inline on mobile, and do not autoplay or preload the full file. Starting another sample pauses the previous one. For broad browser support, export MP4 with H.264 video and AAC audio. Add a WebVTT caption file when available. The `src` field can also point to a direct hosted video file; a YouTube/Vimeo page URL is not a direct video file.

### Brand books

1. Put each PDF into `public/assets/brand-books/`.
2. Put its optional cover image into `public/assets/images/`.
3. Add an entry to `brandBooks`:

```js
{
  title: 'Brand identity guidelines',
  description: 'Visual identity / Brand book',
  pdf: '/assets/brand-books/brand-guidelines.pdf',
  cover: '/assets/images/brand-book-cover.jpg',
},
```

The cover opens the PDF in a new tab, where visitors can read or download it using their browser. If no cover is provided, the title is shown on a styled book cover. Use shareable PDFs approved for public viewing.

Page sections and navigation follow the same order: Home → About → Work → Services → Pricing → How we work → Contact.

## Services and pricing

The landing page now includes Video Editing, Branding, and SEO, with pricing immediately after Services. Each service links to its own page:

- `/services/video-editing/`
- `/services/branding/`
- `/services/seo/`

`src/data/services.json` is the shared source for package prices, inclusions, timelines, add-ons, and service terms, transcribed from the supplied Ditsa pricing catalog. All prices are USD. Branding is priced per project; Video Editing and SEO are monthly services.

Edit the catalog JSON to update packages. Then run:

```sh
npm run content:sync
```

This updates the generated pricing block in `index.html` and the three service page HTML files. It also runs automatically before `npm run dev` and `npm run build`. Restart the dev command or run `content:sync` after changing the catalog while the server is running.

- Edit `src/templates/service-page.js` for service-page and pricing markup.
- Edit `src/css/styles.css` for the shared design.
- `src/js/pricing.js` manages the pricing tabs and keyboard navigation.
- `src/js/site.js` is shared navigation behavior for every page.
- `vite.config.js` includes all four HTML entry points in the production build.

Avoid manually changing generated service HTML or content inside the `PRICING:START` / `PRICING:END` markers; regenerate from the template and catalog instead. The original DOCX is not needed to run or build the site.

Package buttons open an email enquiry with the service and selected package in the subject. They do not process payments or subscriptions. No public deployment has been performed for these changes.
