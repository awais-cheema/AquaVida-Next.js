import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import FirePitClient from './FirePitClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('fire-pit', {
        title: 'Fire Pit Installation | AquaVida Pools and Spas',
        description: 'Custom fire pit design and installation in Dallas, TX — architectural stone hearths and precision gas combustion systems.',
    })
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('fire-pit').catch(() => null)
    return <FirePitClient override={entry ?? null} />
}
