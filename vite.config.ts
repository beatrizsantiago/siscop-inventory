import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'inventory',
      filename: 'remoteEntry.js',
      exposes: {
        './inventory-app': './src/App/index.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3003,
  },
  optimizeDeps: {
    exclude: ['@phosphor-icons/react'],
  },
})
