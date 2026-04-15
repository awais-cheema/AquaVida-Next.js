/**
 * App-wide constants.
 */

export const SITE_NAME = 'AquaVida';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Cloudflare R2 / CDN Configuration
 */
const RAW_R2_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_DOMAIN || 'pub-8d68aba30b604ff882d45050c4beb761.r2.dev';
export const R2_DOMAIN = RAW_R2_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
export const R2_BASE   = `https://${R2_DOMAIN}`;

/**
 * Resolves an asset path to either a local public folder or the Cloudflare R2 CDN.
 * In production, it prepends the R2_BASE for faster delivery of high-res media.
 */
export const getAssetUrl = (path: string): string => {
    // If it's already a full URL or starts with data:, return it as-is
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    // Serve all assets from Cloudflare CDN for performance
    const useR2 = true; 
    
    if (useR2) {
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${R2_BASE}/${cleanPath}`;
    }
    
    return path;
};
