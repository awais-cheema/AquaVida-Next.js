/**
 * Dynamic sitemap generated from Django CMS API.
 */
import { MetadataRoute } from 'next';
import { getSitemapData } from '@/lib/api';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];

    // Dynamic routes from CMS
    try {
        const pages = await getSitemapData();
        const dynamicRoutes: MetadataRoute.Sitemap = pages
            .filter((p) => p.slug !== 'home')
            .map((page) => ({
                url: `${baseUrl}/${page.slug}`,
                lastModified: new Date(page.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));

        return [...staticRoutes, ...dynamicRoutes];
    } catch {
        // Fallback static sitemap
        return [
            ...staticRoutes,
            { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
            { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.8 },
            { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.8 },
            { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
        ];
    }
}
