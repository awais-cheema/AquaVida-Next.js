import { reader } from '@/lib/keystatic-reader'
import AboutClient from './AboutClient'

export default async function AboutPage() {
    const raw = await reader.singletons.aboutPage.read().catch(() => null)
    const data = raw ? {
        ...raw,
        beliefs: raw.beliefs ? [...raw.beliefs].map(b => ({ ...b })) : undefined,
        values: raw.values ? [...raw.values].map(v => ({ ...v })) : undefined,
    } : undefined
    return <AboutClient data={data} />
}
