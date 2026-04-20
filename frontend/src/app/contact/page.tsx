import { reader } from '@/lib/keystatic-reader'
import ContactClient from './ContactClient'

export default async function ContactPage() {
    const data = await reader.singletons.contactPage.read().catch(() => null)
    return <ContactClient data={data ?? null} />
}
