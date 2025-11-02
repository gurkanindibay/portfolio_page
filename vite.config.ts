import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/portfolio_page/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
