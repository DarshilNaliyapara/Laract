import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    //   server: {
    //     host: '0.0.0.0',   // Allows external access
    //     port: 5173,        // Default Vite port
    //     strictPort: true,  // Ensures Vite sticks to this port
    //     hmr: {
    //       host: '192.168.0.130', // Replace with your actual local IP
    //     },
    //     cors: true,
    //   },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
