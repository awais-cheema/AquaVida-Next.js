import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import ContactClient from './ContactClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('contact', {
        title: 'Contact | AquaVida Pools and Spas',
        description: 'Get in touch with AquaVida Pools and Spas in Dallas, TX — schedule a consultation for your custom pool or outdoor living project.',
    })
}

export default async function ContactPage() {
    const data = await reader.singletons.contactPage.read().catch(() => null)
    return <ContactClient data={data ?? null} />
}
