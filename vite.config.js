import { defineConfig } from 'vite';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Every index.html under the generated folders becomes a build entry, so new
// service pages and blog posts are picked up automatically.
const root = fileURLToPath(new URL('.', import.meta.url));
function htmlEntries(directory) {
  const entries = [];
  const absolute = `${root}${directory}`;
  if (!existsSync(absolute)) return entries;
  if (existsSync(`${absolute}/index.html`)) entries.push(`${absolute}/index.html`);
  for (const item of readdirSync(absolute, { withFileTypes: true })) {
    if (item.isDirectory()) entries.push(...htmlEntries(`${directory}/${item.name}`));
  }
  return entries;
}

const input = { home: `${root}index.html` };
for (const directory of ['about', 'services', 'contact', 'blog']) {
  for (const file of htmlEntries(directory)) {
    const name = file.slice(root.length).replace(/\/index\.html$/, '').replaceAll('/', '-');
    input[name] = file;
  }
}

export default defineConfig({
  build: { rolldownOptions: { input } },
});
