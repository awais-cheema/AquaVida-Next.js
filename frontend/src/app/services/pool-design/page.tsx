import { reader } from '@/lib/keystatic-reader'
import PoolDesignClient from './PoolDesignClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-design').catch(() => null)
    return <PoolDesignClient override={entry ?? null} />
}
