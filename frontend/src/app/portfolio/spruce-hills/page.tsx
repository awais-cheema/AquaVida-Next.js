import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PortfolioProjectShell from '@/components/portfolio/PortfolioProjectShell'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('spruce-hills', {
        title: 'Spruce Hills | AquaVida Portfolio',
        description: 'A gravity-defying cantilevered infinity edge in Los Angeles — concrete brutalism meets organic tranquility on an extreme hillside.',
    })
}

const DEFAULTS = {
    id: 'spruce-hills',
    title: 'Spruce Hills',
    description: 'A multi-level architectural statement that redefines the relationship between concrete brutalism and organic tranquility. Engineered into an extreme hillside, this project features a gravity-defying cantilevered infinity edge.',
    heroImage: '/images/portfolio/spruce_hills/hero.avif',
    location: 'Los Angeles, CA',
    year: '2023',
    category: 'High-Performance Estate',
    philosophyTitle: 'The Silent Monolith',
    philosophyBody: 'True luxury is found in the absence of noise. By utilizing monochromatic limestone and structural concrete, we let the water—and the light—tell the story of the site.',
    philosophyImage: '/images/portfolio/spruce_hills/Tranquility_Mood.avif',
    gallery: [
        { url: '/images/portfolio/spruce_hills/spa.avif', title: 'Integrated Spa', spec: 'Material: Cold-Formed Concrete', size: 'col-span-2 row-span-1' },
        { url: '/images/portfolio/spruce_hills/Limestone_Macro.avif', title: 'Tonal Depth', spec: 'Detail: Hand-Finished Limestone', size: 'col-span-1 row-span-1' },
        { url: '/images/portfolio/spruce_hills/Structure_Detail.avif', title: 'Structural Void', spec: 'Engineering: Cantilevered Slabs', size: 'col-span-1 row-span-1' },
    ],
    technicalTitle: 'Engineering the Void',
    technicalBody: 'Spruce Hills required over 45 structural piers drilled into the hillside bedrock to support the massive horizontal spans of the pool deck and the zero-edge weir wall.',
    accentColor: '#0D5699',
}

export default async function SpruceHillsPage() {
    const entry = await reader.collections.portfolioProjects.read('spruce-hills').catch(() => null)
    const p = entry
        ? {
            ...DEFAULTS, ...entry, id: 'spruce-hills',
            gallery: entry.gallery?.length ? [...entry.gallery].map(g => ({ ...g })) : DEFAULTS.gallery,
            faqItems: entry.faqItems?.length ? [...entry.faqItems].map(f => ({ ...f })) : undefined,
          }
        : DEFAULTS
    return <PortfolioProjectShell p={p} />
}
