/**
 * Home page — hero-only cinematic experience.
 */
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { reader } from '@/lib/keystatic-reader';
import { buildPageMetadata } from '@/lib/seo';
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
import SeoLinks from '@/components/layout/SeoLinks';

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.homePage.read().catch(() => null)
    return buildPageMetadata('home', {
        title: 'AquaVida Pools and Spas',
        description: 'Premium pool design, construction and outdoor living by AquaVida.',
    }, data)
}

export default async function HomePage() {
    const data = await reader.singletons.homePage.read().catch(() => null)
    
    let jsonLd: Record<string, any> = {};
    try {
        const g = await reader.singletons.globalSeo.read().catch(() => null)
        jsonLd = g?.schemaOrg ? JSON.parse(g.schemaOrg) : {}
    } catch {
        // Structured data unavailable
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
            <div className="absolute bottom-0 w-full z-[1]">
                <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
            </div>
            <HeroSection />
        </>
    );
}
