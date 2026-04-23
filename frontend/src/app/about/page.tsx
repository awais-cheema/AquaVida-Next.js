import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import AboutClient from './AboutClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.aboutPage.read().catch(() => null)
    return buildPageMetadata('about', {
        title: 'About | AquaVida Pools and Spas',
        description: "Meet the team behind AquaVida — architects, engineers, and artisans building Dallas's finest aquatic experiences.",
    }, data)
}

export default async function AboutPage() {
    const raw = await reader.singletons.aboutPage.read().catch(() => null)
    const data = raw ? {
        ...raw,
        manifesto: raw.manifesto ? await raw.manifesto() : undefined,
        approachQuote: raw.approachQuote ? await raw.approachQuote() : undefined,
        approachDescription: raw.approachDescription ? await raw.approachDescription() : undefined,
        beliefs: raw.beliefs ? [...raw.beliefs].map(b => ({ ...b })) : undefined,
        values: raw.values ? await Promise.all([...raw.values].map(async v => ({ ...v, desc: await v.desc() }))) : undefined,
        founderBio: raw.founderBio ? await raw.founderBio() : undefined,
    } : undefined
    return (
        <>
            <AboutClient data={data} />
            <SeoLinks internalLinks={raw?.internalLinks} externalLinks={raw?.externalLinks} />
        </>
    )
}
