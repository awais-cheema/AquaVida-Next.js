import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PrivacyPolicyClient from './PrivacyPolicyClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.privacyPolicy.read().catch(() => null)
    return buildPageMetadata('privacy-policy', {
        title: 'Privacy Policy | AquaVida Pools and Spas',
        description: 'Learn how AquaVida Pools and Spas collects, uses, and protects your personal information.',
    }, data)
}

export default async function PrivacyPolicyPage() {
    const data = await reader.singletons.privacyPolicy.read().catch(() => null)
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
            <PrivacyPolicyClient data={resolvedData as any} />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
