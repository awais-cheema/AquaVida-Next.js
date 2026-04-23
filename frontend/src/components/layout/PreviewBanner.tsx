'use client'

import Link from 'next/link'

export default function PreviewBanner() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black text-center py-2 px-4 text-sm font-bold tracking-wide shadow-lg">
            <span className="mr-3">👁 PREVIEW MODE — You are viewing draft content</span>
            <Link
                href="/api/preview/end"
                className="inline-block px-4 py-1 bg-black text-white rounded-full text-xs font-bold hover:bg-white hover:text-black transition-colors"
            >
                Exit Preview
            </Link>
        </div>
    )
}
