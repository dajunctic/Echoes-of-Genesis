import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    server: {
        port: 3000,
        host: '0.0.0.0',
    },
    resolve: {
        alias: {
            '@eog/shared': path.resolve(__dirname, '../shared/src'),
        },
    },
    build: {
        target: 'esnext',
        assetsInlineLimit: 0,
    },
});
//# sourceMappingURL=vite.config.js.map