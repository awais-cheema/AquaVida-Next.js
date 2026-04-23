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
        const slugs = await reader.collections.posts.list()
        if (slugs.length > 0) {
            const results = await Promise.all(
                slugs.map(async (slug, i) => {
                    try {
                        const post = await reader.collections.posts.read(slug)
                        if (!post) return null
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
                        return null
                    }
                }),
            )
            posts = results.filter(Boolean) as BlogPost[]
        } else {
            posts = await getBlogPosts()
        }
    } catch (e: any) {
        posts = await getBlogPosts().catch(() => [])
    }

    const settings = await reader.singletons.blogSettings.read().catch(() => null)
    
    // Resolve FAQ and metadata
    const faqItems = (settings as any)?.faqItems?.length 
        ? await Promise.all([...(settings as any).faqItems].map(async (f: any) => ({ ...f, answer: await f.answer() }))) 
        : undefined
    
    const categories = (settings as any)?.categories?.length 
        ? [...(settings as any).categories] 
        : undefined

    return (
        <>
            <BlogClient 
                initialPosts={posts} 
                faqItems={faqItems} 
                categories={categories}
                headerLabel={settings?.headerLabel}
                headerTitle={settings?.headerTitle}
                headerDescription={settings?.headerDescription}
            />
            <SeoLinks internalLinks={settings?.internalLinks} externalLinks={settings?.externalLinks} />
        </>
    )
}
