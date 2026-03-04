import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        intelligence: resolve(__dirname, 'intelligence.html'),
        timeline: resolve(__dirname, 'timeline.html'),
      },
    },
  },
});
