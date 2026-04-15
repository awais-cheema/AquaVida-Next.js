import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio | AquaVida Pools and Spas',
    description: 'Explore our curated archive of high-end aquatic architecture and luxury outdoor living spaces.',
};

export default function PortfolioPage() {
    return <PortfolioClient />;
}
