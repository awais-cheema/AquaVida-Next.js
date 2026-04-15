import { getBlogPosts, BlogPost } from '@/lib/api';
import BlogClient from './BlogClient';

export const metadata = {
    title: 'Blog | AquaVida Pools and Spas',
    description: 'Explore the latest insights in aquatic architecture, pool engineering, and outdoor luxury design.',
};

export default async function BlogPage() {
    // Fetch dynamic content from CMS
    // We provide a fallback empty array if the API is not yet available
    let posts: BlogPost[] = [];
    try {
        posts = await getBlogPosts();
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
    }

    return <BlogClient initialPosts={posts} />;
}
