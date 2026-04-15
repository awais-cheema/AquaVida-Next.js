/**
 * Django API client for AquaVida CMS.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface FetchOptions {
    revalidate?: number;
    tags?: string[];
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { revalidate = 60, tags } = options;

    const res = await fetch(`${API_URL}${endpoint}`, {
        next: {
            revalidate,
            tags,
        },
        headers: {
            'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// Types
export interface PageListItem {
    id: number;
    title: string;
    slug: string;
    template: string;
    status: string;
    published_at: string;
    ordering: number;
    show_in_nav: boolean;
}

export interface MediaItem {
    id: number;
    title: string;
    media_type: string;
    alt_text: string;
    caption: string;
    width: number;
    height: number;
    cdn_url: string;
    responsive_urls: Record<string, string>;
}

export interface SectionData {
    id: number;
    section_type: string;
    heading: string;
    subheading: string;
    body: string;
    cta_text: string;
    cta_url: string;
    background_color: string;
    order: number;
    is_visible: boolean;
    extra_data: Record<string, any>;
    media: MediaItem[];
}

export interface SEOData {
    meta_title: string;
    meta_description: string;
    canonical_url: string;
    og_title: string;
    og_description: string;
    og_image_url: string;
    og_type: string;
    twitter_card: string;
    no_index: boolean;
    no_follow: boolean;
    json_ld: Record<string, any>;
    effective_title: string;
    robots_content: string;
}

export interface PageDetail {
    id: number;
    title: string;
    slug: string;
    template: string;
    status: string;
    published_at: string;
    sections: SectionData[];
    seo: SEOData | null;
}

export interface SiteConfig {
    site_name: string;
    tagline: string;
    logo_url: string;
    default_og_image_url: string;
    footer_text: string;
    social_links: Record<string, string>;
}

export interface NavItem {
    title: string;
    slug: string;
    ordering: number;
}

export interface SitemapItem {
    slug: string;
    updated_at: string;
    template: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author_name: string;
    published_at: string;
    read_time: string;
    featured_image_url: string;
    is_featured: boolean;
}

// API Functions
export async function getPageBySlug(slug: string): Promise<PageDetail> {
    return apiFetch<PageDetail>(`/pages/${slug}/`, { tags: ['pages', slug] });
}

export async function getSitemapData(): Promise<SitemapItem[]> {
    return apiFetch<SitemapItem[]>('/sitemap-data/', { revalidate: 3600 });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    return apiFetch<BlogPost[]>('/blogs/', { tags: ['blogs'] });
}
