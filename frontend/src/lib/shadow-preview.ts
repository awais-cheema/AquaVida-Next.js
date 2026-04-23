import { cookies } from 'next/headers';

/**
 * resolveDraftContent
 * Combines standard Keystatic reader output with our Shadow Preview cache.
 * If a draft session is active, it overrides persistent data with live form data.
 */
export async function resolveDraftContent(type: string, fallbackData: any, spDraftId?: string) {
  const cookieStore = await cookies();
  const draftId = spDraftId || cookieStore.get('shadow_draft_id')?.value;

  if (!draftId) return fallbackData;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/preview/cache?draftId=${draftId}`, { cache: 'no-store' });
    
    if (res.ok) {
      const cached = await res.json();
      // If types match (or generic), return the cached data
      if (cached && (cached.type === type || cached.type === 'generic' || cached.type === 'services' || cached.type === 'blog' || cached.type === 'about')) {
        return cached.data;
      }
    }
  } catch (e) {
    console.error('Shadow Preview resolve error:', e);
  }

  return fallbackData;
}
