import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import TermsConditionsClient from './TermsConditionsClient'

export const metadata: Metadata = {
    title: 'Terms & Conditions | AquaVida Pools and Spas',
    description: 'Read the terms and conditions governing the use of AquaVida Pools and Spas services and website.',
}

export default async function TermsConditionsPage() {
    const data = await reader.singletons.termsConditions.read().catch(() => null)
    return <TermsConditionsClient data={data ?? null} />
}
