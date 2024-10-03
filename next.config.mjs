/** @type {import('next').NextConfig} */
import WithBundleAnalyzer from '@next/bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';
// next.config.js
const withBundleAnalyzerFunc = WithBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});





const nextConfig = withBundleAnalyzerFunc({
    productionBrowserSourceMaps: true,
    webpack: (config, { isServer, dev }) => {
        // Only add the service worker plugin when building the client-side bundle
        if (!isServer && !dev) {
            config.plugins.push(
                new GenerateSW({
                    disableDevLogs: true,
                    clientsClaim: true,
                    skipWaiting: true,
                    maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 5 MB limit
                    runtimeCaching: [
                        {
                            urlPattern: ({ request }) => request.destination === 'script',
                            handler: 'StaleWhileRevalidate',
                            options: {
                                cacheName: 'js-files',
                                expiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
                                },
                            },
                        },
                    ],
                })
            );
        }

        return config;
    },
});

export default nextConfig;


// module.exports = withBundleAnalyzer({
//     webpack(config) {
//         // Your existing webpack config can be modified here if needed
//         return config;
//     },
// });
