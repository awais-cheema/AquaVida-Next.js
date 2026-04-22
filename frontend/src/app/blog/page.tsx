import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { getBlogPosts, BlogPost } from '@/lib/api'
import { buildPageMetadata } from '@/lib/seo'
import BlogClient from './BlogClient'
import SeoLinks from '@/components/layout/SeoLinks'

// Force dynamic rendering — no caching
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const settings = await reader.singletons.blogSettings.read().catch(() => null)
    return buildPageMetadata('blog', {
        title: 'Blog | AquaVida Pools and Spas',
        description: 'Explore the latest insights in aquatic architecture, pool engineering, and outdoor luxury design.',
    }, settings)
}

export default async function BlogPage() {
    let posts: BlogPost[] = []

    try {
        // Primary source: Keystatic local content
        const slugs = await reader.collections.posts.list()
        console.log('[Blog] Keystatic slugs found:', slugs)

        if (slugs.length > 0) {
            const results = await Promise.all(
                slugs.map(async (slug, i) => {
                    try {
                        const post = await reader.collections.posts.read(slug)
                        if (!post) {
                            console.warn(`[Blog] Post "${slug}" returned null`)
                            return null
                        }
                        console.log(`[Blog] Successfully read post "${slug}":`, post.title)
                        return {
                            id: i + 1,
                            title: post.title || slug,
                            slug,
                            excerpt: post.excerpt || '',
                            content: '',
                            category: post.category || 'Design',
                            author_name: post.author_name || '',
                            published_at: post.published_at || new Date().toISOString(),
                            read_time: post.read_time || '5 min read',
                            featured_image_url: post.featured_image || '',
                            is_featured: post.is_featured || false,
                        } satisfies BlogPost
                    } catch (postErr: any) {
                        console.error(`[Blog] Error reading post "${slug}":`, postErr.message)
                        return null
                    }
                }),
            )
            posts = results.filter(Boolean) as BlogPost[]
            console.log(`[Blog] Total posts loaded: ${posts.length}`)
        } else {
            console.log('[Blog] No Keystatic slugs, falling back to Django API')
            posts = await getBlogPosts()
        }
    } catch (e: any) {
        console.error('[Blog] Keystatic list error:', e.message)
        try {
            posts = await getBlogPosts()
        } catch (de: any) {
            console.error('[Blog] Django fallback error:', de.message)
        }
    }

    const settings = await reader.singletons.blogSettings.read().catch(() => null)
    const faqItems = (settings as any)?.faqItems?.length ? await Promise.all([...(settings as any).faqItems].map(async (f: any) => ({ ...f, answer: await f.answer() }))) : undefined
    const categories = (settings as any)?.categories?.length ? [...(settings as any).categories] : undefined

    return (
        <>
            <BlogClient 
                initialPosts={posts} 
                faqItems={faqItems} 
                categories={categories}
            />
            <SeoLinks internalLinks={settings?.internalLinks} externalLinks={settings?.externalLinks} />
        </>
    )
}
