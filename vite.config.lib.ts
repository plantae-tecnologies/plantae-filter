import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    build: {
      lib: {
        entry: 'src/main.ts',
        name: 'PlantaeFilter',
        fileName: (format) => `plantae-filter.${format}.js`,
        formats: ['es', 'umd']
      },
      rollupOptions: {
        // Remover o external
        output: {
          globals: {
            'fuse.js': 'Fuse',
            'clusterize.js': 'Clusterize'
          }
        }
      }
    },
    plugins: [
        dts(),
        viteStaticCopy({
          targets: [
            {
              src: 'src/theme',   // sua pasta de temas
              dest: ''            // copia direto para /dist/theme
            }
          ]
        })
    ]
  });
  