import { defineConfig } from 'vitest/config';

export default defineConfig({
    server: {
        open: '/src/index.html' // abre direto a página de exemplo
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.ts'
    }
});
