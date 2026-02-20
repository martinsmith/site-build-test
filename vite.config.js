import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'new-lift-installations': resolve(__dirname, 'new-lift-installations.html'),
      },
    },
  },
});

