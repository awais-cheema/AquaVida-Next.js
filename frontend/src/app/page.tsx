/**
 * Home page — hero-only cinematic experience.
 */
import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/api';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import JsonLd from '@/components/seo/JsonLd';
import HeroSection from '@/sections/HeroSection';
import HeroScrollOverlay from '@/components/hero/HeroScrollOverlay';
import HeroContentOverlay2 from '@/components/hero/HeroContentOverlay2';
import HeroContentOverlay3 from '@/components/hero/HeroContentOverlay3';
import HeroContentOverlay4 from '@/components/hero/HeroContentOverlay4';
import HeroContentOverlay5 from '@/components/hero/HeroContentOverlay5';
import HeroContentOverlay6 from '@/components/hero/HeroContentOverlay6';
import HeroContentOverlay7 from '@/components/hero/HeroContentOverlay7';
import HeroContentOverlay8 from '@/components/hero/HeroContentOverlay8';
import HeroContentOverlay9  from '@/components/hero/HeroContentOverlay9';
import HeroContentOverlay10 from '@/components/hero/HeroContentOverlay10';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await getPageBySlug('home');
        const seo = page.seo;
        return {
            title: seo?.effective_title || 'AquaVida Pools and Spas',
            description: seo?.meta_description || 'Premium pool design, construction and outdoor living by AquaVida.',
            openGraph: {
                title: seo?.og_title || 'AquaVida Pools and Spas',
                description: seo?.og_description || '',
                url: SITE_URL,
                images: seo?.og_image_url ? [seo.og_image_url] : [],
            },
            alternates: {
                canonical: seo?.canonical_url || SITE_URL,
            },
        };
    } catch {
        return { title: 'AquaVida Pools and Spas' };
    }
}

export default async function HomePage() {
    let jsonLd: Record<string, any> = {};
    try {
        const page = await getPageBySlug('home');
        jsonLd = page.seo?.json_ld || {};
    } catch {
        // API unavailable — render without structured data
    }

    return (
        <>
            <JsonLd data={jsonLd} />

            {/*
              * z-index stack (highest → lowest):
              *   z-[100] FloatingPillNav       ← layout-level, always visible (pointer-events-auto)
              *   z-[50]  HeroScrollOverlay     ← frames 0-35, full-screen blur + content
              *   z-[50]  HeroContentOverlay2   ← frames 70-95, text only (no blur)
              *   z-[0]   HeroSection canvas    ← receives all scroll events
              */}
            <HeroScrollOverlay />
            <HeroContentOverlay2 />
            <HeroContentOverlay3 />
            <HeroContentOverlay4 />
            <HeroContentOverlay5 />
            <HeroContentOverlay6 />
            <HeroContentOverlay7 />
            <HeroContentOverlay8 />
            <HeroContentOverlay9 />
            <HeroContentOverlay10 />
            <HeroSection />
        </>
    );
}
