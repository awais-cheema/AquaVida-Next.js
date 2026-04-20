import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import PrivacyPolicyClient from './PrivacyPolicyClient'

export const metadata: Metadata = {
    title: 'Privacy Policy | AquaVida Pools and Spas',
    description: 'Learn how AquaVida Pools and Spas collects, uses, and protects your personal information.',
}

export default async function PrivacyPolicyPage() {
    const data = await reader.singletons.privacyPolicy.read().catch(() => null)
    return <PrivacyPolicyClient data={data ?? null} />
}
