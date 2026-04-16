import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Us | AquaVida',
    description: 'Learn about our mission, vision, and team at AquaVida — passionately shaping backyards into timeless designs.',
    openGraph: {
        title: 'About Us | AquaVida',
        description: 'Learn about our mission, vision, and team at AquaVida.',
        url: `${SITE_URL}/about`,
    },
    alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
    return <AboutClient />;
}
