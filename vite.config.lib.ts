import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    base: './',
    build: {
        lib: {
            entry: 'src/main.ts',
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
        minify: 'terser',
        assetsInlineLimit: 4096
    },
    plugins: [
        dts({
            outDir: 'dist',
            insertTypesEntry: true,
            entryRoot: 'src',
            rollupTypes: true
        }),
        viteStaticCopy({
            targets: [
                { src: 'src/theme/*', dest: 'theme' }
            ]
        })
    ]
});
