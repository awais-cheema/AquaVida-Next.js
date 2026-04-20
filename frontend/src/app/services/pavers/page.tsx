import { reader } from '@/lib/keystatic-reader'
import PaverClient from './PaverClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pavers').catch(() => null)
    return <PaverClient override={entry ?? null} />
}
