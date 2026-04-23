import { fields } from '@keystatic/core'

/**
 * richText
 * A helper to standardize MDX/Document fields across the CMS with consistent
 * image upload paths and formatting options.
 */
export const richText = (label: string) => fields.document({
  label,
  formatting: true,
  dividers: true,
  links: true,
  images: {
    directory: 'public/images/cms',
    publicPath: '/images/cms/',
  }
})

/**
 * seoFieldsDef
 * Standardized SEO fields used across all pages.
 * Includes both Meta tags and Related Link resources.
 */
export const seoFieldsDef = {
  /* Meta Tags */
  seoTitle: fields.text({ label: 'Meta Title', description: '50\u201360 characters recommended' }),
  seoDescription: fields.text({ label: 'Meta Description', multiline: true, description: '150\u2013160 characters recommended' }),
  seoKeywords: fields.text({ label: 'Focus Keywords', description: 'Comma-separated keywords' }),
  
  /* Open Graph */
  ogTitle: fields.text({ label: 'OG Title', description: 'Displays on social platforms' }),
  ogDescription: fields.text({ label: 'OG Description', multiline: true }),
  ogImage: fields.image({ 
    label: 'OG Image', 
    directory: 'public/images/seo', 
    publicPath: '/images/seo/' 
  }),
  
  /* Advanced */
  seoCanonicalUrl: fields.text({ label: 'Canonical URL' }),
  seoNoIndex: fields.checkbox({ label: 'No Index (Hide from Google)', defaultValue: false }),
  seoNoFollow: fields.checkbox({ label: 'No Follow', defaultValue: false }),

  /* Related Resources */
  internalLinks: fields.array(
    fields.object({
      anchorText: fields.text({ label: 'Anchor Text (Label displayed to users)' }),
      targetUrl: fields.text({ label: 'Internal Path (e.g. /services/pavers)' }),
    }),
    { 
      label: 'SEO - Internal Related Links',
      itemLabel: props => props.fields.anchorText.value || 'New Internal Link'
    }
  ),
  externalLinks: fields.array(
    fields.object({
      anchorText: fields.text({ label: 'Anchor Text (Label displayed to users)' }),
      url: fields.text({ label: 'External URL (e.g. https://example.com)' }),
      rel: fields.select({
        label: 'Rel attribute',
        options: [
          { label: 'Follow (Default for Authority)', value: 'follow' },
          { label: 'No Follow', value: 'nofollow' },
          { label: 'Sponsored', value: 'sponsored' },
        ],
        defaultValue: 'follow',
      }),
      newTab: fields.checkbox({ label: 'Open in new tab?', defaultValue: true }),
    }),
    { 
      label: 'SEO - External Authority Links',
      itemLabel: props => props.fields.anchorText.value || 'New External Link'
    }
  ),
}
