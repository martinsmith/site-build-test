import { resolve } from 'path';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';

/** Replaces <!-- @include name --> with the contents of src/partials/name.html */
function htmlPartials() {
  return {
    name: 'html-partials',
    transformIndexHtml(html) {
      return html.replace(
        /<!--\s*@include\s+([\w-]+)\s*-->/g,
        (_match, name) => {
          const filePath = resolve(__dirname, `src/partials/${name}.html`);
          return readFileSync(filePath, 'utf-8');
        }
      );
    },
  };
}

export default defineConfig({
  plugins: [htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'new-lift-installations': resolve(__dirname, 'new-lift-installations.html'),
        'commercial-lifts': resolve(__dirname, 'commercial-lifts.html'),
        contact: resolve(__dirname, 'contact.html'),
        'why-choose-us': resolve(__dirname, 'why-choose-us.html'),
        services: resolve(__dirname, 'services.html'),
        sectors: resolve(__dirname, 'sectors.html'),
      },
    },
  },
});

