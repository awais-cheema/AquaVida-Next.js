import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import TermsConditionsClient from './TermsConditionsClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.termsConditions.read().catch(() => null)
    return buildPageMetadata('terms', {
        title: 'Terms & Conditions | AquaVida Pools and Spas',
        description: 'Read the terms and conditions for using AquaVida Pools and Spas website and services.',
    }, data)
}

export default async function TermsConditionsPage() {
    const data = await reader.singletons.termsConditions.read().catch(() => null)
    const resolvedData = data ? {
        ...data,
        intro: await data.intro(),
        sections: await Promise.all((data.sections || []).map(async s => ({
            ...s,
            body: await s.body()
        })))
    } : null

    return (
        <>
            <TermsConditionsClient data={resolvedData as any} />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
