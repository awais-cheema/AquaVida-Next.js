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
                initialServices={data?.services?.length ? await Promise.all([...data.services].map(async s => ({ ...s, image: s.image ?? '', sub: await s.sub() }))) : undefined}
                initialTestimonials={data?.testimonials?.length ? await Promise.all([...data.testimonials].map(async t => ({ ...t, image: t.image ?? '', quote: await t.quote() }))) : undefined}
                initialFaqItems={data?.faqItems?.length ? await Promise.all([...data.faqItems].map(async f => ({ ...f, answer: await f.answer() }))) : undefined}
                heroImage={data?.heroImage || undefined}
                heroTitle={data?.heroTitle || undefined}
                heroTitleRight={data?.heroTitleRight || undefined}
                expertiseLabel={data?.expertiseLabel || undefined}
                expertiseTitle={data?.expertiseTitle || undefined}
                expertiseDescription={data?.expertiseDescription ? await data.expertiseDescription() : undefined}
                corePrinciplesTitle={data?.corePrinciplesTitle || undefined}
                corePrinciples={data?.corePrinciples?.length ? await Promise.all([...data.corePrinciples].map(async p => ({ ...p, image: p.image ?? '', sub: await p.sub() }))) : undefined}
                ctaLabel={data?.ctaLabel || undefined}
                ctaHeading={data?.ctaHeading || undefined}
                ctaButtonText={data?.ctaButtonText || undefined}
                ctaButtonHref={data?.ctaButtonHref || undefined}
            />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
