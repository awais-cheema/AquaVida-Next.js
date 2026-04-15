/**
 * JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag.
 */

interface JsonLdProps {
    data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
    if (!data || Object.keys(data).length === 0) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
