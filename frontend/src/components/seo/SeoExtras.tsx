import { headers } from 'next/headers'
import Link from 'next/link'
import { pathnameToSeoSlug, getPageSeoEntry } from '@/lib/seo'

export default async function SeoExtras() {
  const hdrs = await headers()
  const pathname = hdrs.get('x-pathname') || '/'
  const slug = pathnameToSeoSlug(pathname)
  if (!slug) return null

  const entry = await getPageSeoEntry(slug)
  if (!entry) return null

  const e = entry as any
  const internalLinks = e.internalLinks as { anchorText: string; href?: string; description?: string }[] | undefined
  const breadcrumbs = e.breadcrumbs as { label: string; href: string }[] | undefined
  const structuredData = e.structuredData as string | undefined

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0
  const hasLinks = internalLinks && internalLinks.length > 0
  const hasStructuredData = structuredData && structuredData.trim()

  const breadcrumbSchema = hasBreadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [...breadcrumbs].map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.label,
          item: b.href,
        })),
      }
    : null

  return (
    <>
      {/* JSON-LD: BreadcrumbList */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* JSON-LD: per-page custom schema */}
      {hasStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData! }}
        />
      )}

      {/* Visible internal links section */}
      {hasLinks && (
        <section
          aria-label="Related pages"
          className="w-full bg-[#05070A] border-t border-white/5 px-6 py-12"
        >
          <div className="max-w-[1400px] mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/25 mb-6">
              Related Pages
            </p>
            <div className="flex flex-wrap gap-3">
              {[...internalLinks].map((link, i) => (
                <Link
                  key={i}
                  href={link.href || '/'}
                  className="group inline-flex flex-col gap-1 px-5 py-3 rounded-full border border-white/10 hover:border-white/30 transition-colors"
                >
                  <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors tracking-wide">
                    {link.anchorText}
                  </span>
                  {link.description && (
                    <span className="text-xs text-white/35 group-hover:text-white/50 transition-colors">
                      {link.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
