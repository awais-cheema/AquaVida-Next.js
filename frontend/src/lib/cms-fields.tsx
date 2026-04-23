import { fields } from '@keystatic/core'
import ShadowSaveButton from '../components/cms/fields/ShadowSaveButton'

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
 * shadowPreviewField
 * A custom field group that integrates the ShadowSaveButton.
 * This triggers a BroadcastChannel message whenever any field in the group (or form) changes.
 */
export const shadowPreviewField = fields.group({
  label: 'Shadow Live Preview',
  description: 'Broadcast changes to the live preview window without saving.',
  fields: {
    _trigger: fields.text({ label: 'Trigger (hidden)', defaultValue: 'update' }),
  }
}, {
  // @ts-ignore
  component: ShadowSaveButton
})

/**
 * seoFieldsDef
 * Standardized SEO fields used for internal and external linking strategies.
 */
export const seoFieldsDef = {
  internalLinks: fields.array(
    fields.object({
      label: fields.text({ label: 'Link Label' }),
      url: fields.text({ label: 'Internal Path' }),
    }),
    { label: 'SEO - Internal Related Links' }
  ),
  externalLinks: fields.array(
    fields.object({
      label: fields.text({ label: 'Link Label' }),
      url: fields.text({ label: 'External URL' }),
    }),
    { label: 'SEO - External Authority Links' }
  ),
}
