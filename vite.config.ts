import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// Vite 설정
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  css: {
    postcss: './postcss.config.cjs', // PandaCSS용 PostCSS 설정 연결
  },
});
