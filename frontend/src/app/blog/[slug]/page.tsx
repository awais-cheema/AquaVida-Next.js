import { reader } from '@/lib/keystatic-reader'
import { getGlobalSeo } from '@/lib/seo'
import { DocumentRenderer } from '@keystatic/core/renderer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react'

export async function generateStaticParams() {
    const slugs = await reader.collections.blogs.list().catch(() => [] as string[])
    return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const [post, g] = await Promise.all([
        reader.collections.blogs.read(slug).catch(() => null),
        getGlobalSeo(),
    ])
    if (!post) return {}
    const title = post.seoTitle || (post.title ? `${post.title} | AquaVida` : slug)
    const description = post.seoDescription || post.excerpt || g?.defaultDescription || ''
    const ogTitleVal = post.ogTitle || title
    const ogDescVal = post.ogDescription || description
    const noIndex = post.seoNoIndex ?? false
    const noFollow = post.seoNoFollow ?? false
    const canonical = post.seoCanonicalUrl || undefined
    const meta: Record<string, any> = {
        title: { absolute: title },
        description,
        openGraph: {
            title: ogTitleVal,
            description: ogDescVal,
            siteName: g?.siteName || 'AquaVida Pools and Spas',
            type: 'article',
            ...(post.ogImage || post.featured_image ? { images: [post.ogImage || post.featured_image] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitleVal,
            description: ogDescVal,
            ...(g?.twitterHandle ? { site: g.twitterHandle } : {}),
        },
        robots: { index: !noIndex, follow: !noFollow },
        ...(canonical ? { alternates: { canonical } } : {}),
    }
    if (post.seoKeywords) {
        meta.keywords = post.seoKeywords.split(',').map((k: string) => k.trim())
    }
    return meta
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await reader.collections.blogs.read(slug).catch(() => null)

    if (!post) notFound()

    return (
        <div className="min-h-screen bg-[#05070A] text-[#DCE3F0] font-allomira pt-[12vh]">
            <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16">

                {/* Back */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm tracking-widest uppercase font-bold mb-16"
                >
                    <ArrowLeft size={14} />
                    All Articles
                </Link>

                {/* Featured image */}
                {post.featured_image && (
                    <div className="relative aspect-video rounded-[40px] overflow-hidden mb-16">
                        <Image
                            src={post.featured_image}
                            alt={post.title || ''}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-16">
                    <span className="inline-block px-6 py-2 rounded-full bg-[#0D5699]/20 text-[#0D5699] text-sm font-bold tracking-widest uppercase mb-8">
                        {post.category}
                    </span>
                    <h1 className="text-[clamp(36px,5vw,72px)] font-black leading-[0.95] tracking-tighter uppercase mb-10">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-2xl text-white/50 font-light leading-relaxed mb-10">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-8 text-sm text-white/30 tracking-widest uppercase font-bold pt-8 border-t border-white/5">
                        {post.author_name && (
                            <span className="flex items-center gap-2">
                                <User size={14} /> {post.author_name}
                            </span>
                        )}
                        {post.published_at && (
                            <span className="flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(post.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </span>
                        )}
                        {post.read_time && (
                            <span className="flex items-center gap-2">
                                <Clock size={14} /> {post.read_time}
                            </span>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase
                    prose-p:text-white/70 prose-p:leading-relaxed
                    prose-a:text-[#0D5699] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-hr:border-white/10
                    prose-img:rounded-[24px]">
                    <DocumentRenderer document={await post.content()} />
                </div>

                {/* Footer nav */}
                <div className="mt-24 pt-12 border-t border-white/5">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors text-sm tracking-widest uppercase font-bold"
                    >
                        <ArrowLeft size={14} />
                        Back to All Articles
                    </Link>
                </div>
            </div>
        </div>
    )
}
