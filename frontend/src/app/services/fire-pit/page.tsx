import { reader } from '@/lib/keystatic-reader'
import FirePitClient from './FirePitClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('fire-pit').catch(() => null)
    return <FirePitClient override={entry ?? null} />
}
