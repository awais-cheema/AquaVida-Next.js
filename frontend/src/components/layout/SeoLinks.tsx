import Link from 'next/link'

export interface SeoLinkDef {
  anchorText: string
  url?: string // external
  targetUrl?: string // internal
  rel?: 'follow' | 'nofollow' | 'sponsored' | 'ugc' | string
  newTab?: boolean
  context?: string
}

export default function SeoLinks({
  internalLinks,
  externalLinks
}: {
  internalLinks?: readonly SeoLinkDef[] | null;
  externalLinks?: readonly SeoLinkDef[] | null;
}) {
  if (!internalLinks?.length && !externalLinks?.length) return null;

  return (
    <div className="bg-[#05070A] px-6 md:px-12 lg:px-24 py-8 border-t border-white/5 font-sans relative z-10 w-full">
        <div className="max-w-[1900px] mx-auto opacity-30 hover:opacity-100 transition-opacity duration-500">
            <h4 className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4">Related Resources</h4>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
                {internalLinks?.map((link, i) => (
                    <Link key={`int-${i}`} href={link.targetUrl || '/'} className="text-white/60 hover:text-white text-xs md:text-sm transition-colors decoration-white/20 hover:decoration-white underline underline-offset-4 font-light">
                        {link.anchorText}
                    </Link>
                ))}
                
                {externalLinks?.map((link, i) => {
                    const fallbackRel = link.rel || 'nofollow';
                    const isFollow = fallbackRel === 'follow';
                    const relAttr = isFollow 
                        ? (link.newTab ? 'noopener noreferrer' : undefined) 
                        : `${fallbackRel} ${link.newTab ? 'noopener noreferrer' : ''}`.trim();

                    return (
                        <a 
                          key={`ext-${i}`} 
                          href={link.url || '#'} 
                          rel={relAttr || undefined}
                          target={link.newTab ? '_blank' : undefined}
                          className="text-white/60 hover:text-[#A68A33] text-xs md:text-sm transition-colors decoration-white/20 hover:decoration-[#A68A33] underline underline-offset-4 font-light"
                        >
                            {link.anchorText}
                        </a>
                    )
                })}
            </div>
        </div>
    </div>
  )
}
