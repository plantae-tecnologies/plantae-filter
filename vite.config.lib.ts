import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  build: {
    lib: {
      entry: 'src/main.ts', // main.ts agora exporta o instance e o element
      name: 'PlantaeFilter',
      fileName: (format) => `plantae-filter.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        globals: {
          'fuse.js': 'Fuse',
          'clusterize.js': 'Clusterize'
        }
      }
    },
    minify: 'terser'
  },
  plugins: [
    dts(),
    viteStaticCopy({
      targets: [
        { src: 'src/theme', dest: '' }
      ]
    })
  ]
});
