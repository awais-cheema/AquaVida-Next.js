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
    const res = await fetch(`${baseUrl}/api/preview/cache?draftId=${draftId}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const cached = await res.json();
      if (cached && cached.data) {
        console.log(`[ShadowPreview] Found draft for ${type}, merging...`);
        
        const rawData = cached.data;
        
        // Keystatic reader usually returns functions for document fields.
        // Our cached data is raw JSON. We need to bridge this.
        const bridgedData = { ...rawData };
        
        // Recursively wrap document-like objects in functions to match Keystatic reader API
        Object.keys(bridgedData).forEach(key => {
          const val = bridgedData[key];
          // If it's an array and looks like a document (first item has type: 'paragraph' etc)
          if (Array.isArray(val) && val.length > 0 && val[0].type) {
            bridgedData[key] = () => Promise.resolve(val);
          }
          // Also handle nested document fields in arrays (like testimonials or principles)
          if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
             // We don't necessarily need to deep-wrap everything unless the page calls them as functions
          }
        });

        // Special case for Services page principle/testimonials which are also functions in reader
        if (type === 'services' || type === 'generic') {
            if (bridgedData.services) {
                bridgedData.services = bridgedData.services.map((s: any) => ({
                    ...s,
                    sub: () => Promise.resolve(s.sub)
                }));
            }
            if (bridgedData.testimonials) {
                bridgedData.testimonials = bridgedData.testimonials.map((t: any) => ({
                    ...t,
                    quote: () => Promise.resolve(t.quote)
                }));
            }
            if (bridgedData.corePrinciples) {
                bridgedData.corePrinciples = bridgedData.corePrinciples.map((p: any) => ({
                    ...p,
                    sub: () => Promise.resolve(p.sub)
                }));
            }
            if (bridgedData.faqItems) {
                bridgedData.faqItems = bridgedData.faqItems.map((f: any) => ({
                    ...f,
                    answer: () => Promise.resolve(f.answer)
                }));
            }
        }
        
        // Special case for Blog content
        if (type === 'blog' && bridgedData.content) {
             const originalContent = bridgedData.content;
             bridgedData.content = () => Promise.resolve(originalContent);
        }

        return bridgedData;
      }
    }
  } catch (e) {
    console.error('Shadow Preview resolve error:', e);
  }

  return fallbackData;
}
