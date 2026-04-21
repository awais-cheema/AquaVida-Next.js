import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import ServicesClient, { type ServiceItem, type TestimonialItem } from './ServicesClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.servicesPage.read().catch(() => null)
    return buildPageMetadata('services', {
        title: 'Services | AquaVida Pools and Spas',
        description: 'Custom pool construction, outdoor kitchens, fire pits, pergolas, and more — precision-engineered for Dallas luxury living.',
    }, data)
}

export default async function Page() {
    const data = await reader.singletons.servicesPage.read().catch(() => null)
    return (
        <>
            <ServicesClient
                initialServices={data?.services?.length ? [...data.services].map(s => ({ ...s, image: s.image ?? '' })) as any : undefined}
                initialTestimonials={data?.testimonials?.length ? [...data.testimonials].map(t => ({ ...t, image: t.image ?? '' })) as any : undefined}
                initialFaqItems={data?.faqItems?.length ? [...data.faqItems].map(f => ({ ...f })) : undefined}
                heroImage={data?.heroImage || undefined}
                heroTitle={data?.heroTitle || undefined}
                heroTitleRight={data?.heroTitleRight || undefined}
                expertiseLabel={data?.expertiseLabel || undefined}
                expertiseTitle={data?.expertiseTitle || undefined}
                expertiseDescription={data?.expertiseDescription || undefined}
                corePrinciplesTitle={data?.corePrinciplesTitle || undefined}
                corePrinciples={data?.corePrinciples?.length ? [...data.corePrinciples].map(p => ({ ...p, image: p.image ?? '' })) as any : undefined}
                ctaLabel={data?.ctaLabel || undefined}
                ctaHeading={data?.ctaHeading || undefined}
                ctaButtonText={data?.ctaButtonText || undefined}
                ctaButtonHref={data?.ctaButtonHref || undefined}
            />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
