const RAW_R2_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_DOMAIN || 'pub-8d68aba30b604ff882d45050c4beb761.r2.dev';
const R2_DOMAIN = RAW_R2_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Image optimization — Cloudflare CDN
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: R2_DOMAIN,
            },
            {
                protocol: 'https',
                hostname: '**.cloudflare.com',
            },
            {
                protocol: 'https',
                hostname: '**.r2.dev',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'hgtvhome.sndimg.com',
            },
            {
                protocol: 'https',
                hostname: 'www.exscapedesigns.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
            },
        ],
    },

    // Redirects — old URLs → canonical URLs (308 = permanent)
    async redirects() {
        return [
            {
                source: '/services/stone-firepit',
                destination: '/services/fire-pit',
                permanent: true,
            },
            {
                source: '/services/stone-firepit/',
                destination: '/services/fire-pit',
                permanent: true,
            },
            {
                source: '/services/paver-installation',
                destination: '/services/pavers',
                permanent: true,
            },
            {
                source: '/services/paver-installation/',
                destination: '/services/pavers',
                permanent: true,
            },
        ];
    },

    // Headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
            {
                source: '/videos/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/models/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ];
    },

    // Webpack — optimize Three.js
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.alias = {
                ...config.resolve.alias,
                'three/examples/jsm': 'three/examples/jsm',
            };
        }
        // GLTF/GLB loader
        config.module.rules.push({
            test: /\.(glb|gltf)$/,
            type: 'asset/resource',
        });
        return config;
    },

    // Experimental
    experimental: {
        optimizePackageImports: ['lucide-react', 'three', '@react-three/drei']
    },
};

// Bundle analyzer (optional)
const withBundleAnalyzer = process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({ enabled: true })
    : (config) => config;

module.exports = withBundleAnalyzer(nextConfig);
