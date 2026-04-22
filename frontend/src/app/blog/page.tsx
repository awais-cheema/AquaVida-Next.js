import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { getBlogPosts, BlogPost } from '@/lib/api'
import { buildPageMetadata } from '@/lib/seo'
import BlogClient from './BlogClient'
import SeoLinks from '@/components/layout/SeoLinks'

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
        const slugs = await reader.collections.blogs.list()

        if (slugs.length > 0) {
            const results = await Promise.all(
                slugs.map(async (slug, i) => {
                    const post = await reader.collections.blogs.read(slug)
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
                }),
            )
            posts = results.filter(Boolean) as BlogPost[]
        } else {
            // Fallback: Django API when no Keystatic posts exist yet
            posts = await getBlogPosts()
        }
    } catch {
        try {
            posts = await getBlogPosts()
        } catch {
            console.error('Failed to load blog posts from Keystatic and Django API')
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
