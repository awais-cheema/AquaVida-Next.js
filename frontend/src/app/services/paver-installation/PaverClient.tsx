'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    Grid3X3, Palette, Shield, Droplets,
    Layers, CheckCircle, Wrench, Clock,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#7a9e5a',
    accentRgb: '122,158,90',

    heroLabel: 'Precision Hardscaping — Dallas, TX',
    heroTitle: 'Architectural',
    heroHighlight: 'Paver Systems.',
    heroBody: 'Transforming outdoor spaces with artisanal paver layouts that blend structural integrity with fluid aesthetic harmony. Our curation defines the modern Dallas landscape — from iconic driveways to seamless pool decks.',
    heroImage: '/images/services/patio_extensions_hero.avif',

    overviewTitle: 'The Foundation of Outdoor Luxury',
    overviewBody: 'AquaVida provides professional hardscape solutions that anchor your entire outdoor environment. We specialize in precision paver systems that offer superior durability and aesthetic flexibility over standard concrete. Our master installers specialize in site-specific sub-base engineering, ensuring your surfaces remain perfectly level and resistant to the expansive clay soils of North Texas.',
    overviewImage: '/images/services/patio_extensions_overview.avif',

    processTitle: 'The Hardscape Workflow',
    processSteps: [
        {
            title: 'Hydraulic & Site Design',
            body: 'We map your property’s drainage patterns to ensure water is managed effectively beneath the surface. Our designers help you select a pattern and texture that scales with your home’s architecture.',
        },
        {
            title: 'Sub-Base Infrastructure',
            body: 'Deep excavation followed by high-density aggregate compaction and geotextile stabilization. We build a monolithic foundation that prevents future settling or joint displacement.',
        },
        {
            title: 'Artisan Placement & Locking',
            body: 'Hand-setting each unit with precision cuts and edge restraints. We utilize high-bond polymeric sand to lock the system into a single fluid surface that resists weeds and erosion.',
        },
    ],

    investmentTitle: 'Investing in Structural Permanence',
    investmentBody: 'Quality paver systems are a multi-generational investment. Unlike poured concrete, pavers are resistant to cracking and can be easily accessed for utility maintenance. We utilize premium natural stone and architectural concrete units that withstand Dallas UV exposure and heavy vehicle loads, providing a permanent upgrade to your property’s curb appeal and functional value.',
    investmentImage: '/images/services/patio_extensions_investment.avif',

    servicesTitle: 'Comprehensive Hardscape Services',
    servicesItems: [
        {
            title: 'Bespoke Pattern Installation',
            body: 'Custom layouts for pool decks, driveways, and expansive patios. We specialize in complex geometric patterns, contrasting borders, and fluid, curved transitions.',
        },
        {
            title: 'Surface Restoration',
            body: 'Professional re-leveling and joint replacement for failing existing hardscapes. We restore the structural integrity and aesthetic clarity of your older paver systems.',
        },
        {
            title: 'Technological Maintenance',
            body: 'Nanotechnology sealing and deep-clean programs designed to protect surfaces from oil, organic stains, and UV fading while enhancing the natural stone color.',
        },
    ],

    featuresTitle: 'The Hardscape Masterclass',
    features: [
        {
            icon: Grid3X3,
            title: 'Geometric Curation',
            body: 'Herringbone, basketweave, or custom concentric patterns designed to direct visual flow and complement your home’s architectural lines.',
        },
        {
            icon: Palette,
            title: 'Tonal Harmony',
            body: 'We source materials in palettes ranging from cool Arctic greys to warm Mediterranean ambers, ensuring perfect integration with your existing landscape.',
        },
        {
            icon: Shield,
            title: 'Nanoscale Protection',
            body: 'Optional protective coatings that molecularly bond with the stone, creating a moisture barrier that prevents fading and thermal degradation.',
        },
        {
            icon: Droplets,
            title: 'Advanced Permeability',
            body: 'Eco-conscious sub-grade systems that return stormwater to the aquifer while maintaining a pristine, dry surface for pedestrian use.',
        },
        {
            icon: Layers,
            title: 'Structural Layering',
            body: 'Multi-stage base preparation involving vibratory compaction and architectural edging to prevent lateral movement over decades of use.',
        },
        {
            icon: CheckCircle,
            title: 'Polymeric Bond',
            body: 'High-performance jointing sand that hardens into a dense, flexible matrix—eliminating ants, weeds, and joint-washout for good.',
        },
    ],

    standardsTitle: 'Technical Standards',
    standards: [
        {
            title: 'Engineering Governance',
            body: "Our installation methods exceed industry standards for base depth and compaction density, specifically calibrated for the high-expansion clay dynamics of Dallas, Texas.",
        },
        {
            title: 'Warranty & Maintenance Support',
            body: 'We provide structured post-install care guidelines and a rock-solid structural warranty, ensuring your hardscape remains a permanent asset to your property.',
        },
    ],

    ctaTitle: 'Architect Your Garden Foundation',
    ctaBody: 'Define your outdoor terrain with AquaVida’s precision paver systems. Contact our hardscape studio today for a technical site analysis and custom layout proposal.',
    ctaImage: '/images/services/patio_extensions_cta.avif',
};

export default function PaverClient() {
    return <ServicePageShell d={data} />;
}
