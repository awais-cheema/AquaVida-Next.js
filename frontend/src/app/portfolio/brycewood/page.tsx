import { reader } from '@/lib/keystatic-reader'
import PortfolioProjectShell from '@/components/portfolio/PortfolioProjectShell'

const DEFAULTS = {
    id: 'brycewood',
    title: 'Brycewood',
    description: 'A crystalline infinity pool that pushes the limits of hydraulic transparency. Sharp geometric lines and a minimalist coping detail create a pool that looks less like a basin and more like a slab of solid water.',
    heroImage: '/images/portfolio/brycewood/hero.avif',
    location: 'Seattle, WA',
    year: '2024',
    category: 'Crystalline Architecture',
    philosophyTitle: 'Crystalline Clarity',
    philosophyBody: 'True clarity is the result of extreme engineering. By utilizing ultraviolet and horizontal-flow filtration, we achieve museum-grade water quality that reflects architecture in its purest form.',
    philosophyImage: '/images/portfolio/brycewood/Refraction_Study.avif',
    gallery: [
        { url: '/images/portfolio/brycewood/Vibrant_Modern.avif', title: 'Geometric Line', spec: 'Zero-Edge Infinity Weir', size: 'col-span-2 row-span-1' },
        { url: '/images/portfolio/brycewood/Coping_Detail.avif', title: 'Shadow-Box Detail', spec: 'Natural Slate Coping', size: 'col-span-1 row-span-1' },
        { url: '/images/portfolio/brycewood/Greenery_Macro.avif', title: 'Bio-Integration', spec: 'Native Flora Landscape', size: 'col-span-1 row-span-1' },
    ],
    technicalTitle: 'Liquid Engineering',
    technicalBody: 'The Brycewood project features a 60-linear-foot infinity spillway that produces zero audible splashing, delivering a perfectly silent and mirror-like water surface.',
    accentColor: '#D4AF37',
}

export default async function BrycewoodPage() {
    const entry = await reader.collections.portfolioProjects.read('brycewood').catch(() => null)
    const p = entry
        ? {
            ...DEFAULTS, ...entry, id: 'brycewood',
            gallery: entry.gallery?.length ? [...entry.gallery].map(g => ({ ...g })) : DEFAULTS.gallery,
            faqItems: entry.faqItems?.length ? [...entry.faqItems].map(f => ({ ...f })) : undefined,
          }
        : DEFAULTS
    return <PortfolioProjectShell p={p} />
}
