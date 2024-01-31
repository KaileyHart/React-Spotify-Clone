import { defineConfig, transformWithEsbuild } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';

// * https://vitejs.dev/config/ -- 04/04/2023 JH

// * https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js -- 09/22/2023 MF

// * https://stackoverflow.com/questions/74620427/how-to-configure-vite-to-allow-jsx-syntax-in-js-files

dotenv.config();

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/))  return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    react(),
  ],
  server: {
    port: process.env.PORT
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssImport,
        postcssNested,
        autoprefixer,
        postcssPresetEnv({ stage: 1 })
      ]
    }
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./index.html"
      },
      output: {
        entryFileNames: 'static/[name].[hash].js',
        assetFileNames: `static/[name].[hash].[ext]`,
      }
    }
  }
});
