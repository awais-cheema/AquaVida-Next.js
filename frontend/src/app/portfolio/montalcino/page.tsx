import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PortfolioProjectShell from '@/components/portfolio/PortfolioProjectShell'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.portfolioProjects.read('montalcino').catch(() => null)
    return buildPageMetadata('montalcino', {
        title: 'Montalcino | AquaVida Portfolio',
        description: 'A nocturnal sanctuary in Austin — sunken fire feature, zero-edge design, and precision hydraulics for high-end social architecture.',
    }, entry)
}

const DEFAULTS = {
    id: 'montalcino',
    title: 'Montalcino',
    description: 'A nocturnal sanctuary designed for high-end social engagement. At the heart of this estate project is a sunken, zero-edge fire feature where the heat of the flame meets the cooling embrace of silent hydraulics.',
    heroImage: '/images/portfolio/montalcino/hero.avif',
    location: 'Austin, TX',
    year: '2023',
    category: 'Social Architecture',
    philosophyTitle: 'The Nocturnal Glow',
    philosophyBody: 'Design is the manipulation of light and shadow. At Montalcino, we used firelight as our primary architectural material, creating a warm, social nocturnal hearth in an onyx void.',
    philosophyImage: '/images/portfolio/montalcino/Fire_Feature.avif',
    gallery: [
        { url: '/images/portfolio/montalcino/Evening_Social.avif', title: 'Social Depth', spec: 'Sunken Firepit Enclosure', size: 'col-span-2 row-span-1' },
        { url: '/images/portfolio/montalcino/Kitchen_Macro.avif', title: 'Precision Surface', spec: 'Outdoor Culinary Station', size: 'col-span-1 row-span-1' },
        { url: '/images/portfolio/montalcino/Liquid_Light_Macro.avif', title: 'Refractive Detail', spec: 'Submerged Fire-Glass System', size: 'col-span-1 row-span-1' },
    ],
    technicalTitle: 'Precision Hydrology',
    technicalBody: 'The sunken firepit area required a complex dual-channel hydraulic system to ensure that the water stayed separated from the gas lines while maintaining a seamless zero-level overflow.',
    accentColor: '#FF8C00',
}

export default async function MontalcinoPage() {
    const entry = await reader.collections.portfolioProjects.read('montalcino').catch(() => null)
    const p = entry
        ? {
            ...DEFAULTS, 
            ...entry, 
            id: 'montalcino',
            description: (entry as any).description as any,
            philosophyBody: (entry as any).philosophyBody as any,
            technicalBody: (entry as any).technicalBody as any,
            heroImage: entry.heroImage ?? DEFAULTS.heroImage,
            philosophyImage: entry.philosophyImage ?? DEFAULTS.philosophyImage,
            gallery: entry.gallery?.length ? [...entry.gallery].map(g => ({ ...g, url: g.url ?? '' })) as any : DEFAULTS.gallery,
            faqItems: entry.faqItems?.length ? [...entry.faqItems].map(f => ({ ...f, answer: f.answer as any })) : undefined,
          }
        : DEFAULTS
    return <PortfolioProjectShell p={p} />
}
