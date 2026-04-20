import { reader } from '@/lib/keystatic-reader'
import OutdoorKitchensClient from './OutdoorKitchensClient'

export default async function Page() {
    const entry = await reader.collections.servicePages.read('outdoor-grill').catch(() => null)
    return <OutdoorKitchensClient override={entry ?? null} />
}
