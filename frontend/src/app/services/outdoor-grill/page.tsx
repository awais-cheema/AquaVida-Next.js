import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import OutdoorKitchensClient from './OutdoorKitchensClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('outdoor-grill', {
        title: 'Outdoor Kitchen & Grill | AquaVida Pools and Spas',
        description: 'Custom outdoor kitchen and grill design in Dallas, TX — professional-grade culinary stations built for the Texas lifestyle.',
    })
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('outdoor-grill').catch(() => null)
    return <OutdoorKitchensClient override={entry ?? null} />
}
