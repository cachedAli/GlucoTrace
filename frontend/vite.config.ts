import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(),
  visualizer({
    open: true,
    filename: 'bundle-analysis.html',
  }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
