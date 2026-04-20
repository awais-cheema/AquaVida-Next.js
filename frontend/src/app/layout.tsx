/**
 * Root layout — global providers, nav, footer, and metadata.
 */
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import SiteShell from '@/components/SiteShell';
import { reader } from '@/lib/keystatic-reader';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/styles/globals.css';

// ── Allomira — variable font covers all weights, static files as fallbacks ──
const allomira = localFont({
    src: [
        { path: './fonts/Allomira-VF.woff2',      style: 'normal' },
        { path: './fonts/Allomira-Thin.woff2',     weight: '100', style: 'normal' },
        { path: './fonts/Allomira-Light.woff2',    weight: '300', style: 'normal' },
        { path: './fonts/Allomira-Regular.woff2',  weight: '400', style: 'normal' },
        { path: './fonts/Allomira-Medium.woff2',   weight: '500', style: 'normal' },
        { path: './fonts/Allomira-Bold.woff2',     weight: '700', style: 'normal' },
        { path: './fonts/Allomira-Black.woff2',    weight: '900', style: 'normal' },
    ],
    variable: '--font-allomira',
    display: 'swap',
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'AquaVida Pools and Spas',
        template: '%s | AquaVida Pools and Spas',
    },
    description: 'AquaVida blends cutting-edge technology with ocean-inspired design. Interactive 3D experiences.',
    icons: {
        icon: [
            { url: '/logo.avif', type: 'image/avif' },
        ],
        apple: '/logo.avif',
        shortcut: '/logo.avif',
    },
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
    },
    robots: {
        index: true,
        follow: true,
    },
    verification: {
        google: 'wcjVQ-27D9k6VhuenwGqKiTUwiZjb-AcF51SL3LJ_wY',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0a0e17',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const footerData = await reader.singletons.footerSettings.read().catch(() => null)

    return (
        <html lang="en" className={`dark ${allomira.variable}`} suppressHydrationWarning>
            <head>
                <Script
                    id="clarity-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vke7bmqua4");`,
                    }}
                />
            </head>
            <body suppressHydrationWarning>
                <SiteShell footerData={footerData ?? null}>
                    {children}
                </SiteShell>
                <SpeedInsights />
            </body>
        </html>
    );
}
