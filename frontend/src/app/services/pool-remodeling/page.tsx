import { reader } from '@/lib/keystatic-reader'
import PoolRemodelingClient from './PoolRemodelingClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-remodeling').catch(() => null)
    return <PoolRemodelingClient override={entry ?? null} />
}
