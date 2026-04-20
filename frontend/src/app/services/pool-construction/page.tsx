import { reader } from '@/lib/keystatic-reader'
import PoolConstructionClient from './PoolConstructionClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-construction').catch(() => null)
    return <PoolConstructionClient override={entry ?? null} />
}
