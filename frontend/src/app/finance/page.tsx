import { reader } from '@/lib/keystatic-reader'
import FinancingClient from './FinancingClient'

export default async function Page() {
    const data = await reader.singletons.financePage.read().catch(() => null)
    return (
        <FinancingClient
            partners={data?.partners?.length ? data.partners : null}
            faqItems={data?.faqItems?.length ? data.faqItems : null}
        />
    )
}
