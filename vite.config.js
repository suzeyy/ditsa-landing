import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        videoEditing: fileURLToPath(new URL('./services/video-editing/index.html', import.meta.url)),
        branding: fileURLToPath(new URL('./services/branding/index.html', import.meta.url)),
        seo: fileURLToPath(new URL('./services/seo/index.html', import.meta.url)),
      },
    },
  },
});
