'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    Flame, Shield, Wind, Wrench, CalendarCheck,
    Thermometer, Zap, Leaf,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#e8823a',
    accentRgb: '232,130,58',

    heroLabel: 'Elemental Artistry — Dallas, TX',
    heroTitle: 'Stone Fire Pit',
    heroHighlight: 'Installation.',
    heroBody: 'Transform your outdoor sanctuary with the elemental warmth of natural stone. A fluid blend of primal fire and sophisticated, precision-engineered combustion technology — designed for year-round gathering.',
    heroImage: '/images/services/fire_pit_hero.avif',

    overviewTitle: 'The Hearth of the Garden',
    overviewBody: 'AquaVida’s master stonemasons specialize in custom fire architectures that serve as the anchor of the outdoor experience. Utilizing hand-selected limestone, granite, and local fieldstone, we engineer fire features that integrate seamlessly with your pool and patio layout. Our designs prioritize both the visual drama of the flame and the technical precision of modern gas-delivery systems.',
    overviewImage: '/images/services/fire_pit_overview.avif',

    processTitle: 'The Elemental Workflow',
    processSteps: [
        {
            title: 'Technical Site Consultation',
            body: 'We analyze your property’s wind patterns and utility logistics to determine the optimal placement for safety and comfort. This includes mapping gas lines and ensuring proper fire-code clearances.',
        },
        {
            title: 'Masonry Construction',
            body: 'Our artisans hand-carve and set every stone, building a structural core that withstands extreme thermal cycles. We emphasize traditional joinery and architectural balance in every build.',
        },
        {
            title: 'Combustion Integration',
            body: 'Certified technicians install high-output burners and safety valves. We execute rigorous pressure testing and flame calibration to ensure a reliable, smokeless experience every time.',
        },
    ],

    investmentTitle: 'Investing in Atmospheric Value',
    investmentBody: 'A custom fire feature extends the seasonal utility of your outdoor space, providing a year-round destination for entertainment. We utilize indigenous Texas stone and aerospace-grade burner components to ensure your fire pit remains a maintenance-free centerpiece. In Dallas, integrated fire features consistently rank as top-tier landscape additions for property valuation.',
    investmentImage: '/images/services/fire_pit_investment.avif',

    servicesTitle: 'Specialized Fire Services',
    servicesItems: [
        {
            title: 'Architectural Stone Fire Pits',
            body: 'Custom-engineered fire vessels built into your existing hardscape. We specialize in submerged fire pits, poolside fire bowls, and expansive hearths designed for large-scale entertaining.',
        },
        {
            title: 'Technical Restoration',
            body: 'Professional recalibration and repair for existing fire features. We replace failing burner systems, repoint masonry, and upgrade ignition controls to modern safety standards.',
        },
        {
            title: 'Safety Maintenance Protocols',
            body: 'Structured inspection programs for residential gas systems. We provide annual burner cleaning, connection testing, and stonework protective sealing to ensure long-term performance.',
        },
    ],

    featuresTitle: 'The AquaVida Warmth',
    features: [
        {
            icon: Flame,
            title: 'Smokeless Technology',
            body: 'Advanced cross-ventilation engineering ensures a clean, oxygen-rich burn—providing the heat of a wood fire without the ash or smoke intrusion.',
        },
        {
            icon: Shield,
            title: 'Thermal Resilience',
            body: 'Every structure is built with a fire-rated internal core and thermal expansion joints to prevent stone cracking during rapid temperature shifts.',
        },
        {
            icon: Thermometer,
            title: 'Radiant Output',
            body: 'Our high-performance burner systems deliver up to 125,000 BTUs, creating a consistent warmth radius that defies the Dallas winter chill.',
        },
        {
            icon: Wind,
            title: 'Integrated Utility Line',
            body: 'We handle the complete sub-base utility routing for natural gas or propane systems—all concealed beneath the patio for a clean architectural profile.',
        },
        {
            icon: Leaf,
            title: 'Clean Combustion',
            body: 'Precision valves and high-efficiency nozzles minimize fuel consumption while maximizing flame height and color consistency.',
        },
        {
            icon: Zap,
            title: 'Under-Glow Scenes',
            body: 'Optional integrated LED lighting can be recessed into the base masonry, providing a safe and stunning guidance light when the fire is not in use.',
        },
    ],

    standardsTitle: 'Operational Safety',
    standards: [
        {
            title: 'Fire Code Compliance',
            body: "AquaVida adheres strictly to City of Dallas fire safety regulations, ensuring all gas clearances, emergency shut-offs, and ventilation requirements are met and inspected.",
        },
        {
            title: 'Safety Hand-Off',
            body: 'We provide a complete operational walkthrough for your new fire system, including emergency shutdown procedures and seasonal burner maintenance guidelines.',
        },
    ],

    ctaTitle: 'Architect Your Evening Centerpiece',
    ctaBody: "Bring the elemental power of a custom fire feature to your Dallas property. Contact AquaVida for a technical site assessment and start planning your night-time sanctuary.",
    ctaImage: '/images/services/fire_pit_cta.avif',
};

export default function FirePitClient() {
    return <ServicePageShell d={data} />;
}
