'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    Waves, Shield, Zap, Clock,
    CheckCircle, Leaf, Ruler, Star,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#3a9fd4',
    accentRgb: '58,159,212',

    heroLabel: 'Premier Pool Construction — Dallas, TX',
    heroTitle: 'Architecture',
    heroHighlight: 'of Water.',
    heroBody: "We don't just build pools; we curate liquid landscapes. Experience the intersection of precision engineering and fluid aesthetics — creating the iconic Dallas retreat your property deserves.",
    heroImage: '/images/services/pool_construction_hero.avif',

    overviewTitle: 'Uncompromising Structural Artistry',
    overviewBody: 'At AquaVida, we treat pool construction as a permanent architectural extension of your home. Our method combines Dallas-specific engineering with a high-fashion design sensibility. We manage every phase from initial excavation to the final tile set, ensuring every technical detail supports a stunning visual outcome that lasts for generations.',
    overviewImage: '/images/services/pool_construction_overview.avif',

    processTitle: 'The Construction Workflow',
    processSteps: [
        {
            title: 'Architectural Planning',
            body: 'Every project begins with a deep site analysis and technical blueprinting. We navigate Dallas city codes and soil dynamics to ensure your pool is built on a foundation of absolute precision.',
        },
        {
            title: 'Structural Execution',
            body: 'Our heavy equipment crews and steel specialists transform site data into solid form. We prioritize rapid, clean execution to minimize disruption while maintaining total site safety.',
        },
        {
            title: 'Mechanical Precision',
            body: 'Hydraulics, automation, and filtration systems are integrated by certified specialists. Every component is tested to meet our high-efficiency performance standards before the first fill.',
        },
    ],

    investmentTitle: 'Valuing Your Outdoor Legacy',
    investmentBody: 'A luxury pool is an investment in both your quality of life and your property’s equity. In Dallas, professionally constructed pools command significant market premiums. While standard builds start around $60,000, we specialize in high-end projects that optimize materials and technology to deliver maximum ROI without compromising on the architectural vision.',
    investmentImage: '/images/services/pool_construction_investment.avif',

    servicesTitle: 'Specialized Construction Solutions',
    servicesItems: [
        {
            title: 'Custom In-Ground Engineering',
            body: 'Our signature shotcrete pools are engineered to Dallas soil specifications, allowing for complex geometries, infinity edges, and submerged architectural elements.',
        },
        {
            title: 'Advanced Fiberglass Integration',
            body: 'For projects requiring rapid deployment, our manufacturer-certified fiberglass installations provide a lifetime-guaranteed shell with high-performance finishes.',
        },
        {
            title: 'Luxury Build Management',
            body: 'Full-service oversight for complex residential projects. We coordinate all trades, from lighting designers to hardscape contractors, providing a single point of technical accountability.',
        },
    ],

    featuresTitle: "The AquaVida Edge",
    features: [
        {
            icon: CheckCircle,
            title: 'Master Artisans',
            body: 'Our crews are trained in technical European standards, bringing world-class finishing skills to Every Dallas pool project.',
        },
        {
            icon: Leaf,
            title: 'High-Performance Systems',
            body: 'Low-energy hydraulics and advanced saltwater purification reduce chemical reliance and operating costs by up to 40%.',
        },
        {
            icon: Clock,
            title: 'Predictive Scheduling',
            body: 'Proprietary project management methods allow us to deliver 30% faster build cycles through rigorous site logistics.',
        },
        {
            icon: Waves,
            title: 'Infinity & Edge Dynamics',
            body: 'Specialists in vanishing edges, perimeter overflows, and glass-wall integrations that redefine the horizon line.',
        },
        {
            icon: Ruler,
            title: 'Soil-Specific Foundations',
            body: 'Dallas clay requires specific structural approaches. Our engineering accounts for local expansion forces that standard builds ignore.',
        },
        {
            icon: Star,
            title: 'Smart Automation',
            body: 'Control every aspect of your pool environment—from lighting scenes to temperature—via a unified, secure mobile interface.',
        },
    ],

    standardsTitle: 'Operational Excellence',
    standards: [
        {
            title: 'Energy-Efficient Certification',
            body: 'All mechanical systems are spec\'d for maximum efficiency, utilizing variable-speed pumps and high-output heat pumps to keep operational footprints minimal.',
        },
        {
            title: 'Comprehensive Post-Build Care',
            body: 'Our service doesn’t end at the fill. We provide structured maintenance handoffs and technical support to ensure your investment stays in showroom condition.',
        },
    ],

    ctaTitle: 'Ready to Define Your Horizon?',
    ctaBody: "Contact our technical studio for a site consultation. Our Dallas specialists will assess your terrain and provide a preliminary feasibility report and architectural vision for your new pool.",
    ctaImage: '/images/services/pool_construction_cta.avif',
};

export default function PoolConstructionClient() {
    return <ServicePageShell d={data} />;
}
