import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import AboutClient from './AboutClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('about', {
        title: 'About | AquaVida Pools and Spas',
        description: 'Meet the team behind AquaVida — architects, engineers, and artisans building Dallas's finest aquatic experiences.',
    })
}

export default async function AboutPage() {
    const raw = await reader.singletons.aboutPage.read().catch(() => null)
    const data = raw ? {
        ...raw,
        beliefs: raw.beliefs ? [...raw.beliefs].map(b => ({ ...b })) : undefined,
        values: raw.values ? [...raw.values].map(v => ({ ...v })) : undefined,
    } : undefined
    return <AboutClient data={data} />
}
