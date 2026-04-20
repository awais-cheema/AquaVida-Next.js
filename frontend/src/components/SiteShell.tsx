'use client'

import { usePathname } from 'next/navigation'
import FloatingPillNav from '@/components/layout/FloatingPillNav'
import FloatingFooter, { type FooterData } from '@/components/layout/FloatingFooter'
import LoaderScreen from '@/components/LoaderScreen'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

const ADMIN_PATHS = ['/keystatic', '/keystatic-login']

export default function SiteShell({ children, footerData }: { children: React.ReactNode; footerData?: FooterData | null }) {
  const pathname = usePathname()
  const isAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p))

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {/*
       * FloatingPillNav is intentionally rendered OUTSIDE SmoothScrollProvider.
       * ScrollSmoother applies translateY transforms to #smooth-content; any
       * position:fixed element inside that container loses true viewport-fixed
       * behavior and scrolls off-screen with the transform.
       */}
      <LoaderScreen />
      <FloatingPillNav />
      <SmoothScrollProvider>
        <div id="app-root" className="flex min-h-screen flex-col overflow-x-hidden">
          <main id="main-content" role="main" className="flex-1 w-full relative">
            {children}
          </main>
          <FloatingFooter footerData={footerData} />
        </div>
      </SmoothScrollProvider>
    </>
  )
}
