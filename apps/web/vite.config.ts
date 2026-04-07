import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const repoRoot = resolve(__dirname, '../..');

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [react()],
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['itk-wasm', '@itk-wasm/image-io', '@thewtex/zstddec'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  test: {
    environment: 'node',
  },
});
