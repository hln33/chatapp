import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  loadEnvConfig(process.cwd());

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  });
};
