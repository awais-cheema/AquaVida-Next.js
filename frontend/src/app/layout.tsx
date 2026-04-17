/**
 * Root layout — global providers, nav, footer, and metadata.
 */
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import FloatingPillNav from '@/components/layout/FloatingPillNav';
import FloatingFooter  from '@/components/layout/FloatingFooter';
import LoaderScreen from '@/components/LoaderScreen';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
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
        default: 'Aqua Vida Pools And Spas',
        template: '%s | Aqua Vida Pools And Spas',
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                {/*
                  * FloatingPillNav is intentionally rendered OUTSIDE SmoothScrollProvider.
                  * ScrollSmoother applies translateY transforms to #smooth-content; any
                  * position:fixed element inside that container loses true viewport-fixed
                  * behavior and scrolls off-screen with the transform. Rendering here
                  * (a direct body child, sibling to the scroll wrapper) keeps it pinned.
                  */}
                <LoaderScreen />
                <FloatingPillNav />
                <SmoothScrollProvider>
                    <div id="app-root" className="flex min-h-screen flex-col overflow-x-hidden">
                        <main id="main-content" role="main" className="flex-1 w-full relative">
                            {children}
                        </main>
                        {/*
                          * FloatingFooter lives inside SmoothScrollProvider so that on non-home
                          * pages (position:relative) it renders AFTER page content, not before.
                          * On the home page it uses createPortal and exits this container anyway.
                          */}
                        <FloatingFooter />
                    </div>
                </SmoothScrollProvider>
                <SpeedInsights />
            </body>
        </html>
    );
}
