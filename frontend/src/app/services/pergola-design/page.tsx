import { reader } from '@/lib/keystatic-reader'
import PergolaClient from './PergolaClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pergola-design').catch(() => null)
    return <PergolaClient override={entry ?? null} />
}
