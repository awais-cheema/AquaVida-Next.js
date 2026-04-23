import { DocumentRenderer, DocumentRendererProps } from '@keystatic/core/renderer';
import Link from 'next/link';

interface CmsContentProps {
  content: any;
  className?: string;
  renderers?: DocumentRendererProps['renderers'];
}

export default function CmsContent({ content, className, renderers: customRenderers }: CmsContentProps) {
  if (!content) return null;

  // Handle plain strings (backward compatibility or simple text)
  if (typeof content === 'string') {
    return <p className={className}>{content}</p>;
  }

  // Merged renderers
  const renderers: DocumentRendererProps['renderers'] = {
    ...customRenderers,
    inline: {
      ...customRenderers?.inline,
      link: ({ href, children }) => {
        let url = href;
        // Auto-prefix URLs that start with www.
        if (/^www\./i.test(url)) {
          url = `https://${url}`;
        }
        const isInternal = url.startsWith('/') || url.startsWith('https://aquavidapools');
        return (
          <Link 
            href={url} 
            target={isInternal ? undefined : '_blank'}
            rel={isInternal ? undefined : 'noopener noreferrer'}
          >
            {children}
          </Link>
        );
      }
    }
  };

  // Handle Keystatic document (array of blocks)
  if (Array.isArray(content) || (typeof content === 'object' && content !== null)) {
    try {
      return (
        <div className={className}>
          <DocumentRenderer document={content} renderers={renderers} />
        </div>
      );
    } catch (e) {
      console.error('Error rendering CMS content:', e);
      return null;
    }
  }

  return null;
}
