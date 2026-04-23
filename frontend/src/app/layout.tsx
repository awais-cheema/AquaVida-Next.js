/**
 * Root layout — global providers, nav, footer, and metadata.
 */
import type { Metadata, Viewport } from 'next';
import { draftMode } from 'next/headers';
import localFont from 'next/font/local';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import SiteShell from '@/components/SiteShell';
import { reader } from '@/lib/keystatic-reader';
import { getGlobalSeo } from '@/lib/seo';
import SeoExtras from '@/components/seo/SeoExtras';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PreviewBanner from '@/components/layout/PreviewBanner';
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

export async function generateMetadata(): Promise<Metadata> {
    const g = await getGlobalSeo()
    const siteUrl = g?.siteUrl || SITE_URL
    const defaultRobots = g?.defaultRobots || 'index,follow'
    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: g?.defaultTitle || 'AquaVida Pools and Spas',
            template: g?.titleTemplate || '%s | AquaVida Pools and Spas',
        },
        description: g?.defaultDescription || 'AquaVida blends cutting-edge technology with ocean-inspired design.',
        icons: {
            icon: [{ url: '/logo.avif', type: 'image/avif' }],
            apple: '/logo.avif',
            shortcut: '/logo.avif',
        },
        openGraph: {
            type: 'website',
            siteName: g?.siteName || SITE_NAME,
            locale: 'en_US',
            ...(g?.defaultOgImage ? { images: [g.defaultOgImage] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            ...(g?.twitterHandle ? { site: g.twitterHandle } : {}),
        },
        robots: {
            index: !defaultRobots.includes('noindex'),
            follow: !defaultRobots.includes('nofollow'),
        },
        verification: {
            google: g?.googleVerification || 'wcjVQ-27D9k6VhuenwGqKiTUwiZjb-AcF51SL3LJ_wY',
            ...(g?.bingVerification ? { other: { 'msvalidate.01': [g.bingVerification] } } : {}),
        },
    }
}

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
    const [footerData, g] = await Promise.all([
        reader.singletons.footerSettings.read().catch(() => null),
        getGlobalSeo(),
    ])

    const clarityId = g?.clarityId || 'vke7bmqua4'
    const gaId = g?.googleAnalyticsId || null
    const gtmId = g?.googleTagManagerId || null

    return (
        <html lang="en" className={`dark ${allomira.variable}`} suppressHydrationWarning>
            <head>
                {/* Google Tag Manager (Head) */}
                {gtmId && (
                    <Script
                        id="gtm-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${gtmId}');`,
                        }}
                    />
                )}
                <Script
                    id="clarity-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`,
                    }}
                />
                {gaId && (
                    <>
                        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
                        <Script
                            id="google-analytics"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
                            }}
                        />
                    </>
                )}
            </head>
            <body suppressHydrationWarning>
                {/* Google Tag Manager (Body) */}
                {gtmId && (
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                )}
                <SiteShell footerData={footerData as unknown as import('@/components/layout/FloatingFooter').FooterData ?? null} seoExtras={<SeoExtras />}>
                    {(await draftMode()).isEnabled && <PreviewBanner />}
                    {children}
                </SiteShell>
                <SpeedInsights />
            </body>
        </html>
    );
}
