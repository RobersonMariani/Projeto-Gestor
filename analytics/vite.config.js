import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input:
            [
                'resources/css/app.css',
                'resources/js/dashboardOccurrences.js',
                'resources/js/charts.js',
                'resources/js/podium.js',
                'resources/js/reports.js',
                'resources/js/registerAnalyst.js',
                'resources/js/app.js',
                'resources/js/login.js'
            ],
            refresh: true,
        }),
    ],
});
