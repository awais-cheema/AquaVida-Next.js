'use client'

import dynamic from 'next/dynamic'

const KeystaticApp = dynamic(() => import('./keystatic-app'), { ssr: false })

export default function KeystaticAdminPage() {
  return <KeystaticApp />
}
